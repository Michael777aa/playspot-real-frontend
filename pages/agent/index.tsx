import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Button, Pagination } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import AgentCard from '../../libs/components/common/AgentCard';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Member } from '../../libs/types/member/member';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { LIKE_TARGET_MEMBER, SUBSCRIBE, UNSUBSCRIBE } from '../../apollo/user/mutation';
import { GET_AGENTS } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Messages } from '../../libs/config';
import { userVar } from '../../apollo/store';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const AgentList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [filterSortName, setFilterSortName] = useState('New');
	const [sortingOpen, setSortingOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [searchFilter, setSearchFilter] = useState<any>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [agents, setAgents] = useState<Member[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchText, setSearchText] = useState<string>('');
	const [selectedSort, setSelectedSort] = useState('');
	const user = useReactiveVar(userVar);

	/** APOLLO REQUESTS **/

	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);
	const {
		loading: getAgentsLoading,
		data: getAgentsData,
		error: getAgentsError,
		refetch: getAgentsRefetch,
	} = useQuery(GET_AGENTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgents(data?.getAgents?.list);
			setTotal(data?.getAgents?.metaCounter[0]?.total);
		},
	});
	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const input_obj = JSON.parse(router?.query?.input as string);
			setSearchFilter(input_obj);
		} else
			router.replace(`/agent?input=${JSON.stringify(searchFilter)}`, `/agent?input=${JSON.stringify(searchFilter)}`);

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	/** HANDLERS **/
	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};
	const subscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			console.log('id', id);
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw new Error(Messages.error2);

			await subscribe({
				variables: { input: id },
			});
			await sweetTopSmallSuccessAlert('Subscribed!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const unsubscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			console.log('id', id);
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw new Error(Messages.error2);

			const result = await unsubscribe({
				variables: { input: id },
			});
			console.log('RESULT', result);

			await sweetTopSmallSuccessAlert('Unsubscribed!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'New':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: 'DESC' });
				setFilterSortName('New');
				break;
			case 'old':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: 'ASC' });
				setFilterSortName('Oldest order');
				break;
			case 'likes':
				setSearchFilter({ ...searchFilter, sort: 'memberLikes', direction: 'DESC' });
				setFilterSortName('Likes');
				break;
			case 'views':
				setSearchFilter({ ...searchFilter, sort: 'memberViews', direction: 'DESC' });
				setFilterSortName('Views');
				break;
		}
		setSortingOpen(false);
		setAnchorEl2(null);
	};

	const handleSortingClick = (e: any) => {
		const sortId = e.currentTarget.id;
		setSelectedSort(sortId);
		sortingHandler(e);
	};
	const paginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(`/agent?input=${JSON.stringify(searchFilter)}`, `/agent?input=${JSON.stringify(searchFilter)}`, {
			scroll: false,
		});
		setCurrentPage(value);
	};

	const likeMemberHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetMember({
				variables: { input: id },
			});
			await getAgentsRefetch();
		} catch (err: any) {
			console.log('ERROR, likeMemberHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return (
			<Stack
				className="agent-list-page"
				style={{
					padding: '15px',
					backgroundColor: '#f9f9f9',
					display: 'flex',
					flexDirection: 'column',
					gap: '20px',
					marginTop: 50,
				}}
			>
				<Stack
					className="container"
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '20px',
					}}
				>
					<Stack
						className="filter"
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '15px',
							backgroundColor: '#fff',
							padding: '15px',
							borderRadius: '8px',
							boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
						}}
					>
						<Stack
							className="left"
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								gap: '10px',
							}}
						>
							<input
								type="text"
								placeholder="Search for an agent"
								value={searchText}
								onChange={(e: any) => setSearchText(e.target.value)}
								onKeyDown={(event: any) => {
									if (event.key === 'Enter') {
										setSearchFilter({
											...searchFilter,
											search: { ...searchFilter.search, text: searchText },
										});
									}
								}}
								style={{
									flex: 1,
									padding: '10px',
									border: '1px solid #ddd',
									borderRadius: '5px',
									fontSize: '1rem',
								}}
							/>
						</Stack>

						{/* Sort Dropdown */}
						<Stack
							className="right"
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<span style={{ fontSize: '1rem', color: '#333' }}>Sort by</span>
							<div>
								<Button
									onClick={sortingClickHandler}
									endIcon={<KeyboardArrowDownRoundedIcon />}
									style={{ fontSize: '0.9rem', fontWeight: '600', color: '#007bff' }}
								>
									{filterSortName}
								</Button>
								<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
									{['New', 'Oldest', 'Likes', 'Views'].map((sortOption) => (
										<MenuItem
											key={sortOption}
											onClick={handleSortingClick}
											id={sortOption.toLowerCase()}
											disableRipple
											sx={{
												color: selectedSort === sortOption.toLowerCase() ? 'red' : 'inherit',
											}}
										>
											{sortOption}
										</MenuItem>
									))}
								</Menu>
							</div>
						</Stack>
					</Stack>

					{/* Agent List */}
					<Stack
						className="card-wrap"
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '15px',
							backgroundColor: '#fff',
							padding: '15px',
							borderRadius: '8px',
							boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
						}}
					>
						{agents?.length === 0 ? (
							<div
								className="no-data"
								style={{
									textAlign: 'center',
									color: '#777',
								}}
							>
								<img
									src="/img/icons/icoAlert.svg"
									alt=""
									style={{
										width: '50px',
										height: '50px',
										marginBottom: '10px',
									}}
								/>
								<p>No Agents found!</p>
							</div>
						) : (
							agents.map((agent: Member) => (
								<AgentCard
									agent={agent}
									subscribeHandler={subscribeHandler}
									unsubscribeHandler={unsubscribeHandler}
									key={agent._id}
									likeMemberHandler={likeMemberHandler}
								/>
							))
						)}
					</Stack>

					{/* Pagination Section */}
					<Stack
						className="pagination"
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: '10px',
						}}
					>
						{agents.length !== 0 && Math.ceil(total / searchFilter.limit) > 1 && (
							<Pagination
								page={currentPage}
								count={Math.ceil(total / searchFilter.limit)}
								onChange={paginationChangeHandler}
								shape="circular"
								color="primary"
							/>
						)}
						{agents.length !== 0 && (
							<span style={{ fontSize: '0.85rem', color: '#555' }}>
								Total {total} agent{total > 1 ? 's' : ''} available
							</span>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'agent-list-page'}>
				<Stack className={'container'}>
					<Stack className={'filter'}>
						<Stack component={'div'} className={'left'}>
							<input
								type="text"
								placeholder={'Search for an agent'}
								value={searchText}
								onChange={(e: any) => setSearchText(e.target.value)}
								onKeyDown={(event: any) => {
									if (event.key == 'Enter') {
										setSearchFilter({
											...searchFilter,
											search: { ...searchFilter.search, text: searchText },
										});
									}
								}}
							/>
						</Stack>
						<Stack component={'div'} className={'right'} sx={{ position: 'relative', right: '50px' }}>
							<span>Sort by</span>
							<div>
								<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
									{filterSortName}
								</Button>
								<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
									<MenuItem
										onClick={handleSortingClick}
										id={'New'}
										disableRipple
										sx={{
											color: selectedSort === 'New' ? 'red' : 'inherit',
										}}
									>
										New
									</MenuItem>
									<MenuItem
										onClick={handleSortingClick}
										id={'old'}
										disableRipple
										sx={{
											color: selectedSort === 'old' ? 'red' : 'inherit',
										}}
									>
										Oldest
									</MenuItem>
									<MenuItem
										onClick={handleSortingClick}
										id={'likes'}
										disableRipple
										sx={{
											color: selectedSort === 'likes' ? 'red' : 'inherit',
										}}
									>
										Likes
									</MenuItem>
									<MenuItem
										onClick={handleSortingClick}
										id={'views'}
										disableRipple
										sx={{
											color: selectedSort === 'views' ? 'red' : 'inherit',
										}}
									>
										Views
									</MenuItem>
								</Menu>
							</div>
						</Stack>
					</Stack>
					<Stack className={'card-wrap'}>
						{agents?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Agents found!</p>
							</div>
						) : (
							agents.map((agent: Member) => {
								return (
									<AgentCard
										agent={agent}
										subscribeHandler={subscribeHandler}
										unsubscribeHandler={unsubscribeHandler}
										key={agent._id}
										likeMemberHandler={likeMemberHandler}
									/>
								);
							})
						)}
					</Stack>
					<Stack className={'pagination'}>
						<Stack className="pagination-box">
							{agents.length !== 0 && Math.ceil(total / searchFilter.limit) > 1 && (
								<Stack className="pagination-box">
									<Pagination
										page={currentPage}
										count={Math.ceil(total / searchFilter.limit)}
										onChange={paginationChangeHandler}
										shape="circular"
										color="primary"
									/>
								</Stack>
							)}
						</Stack>

						{agents.length !== 0 && (
							<span>
								Total {total} agent{total > 1 ? 's' : ''} available
							</span>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

AgentList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 12,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(AgentList);
