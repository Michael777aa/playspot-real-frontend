import React, { useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Pagination, Stack, Typography } from '@mui/material';
import { T } from '../../types/common';
import { GET_VISITED } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { Facility } from '../../types/facility/facility';
import FacilityCard from '../facility/FacilityCard';

const RecentlyVisited: NextPage = () => {
	const device = useDeviceDetect();
	const [recentlyVisited, setRecentlyVisited] = useState<Facility[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchVisited, setSearchVisited] = useState<T>({ page: 1, limit: 6 });

	/** APOLLO REQUESTS **/

	const {
		loading: getVisitedLoading,
		data: getVisitedData,
		error: getVisitedError,
		refetch: getVisitedRefetch,
	} = useQuery(GET_VISITED, {
		fetchPolicy: 'network-only',
		variables: { input: searchVisited },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setRecentlyVisited(data?.getVisited?.list);
			setTotal(data?.getVisited?.metaCounter[0]?.total || 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchVisited({ ...searchVisited, page: value });
	};

	if (device === 'mobile') {
		return <div>PLAYSPOT MY FAVORITES MOBILE</div>;
	} else {
		return (
			<div id="my-favoritess-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">Recently Visited</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack>
					<Stack className="main-config">
						<Stack className="favorites-list-box">
							{recentlyVisited?.length ? (
								recentlyVisited?.map((facility: Facility) => {
									return <FacilityCard facility={facility} recentlyVisited={true} />;
								})
							) : (
								<div className={'no-data'}>
									<img src="/img/icons/icoAlert.svg" alt="" />
									<p>No Recently Visited Facilities found!</p>
								</div>
							)}
						</Stack>
					</Stack>
				</Stack>
				{recentlyVisited?.length ? (
					<Stack className="pagination-config">
						<Stack className="pagination-box">
							<Pagination
								count={Math.ceil(total / searchVisited.limit)}
								page={searchVisited.page}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
							/>
						</Stack>
						<Stack className="total-result">
							<Typography>
								Total {total} recently visited facilit{total > 1 ? 'ies' : 'y'}
							</Typography>
						</Stack>
					</Stack>
				) : null}
			</div>
		);
	}
};

export default RecentlyVisited;
