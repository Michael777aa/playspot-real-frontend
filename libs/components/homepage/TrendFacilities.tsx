import React, { useState } from 'react';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TrendFacilityCard from './TrendFacilityCard';
import { useMutation, useQuery } from '@apollo/client';
import { GET_FACILITIES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { LIKE_TARGET_FACILITY } from '../../../apollo/user/mutation';
import { FacilitiesInquiry } from '../../types/facility/facility.input';
import { Facility } from '../../types/facility/facility';
import { useTranslation } from 'next-i18next';

interface TrendFacilitiesProps {
	initialInput: FacilitiesInquiry;
}

const TrendFacilities = (props: TrendFacilitiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendFacilities, setTrendFacilities] = useState<Facility[]>([]);
	const { t } = useTranslation('common');

	/** APOLLO REQUESTS **/
	const [likeTargetFacility] = useMutation(LIKE_TARGET_FACILITY);

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
			setTrendFacilities(data?.getFacilities?.list);
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

	if (!trendFacilities) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'trend-facilities'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						Trend Facilities
						<p style={{ marginTop: '10px' }}>Trend is based on likes</p>
					</Stack>
					<Stack className={'card-box'}>
						{trendFacilities.length === 0 ? (
							<Stack component={'div'} className={'empty-list'}>
								Trends not availably currently
							</Stack>
						) : (
							<Swiper
								className={'trend-facility-swiper'}
								slidesPerView={'auto'}
								centeredSlides={false}
								spaceBetween={15}
								modules={[Autoplay]}
							>
								{trendFacilities.map((facility: Facility) => {
									return (
										<SwiperSlide key={facility._id} className={'trend-facility-slide'}>
											<TrendFacilityCard facility={facility} likeFacilityHandler={likeFacilityHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'trend-facilities'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Stack component={'div'} className={'left'}>
							<span>{t('Trend Sport Facilities')}</span>
							<p>{t('Trend is based on likes')}</p>
						</Stack>
						<Stack component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon className={'swiper-trend-prev'} />
								<div className={'swiper-trend-pagination'}></div>
								<EastIcon className={'swiper-trend-next'} />
							</div>
						</Stack>
					</Stack>
					<Stack className={'card-box'}>
						{trendFacilities.length === 0 ? (
							<Stack component={'div'} className={'empty-list'}>
								Trends not availably currently
							</Stack>
						) : (
							<Swiper
								className={'trend-facility-swiper'}
								slidesPerView={'auto'}
								spaceBetween={15}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-trend-next',
									prevEl: '.swiper-trend-prev',
								}}
								pagination={{
									el: '.swiper-trend-pagination',
								}}
								threshold={10}
								touchStartPreventDefault={false}
							>
								{trendFacilities.map((facility: Facility) => {
									return (
										<SwiperSlide key={facility._id} className={'trend-facility-slide'}>
											<TrendFacilityCard facility={facility} likeFacilityHandler={likeFacilityHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TrendFacilities.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'facilityLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendFacilities;
