import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { GET_FACILITIES } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { Facility } from '../../types/facility/facility';
import { FacilityCard } from '../mypage/FacilityCard';

const MyFacilities: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { memberId } = router.query;
	const [searchFilter, setSearchFilter] = useState<Facility>({ ...initialInput });
	const [agentFacilities, setAgentFacilities] = useState<Facility[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/

	const {
		loading: getFacilitiesLoading,
		data: getFacilitiesData,
		error: getFacilitiesError,
		refetch: getFacilitiesRefetch,
	} = useQuery(GET_FACILITIES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: any) => {
			setAgentFacilities(data?.getFacilities?.list);
			setTotal(data?.getFacilities?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getFacilitiesRefetch({ input: searchFilter }).then();
	}, [searchFilter]);

	useEffect(() => {
		if (memberId)
			setSearchFilter({ ...initialInput, search: { ...initialInput.search, memberId: memberId as string } });
	}, [memberId]);

	if (device === 'mobile') {
		return <div>PLAYSPOT FACILITIES MOBILE</div>;
	} else {
		return (
			<div id="member-facilities-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">Facilities</Typography>
					</Stack>
				</Stack>
				<Stack className="facilities-list-box">
					<Stack className="list-box">
						{agentFacilities?.length > 0 && (
							<Stack className="listing-title-box">
								<Typography className="title-text">Listing title</Typography>
								<Typography className="title-text">Date Published</Typography>
								<Typography className="title-text">Status</Typography>
								<Typography className="title-text">View</Typography>
							</Stack>
						)}
						{agentFacilities?.length === 0 && (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Facility found!</p>
							</div>
						)}
						{agentFacilities?.map((facility: Facility) => {
							return <FacilityCard facility={facility} memberPage={true} key={facility?._id} />;
						})}

						{agentFacilities.length !== 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box"></Stack>
								<Stack className="total-result">
									<Typography>{total} facility available</Typography>
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
			memberId: '',
		},
	},
};

export default MyFacilities;
