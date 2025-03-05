import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Typography, Badge, Drawer, TableRow, TableCell, InputBase, IconButton } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import SearchIcon from '@mui/icons-material/Search';
import { GET_NOTIFICATIONS } from '../../apollo/user/query';
import { NotificationInquiry } from '../types/notifications/notifications';
import { Notification } from '../types/notifications/notifications';
import { NotificationStatus } from '../enums/notification.enum';
import { UPDATE_NOTIFICATION } from '../../apollo/user/mutation';
import { List, ListItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FacilitiesInquiry } from '../types/facility/facility.input';
import MenuIcon from '@mui/icons-material/Menu';
interface topFilter {
	initialInput: FacilitiesInquiry;
}
const Top = (props: topFilter) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const [colorChange, setColorChange] = useState(false);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);
	const [searchFiltere, setSearchFiltere] = useState<FacilitiesInquiry>(initialInput);
	const [isNotificationOpen, setIsNotificationOpen] = useState(false);
	const [unreadCount, setUnreadCount] = useState<number>(0);
	const [selectedLang, setSelectedLang] = useState('en');
	const [isMenuDrawerOpen, setMenuDrawerOpen] = useState(false);
	const [isSearchDrawerOpen, setSearchDrawerOpen] = useState(false);
	const [isDrawerOpen, setDrawerOpen] = useState(false);

	const searchFilter: NotificationInquiry = {
		page: 1,
		limit: 500,
		search: {
			receiverId: user?._id || '',
		},
	};
	const [updateNotification] = useMutation(UPDATE_NOTIFICATION);
	const {
		loading: getNotificationsLoading,
		data: getNotificationsData,
		error: getNotificationsError,
		refetch: getNotificationsRefetch,
	} = useQuery(GET_NOTIFICATIONS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			const newNotifications = data?.getNotifications?.list || [];
			setNotifications(newNotifications);
			setUnreadCount(newNotifications.filter((n: any) => n.notificationStatus === NotificationStatus.WAIT).length);
		},
	});

	useEffect(() => {
		if (user?._id) {
			getNotificationsRefetch();
		} else {
			setNotifications([]);
		}
	}, [user]);
	const toggleDrawer = () => {
		setDrawerOpen(!isDrawerOpen);
	};

	useEffect(() => {
		if (user?._id) {
			getNotificationsRefetch();
		} else {
			setNotifications([]);
		}
	}, [user]);

	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
		}
	}, [router]);
	useEffect(() => {
		switch (router.pathname) {
			case '/facility/detail':
				setBgColor(true);
				break;
			default:
				break;
		}
	}, [router]);
	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);
	useEffect(() => {
		if (user?._id) {
			getNotificationsRefetch();
		}
	}, [user]);

	useEffect(() => {
		const savedLang = localStorage.getItem('locale') || 'en';
		setSelectedLang(savedLang);
	}, []);

	useEffect(() => {
		if (user?._id) {
			getNotificationsRefetch();
		} else {
			setNotifications([]);
		}
	}, [user, isNotificationOpen]);

	const pushSearchHandler = async () => {
		try {
			if (searchFiltere?.search?.locationList?.length == 0) {
				delete searchFiltere.search.locationList;
			}

			if (searchFiltere?.search?.typeList?.length == 0) {
				delete searchFiltere.search.typeList;
			}

			await router.push(
				`/facility?input=${JSON.stringify(searchFiltere)}`,
				`/facility?input=${JSON.stringify(searchFiltere)}`,
			);
		} catch (err: any) {
			console.log('ERROR, pushSearchHandler:', err);
		}
	};

	const toggleNotificationDrawer = (open: boolean) => {
		if (open && user?._id) {
			getNotificationsRefetch();
		}
		setIsNotificationOpen(open);
	};
	const handlePasswordKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			pushSearchHandler();
		}
	};

	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
	};

	const langChoice = useCallback(
		async (e: any) => {
			const langId = e.currentTarget.id;
			setSelectedLang(langId);
			localStorage.setItem('locale', langId);

			setDrawerOpen(false);

			await router.push(router.asPath, router.asPath, { locale: langId });
		},
		[router],
	);

	const changeNavbarColor = () => {
		if (window.scrollY >= 50) {
			setColorChange(true);
		} else {
			setColorChange(false);
		}
	};

	const updateNotifsHandler = async (notificationId: string) => {
		try {
			const notification = notifications.find((n) => n._id === notificationId);

			if (notification && notification.notificationStatus === NotificationStatus.WAIT) {
				const updateData = { _id: notificationId, notificationStatus: NotificationStatus.READ };

				const response = await updateNotification({
					variables: {
						input: updateData,
					},
				});

				if (response.data) {
					setNotifications((prevNotifications) =>
						prevNotifications.map((n) =>
							n._id === notificationId ? { ...n, notificationStatus: NotificationStatus.READ } : n,
						),
					);

					setUnreadCount((prev) => Math.max(prev - 1, 0));
				}
			}
		} catch (error) {
			console.error('Error updating notification:', error);
		}
	};
	const toggleSearchDrawer = () => {
		setSearchDrawerOpen((prevState) => !prevState);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const getLanguageLabel = (langCode: string | null) => {
		switch (langCode) {
			case 'en':
				return 'English';
			case 'kr':
				return 'Korean';
			case 'ru':
				return 'Russian';
			default:
				return 'English';
		}
	};

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', changeNavbarColor);
	}

	if (device == 'mobile') {
		return (
			<div className="top">
				<Stack className="left">
					<Stack className="left-main">
						<button className="left-icon" onClick={toggleDrawer}>
							{isDrawerOpen ? <CloseIcon /> : <MenuIcon />}
						</button>

						<Drawer
							anchor="left"
							open={isDrawerOpen}
							onClose={toggleDrawer}
							sx={{
								'& .MuiDrawer-paper': {
									width: '100%',
									padding: '20px',
									backgroundColor: '#ffffff',
								},
							}}
						>
							<Stack>
								<Stack
									className="drawer-menu"
									sx={{
										display: 'flex',
										flexDirection: 'column',
										marginTop: '60px',
										gap: '15px',
									}}
								>
									<Link
										href="/"
										onClick={toggleDrawer}
										style={{ fontSize: '1.2rem', color: '#333', cursor: 'pointer' }}
									>
										<div>{t('Home')}</div>
									</Link>
									<span style={{ width: '100%', height: '1px', backgroundColor: '#000000' }}></span>
									<Link
										href="/facility"
										onClick={toggleDrawer}
										style={{ fontSize: '1.2rem', color: '#333', cursor: 'pointer' }}
									>
										<div>{t('Book')}</div>
									</Link>
									<span style={{ width: '100%', height: '1px', backgroundColor: '#000000' }}></span>

									<Link
										href="/agent"
										onClick={toggleDrawer}
										style={{ fontSize: '1.2rem', color: '#333', cursor: 'pointer' }}
									>
										<div> {t('Managers')} </div>
									</Link>
									<span style={{ width: '100%', height: '1px', backgroundColor: '#000000' }}></span>

									<Link
										href="/community?articleCategory=FREE"
										onClick={toggleDrawer}
										style={{ fontSize: '1.2rem', color: '#333', cursor: 'pointer' }}
									>
										<div> {t('Community')} </div>
									</Link>
									<span style={{ width: '100%', height: '1px', backgroundColor: '#000000' }}></span>

									<Link
										href="/cs"
										onClick={toggleDrawer}
										style={{ fontSize: '1.2rem', color: '#333', cursor: 'pointer' }}
									>
										<div> {t('Cs')} </div>
									</Link>
									<span style={{ width: '100%', height: '1px', backgroundColor: '#000000' }}></span>
									{user?._id && (
										<Link href={'/mypage'}>
											<div onClick={toggleDrawer} style={{ fontSize: '1.2rem', color: '#333', cursor: 'pointer' }}>
												<div> {t('My Page')} </div>
											</div>
											<span style={{ width: '100%', height: '1px', backgroundColor: '#000000' }}></span>
										</Link>
									)}
								</Stack>
								<Stack className="lan-box">
									<List className="language-list" sx={{ display: 'flex', marginTop: '50px' }}>
										{/* English Option */}
										<ListItem
											id="en"
											className={`dropdown-item ${selectedLang === 'en' ? 'selected' : ''}`}
											onClick={langChoice}
											sx={{
												cursor: 'pointer',
												display: 'flex',

												alignItems: 'center',
												justifyContent: 'center',
												borderBottom: selectedLang === 'en' ? '2px solid red' : '2px solid transparent',
												padding: '10px 15px',
												transition: 'border-color 0.3s',
											}}
										>
											<img
												className="img-flag"
												src="/img/flag/langen.png"
												alt="usaFlag"
												style={{ width: '20px', marginRight: '8px' }}
											/>
											{t('English')}
										</ListItem>

										<ListItem
											id="kr"
											className={`dropdown-item ${selectedLang === 'kr' ? 'selected' : ''}`}
											onClick={langChoice}
											sx={{
												cursor: 'pointer',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												borderBottom: selectedLang === 'kr' ? '2px solid red' : '2px solid transparent',
												padding: '10px 15px',
												transition: 'border-color 0.3s',
											}}
										>
											<img
												className="img-flag"
												src="/img/flag/langkr.png"
												alt="koreanFlag"
												style={{ width: '20px', marginRight: '8px' }}
											/>
											{t('Korean')}
										</ListItem>

										<ListItem
											id="ru"
											className={`dropdown-item ${selectedLang === 'ru' ? 'selected' : ''}`}
											onClick={langChoice}
											sx={{
												cursor: 'pointer',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												borderBottom: selectedLang === 'ru' ? '2px solid red' : '2px solid transparent',
												padding: '10px 15px',
												transition: 'border-color 0.3s',
											}}
										>
											<img
												className="img-flag"
												src="/img/flag/langru.png"
												alt="russiaFlag"
												style={{ width: '20px', marginRight: '8px' }}
											/>
											{t('Russian')}
										</ListItem>
									</List>
								</Stack>
							</Stack>
						</Drawer>
						<Drawer
							anchor="top"
							open={isSearchDrawerOpen}
							onClose={toggleSearchDrawer}
							sx={{
								'& .MuiDrawer-paper': {
									width: '100%',
									padding: '20px',
									backgroundColor: '#ffffff',
									position: 'relative',
									height: '100vh',
									top: '50px',
								},
							}}
						>
							<Stack>
								<Stack direction="row" spacing={2} alignItems="center">
									<InputBase
										style={{
											border: '1px solid #ccc',
											borderRadius: '5px',
											padding: '5px 10px',
											flexGrow: 1,
										}}
										value={searchFiltere?.search?.text ?? ''}
										type="text"
										onChange={(e: any) => {
											setSearchFiltere({
												...searchFiltere,
												search: { ...searchFiltere.search, text: e.target.value },
											});
										}}
										placeholder="Search facilities..."
										onKeyDown={handlePasswordKeyDown}
									/>
									<IconButton onClick={pushSearchHandler} style={{ padding: '10px' }}>
										<SearchIcon />
									</IconButton>
								</Stack>
							</Stack>
						</Drawer>

						<IconButton className="search-buttton-inside" onClick={toggleSearchDrawer} style={{ padding: '10px' }}>
							{isSearchDrawerOpen ? <CloseIcon /> : <SearchIcon />}
						</IconButton>
						<Drawer
							anchor="top"
							open={isSearchDrawerOpen}
							onClose={toggleSearchDrawer}
							sx={{
								'& .MuiDrawer-paper': {
									width: '100%',
									padding: '20px',
									backgroundColor: '#ffffff',
									position: 'relative',
									height: '100vh',
									top: '50px',
								},
							}}
						>
							<Stack>
								<Stack direction="row" spacing={2} alignItems="center">
									<InputBase
										style={{
											border: '1px solid #ccc',
											borderRadius: '5px',
											padding: '5px 10px',
											flexGrow: 1,
										}}
										value={searchFiltere?.search?.text ?? ''}
										type="text"
										onChange={(e: any) => {
											setSearchFiltere({
												...searchFiltere,
												search: { ...searchFiltere.search, text: e.target.value },
											});
										}}
										placeholder="Search facilities..."
										onKeyDown={handlePasswordKeyDown}
									/>
									<IconButton onClick={pushSearchHandler} style={{ padding: '10px' }}>
										<SearchIcon />
									</IconButton>
								</Stack>
							</Stack>
						</Drawer>
					</Stack>
				</Stack>
				<Stack className="middle">PlaySpot 🏟️</Stack>
				<Stack className="right">
					<Stack
						component="div"
						className="user-box"
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							position: 'relative',
						}}
					>
						{user?._id ? (
							<>
								<div
									className="login-user"
									onClick={(event) => setLogoutAnchor(event.currentTarget)}
									style={{
										width: '40px',
										height: '40px',
										borderRadius: '50%',
										overflow: 'hidden',
										cursor: 'pointer',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
									}}
								>
									<img
										src={
											user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : `/img/profile/default-user.png`
										}
										alt="User Profile"
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover',
										}}
									/>
								</div>
								<Menu
									id="basic-menu"
									anchorEl={logoutAnchor}
									open={logoutOpen}
									onClose={() => setLogoutAnchor(null)}
									sx={{
										mt: '5px',
										'& .MuiMenu-paper': {
											minWidth: '150px',
											borderRadius: '8px',
											boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
										},
									}}
								>
									<MenuItem
										onClick={() => logOut()}
										sx={{
											display: 'flex',
											alignItems: 'center',
											gap: '10px',
											padding: '10px 16px',
											fontSize: '14px',
											fontWeight: '500',
											color: 'blue',
											'&:hover': {
												backgroundColor: '#f5f5f5',
											},
										}}
									>
										<Logout fontSize="small" />

										<div> {t('Logout')} </div>
									</MenuItem>
								</Menu>
							</>
						) : (
							<Link href="/account/join" passHref>
								<Stack
									className="user-box"
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										position: 'relative',
									}}
								>
									<div
										className="join-box"
										style={{
											width: '40px',
											height: '40px',
											borderRadius: '50%',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											cursor: 'pointer',
										}}
									>
										<AccountCircleIcon fontSize="medium" />
									</div>
								</Stack>
							</Link>
						)}
					</Stack>

					<Stack>
						<Badge badgeContent={unreadCount} color="secondary">
							<NotificationsOutlinedIcon
								onClick={() => toggleNotificationDrawer(!isNotificationOpen)}
								style={{ cursor: 'pointer', fontSize: '28px', position: 'relative', top: '6px' }}
							/>
						</Badge>

						<Drawer
							anchor="right"
							open={isNotificationOpen}
							onClose={() => toggleNotificationDrawer(false)}
							sx={{
								'& .MuiDrawer-paper': {
									width: device === 'mobile' ? '100%' : '450px',
									padding: '20px',
									backgroundColor: '#ffffff',
									boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
									borderRadius: device === 'mobile' ? '0px' : '8px',
								},
							}}
						>
							<Stack spacing={2}>
								<Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
									{t('Notifications')}
								</Typography>
								{notifications.length === 0 ? (
									<Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', marginTop: '20px' }}>
										{t('No new notifications')}
									</Typography>
								) : (
									notifications.map((notification) => (
										<Stack
											key={notification._id}
											sx={{
												position: 'relative',
												padding: '16px',
												border: '1px solid #ddd',
												borderRadius: '8px',
												marginBottom: '12px',
												boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
												transition: 'background-color 0.3s',
												'&:hover': {
													backgroundColor: '#f4f4f4',
												},
											}}
										>
											<MenuItem
												onClick={() => updateNotifsHandler(notification._id)}
												sx={{
													padding: '0',
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'flex-start',
												}}
											>
												{notification.notificationStatus === 'WAIT' && (
													<Stack
														sx={{
															width: '10px',
															height: '10px',
															backgroundColor: 'green',
															borderRadius: '50%',
															position: 'absolute',
															top: '-8px',
															left: '-8px',
														}}
													/>
												)}
												<Stack sx={{ width: '100%' }}>
													{notification.notificationName && (
														<Typography
															variant="body1"
															sx={{
																fontSize: '15px',
																fontWeight: '900',
																color: '#00000',
																marginBottom: '8px',
																wordBreak: 'break-word',
																whiteSpace: 'normal',
															}}
														>
															Name: {notification.notificationName}
														</Typography>
													)}
													<Typography
														variant="body1"
														sx={{
															fontSize: '17px',
															fontWeight: '700',
															color: '#00000',
															marginBottom: '8px',
															wordBreak: 'break-word',
															whiteSpace: 'normal',
														}}
													>
														{notification.notificationTitle}
													</Typography>
													<Typography
														sx={{
															fontSize: '14px',
															color: 'textSecondary',
															marginBottom: '8px',
															wordBreak: 'break-word',
															whiteSpace: 'normal',
														}}
														variant="body2"
													>
														{notification.notificationDesc}
													</Typography>
												</Stack>
											</MenuItem>
										</Stack>
									))
								)}
							</Stack>
						</Drawer>
					</Stack>
				</Stack>
			</div>
		);
	} else {
		return (
			<Stack className={'navbar'}>
				<Stack className={`navbar-main ${colorChange ? 'transparent' : ''} ${bgColor ? 'transparent' : ''}`}>
					<Stack className={'container'}>
						<Stack className={'navbar-top-menu'}>
							<Stack className={'left-top-menu'}>
								<a href="" className="icon">
									<InstagramIcon />
								</a>
								<a href="" className="icon">
									<YouTubeIcon />
								</a>
								<a href="" className="icon">
									<TelegramIcon />
								</a>
								<a href="" className="icon">
									<TwitterIcon />
								</a>
								<a href="" className="icon">
									<FacebookIcon />
								</a>
							</Stack>
							<Stack className={'right-top-menu'}>
								<Stack component={'div'} className={'right-top-box'}>
									<Link href={'/about'} className={'link'}>
										<div>{t('About')} </div>
									</Link>

									<Link href={'/cs'} className={'link'}>
										<div> {t('Cs')} </div>
									</Link>
									<Stack className={'lan-box'}>
										<Button
											disableRipple
											className="btn-lang"
											onClick={langClick}
											endIcon={<CaretDown size={10} color="#000000" weight="fill" />}
										>
											<Stack
												component={'div'}
												className={'flag'}
												style={{
													display: 'flex',
													flexDirection: 'row',
													alignItems: 'center',
												}}
											>
												{lang !== null ? (
													<>
														<img src={`/img/flag/lang${lang}.png`} alt={'Flag'} />
														<span className={'language-label'} style={{ marginLeft: '8px' }}>
															{getLanguageLabel(lang)}
														</span>
													</>
												) : (
													<img src={`/img/flag/langen.png`} alt={'Flag'} />
												)}
											</Stack>
										</Button>

										<Menu
											anchorEl={anchorEl2}
											open={drop}
											onClose={langClose}
											sx={{
												position: 'absolute',
												display: 'flex',
												flexDirection: 'row',
												justifyContent: 'center',
												alignItems: 'center',
											}}
										>
											<MenuItem disableRipple onClick={langChoice} id="en">
												<img
													className="img-flag"
													src={'/img/flag/langen.png'}
													onClick={langChoice}
													id="en"
													alt={'usaFlag'}
												/>
												{t('English')}
											</MenuItem>
											<MenuItem disableRipple onClick={langChoice} id="kr">
												<img
													className="img-flag"
													src={'/img/flag/langkr.png'}
													onClick={langChoice}
													id="uz"
													alt={'koreanFlag'}
												/>
												{t('Korean')}
											</MenuItem>
											<MenuItem disableRipple onClick={langChoice} id="ru">
												<img
													className="img-flag"
													src={'/img/flag/langru.png'}
													onClick={langChoice}
													id="ru"
													alt={'russiaFlag'}
												/>
												{t('Russian')}
											</MenuItem>
										</Menu>
									</Stack>
								</Stack>
							</Stack>
						</Stack>
						<Stack className={'navbar-middle-menu'}>
							<Stack className={'left-middle-menu'}>
								<Stack component={'div'} className={'logo-box'}>
									<Link href={'/'} className={'entitlement'}>
										<h1>PlaySpot 🏟️</h1>
									</Link>
								</Stack>
								<Stack component={'div'} className={'router-box'}>
									<Link href={'/'}>
										<div>{t('Home')}</div>
									</Link>
									<Link href={'/facility'}>
										<div>{t('Book')}</div>
									</Link>
									<Link href={'/agent'}>
										<div> {t('Managers')} </div>
									</Link>
									<Link href={'/community?articleCategory=FREE'}>
										<div> {t('Community')} </div>
									</Link>
									{user?._id && (
										<Link href={'/mypage'}>
											<div> {t('My Page')} </div>
										</Link>
									)}
								</Stack>
							</Stack>
							<Stack className={'right-middle-menu'}>
								<Stack className={'search-b'}>
									<input
										className={'search-buttton'}
										value={searchFiltere?.search?.text ?? ''}
										type="text"
										onChange={(e: any) => {
											setSearchFiltere({
												...searchFiltere,
												search: { ...searchFiltere.search, text: e.target.value },
											});
										}}
										placeholder="Search facilities..."
										onKeyDown={handlePasswordKeyDown}
									/>
									<SearchIcon className={'search-buttton-inside'} onClick={pushSearchHandler} />
								</Stack>
								<Stack className="right-login-and-notif">
									<Stack component="div" className="user-box">
										{user?._id ? (
											<>
												<div className="login-user" onClick={(event) => setLogoutAnchor(event.currentTarget)}>
													<img
														src={
															user?.memberImage
																? `${REACT_APP_API_URL}/${user?.memberImage}`
																: `/img/profile/default-user.png`
														}
													/>
												</div>
												<Menu
													id="basic-menu"
													anchorEl={logoutAnchor}
													open={logoutOpen}
													onClose={() => setLogoutAnchor(null)}
													sx={{ mt: '5px' }}
												>
													<MenuItem onClick={() => logOut()}>
														<Logout fontSize="small" style={{ color: 'blue', marginRight: '10px' }} />

														<div> {t('Logout')} </div>
													</MenuItem>
												</Menu>
											</>
										) : (
											<Link href="/account/join">
												<div className="join-box">
													<AccountCircleIcon />
												</div>
											</Link>
										)}
									</Stack>
								</Stack>
								<Stack>
									<Badge badgeContent={unreadCount} color="secondary">
										<NotificationsOutlinedIcon
											onClick={() => toggleNotificationDrawer(true)}
											style={{ cursor: 'pointer', fontSize: '28px' }}
										/>
									</Badge>
									<Drawer
										anchor="right"
										open={isNotificationOpen}
										onClose={() => toggleNotificationDrawer(false)}
										sx={{
											'& .MuiDrawer-paper': {
												width: '450px',
												padding: '20px',
												backgroundColor: '#ffffff',
												boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
												borderRadius: '8px',
											},
										}}
									>
										<Stack spacing={2}>
											<Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
												{t('Notifications')}
											</Typography>
											{notifications.length === 0 ? (
												<Typography
													variant="body2"
													color="textSecondary"
													sx={{ textAlign: 'center', marginTop: '20px' }}
												>
													{t('No new notifications')}
												</Typography>
											) : (
												notifications.map((notification) => (
													<Stack
														key={notification._id}
														sx={{
															position: 'relative',
															padding: '16px',
															border: '1px solid #ddd',
															borderRadius: '8px',
															marginBottom: '12px',
															boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
															transition: 'background-color 0.3s',
															'&:hover': {
																backgroundColor: '#f4f4f4',
															},
														}}
													>
														<MenuItem
															onClick={() => updateNotifsHandler(notification._id)}
															sx={{ padding: '0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
														>
															{notification.notificationStatus === NotificationStatus.WAIT && (
																<Stack
																	sx={{
																		width: '10px',
																		height: '10px',
																		backgroundColor: 'green',
																		borderRadius: '50%',
																		position: 'absolute',
																		top: '-8px',
																		left: '-8px',
																	}}
																/>
															)}
															<Stack sx={{ width: '100%' }}>
																{notification.notificationName && (
																	<Typography
																		variant="body1"
																		sx={{
																			fontSize: '15px',
																			fontWeight: '900',
																			color: '#00000',
																			marginBottom: '8px',
																			wordBreak: 'break-word',
																			whiteSpace: 'normal',
																		}}
																	>
																		Name: {notification.notificationName}
																	</Typography>
																)}

																{notification.notificationNumber && (
																	<Typography
																		variant="body1"
																		sx={{
																			fontSize: '14px',
																			fontWeight: '700',
																			color: '#00000',
																			marginBottom: '8px',
																			wordBreak: 'break-word',
																			whiteSpace: 'normal',
																		}}
																	>
																		Number: {notification.notificationNumber}
																	</Typography>
																)}

																<Typography
																	variant="body1"
																	sx={{
																		fontSize: '17px',
																		fontWeight: '700',
																		color: '#00000',
																		marginBottom: '8px',
																		wordBreak: 'break-word',
																		whiteSpace: 'normal',
																	}}
																>
																	{notification.notificationTitle}
																</Typography>

																<Typography
																	sx={{
																		fontSize: '14px',
																		color: 'textSecondary',
																		marginBottom: '8px',
																		wordBreak: 'break-word',
																		whiteSpace: 'normal',
																	}}
																	variant="body2"
																>
																	{notification.notificationDesc}
																</Typography>

																<Typography
																	variant="caption"
																	sx={{
																		fontSize: '14px',
																		fontWeight: '700',
																		color: '#00000',
																		marginBottom: '8px',
																		wordBreak: 'break-word',
																		whiteSpace: 'normal',
																	}}
																>
																	{new Date(notification.createdAt).toLocaleString()}
																</Typography>
															</Stack>
														</MenuItem>
													</Stack>
												))
											)}
										</Stack>
									</Drawer>
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};
Top.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			squaresRange: {
				start: 0,
				end: 500,
			},
			pricesRange: {
				start: 0,
				end: 500000,
			},
		},
	},
};
export default Top;
