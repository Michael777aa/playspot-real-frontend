import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Container, Typography, Link, IconButton } from '@mui/material';
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
			<div
			style={{
				width: '100%',
				padding: '60px 0',
				backgroundColor: '#060f2b',
				color: '#fff',
			}}
		>
			<Container maxWidth="lg">
				{/* Top Area */}
				<Stack
					direction={{ xs: 'column', md: 'row' }}
					justifyContent="space-between"
					alignItems="center"
					spacing={4}
					sx={{ mb: 6 }}
				>
					{/* Branding */}
					<Stack textAlign={{ xs: 'center', md: 'left' }}>
						<Typography variant="h4" sx={{ fontWeight: 700 }}>
							PlaySpot
						</Typography>
						<Typography variant="subtitle1" sx={{ color: '#bbb' }}>
							Best Deals
						</Typography>
					</Stack>
		
					{/* Email Input */}
					<Stack width="100%" maxWidth={636}>
						<input
							type="text"
							placeholder="Enter your email"
							style={{
								width: '100%',
								height: 50,
								borderRadius: 25,
								border: 'none',
								padding: '0 20px',
								fontSize: 16,
								color: '#000',
							}}
						/>
					</Stack>
		
					{/* Social Icons */}
					<Stack direction="row" spacing={2} justifyContent="center">
						{[TwitterIcon, FacebookIcon, YouTubeIcon, LinkedInIcon].map((Icon, idx) => (
							<IconButton
								key={idx}
								sx={{
									color: '#fff',
									border: '1px solid #fff',
									borderRadius: '50%',
									width: 40,
									height: 40,
									'&:hover': { backgroundColor: '#ffffff20' },
								}}
							>
								<Icon />
							</IconButton>
						))}
					</Stack>
				</Stack>
		
				{/* Footer Columns */}
				<Stack
					direction={{ xs: 'column', md: 'row' }}
					spacing={4}
					justifyContent="space-between"
					flexWrap="wrap"
				>
					{/* Column: Why People Like Us */}
					<Stack maxWidth={{ xs: '100%', md: '25%' }}>
						<Typography variant="h6" sx={{ mb: 1.5 }}>
							Why People Like Us!
						</Typography>
						<Typography variant="body2" sx={{ color: '#aaa', mb: 2 }}>
							Facilitying sports facilities like soccer fields, basketball courts, golf courses, and more has never
							been easier. Best arenas are here.
						</Typography>
						<Button variant="outlined" sx={{ borderColor: '#fff', color: '#fff' }}>
							Read More
						</Button>
					</Stack>
		
					{/* Column: About */}
					<Stack maxWidth={{ xs: '100%', md: '20%' }}>
						<Typography variant="h6" sx={{ mb: 1.5 }}>
							About Us
						</Typography>
						{['Contact Us', 'Privacy Policy', 'Terms & Condition', 'Return Policy'].map((text, i) => (
							<Link key={i} href="#" style={{ textDecoration: 'none', color: '#aaa', marginBottom: 8 }}>
								<Typography variant="body2">{text}</Typography>
							</Link>
						))}
					</Stack>
		
					{/* Column: Account */}
					<Stack maxWidth={{ xs: '100%', md: '20%' }}>
						<Typography variant="h6" sx={{ mb: 1.5 }}>
							Account
						</Typography>
						{['My Account', 'Booking Details', 'WishList', 'My Profile'].map((text, i) => (
							<Link key={i} href="#" style={{ textDecoration: 'none', color: '#aaa', marginBottom: 8 }}>
								<Typography variant="body2">{text}</Typography>
							</Link>
						))}
					</Stack>
		
					{/* Column: Contact */}
					<Stack maxWidth={{ xs: '100%', md: '25%' }}>
						<Typography variant="h6" sx={{ mb: 1.5 }}>
							Contact
						</Typography>
						<Typography
							variant="body2"
							component="a"
							href="https://maps.google.com/?q=1429 Netus Rd, NY 48247"
							target="_blank"
							rel="noopener noreferrer"
							sx={{ color: '#aaa', display: 'block', mb: 1 }}
						>
							1429 Netus Rd, NY 48247
						</Typography>
						<Typography
							variant="body2"
							component="a"
							href="mailto:abdullah.just777@gmail.com"
							sx={{ color: '#aaa', display: 'block', mb: 1 }}
						>
							abdullah.just777@gmail.com
						</Typography>
						<Typography
							variant="body2"
							component="a"
							href="tel:+821028771575"
							sx={{ color: '#aaa', display: 'block' }}
						>
							+82 10 2877 1575
						</Typography>
		
						<Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
							Payment Accepted
						</Typography>
		
						<Stack direction="row" spacing={2}>
							{['master-card', 'paypal-card', 'visa-card', 'western-card'].map((img, i) => (
								<img
									key={i}
									src={`/img/footer/${img}.svg`}
									alt={img}
									style={{ width: 50, height: 50, objectFit: 'contain' }}
								/>
							))}
						</Stack>
					</Stack>
				</Stack>
			</Container>
		</div>
		);
	}
};

export default Footer;
