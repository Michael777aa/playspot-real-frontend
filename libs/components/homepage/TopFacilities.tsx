import React, { useState } from 'react';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { GET_FACILITIES } from '../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_FACILITY } from '../../../apollo/user/mutation';
import { T } from '../../types/common';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert } from '../../sweetAlert';
import { Facility } from '../../types/facility/facility';
import { FacilitiesInquiry } from '../../types/facility/facility.input';
import TopFacilityCard from './TopFacilityCard';
import { useTranslation } from 'react-i18next';

interface TopFacilitiesProps {
	initialInput: FacilitiesInquiry;
}

const TopFacilities = (props: TopFacilitiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [topFacilities, setTopFacilities] = useState<Facility[]>([]);
	const [likeTargetFacility] = useMutation(LIKE_TARGET_FACILITY);
	const { t } = useTranslation('common');
	/** APOLLO REQUESTS **/
	const {
		loading: getFacilitiesLoading,
		data: getFacilitiesData,
		error: getFacilitiesError,
		refetch: getFacilitiesRefetch,
	} = useQuery(GET_FACILITIES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTopFacilities(data?.getFacilities?.list);
		},
	});

	/** HANDLERS **/

	const likeFacilityHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetFacility({ variables: { input: id } });

			await getFacilitiesRefetch();
		} catch (err: any) {
			console.log('Erron on likeFacilityHandler', err);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return (
			<Stack className={'top-facilities'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>{'Top Sports Arenas'}</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper className={'top-facility-swiper'} slidesPerView={'auto'} spaceBetween={15} modules={[Autoplay]}>
							{topFacilities.map((facility: Facility) => {
								return (
									<SwiperSlide className={'top-facility-slide'} key={facility?._id}>
										<TopFacilityCard facility={facility} likeFacilityHandler={likeFacilityHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'top-facilities'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Stack component={'div'} className={'left'}>
							<span>{'Top Sports Arenas'}</span>
							<p>Check out our Leading Sports Arenas</p>
						</Stack>
						<Stack component={'div'} className={'right'}>
							<div className={'pagination-box'} style={{ position: 'relative', top: 15, right: 18 }}>
								<WestIcon className={'swiper-top-prev'} />
								<div className={'swiper-top-pagination'}></div>
								<EastIcon className={'swiper-top-next'} />
							</div>
						</Stack>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'top-facility-swiper'}
							slidesPerView={'auto'}
							spaceBetween={15}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-top-next',
								prevEl: '.swiper-top-prev',
							}}
							pagination={{
								el: '.swiper-top-pagination',
							}}
							threshold={10}
							touchStartPreventDefault={false}
							preventClicks={true}
							preventClicksPropagation={true}
						>
							{topFacilities.map((facility: Facility) => {
								return (
									<SwiperSlide
										onClick={(e) => {
											e.stopPropagation();
										}}
										className={'top-facility-slide'}
										key={facility?._id}
									>
										<TopFacilityCard facility={facility} likeFacilityHandler={likeFacilityHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TopFacilities.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'facilityRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopFacilities;
