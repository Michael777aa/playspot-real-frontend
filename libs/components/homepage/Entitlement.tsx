import React from 'react';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useTranslation } from 'next-i18next';

const Entitlement = () => {
	const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');
	if (device === 'mobile') {
		return (
			<>
				<Stack className="main-entit-container">
					<Stack className={'left-side'}>
						<h1>{t('Facility Sports Facilities & Unique Experiences')} </h1>
						<p>
							{t(
								'Accompany us for a game-changing experience with PlaySpot. Facilitying sports facilities like soccer fields, basketball courts, golf courses, and more has never been easier. Discover the perfect venue for your next match, training session, or sports event, all in one place. Let us take your sports experience to the next level.',
							)}
						</p>
					</Stack>
				</Stack>
			</>
		);
	} else {
		return (
			<>
				<Stack className="main-entit-container">
					<Stack className={'left-side'}>
						<h1>{t('Facility Sports Facilities & Unique Experiences')} </h1>
						<p>
							{t(
								'Accompany us for a game-changing experience with PlaySpot. Facilitying sports facilities like soccer fields, basketball courts, golf courses, and more has never been easier. Discover the perfect venue for your next match, training session, or sports event, all in one place. Let us take your sports experience to the next level.',
							)}
						</p>
					</Stack>
					<Stack className="right-side">
						<Stack>
							<img src="/img/header/2024-10-30 20.18.44.jpg" alt="" />
							<img src="/img/header/2024-10-30 20.18.47.jpg" alt="" />
						</Stack>
						<Stack>
							<img src="/img/header/2024-10-30 20.18.08.jpg" alt="" />
							<img src="/img/header/2024-10-30 20.18.51.jpg" alt="" />
						</Stack>
					</Stack>
				</Stack>
			</>
		);
	}
};

export default Entitlement;
