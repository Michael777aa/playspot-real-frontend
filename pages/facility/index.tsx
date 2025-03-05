import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Stack, Button, Menu, MenuItem, Pagination, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Direction, Message } from '../../libs/enums/common.enum';
import { useMutation, useQuery } from '@apollo/client';
import { GET_FACILITIES } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Facility } from '../../libs/types/facility/facility';
import { LIKE_TARGET_FACILITY } from '../../apollo/user/mutation';
import { FacilitiesInquiry } from '../../libs/types/facility/facility.input';
import FacilityCard from '../../libs/components/facility/FacilityCard';
import Filter from '../../libs/components/facility/Filter';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const FacilityList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<FacilitiesInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [facilities, setFacilities] = useState<Facility[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [selectedSortOption, setSelectedSortOption] = useState('Sort by latest');

	/** APOLLO REQUESTS **/
	const [likeTargetFacility] = useMutation(LIKE_TARGET_FACILITY);

	const {
		loading: getFacilitiesLoading,
		data: getFacilitiesData,
		error: getFacilitiesError,
		refetch: getFacilitiesRefetch,
	} = useQuery(GET_FACILITIES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setFacilities(data?.getFacilities?.list);
			setTotal(data?.getFacilities?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	/** HANDLERS **/
	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(
			`/facility?input=${JSON.stringify(searchFilter)}`,
			`/facility?input=${JSON.stringify(searchFilter)}`,
			{
				scroll: false,
			},
		);
		setCurrentPage(value);
	};

	const likeFacilityHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetFacility({ variables: { input: id } });

			await getFacilitiesRefetch({ _id: id });
		} catch (err: any) {
			console.log('Error on likeFacilityHandler', err);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		const selectedOption = e.currentTarget.id;
		setSelectedSortOption(selectedOption);
		switch (selectedOption) {
			case 'Sort by price:low to high':
				setSearchFilter({ ...searchFilter, sort: 'facilityPrice', direction: Direction.ASC });
				break;
			case 'Sort by price:high to low':
				setSearchFilter({ ...searchFilter, sort: 'facilityPrice', direction: Direction.DESC });
				break;
			case 'Sort by latest':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.ASC });
				break;
			case 'Sort by popularity':
				setSearchFilter({ ...searchFilter, sort: 'facilityViews', direction: Direction.DESC });
				break;
			case 'Sort by liked':
				setSearchFilter({ ...searchFilter, sort: 'facilityLikes', direction: Direction.DESC });
				break;
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return (
			<div id="facility-list-page" style={{ position: 'relative', marginTop: '100px' }}>
				<div className="container">
					<Stack
						component={'div'}
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
							justifyContent: 'center',
							padding: '10px',
							backgroundColor: '#f9f9f9',
							borderRadius: '8px',
							boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
							marginBottom: '10px',
						}}
					>
						<span
							style={{
								fontSize: '14px',
								fontWeight: '600',
								color: '#333',
								marginBottom: '8px',
							}}
						>
							Sort by
						</span>
						<div style={{ width: '100%' }}>
							<Button
								onClick={sortingClickHandler}
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									width: '100%',
									padding: '10px',
									backgroundColor: '#ffffff',
									border: '1px solid #ddd',
									borderRadius: '8px',
									fontSize: '14px',
									fontWeight: '600',
									color: '#333',
									boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
								}}
								endIcon={<KeyboardArrowDownRoundedIcon />}
							>
								{selectedSortOption}
							</Button>
							<Menu
								anchorEl={anchorEl}
								open={sortingOpen}
								onClose={sortingCloseHandler}
								sx={{
									marginTop: '10px',
									borderRadius: '8px',
									boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
								}}
							>
								{[
									'Sort by popularity',
									'Sort by latest',
									'Sort by price:low to high',
									'Sort by price:high to low',
									'Sort by liked',
								].map((label) => (
									<MenuItem
										key={label}
										onClick={sortingHandler}
										id={label}
										disableRipple
										style={{
											padding: '10px 15px',
											fontSize: '14px',
											color: selectedSortOption === label ? 'red' : '#333',
											fontWeight: selectedSortOption === label ? 'bold' : 'normal',
											backgroundColor: selectedSortOption === label ? '#f9f9f9' : '#ffffff',
										}}
									>
										{label}
									</MenuItem>
								))}
							</Menu>
						</div>
					</Stack>

					<Stack className={'facility-page'}>
						<Stack className={'filter-config'}>
							{/* @ts-ignore */}
							<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
						</Stack>
						<Stack className="main-config" mb={'76px'}>
							<Stack className={'list-config'}>
								{facilities?.length === 0 ? (
									<div className={'no-data'}>
										<img src="/img/icons/icoAlert.svg" alt="" />
										<p>No Facilities found!</p>
									</div>
								) : (
									facilities.map((facility: Facility) => {
										return (
											<FacilityCard facility={facility} likeFacilityHandler={likeFacilityHandler} key={facility?._id} />
										);
									})
								)}
							</Stack>
							<Stack className="pagination-config" sx={{ textAlign: 'center', marginTop: '10px' }}>
								{facilities.length !== 0 && (
									<Stack className="pagination-box">
										<Pagination
											style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
											page={currentPage}
											count={Math.ceil(total / searchFilter.limit)}
											onChange={handlePaginationChange}
											shape="circular"
											color="primary"
										/>
									</Stack>
								)}

								{facilities.length !== 0 && (
									<Stack className="total-result" mt={2}>
										<Typography>
											Total {total} facilit{total > 1 ? 'ies' : 'y'} available
										</Typography>
									</Stack>
								)}
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	} else {
		return (
			<div id="facility-list-page" style={{ position: 'relative' }}>
				<div className="container">
					<Stack component={'div'} className={'right'}>
						<span>Sort by</span>
						<div>
							<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
								{selectedSortOption}
							</Button>
							<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
								{[
									'Sort by popularity',
									'Sort by latest',
									'Sort by price:low to high',
									'Sort by price:high to low',
									'Sort by liked',
								].map((label) => (
									<MenuItem
										className="inside-item"
										onClick={sortingHandler}
										id={label}
										disableRipple
										key={label}
										sx={{
											color: selectedSortOption === label ? 'red' : 'inherit',
											fontWeight: selectedSortOption === label ? 'bold' : 'normal',
										}}
									>
										{label}
									</MenuItem>
								))}
							</Menu>
						</div>
					</Stack>
					<Stack className={'facility-page'}>
						<Stack className={'filter-config'}>
							{/* @ts-ignore */}
							<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
						</Stack>
						<Stack className="main-config" mb={'76px'}>
							<Stack className={'list-config'}>
								{facilities?.length === 0 ? (
									<div className={'no-data'}>
										<img src="/img/icons/icoAlert.svg" alt="" />
										<p>No Facilities found!</p>
									</div>
								) : (
									facilities.map((facility: Facility) => {
										return (
											<FacilityCard facility={facility} likeFacilityHandler={likeFacilityHandler} key={facility?._id} />
										);
									})
								)}
							</Stack>
							<Stack className="pagination-config">
								{facilities.length !== 0 && (
									<Stack className="pagination-box">
										<Pagination
											page={currentPage}
											count={Math.ceil(total / searchFilter.limit)}
											onChange={handlePaginationChange}
											shape="circular"
											color="primary"
										/>
									</Stack>
								)}

								{facilities.length !== 0 && (
									<Stack className="total-result">
										<Typography>
											Total {total} facilit{total > 1 ? 'ies' : 'y'} available
										</Typography>
									</Stack>
								)}
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

FacilityList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 15,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			squaresRange: {
				start: 0,
				end: 500,
			},
			pricesRange: {
				start: 0,
				end: 2000000,
			},
		},
	},
};

export default withLayoutBasic(FacilityList);
