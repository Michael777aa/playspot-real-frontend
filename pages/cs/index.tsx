import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Notice from '../../libs/components/cs/Notice';
import Faq from '../../libs/components/cs/Faq';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CS: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();

	/** HANDLERS **/
	const changeTabHandler = (tab: string) => {
		router.push(
			{
				pathname: '/cs',
				query: { tab: tab },
			},
			undefined,
			{ scroll: false },
		);
	};
	const tab = router.query.tab ?? 'notice';

	if (device === 'mobile') {
		return (
			<Stack
				className="cs-page"
				sx={{
					width: '100%',
					padding: '10px',
					backgroundColor: '#f9f9f9',
					gap: '20px',
					marginTop: '50px',
				}}
			>
				<Stack
					className="container"
					sx={{
						maxWidth: '100%',
						margin: '0 auto',
						display: 'flex',
						flexDirection: 'column',
						gap: '20px',
					}}
				>
					{/* Main Info Section */}
					<Stack
						component="div"
						className="cs-main-info"
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: '15px',
							padding: '10px',
							backgroundColor: '#ffffff',
							borderRadius: '12px',
							boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
						}}
					>
						<Stack
							component="div"
							className="info"
							sx={{
								textAlign: 'center',
							}}
						>
							<Typography
								sx={{
									fontSize: '1.5rem',
									fontWeight: '600',
									color: '#333',
								}}
							>
								Cs Center
							</Typography>
							<Typography
								sx={{
									fontSize: '1rem',
									color: '#666',
								}}
							>
								I will answer your questions
							</Typography>
						</Stack>

						{/* Tabs */}
						<Stack
							component="div"
							className="btns"
							sx={{
								display: 'flex',
								gap: '10px',
							}}
						>
							<Stack
								component="div"
								sx={{
									padding: '8px 16px',
									borderRadius: '8px',
									backgroundColor: tab === 'notice' ? '#007bff' : '#f4f4f4',
									color: tab === 'notice' ? '#fff' : '#333',
									fontWeight: '600',
									fontSize: '0.9rem',
									cursor: 'pointer',
									transition: 'background-color 0.3s ease, color 0.3s ease',
									textAlign: 'center',
								}}
								onClick={() => {
									changeTabHandler('notice');
								}}
							>
								Notice
							</Stack>
							<Stack
								component="div"
								sx={{
									padding: '8px 16px',
									borderRadius: '8px',
									backgroundColor: tab === 'faq' ? '#007bff' : '#f4f4f4',
									color: tab === 'faq' ? '#fff' : '#333',
									fontWeight: '600',
									fontSize: '0.9rem',
									cursor: 'pointer',
									transition: 'background-color 0.3s ease, color 0.3s ease',
									textAlign: 'center',
								}}
								onClick={() => {
									changeTabHandler('faq');
								}}
							>
								FAQ
							</Stack>
						</Stack>
					</Stack>

					{/* Content Section */}
					<Stack
						component="div"
						className="cs-content"
						sx={{
							padding: '10px',
							backgroundColor: '#ffffff',
							borderRadius: '12px',
							boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
						}}
					>
						{tab === 'notice' && <Notice />}
						{tab === 'faq' && <Faq />}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'cs-page'}>
				<Stack className={'container'}>
					<Stack component={'div'} className={'cs-main-info'}>
						<Stack component={'div'} className={'info'}>
							<span>Cs center</span>
							<p>I will answer your questions</p>
						</Stack>
						<Stack component={'div'} className={'btns'}>
							<div
								className={tab == 'notice' ? 'active' : ''}
								onClick={() => {
									changeTabHandler('notice');
								}}
							>
								Notice
							</div>
							<div
								className={tab == 'faq' ? 'active' : ''}
								onClick={() => {
									changeTabHandler('faq');
								}}
							>
								FAQ
							</div>
						</Stack>
					</Stack>

					<Stack component={'div'} className={'cs-content'}>
						{tab === 'notice' && <Notice />}

						{tab === 'faq' && <Faq />}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(CS);
