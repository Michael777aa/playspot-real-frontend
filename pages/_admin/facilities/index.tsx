import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Stack, List, ListItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import { FacilityPanelList } from '../../../libs/components/admin/facilities/FacilityList';
import { AllFacilitiesInquiry } from '../../../libs/types/facility/facility.input';
import { Facility } from '../../../libs/types/facility/facility';
import { FacilityLocation, AvailabilityStatus } from '../../../libs/enums/facility.enum';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { FacilityUpdate } from '../../../libs/types/facility/facility.update';
import { REMOVE_FACILITY_BY_ADMIN, UPDATE_FACILITY_BY_ADMIN } from '../../../apollo/admin/mutation';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_FACILITIES_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';

const AdminFacilities: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [facilitiesInquiry, setFacilitiesInquiry] = useState<AllFacilitiesInquiry>(initialInquiry);
	const [facilities, setFacilities] = useState<Facility[]>([]);
	const [facilitiesTotal, setFacilitiesTotal] = useState<number>(0);
	const [value, setValue] = useState(
		facilitiesInquiry?.search?.availabilityStatus ? facilitiesInquiry?.search?.availabilityStatus : 'ALL',
	);
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/
	const [updateFacilityByAdmin] = useMutation(UPDATE_FACILITY_BY_ADMIN);
	const [removeFacilityByAdmin] = useMutation(REMOVE_FACILITY_BY_ADMIN);

	const {
		loading: getAllFacilitiesByAdminLoading,
		data: getAllFacilitiesByAdminData,
		error: getAllFacilitiesByAdminError,
		refetch: getAllFacilitiesByAdminRefetch,
	} = useQuery(GET_ALL_FACILITIES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: facilitiesInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setFacilities(data?.getAllFacilitiesByAdmin?.list);
			setFacilitiesTotal(data?.getAllFacilitiesByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getAllFacilitiesByAdminRefetch({ input: facilitiesInquiry }).then();
	}, [facilitiesInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		facilitiesInquiry.page = newPage + 1;
		await getAllFacilitiesByAdminRefetch({ input: facilitiesInquiry });
		setFacilitiesInquiry({ ...facilitiesInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		facilitiesInquiry.limit = parseInt(event.target.value, 10);
		facilitiesInquiry.page = 1;
		await getAllFacilitiesByAdminRefetch({ input: facilitiesInquiry });
		setFacilitiesInquiry({ ...facilitiesInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);

		setFacilitiesInquiry({ ...facilitiesInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'AVAILABLE':
				setFacilitiesInquiry({ ...facilitiesInquiry, search: { availabilityStatus: AvailabilityStatus.AVAILABLE } });
				break;
			case 'RESERVED':
				setFacilitiesInquiry({ ...facilitiesInquiry, search: { availabilityStatus: AvailabilityStatus.RESERVED } });
				break;
			case 'DELETE':
				setFacilitiesInquiry({ ...facilitiesInquiry, search: { availabilityStatus: AvailabilityStatus.DELETE } });
				break;
			default:
				delete facilitiesInquiry?.search?.availabilityStatus;
				setFacilitiesInquiry({ ...facilitiesInquiry });
		}
	};

	const removeFacilityHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to remove this facility?')) {
				await removeFacilityByAdmin({ variables: { input: id } });
				await getAllFacilitiesByAdminRefetch({ input: facilitiesInquiry });
			}

			menuIconCloseHandler();
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);

			if (newValue !== 'ALL') {
				setFacilitiesInquiry({
					...facilitiesInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...facilitiesInquiry.search,
						facilityLocationList: [newValue as FacilityLocation],
					},
				});
			} else {
				delete facilitiesInquiry?.search?.facilityLocationList;
				setFacilitiesInquiry({ ...facilitiesInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler:', err.message);
		}
	};

	const updateFacilityHandler = async (updateData: FacilityUpdate) => {
		try {
			let confirmMessage = '';
			if (updateData.availabilityStatus === AvailabilityStatus.AVAILABLE) {
				confirmMessage = `Do you want to make this facility available?`;
				updateData.availabilityStatus = AvailabilityStatus.AVAILABLE;
			} else if (updateData.availabilityStatus === AvailabilityStatus.RESERVED) {
				confirmMessage = `Do you want to make this facility reserved?`;
				updateData.availabilityStatus = AvailabilityStatus.RESERVED;
			} else {
				confirmMessage = `Do you want to make this facility deleted?`;
				updateData.availabilityStatus = AvailabilityStatus.RESERVED;
			}

			// Confirm the action with the user
			if (!(await sweetConfirmAlert(confirmMessage))) return;

			// Call the mutation
			const { data } = await updateFacilityByAdmin({ variables: { input: updateData } });

			if (data) {
				// Update the local facilities state after the mutation
				setFacilities((prevFacilities) =>
					prevFacilities.map((facility) =>
						facility._id === updateData._id
							? { ...facility, availabilityStatus: updateData.availabilityStatus }
							: facility,
					),
				);
			}

			menuIconCloseHandler();
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err);
		}
	};

	return (
		<Stack component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Facilities List
			</Typography>
			<Stack component={'div'} className={'table-wrap'}>
				<Stack component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Stack component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'ALL')}
									value="ALL"
									className={value === 'ALL' ? 'li on' : 'li'}
								>
									All
								</ListItem>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'AVAILABLE')}
									value="AVAILABLE"
									className={value === 'AVAILABLE' ? 'li on' : 'li'}
								>
									AVAILABLE
								</ListItem>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'RESERVED')}
									value="RESERVED"
									className={value === 'RESERVED' ? 'li on' : 'li'}
								>
									OCCUPIED
								</ListItem>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'DELETE')}
									value="DELETE"
									className={value === 'DELETE' ? 'li on' : 'li'}
								>
									Deleted
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<Select sx={{ width: '160px', mr: '20px' }} value={searchType}>
									<MenuItem value={'ALL'} onClick={() => searchTypeHandler('ALL')}>
										ALL
									</MenuItem>
									{Object.values(FacilityLocation).map((location: string) => (
										<MenuItem value={location} onClick={() => searchTypeHandler(location)} key={location}>
											{location}
										</MenuItem>
									))}
								</Select>
							</Stack>
							<Divider />
						</Stack>
						<FacilityPanelList
							facilities={facilities}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateFacilityHandler={updateFacilityHandler}
							removeFacilityHandler={removeFacilityHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={facilitiesTotal}
							rowsPerPage={facilitiesInquiry?.limit}
							page={facilitiesInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Stack>
			</Stack>
		</Stack>
	);
};

AdminFacilities.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminFacilities);
