import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t } = useTranslation('common');
		const device = useDeviceDetect();
		const [authHeader, setAuthHeader] = useState<boolean>(false);
		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				bgImage = '';

			switch (router.pathname) {
				case '/facility':
					title = 'Sports Facilities ';
					desc = 'We’re so happy to have you back!';
					bgImage = '/img/banner/heade2image.jpg';
					break;
				case '/agent':
					title = 'Our Trusted Managers';
					desc = 'Sport Arenas, expertly managed for success.';
					bgImage = '/img/banner/9ed73c93-f122-4e05-87ac-539f413f649f.webp';
					break;
				case '/agent/detail':
					title = 'Manager Detail Page';
					desc = 'Agent/detail';
					bgImage = '/img/banner/9ed73c93-f122-4e05-87ac-539f413f649f.webp';
					break;
				case '/mypage':
					title = 'my page';
					desc = 'Home / For Facility';
					bgImage = '/img/banner/9ed73c93-f122-4e05-87ac-539f413f649f.webp';
					break;
				case '/community':
					title = 'Community';
					desc = 'Home / For Facility';
					bgImage = '/img/banner/9ed73c93-f122-4e05-87ac-539f413f649f.webp';
					break;
				case '/community/detail':
					title = 'Community Detail';
					desc = 'Home / For Facility';
					bgImage = '/img/banner/9ed73c93-f122-4e05-87ac-539f413f649f.webp';
					break;
				case '/cs':
					title = 'CS';
					desc = 'We are glad to see you again!';
					bgImage = '/img/banner/9ed73c93-f122-4e05-87ac-539f413f649f.webp';
					break;
				case '/about':
					title = 'About Page';
					desc = 'We are glad to see you again!';
					bgImage = '/img/banner/9ed73c93-f122-4e05-87ac-539f413f649f.webp';
					break;
				case '/account/join':
					title = 'Login/Signup';
					desc = 'Authentication Process';
					bgImage = '/img/banner/9ed73c93-f122-4e05-87ac-539f413f649f.webp';
					setAuthHeader(true);
					break;
				case '/member':
					title = 'Member Page';
					desc = 'Home / For Facility';
					bgImage = '/img/banner/9ed73c93-f122-4e05-87ac-539f413f649f.webp';
					break;
				default:
					break;
			}

			return { title, desc, bgImage };
		}, [router.pathname]);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>PlaySpot</title>
						<meta name={'title'} content={`PlaySpot`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>
						<Chat />
						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>PlaySpot</title>
						<meta name={'title'} content={`PlaySpot`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack
							className={`header-basic ${authHeader && 'auth'}`}
							style={{
								backgroundImage: `url(${memoizedValues.bgImage})`,
								backgroundSize: 'cover',
								boxShadow: 'inset 10px 40px 150px 40px rgb(24 22 36)',
							}}
						>
							<Stack className={'container'}>
								<strong>{t(memoizedValues.title)}</strong>
								<span>{t(memoizedValues.desc)}</span>
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Chat />

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;
