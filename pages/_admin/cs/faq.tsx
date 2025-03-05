import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Stack, Button, InputAdornment } from '@mui/material';
import { List, ListItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { FaqArticlesPanelList } from '../../../libs/components/admin/cs/FaqList';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_NOTICE } from '../../../apollo/admin/mutation';
import { GET_ALL_NOTICES } from '../../../apollo/admin/query';
import { Notice } from '../../../libs/types/notice/notice';
import { NoticeCategory, NoticeField, NoticeStatus } from '../../../libs/enums/notice.enum';
import { NoticeUpdate } from '../../../libs/types/notice/notice.update';
import { sweetErrorHandling } from '../../../libs/sweetAlert';
import { T } from '../../../libs/types/common';
import { NoticiesInquiry } from '../../../libs/types/notice/notice.input';
import { useRouter } from 'next/router';

const FaqArticles: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<any>([]);
	const [noticesInquiry, setNoticesInquiry] = useState<NoticiesInquiry>(initialInquiry);
	const [allNotices, setAllNotices] = useState<Notice[]>([]);
	const router = useRouter();

	const [value, setValue] = useState(
		noticesInquiry?.search?.noticeStatus ? noticesInquiry?.search?.noticeStatus : 'ALL',
	);
	const [searchText, setSearchText] = useState('');
	const [total, setTotal] = useState<number>(0);

	const [searchType, setSearchType] = useState('ALL');
	const [searchField, setSearchField] = useState('ALL');

	/** APOLLO REQUESTS **/

	const [updateNotice] = useMutation(UPDATE_NOTICE);

	const {
		loading: getNoticesLoading,
		data: getNoticesData,
		error: getNoticesError,
		refetch: getNoticesRefetch,
	} = useQuery(GET_ALL_NOTICES, {
		fetchPolicy: 'network-only',
		variables: { input: noticesInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAllNotices(data?.getNotices?.list || []);
			setTotal(data?.getNotices?.metaCounter[0]?.total || 0);
		},
	});
	/** LIFECYCLES **/

	useEffect(() => {
		getNoticesRefetch({ input: noticesInquiry });
	}, [noticesInquiry]);

	/** HANDLERS **/

	const changePageHandler = async (event: unknown, newPage: number) => {
		setNoticesInquiry((prev) => ({ ...prev, page: newPage + 1 }));
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		setNoticesInquiry((prev) => ({
			...prev,
			limit: parseInt(event.target.value, 10),
			page: 1,
		}));
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);

		setNoticesInquiry({ ...noticesInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setNoticesInquiry({ ...noticesInquiry, search: { noticeStatus: NoticeStatus.ACTIVE } });
				break;
			case 'HOLD':
				setNoticesInquiry({ ...noticesInquiry, search: { noticeStatus: NoticeStatus.HOLD } });
				break;
			case 'DELETE':
				setNoticesInquiry({ ...noticesInquiry, search: { noticeStatus: NoticeStatus.DELETE } });
				break;
			default:
				delete noticesInquiry?.search?.noticeStatus;
				setNoticesInquiry({ ...noticesInquiry });
				break;
		}
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);

			if (newValue !== 'ALL') {
				setNoticesInquiry({
					...noticesInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...noticesInquiry.search,
						noticeCategory: newValue as NoticeCategory,
					},
				});
			} else {
				delete noticesInquiry?.search?.noticeCategory;
				setNoticesInquiry({ ...noticesInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};
	const searchFieldHandler = (newValue: string) => {
		setSearchField(newValue);

		let updatedSearch = { ...noticesInquiry.search };
		if (newValue !== 'ALL') {
			updatedSearch.noticeField = newValue as NoticeField;
		} else {
			delete updatedSearch.noticeField;
		}

		setNoticesInquiry({ ...noticesInquiry, search: updatedSearch });
	};

	const updateArticleHandler = async (updateData: NoticeUpdate) => {
		try {
			await updateNotice({
				variables: {
					input: updateData,
				},
			});
			menuIconCloseHandler();
			getNoticesRefetch({ input: noticesInquiry });
		} catch (err) {
			console.error('Error updating notice:', err);
			sweetErrorHandling(err);
		}
	};

	const searchTextHandler = () => {
		setNoticesInquiry({
			...noticesInquiry,
			search: {
				...noticesInquiry.search,
				text: searchText,
			},
		});
	};

	return (
		<Stack component="div" className="content">
			<Stack component="div" className="title flex_space">
				<Typography variant="h2">FAQ Management</Typography>
				<Button
					className="btn_add"
					sx={{ position: 'relative', top: '10px' }}
					onClick={() =>
						router.push({
							pathname: '/_admin/cs/addNotice',
						})
					}
					variant="outlined"
					size="medium"
				>
					<AddRoundedIcon sx={{ mr: '8px' }} />
					Add Notice
				</Button>
			</Stack>

			<Stack component="div" className="table-wrap">
				<TabContext value={value}>
					<Stack component="div">
						<List className={'tab-menu'}>
							<ListItem
								onClick={(e) => tabChangeHandler(e, 'ALL')}
								value="ALL"
								className={value === 'ALL' ? 'li on' : 'li'}
							>
								All
							</ListItem>
							<ListItem
								onClick={(e) => tabChangeHandler(e, 'ACTIVE')}
								value="ACTIVE"
								className={value === 'ACTIVE' ? 'li on' : 'li'}
							>
								Active
							</ListItem>
							<ListItem
								onClick={(e) => tabChangeHandler(e, 'HOLD')}
								value="HOLD"
								className={value === 'HOLD' ? 'li on' : 'li'}
							>
								Hold
							</ListItem>
							<ListItem
								onClick={(e) => tabChangeHandler(e, 'DELETE')}
								value="DELETE"
								className={value === 'DELETE' ? 'li on' : 'li'}
							>
								Delete
							</ListItem>
						</List>
						<Divider sx={{ my: 2 }} />

						<Stack className="search-area" sx={{ m: '24px' }}>
							<OutlinedInput
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								sx={{ width: '100%' }}
								placeholder="Search "
								onKeyDown={(e) => e.key === 'Enter' && searchTextHandler()}
								endAdornment={
									<>
										{searchText && (
											<CancelRoundedIcon
												style={{ cursor: 'pointer' }}
												onClick={() => {
													setSearchText('');
													searchTextHandler();
												}}
											/>
										)}
										<InputAdornment position="end" onClick={searchTextHandler}>
											<img src="/img/icons/search_icon.png" alt="searchIcon" style={{ cursor: 'pointer' }} />
										</InputAdornment>
									</>
								}
							/>
							<Stack direction="row" sx={{}}>
								<Select
									value={searchType}
									sx={{ width: '160px', mr: 2, ml: 2 }}
									onChange={(e) => searchTypeHandler(e.target.value)}
								>
									<MenuItem value="ALL">ALL</MenuItem>
									{Object.values(NoticeCategory).map((category) => (
										<MenuItem key={category} value={category}>
											{category}
										</MenuItem>
									))}
								</Select>
								<Select
									value={searchField}
									sx={{ width: '160px' }}
									onChange={(e) => searchFieldHandler(e.target.value)}
								>
									<MenuItem value="ALL">ALL</MenuItem>
									{Object.values(NoticeField).map((field) => (
										<MenuItem key={field} value={field}>
											{field}
										</MenuItem>
									))}
								</Select>
							</Stack>
						</Stack>
						<Divider sx={{ my: 2 }} />
					</Stack>

					<FaqArticlesPanelList
						anchorEl={anchorEl}
						allNotices={allNotices}
						handleMenuIconClick={menuIconClickHandler}
						handleMenuIconClose={menuIconCloseHandler}
						updateArticleHandler={updateArticleHandler}
					/>

					<TablePagination
						rowsPerPageOptions={[10, 20, 40, 60]}
						component="div"
						count={total}
						rowsPerPage={noticesInquiry?.limit}
						page={noticesInquiry.page - 1}
						onPageChange={changePageHandler}
						onRowsPerPageChange={changeRowsPerPageHandler}
					/>
				</TabContext>
			</Stack>
		</Stack>
	);
};

FaqArticles.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(FaqArticles);
