import React from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Container } from '@mui/material';

const About: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>ABOUT PAGE MOBILE</div>;
	} else {
		return (
			<div>
				<Container>
					<Stack className={'about-page'}>
						<Stack className={'intro'}>
							<Stack className={'container'}>
								<Stack className={'left'}>
									<strong>Our Goal is to Revolutionize the Experience of Facilitying Sports Facilities.</strong>
								</Stack>
								<Stack className={'right'}>
									<p>
										No matter how well-planned your setup, a surplus of equipment will always put your sports facility
										on the brink of disorder. Fortunately, encouraging users to maintain a cleaner space is far easier
										than expected.
										<br />
										<br />A well-designed sports facility combines practical systems with user-friendly spaces, ensuring
										every visitor enjoys their time. From clean locker rooms to well-maintained courts, every detail
										contributes to an optimal experience.
									</p>
									<Stack className={'boxes'}>
										<div className={'box'}>
											<div>
												<img src="/img/icons/garden.svg" alt="" />
											</div>
											<span>Premium Sports Facility</span>

											<p>Experience seamless functionality and modern design for all your sporting needs.</p>
										</div>
										<div className={'box'}>
											<div>
												<img src="/img/icons/securePayment.svg" alt="" />
											</div>
											<span>Secure Transactions</span>
											<p>Enjoy quick, secure, and transparent payment options for your bookings.</p>
										</div>
									</Stack>
								</Stack>
							</Stack>
						</Stack>
						<Stack className={'statistics'}>
							<Stack className={'container'}>
								<Stack className={'banner'}>
									<img src="/img/banner/9ed73c93-f122-4e05-87ac-539f413f649f.webp" alt="" />
								</Stack>
								<Stack className={'info'}>
									<Stack component={'div'}>
										<strong>10M</strong>
										<p>Award Winning</p>
									</Stack>
									<Stack component={'div'}>
										<strong>45K</strong>
										<p>Arena Ready</p>
									</Stack>
									<Stack component={'div'}>
										<strong>20M</strong>
										<p>Happy Customer</p>
									</Stack>
								</Stack>
							</Stack>
						</Stack>

						<Stack className={'options'}>
							<img src="/img/banner/pexels-photo-18769460.webp" alt="" className={'about-banner'} />
							<Stack className={'container'}>
								<strong>Let’s find the right selling option for you</strong>
								<Stack>
									<div className={'icon-box'}>
										<img src="/img/icons/security.svg" alt="" />
									</div>
									<div className={'text-box'}>
										<span>Facility Management</span>
										<p>We handle the details so you can focus on enjoying the game.</p>
									</div>
								</Stack>
								<Stack>
									<div className={'icon-box'}>
										<img src="/img/icons/keywording.svg" alt="" />
									</div>
									<span>Reliable Facility Services</span>

									<p>Dedicated to maintaining top-tier standards for your sports facility rentals.</p>
								</Stack>
								<Stack>
									<div className={'icon-box'}>
										<img src="/img/icons/investment.svg" alt="" />
									</div>
									<span>Comprehensive Facility Management</span>

									<p>Ensuring your sports venue remains organized, clean, and ready for action.</p>
								</Stack>
								<Stack className={'btn'}>
									Learn More
									<img src="/img/icons/rightup.svg" alt="" />
								</Stack>
							</Stack>
						</Stack>
						<Stack className={'partners'}>
							<Stack className={'container'}>
								<span>Trusted bu the world's best</span>
								<Stack className={'wrap'}>
									<img src="/img/icons/brands/amazon.svg" alt="" />
									<img src="/img/icons/brands/amd.svg" alt="" />
									<img src="/img/icons/brands/cisco.svg" alt="" />
									<img src="/img/icons/brands/dropcam.svg" alt="" />
									<img src="/img/icons/brands/spotify.svg" alt="" />
								</Stack>
							</Stack>
						</Stack>
						<Stack className={'help'}>
							<Stack className={'container'}>
								<Stack component={'div'} className={'left'}>
									<strong>Need help? Talk to our expert.</strong>
									<p>Speak to our specialists or discover the perfect sports facility for your needs.</p>
								</Stack>
								<Stack component={'div'} className={'right'}>
									<div className={'white'}>
										Contact Us
										<img src="/img/icons/rightup.svg" alt="" />
									</div>
									<div className={'black'}>
										<img src="/img/icons/call.svg" alt="" />
										82 10 2877 1575
									</div>
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</Container>
			</div>
		);
	}
};

export default withLayoutBasic(About);
