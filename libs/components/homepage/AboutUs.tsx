import { useTranslation } from 'next-i18next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Container, Stack } from '@mui/material';

const AboutUs = () => {
	const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');

	if (device === 'mobile') {
		return <div>COMMUNITY BOARDS (MOBILE)</div>;
	} else {
		return (
			<Stack className={'about-us-main'}>
				<Container className="container">
					<Stack className={'about-us'}>
						<Stack className={'about-us-left'}>
							<img className={'about-us-left'} src="/img/about-us/sport-1-banner-4.jpg" alt=""></img>
						</Stack>
						<Stack className={'about-us-right'}>
							<h1> {t('WE SUPPORT PASSIONS AND TRY TO HELP FUTURE ATHLETES')}</h1>
						</Stack>
					</Stack>
				</Container>
			</Stack>
		);
	}
};

export default AboutUs;
