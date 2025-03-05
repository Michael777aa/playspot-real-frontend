import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { FacilityCard } from './FacilityCard';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Facility } from '../../types/facility/facility';
import { AgentFacilitiesInquiry } from '../../types/facility/facility.input';
import { T } from '../../types/common';
import { AvailabilityStatus } from '../../enums/facility.enum';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { UPDATE_FACILITY } from '../../../apollo/user/mutation';
import { GET_AGENT_FACILITIES } from '../../../apollo/user/query';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';

const MyFacilities: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const [searchFilter, setSearchFilter] = useState<AgentFacilitiesInquiry>(initialInput);
	const [agentFacilities, setAgentFacilities] = useState<Facility[]>([]);
	const [total, setTotal] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** APOLLO REQUESTS **/

	const [updateFacility] = useMutation(UPDATE_FACILITY);

	const {
		loading: getAgentFacilitiesLoading,
		data: getAgentFacilitiesData,
		error: getAgentFacilitiesError,
		refetch: getAgentFacilitiesRefetch,
	} = useQuery(GET_AGENT_FACILITIES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentFacilities(data?.getAgentFacilities?.list);
			setTotal(data?.getAgentFacilities?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const changeStatusHandler = (value: AvailabilityStatus) => {
		setSearchFilter({ ...searchFilter, search: { availabilityStatus: value } });
	};

	const deleteFacilityHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to delete this sport complex?')) {
				await updateFacility({ variables: { input: { _id: id, availabilityStatus: AvailabilityStatus.DELETE } } });
			}
			await getAgentFacilitiesRefetch({ input: searchFilter });
		} catch (err: any) {
			sweetErrorHandling(err);
		}
	};

	const updateFacilityHandler = async (status: string, id: string) => {
		try {
			if (await sweetConfirmAlert(`Are you sure to change ${status} status?`)) {
				await updateFacility({ variables: { input: { _id: id, availabilityStatus: status } } });
			}
			await getAgentFacilitiesRefetch({ input: searchFilter });
		} catch (err: any) {
			sweetErrorHandling(err);
		}
	};

	if (user?.memberType !== 'AGENT') {
		router.back();
	}

	if (device === 'mobile') {
		return (
			<div
				id="my-facility-page"
				style={{
					padding: '16px',
					maxWidth: '100%',
				}}
			>
				<Stack spacing={2}>
					{/* Header Section */}
					<Stack
						direction="column"
						alignItems="center"
						spacing={1}
						style={{
							textAlign: 'center',
						}}
					>
						<Typography
							variant="h5"
							style={{
								fontWeight: 'bold',
							}}
						>
							My Facilities
						</Typography>
						<Typography variant="body2" color="textSecondary">
							We are glad to see you again!
						</Typography>
					</Stack>

					{/* Tabs Section */}
					<Stack
						direction="row"
						justifyContent="center"
						spacing={2}
						style={{
							borderBottom: '1px solid #e0e0e0',
							paddingBottom: '8px',
						}}
					>
						<Typography
							onClick={() => changeStatusHandler(AvailabilityStatus.AVAILABLE)}
							style={{
								cursor: 'pointer',
								fontWeight: searchFilter.search.availabilityStatus === AvailabilityStatus.AVAILABLE ? 'bold' : 'normal',
								color: searchFilter.search.availabilityStatus === AvailabilityStatus.AVAILABLE ? '#1976d2' : '#555',
							}}
						>
							AVAILABLE
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(AvailabilityStatus.RESERVED)}
							style={{
								cursor: 'pointer',
								fontWeight: searchFilter.search.availabilityStatus === AvailabilityStatus.RESERVED ? 'bold' : 'normal',
								color: searchFilter.search.availabilityStatus === AvailabilityStatus.RESERVED ? '#1976d2' : '#555',
							}}
						>
							RESERVED
						</Typography>
					</Stack>

					{/* List Section */}
					<Stack spacing={2}>
						{/* Listing Titles */}
						<Stack
							direction="row"
							justifyContent="space-between"
							style={{
								padding: '8px',
								borderBottom: '1px solid #e0e0e0',
							}}
						>
							<Typography variant="body2" style={{ fontWeight: 'bold' }}>
								Listing Title
							</Typography>
							<Typography variant="body2" style={{ fontWeight: 'bold' }}>
								Date Published
							</Typography>
							<Typography variant="body2" style={{ fontWeight: 'bold' }}>
								Status
							</Typography>
							<Typography variant="body2" style={{ fontWeight: 'bold' }}>
								View
							</Typography>
							{searchFilter.search.availabilityStatus === AvailabilityStatus.AVAILABLE && (
								<Typography variant="body2" style={{ fontWeight: 'bold' }}>
									Action
								</Typography>
							)}
						</Stack>

						{/* Facilities List */}
						{agentFacilities?.length === 0 ? (
							<Stack
								alignItems="center"
								justifyContent="center"
								style={{
									padding: '16px',
									textAlign: 'center',
									color: '#777',
								}}
							>
								<img
									src="/img/icons/icoAlert.svg"
									alt="No Data"
									style={{
										width: '50px',
										marginBottom: '8px',
									}}
								/>
								<Typography variant="body2">No Facility found!</Typography>
							</Stack>
						) : (
							agentFacilities.map((facility: Facility) => (
								<FacilityCard
									key={facility._id}
									facility={facility}
									deleteFacilityHandler={deleteFacilityHandler}
									updateFacilityHandler={updateFacilityHandler}
								/>
							))
						)}

						{/* Pagination */}
						{agentFacilities.length !== 0 && (
							<Stack alignItems="center" spacing={1} style={{ marginTop: '16px' }}>
								<Pagination
									count={Math.ceil(total / searchFilter.limit)}
									page={searchFilter.page}
									shape="circular"
									color="primary"
									onChange={paginationHandler}
								/>
								<Typography variant="body2" color="textSecondary">
									{total} Facilities available
								</Typography>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	} else {
		return (
			<div id="my-facility-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Facilities</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="facility-list-box">
					<Stack className="tab-name-box">
						<Typography
							onClick={() => changeStatusHandler(AvailabilityStatus.AVAILABLE)}
							className={
								searchFilter.search.availabilityStatus === AvailabilityStatus.AVAILABLE ? 'active-tab-name' : 'tab-name'
							}
						>
							AVAILABLE
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(AvailabilityStatus.RESERVED)}
							className={
								searchFilter.search.availabilityStatus === AvailabilityStatus.RESERVED ? 'active-tab-name' : 'tab-name'
							}
						>
							RESERVED
						</Typography>
					</Stack>

					<Stack className="list-box">
						<Stack className="listing-title-box">
							<Typography className="title-text">Listing title</Typography>
							<Typography className="title-text">Date Published</Typography>
							<Typography className="title-text">Status</Typography>
							<Typography className="title-text">View</Typography>
							{searchFilter.search.availabilityStatus === AvailabilityStatus.AVAILABLE && (
								<Typography className="title-text">Action</Typography>
							)}
						</Stack>

						{agentFacilities?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Facility found!</p>
							</div>
						) : (
							agentFacilities.map((facility: Facility) => {
								return (
									<FacilityCard
										facility={facility}
										deleteFacilityHandler={deleteFacilityHandler}
										updateFacilityHandler={updateFacilityHandler}
									/>
								);
							})
						)}

						{agentFacilities.length !== 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										count={Math.ceil(total / searchFilter.limit)}
										page={searchFilter.page}
										shape="circular"
										color="primary"
										onChange={paginationHandler}
									/>
								</Stack>
								<Stack className="total-result">
									<Typography>{total} Facilities available</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

MyFacilities.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			availabilityStatus: AvailabilityStatus.AVAILABLE,
		},
	},
};

export default MyFacilities;
