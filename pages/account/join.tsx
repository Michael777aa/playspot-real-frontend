import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Button, Checkbox, FormControlLabel, FormGroup, Stack, TextField, Typography, Container } from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Join: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const [input, setInput] = useState({
		firstName: '',
		lastName: '',
		nick: '',
		password: '',
		memberEmail: '',
		phone: '',
		type: 'USER',
	});
	const [loginView, setLoginView] = useState<boolean>(true);

	/** HANDLERS **/
	const viewChangeHandler = (state: boolean) => {
		setLoginView(state);
	};

	const handleInputChange = (name: string, value: any) => {
		setInput((prev) => ({ ...prev, [name]: value }));
	};

	const handleUserTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target;
		handleInputChange('type', checked ? name : 'USER');
	};

	const doLogin = useCallback(async () => {
		try {
			await logIn(input.nick, input.password);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input, router]);

	const doSignUp = useCallback(async () => {
		try {
			await signUp(
				input.firstName,
				input.lastName,
				input.nick,
				input.password,
				input.memberEmail,
				input.phone,
				input.type,
			);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input, router]);

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (e.key === 'Enter') {
				if (loginView) {
					doLogin();
				} else {
					doSignUp();
				}
			}
		},
		[doLogin, doSignUp, loginView],
	);
	if (device === 'mobile') {
		return (
			<Container
				maxWidth="xs"
				className="join-page"
				sx={{
					marginTop: '55px',
					padding: 2,
					backgroundColor: '#fff',
					borderRadius: '12px',
					boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
				}}
			>
				<Stack textAlign="center" mb={3}>
					<Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#333' }}>
						{loginView ? 'Welcome Back!' : 'Create Your Account'}
					</Typography>
					<Typography variant="body2" sx={{ color: '#666' }}>
						{loginView ? 'Please log in to continue.' : 'Sign up to get started.'}
					</Typography>
				</Stack>

				<Stack
					component="form"
					onKeyDown={(e: any) => {
						if (e.key === 'Enter') {
							loginView ? doLogin() : doSignUp();
						}
					}}
					sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
				>
					<TextField
						label="Nickname"
						variant="outlined"
						fullWidth
						size="small"
						onChange={(e: any) => handleInputChange('nick', e.target.value)}
						required
						sx={{ borderRadius: '8px' }}
					/>
					<TextField
						label="Password"
						variant="outlined"
						type="password"
						fullWidth
						size="small"
						onChange={(e: any) => handleInputChange('password', e.target.value)}
						required
						sx={{ borderRadius: '8px' }}
					/>
					{!loginView && (
						<>
							<TextField
								label="First Name"
								variant="outlined"
								fullWidth
								size="small"
								onChange={(e: any) => handleInputChange('firstName', e.target.value)}
								required
								sx={{ borderRadius: '8px' }}
							/>
							<TextField
								label="Last Name"
								variant="outlined"
								fullWidth
								size="small"
								onChange={(e: any) => handleInputChange('lastName', e.target.value)}
								required
								sx={{ borderRadius: '8px' }}
							/>
							<TextField
								label="Email"
								variant="outlined"
								type="email"
								fullWidth
								size="small"
								onChange={(e: any) => handleInputChange('memberEmail', e.target.value)}
								required
								sx={{ borderRadius: '8px' }}
							/>
							<TextField
								label="Phone"
								variant="outlined"
								fullWidth
								size="small"
								onChange={(e: any) => handleInputChange('phone', e.target.value)}
								required
								sx={{ borderRadius: '8px' }}
							/>
						</>
					)}
					{!loginView && (
						<FormGroup>
							<FormControlLabel
								control={
									<Checkbox
										size="small"
										name="USER"
										checked={input.type === 'USER'}
										onChange={handleUserTypeChange}
										sx={{
											'&.Mui-checked': {
												color: '#007bff',
											},
										}}
									/>
								}
								label="User"
							/>
							<FormControlLabel
								control={
									<Checkbox
										size="small"
										name="AGENT"
										checked={input.type === 'AGENT'}
										onChange={handleUserTypeChange}
										sx={{
											'&.Mui-checked': {
												color: '#007bff',
											},
										}}
									/>
								}
								label="Agent"
							/>
						</FormGroup>
					)}
					<Button
						variant="contained"
						fullWidth
						color="primary"
						disabled={
							loginView ? input.nick === '' || input.password === '' : Object.values(input).some((val) => val === '')
						}
						onClick={loginView ? doLogin : doSignUp}
						sx={{
							padding: '10px',
							fontWeight: 'bold',
							textTransform: 'none',
							borderRadius: '8px',
							backgroundColor: '#007bff',
							'&:hover': {
								backgroundColor: '#0056b3',
							},
						}}
					>
						{loginView ? 'Login' : 'Sign Up'}
					</Button>
				</Stack>

				<Stack textAlign="center" mt={2}>
					{loginView ? (
						<Typography
							onClick={() => viewChangeHandler(false)}
							sx={{
								fontSize: '0.85rem',
								color: '#007bff',
								cursor: 'pointer',
								'& span': {
									fontWeight: 'bold',
									textDecoration: 'underline',
								},
							}}
						>
							Not registered yet? <span>Sign Up</span>
						</Typography>
					) : (
						<Typography
							onClick={() => viewChangeHandler(true)}
							sx={{
								fontSize: '0.85rem',
								color: '#007bff',
								cursor: 'pointer',
								'& span': {
									fontWeight: 'bold',
									textDecoration: 'underline',
								},
							}}
						>
							Have an account? <span>Login</span>
						</Typography>
					)}
				</Stack>
			</Container>
		);
	} else {
		return (
			<Container maxWidth="sm" className="join-page" sx={{ marginTop: 5 }}>
				<Stack textAlign="center" mb={3}>
					<Typography variant="h4" gutterBottom>
						{loginView ? 'Welcome Back!' : 'Create Your Account'}
					</Typography>
					<Typography variant="body1">
						{loginView ? 'Please log in to continue.' : 'Sign up to get started.'}
					</Typography>
				</Stack>
				<Stack onKeyPress={handleKeyPress} spacing={2} mt={2}>
					<TextField
						label="Nickname"
						variant="outlined"
						fullWidth
						onChange={(e) => handleInputChange('nick', e.target.value)}
						required
					/>
					<TextField
						label="Password"
						variant="outlined"
						type="password"
						fullWidth
						onChange={(e) => handleInputChange('password', e.target.value)}
						required
					/>
					{!loginView && (
						<>
							<TextField
								label="First Name"
								variant="outlined"
								fullWidth
								onChange={(e) => handleInputChange('firstName', e.target.value)}
								required
							/>
							<TextField
								label="Last Name"
								variant="outlined"
								fullWidth
								onChange={(e) => handleInputChange('lastName', e.target.value)}
								required
							/>
							<TextField
								label="Email"
								variant="outlined"
								type="email"
								fullWidth
								onChange={(e) => handleInputChange('memberEmail', e.target.value)}
								required
							/>
							<TextField
								label="Phone"
								variant="outlined"
								fullWidth
								onChange={(e) => handleInputChange('phone', e.target.value)}
								required
							/>
						</>
					)}
					{!loginView && (
						<FormGroup>
							<FormControlLabel
								control={
									<Checkbox size="small" name="USER" checked={input.type === 'USER'} onChange={handleUserTypeChange} />
								}
								label="User"
							/>
							<FormControlLabel
								control={
									<Checkbox
										size="small"
										name="AGENT"
										checked={input.type === 'AGENT'}
										onChange={handleUserTypeChange}
									/>
								}
								label="Agent"
							/>
						</FormGroup>
					)}
					<Button
						variant="contained"
						color="primary"
						disabled={
							loginView ? input.nick === '' || input.password === '' : Object.values(input).some((val) => val === '')
						}
						onClick={loginView ? doLogin : doSignUp}
					>
						{loginView ? 'Login' : 'Sign Up'}
					</Button>
				</Stack>
				<Stack textAlign="center" mt={2}>
					{loginView ? (
						<p onClick={() => viewChangeHandler(false)}>
							Not registered yet? <span>Sign Up</span>
						</p>
					) : (
						<p onClick={() => viewChangeHandler(true)}>
							Have an account? <span>Login</span>
						</p>
					)}
				</Stack>
			</Container>
		);
	}
};

export default withLayoutBasic(Join);
