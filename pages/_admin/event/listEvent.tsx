import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Stack, Button, InputAdornment } from '@mui/material';
import { List, ListItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { TabContext } from '@mui/lab';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_EVENT, UPDATE_EVENT } from '../../../apollo/admin/mutation';
import { GET_ALL_EVENTS } from '../../../apollo/admin/query';
import { sweetErrorHandling } from '../../../libs/sweetAlert';
import { T } from '../../../libs/types/common';
import { useRouter } from 'next/router';
import { EventInquiry } from '../../../libs/types/event/event.input';
import { Event } from '../../../libs/types/event/event';
import { EventStatus } from '../../../libs/enums/event.enum';
import { EventUpdate } from '../../../libs/types/event/event.update';
import { EventsPanelList } from '../../../libs/components/admin/event/Event';

const Events: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<any>([]);
	const [eventInquiry, setEventInquiry] = useState<EventInquiry>(initialInquiry);
	const [allEvents, setAllEvents] = useState<Event[]>([]);
	const router = useRouter();
	const [value, setValue] = useState(eventInquiry?.search?.eventStatus ? eventInquiry?.search?.eventStatus : 'ALL');
	const [searchText, setSearchText] = useState('');
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/

	const [updateEvent] = useMutation(UPDATE_EVENT);
	const [removeEvent] = useMutation(REMOVE_EVENT);

	const {
		loading: getEventsLoading,
		data: getEventsData,
		error: getEventsError,
		refetch: getEventsRefetch,
	} = useQuery(GET_ALL_EVENTS, {
		fetchPolicy: 'network-only',
		variables: { input: eventInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAllEvents(data?.getAllEventsByAdmin?.list || []);
			setTotal(data?.getAllEventsByAdmin?.metaCounter[0]?.total || 0);
		},
	});
	/** LIFECYCLES **/

	useEffect(() => {
		getEventsRefetch({ input: eventInquiry });
	}, [eventInquiry]);

	/** HANDLERS **/

	const changePageHandler = async (event: unknown, newPage: number) => {
		setEventInquiry((prev) => ({ ...prev, page: newPage + 1 }));
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		setEventInquiry((prev) => ({
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

		setEventInquiry({ ...eventInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setEventInquiry({ ...eventInquiry, search: { eventStatus: EventStatus.ACTIVE } });
				break;
			case 'PAUSE':
				setEventInquiry({ ...eventInquiry, search: { eventStatus: EventStatus.PAUSE } });
				break;
			case 'DELETE':
				setEventInquiry({ ...eventInquiry, search: { eventStatus: EventStatus.DELETE } });
				break;
			default:
				delete eventInquiry?.search?.eventStatus;
				setEventInquiry({ ...eventInquiry });
				break;
		}
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const updateEventHandler = async (updateData: EventUpdate) => {
		try {
			await updateEvent({
				variables: {
					input: updateData,
				},
			});
			menuIconCloseHandler();
			getEventsRefetch({ input: eventInquiry });
		} catch (err) {
			console.error('Error updating notice:', err);
			sweetErrorHandling(err);
		}
	};

	const searchTextHandler = () => {
		setEventInquiry({
			...eventInquiry,
			search: {
				...eventInquiry.search,
				text: searchText,
			},
		});
	};

	return (
		<Stack component="div" className="content">
			<Stack component="div" className="title flex_space">
				<Typography variant="h2"> Events</Typography>
				<Button
					className="btn_add"
					sx={{ position: 'relative', top: '10px' }}
					onClick={() =>
						router.push({
							pathname: '/_admin/event/addEvent',
						})
					}
					variant="outlined"
					size="medium"
				>
					<AddRoundedIcon sx={{ mr: '8px' }} />
					Add Event
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
								onClick={(e) => tabChangeHandler(e, 'PAUSE')}
								value="PAUSE"
								className={value === 'PAUSE' ? 'li on' : 'li'}
							>
								Pause
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
						</Stack>
						<Divider sx={{ my: 2 }} />
					</Stack>

					<EventsPanelList
						anchorEl={anchorEl}
						allEvents={allEvents}
						handleMenuIconClick={menuIconClickHandler}
						handleMenuIconClose={menuIconCloseHandler}
						updateEventHandler={updateEventHandler}
					/>

					<TablePagination
						rowsPerPageOptions={[10, 20, 40, 60]}
						component="div"
						count={total}
						rowsPerPage={eventInquiry?.limit}
						page={eventInquiry.page - 1}
						onPageChange={changePageHandler}
						onRowsPerPageChange={changeRowsPerPageHandler}
					/>
				</TabContext>
			</Stack>
		</Stack>
	);
};

Events.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(Events);
