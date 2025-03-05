import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Container, Typography, Link } from '@mui/material';
import { Button } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
	const device = useDeviceDetect();
	if (device == 'mobile') {
		return (
			<div style={{ width: '100%', padding: '40px 0', backgroundColor: '#060f2b', color: '#fff' }}>
				<Container>
					<Stack
						className="main-upper-container"
						direction={{ xs: 'column', md: 'row' }}
						justifyContent="space-between"
						alignItems="center"
						spacing={4}
					>
						<Stack className="left-side-up">
							<Typography variant="h4" className="left-entitle">
								PlaySpot
							</Typography>
							<Typography variant="subtitle1" className="left-topic">
								Best Deals
							</Typography>
						</Stack>

						<Stack className="right-side-up" direction="row" justifyContent="center">
							<a href="" className="icon">
								<TwitterIcon />
							</a>

							<a href="" className="icon">
								<FacebookIcon />
							</a>

							<a href="" className="icon">
								<YouTubeIcon />
							</a>

							<a href="" className="icon">
								<LinkedInIcon />
							</a>
						</Stack>
					</Stack>

					<Stack
						className="middle-main-container"
						direction={{ xs: 'column', md: 'row' }}
						justifyContent="space-between"
						mt={4}
						spacing={4}
					>
						{/* Section 1 */}
						<Stack className="left-side1 same" sx={{ padding: '0px 30px' }}>
							<Typography variant="h1">Why People Like Us!</Typography>
							<Typography variant="h2" className="left-words">
								Facilitying sports facilities like soccer fields, basketball courts, golf courses, and more has never
								been easier. Best arenas are here.
							</Typography>
						</Stack>

						{/* Section 2 */}
						<Stack className="left-side2 same color-hover" sx={{ gap: '10px' }}>
							<Typography variant="h1">About Us</Typography>

							<Link href={'/contact'} className="ssss">
								<Typography variant="h2">Contact Us</Typography>
							</Link>
							<Link href={'/cs'} className="ssss">
								<Typography variant="h2">Privacy Policy</Typography>
							</Link>
							<Link href={'/cs'} className="ssss">
								<Typography variant="h2">Terms & Condition</Typography>
							</Link>
							<Link href={'/cs'} className="ssss">
								<Typography variant="h2">Return Policy</Typography>
							</Link>
						</Stack>

						<Stack className="right-side2 color-hover same" sx={{ gap: '10px' }}>
							<Typography variant="h1">Account</Typography>

							<Link href={'/mypage'} className="ssss">
								<Typography variant="h2">My Account</Typography>
							</Link>

							<Link href={'/facility'} className="ssss">
								<Typography variant="h2">Booking details</Typography>
							</Link>

							<Link href={'/mypage'} className="ssss">
								<Typography variant="h2">WishList</Typography>
							</Link>

							<Link href={'/mypage'} className="ssss">
								<Typography variant="h2">my profile </Typography>
							</Link>
						</Stack>

						<Stack className="right-side2 same" sx={{ gap: '10px' }}>
							<Typography variant="h1">Contact</Typography>
							<Typography
								variant="h2"
								component="a"
								href="https://maps.google.com/?q=1429 Netus Rd, NY 48247"
								sx={{
									textDecoration: 'none',
									fontWeight: '600',
									fontSize: '16px',
									color: '#ffffff80',
								}}
								target="_blank"
								rel="noopener noreferrer"
							>
								Address: 1429 Netus Rd, NY 48247
							</Typography>

							<Typography
								className="emaillll"
								component="a"
								href="mailto:abdullah.just777@gmail.com"
								sx={{ textDecoration: 'none', fontWeight: '600', fontSize: '16px', color: '#ffffff80' }}
							>
								Email: abdullah.just777@gmail.com
							</Typography>

							<Typography
								className="emaillll22"
								variant="h2"
								component="a"
								href="tel:+821028771575"
								sx={{
									textDecoration: 'none',
									fontWeight: '600',
									fontSize: '16px',
									color: '#ffffff80',
								}}
							>
								Phone: +82 10 2877 1575
							</Typography>
							<Typography variant="h2" className="emaillll22234" mt={1}>
								Payment Accepted
							</Typography>
							<Stack
								display="flex"
								gap={2}
								mt={2}
								sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
							>
								<img src="/img/footer/master-card.svg" alt="Visa" />
								<img src="/img/footer/paypal-card.svg" alt="Western Union" />
								<img src="/img/footer/visa-card.svg" alt="MasterCard" />
								<img src="/img/footer/western-card.svg" alt="PayPal" />
							</Stack>
						</Stack>
					</Stack>
				</Container>
			</div>
		);
	} else {
		return (
			<div style={{ width: '100%', padding: '60px 0', backgroundColor: '#060f2b', color: '#fff' }}>
				<Container>
					<Stack
						className="main-upper-container"
						direction={{ xs: 'column', md: 'row' }}
						justifyContent="space-between"
						alignItems="center"
						spacing={4}
					>
						<Stack className="left-side-up">
							<Typography variant="h4" className="left-entitle">
								PlaySpot
							</Typography>
							<Typography variant="subtitle1" className="left-topic">
								Best Deals
							</Typography>
						</Stack>

						<Stack className="middle-side-up" width={{ xs: '100%', md: '50%' }}>
							<Stack className="search-box-main" display="flex" alignItems="center">
								<input
									style={{ borderRadius: '50px', backgroundColor: '#fff', width: '636px', height: '59px' }}
									placeholder="Enter your email"
									type="text"
								/>
							</Stack>
						</Stack>

						<Stack className="right-side-up" direction="row" justifyContent="center">
							<a href="" className="icon">
								<TwitterIcon />
							</a>

							<a href="" className="icon">
								<FacebookIcon />
							</a>

							<a href="" className="icon">
								<YouTubeIcon />
							</a>

							<a href="" className="icon">
								<LinkedInIcon />
							</a>
						</Stack>
					</Stack>

					<Stack
						className="middle-main-container"
						direction={{ xs: 'column', md: 'row' }}
						justifyContent="space-between"
						mt={4}
						spacing={4}
					>
						<Stack className="left-side1 same">
							<Typography variant="h1">Why People Like Us!</Typography>
							<Typography variant="h2" className="left-words">
								Facilitying sports facilities like soccer fields, basketball courts, golf courses, and more has never
								been easier. Best arenas are here.
							</Typography>
							<Button className="down-button">Read More</Button>
						</Stack>

						<Stack className="left-side2 same color-hover">
							<Typography variant="h1">About Us</Typography>

							<Link href={'/contact'} className="ssss">
								<Typography variant="h2">Contact Us</Typography>
							</Link>
							<Link href={'/cs'} className="ssss">
								<Typography variant="h2">Privacy Policy</Typography>
							</Link>
							<Link href={'/cs'} className="ssss">
								<Typography variant="h2">Terms & Condition</Typography>
							</Link>
							<Link href={'/cs'} className="ssss">
								<Typography variant="h2">Return Policy</Typography>
							</Link>
						</Stack>

						<Stack className="right-side1 color-hover same">
							<Link className="ssss">
								<Typography variant="h1">Account</Typography>
							</Link>

							<Link href={'/mypage'} className="ssss">
								<Typography variant="h2">My Account</Typography>
							</Link>

							<Link href={'/facility'} className="ssss">
								<Typography variant="h2">Booking details</Typography>
							</Link>

							<Link href={'/mypage'} className="ssss">
								<Typography variant="h2">WishList</Typography>
							</Link>

							<Link href={'/mypage'} className="ssss">
								<Typography variant="h2">my profile </Typography>
							</Link>
						</Stack>

						<Stack className="right-side2 same">
							<Link className="ssss">
								<Typography variant="h1">Contact</Typography>
							</Link>
							<Typography
								variant="h2"
								component="a"
								href="https://maps.google.com/?q=1429 Netus Rd, NY 48247"
								sx={{
									textDecoration: 'none',
									fontWeight: '600',
									fontSize: '16px',
									color: '#ffffff80',
								}}
								target="_blank"
								rel="noopener noreferrer"
							>
								Address: 1429 Netus Rd, NY 48247
							</Typography>

							<Typography
								className="emaillll"
								component="a"
								href="mailto:abdullah.just777@gmail.com"
								sx={{ fontWeight: '600', fontSize: '16px' }}
							>
								Email: abdullah.just777@gmail.com
							</Typography>

							<Typography
								className="emaillll22"
								variant="h2"
								component="a"
								href="tel:+821028771575"
								sx={{
									textDecoration: 'none',
									fontWeight: '600',
									fontSize: '16px',
									color: '#ffffff80',
								}}
							>
								Phone: +82 10 2877 1575
							</Typography>
							<Typography variant="h2" className="emaillll22234" mt={2}>
								Payment Accepted
							</Typography>
							<Stack display="flex" gap={2} mt={4} flexDirection={'row'}>
								<img src="/img/footer/master-card.svg" width={'60px'} height={'60px'} alt="Visa" />
								<img src="/img/footer/paypal-card.svg" width={'60px'} height={'60px'} alt="Western Union" />
								<img src="/img/footer/visa-card.svg" width={'60px'} height={'60px'} alt="MasterCard" />
								<img src="/img/footer/western-card.svg" width={'60px'} height={'60px'} alt="PayPal" />
							</Stack>
						</Stack>
					</Stack>
				</Container>
			</div>
		);
	}
};

export default Footer;
