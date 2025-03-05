import React, { useState, useTransition } from 'react';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_FACILITIES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { FacilitiesInquiry } from '../../types/facility/facility.input';
import { Facility } from '../../types/facility/facility';
import PopularFacilityCard from './PopularFacilitiesCard';
import { useTranslation } from 'next-i18next';

interface PopularFacilitiesProps {
	initialInput: FacilitiesInquiry;
}

const PopularFacilities = (props: PopularFacilitiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [popularFacilities, setPopularFacilities] = useState<Facility[]>([]);
	const { t, i18n } = useTranslation('common');

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
			setPopularFacilities(data?.getFacilities?.list);
		},
	});

	if (!popularFacilities) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'popular-facilities'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>{t('Popular facilities')}</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-facility-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={25}
							modules={[Autoplay]}
						>
							{popularFacilities.map((facility: Facility) => {
								return (
									<SwiperSlide key={facility._id} className={'popular-facility-slide'}>
										<PopularFacilityCard facility={facility} />
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
			<Stack className={'popular-facilities'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Stack component={'div'} className={'left'}>
							<span>{'Popular Sport Facilities'}</span>
							<p>{'Popularity is based on views'}</p>
						</Stack>
						<Stack component={'div'} className={'right'}>
							<div className={'more-box'}>
								<Link href={'/facility'}>
									<span>{'Explore All Categories'}</span>
								</Link>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Stack>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-facility-swiper'}
							slidesPerView={'auto'}
							spaceBetween={25}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-popular-next',
								prevEl: '.swiper-popular-prev',
							}}
							pagination={{
								el: '.swiper-popular-pagination',
							}}
						>
							{popularFacilities.map((facility: Facility) => {
								return (
									<SwiperSlide key={facility._id} className={'popular-facility-slide'}>
										<PopularFacilityCard facility={facility} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
					<Stack className={'pagination-box'}>
						<WestIcon className={'swiper-popular-prev'} />
						<div className={'swiper-popular-pagination'}></div>
						<EastIcon className={'swiper-popular-next'} />
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

PopularFacilities.defaultProps = {
	initialInput: {
		page: 1,
		limit: 7,
		sort: 'facilityViews',
		direction: 'DESC',
		search: {},
	},
};

export default PopularFacilities;
