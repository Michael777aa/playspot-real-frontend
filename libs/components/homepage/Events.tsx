import React, { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { EventInquiry } from '../../types/event/event.input';
import { GET_EVENTS } from '../../../apollo/user/query';
import { Event } from '../../types/event/event';
import { REACT_APP_API_URL } from '../../config';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import { useTranslation } from 'next-i18next';

const EventCard = ({ event }: { event: Event }) => {
	const device = useDeviceDetect();
	const event_image = `${REACT_APP_API_URL}/${event.eventImages[0]}`;

	if (device === 'mobile') {
		return (
			<>
				<Stack className="top-card-box">
					<Stack
						component={'div'}
						className={'card-img'}
						style={{
							backgroundImage: `url(${event_image})`,
						}}
					></Stack>
					<Stack
						component="div"
						className="info"
						sx={{
							backgroundColor: '#fff',
							borderRadius: '8px',
							boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
							display: 'flex',
							flexDirection: 'column',
							gap: '4px',
							width: '100%',
						}}
					>
						<strong
							className="title"
							style={{
								fontSize: '18px',
								fontWeight: 'bold',
								color: '#333',
								textTransform: 'capitalize',
							}}
						>
							{event?.eventName}
						</strong>

						<p
							className="desc"
							style={{
								fontSize: '14px',
								fontWeight: '400',
								color: '#666',
							}}
						>
							{event?.eventLocation}
						</p>

						<span
							style={{
								fontSize: '14px',
								fontWeight: '500',
								color: '#000000',
							}}
						>
							{event?.eventTopic}
						</span>

						<span
							style={{
								fontSize: '14px',
								fontWeight: '400',
								color: '#888',
								lineHeight: '1.5',
							}}
						>
							{event?.eventDesc}
						</span>

						<div
							style={{
								fontSize: '12px',
								fontWeight: '400',
								color: '#aaa',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<span>{new Date(event?.createdAt).toDateString()}</span>
						</div>
					</Stack>
				</Stack>
			</>
		);
	} else {
		return (
			<Stack
				className="event-card"
				style={{
					backgroundImage: `url(${event_image})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}}
			>
				<Stack component={'div'} className={'info'}>
					<strong>{event?.eventLocation}</strong>
					<span>{event?.eventTopic}</span>
				</Stack>
				<Stack component={'div'} className={'more'}>
					<span>{event?.eventDesc}</span>
				</Stack>
			</Stack>
		);
	}
};

const Events = ({ initialInquiry }: any) => {
	const [eventInquiry, setEventInquiry] = useState<EventInquiry>(initialInquiry);
	const device = useDeviceDetect();
	const [allEvents, setAllEvents] = useState<Event[]>([]);
	const { t, i18n } = useTranslation('common');

	const {
		loading: getEventsLoading,
		data: getEventsData,
		error: getEventsError,
		refetch: getEventsRefetch,
	} = useQuery(GET_EVENTS, {
		fetchPolicy: 'network-only',
		variables: { input: eventInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAllEvents(data?.getEvents?.list || []);
		},
	});

	useEffect(() => {
		getEventsRefetch({ input: eventInquiry });
	}, [eventInquiry]);

	if (device === 'mobile') {
		return (
			<Stack className={'top-facilities'} mt={4}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>{t('Events')}</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper className={'top-facility-swiper'} slidesPerView={'auto'} spaceBetween={15} modules={[Autoplay]}>
							{allEvents.map((event: Event) => {
								return (
									<SwiperSlide className={'top-facility-slide'} key={event?._id}>
										<EventCard event={event} />
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
			<Stack className={'events'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Stack component={'div'} className={'left'}>
							<span className={'white'}>{t('Events')}</span>
						</Stack>
					</Stack>
					<Stack className={'card-wrapper'}>
						{getEventsLoading ? (
							<Typography variant="h6" align="center">
								Loading events...
							</Typography>
						) : allEvents.length === 0 ? (
							<Stack
								sx={{
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									position: 'relative',
									left: '180px',
									width: '900px',
									backgroundColor: '#f5f5f5',
									borderRadius: 2,
									boxShadow: 2,
									padding: 3,
									textAlign: 'center',
								}}
							>
								<Typography
									variant="h4"
									sx={{
										color: '#555',
										fontWeight: 'bold',
										marginBottom: 2,
									}}
								>
									No Events Available
								</Typography>
								<Typography
									variant="body1"
									sx={{
										color: '#888',
									}}
								>
									Please check back later for updates on events.
								</Typography>
							</Stack>
						) : (
							allEvents.map((event: Event) => <EventCard event={event} key={event?._id} />)
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

Events.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			eventStatus: 'ACTIVE',
		},
	},
};

export default Events;
