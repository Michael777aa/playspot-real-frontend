import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Stack, Typography, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useRouter } from 'next/router';
import ScrollableFeed from 'react-scrollable-feed';
import { RippleBadge } from '../../scss/MaterialTheme/styled';
import { useReactiveVar } from '@apollo/client';
import { socketVar, userVar } from '../../apollo/store';
import { Member } from '../types/member/member';
import { Messages, REACT_APP_API_URL } from '../config';
import { sweetErrorAlert } from '../sweetAlert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useDeviceDetect from '../hooks/useDeviceDetect';

interface MessagePayload {
	id: string;
	event: string;
	text: string;
	memberData: Member;
	createdAt: string;
	isEdited?: boolean;
}

const Chat = () => {
	const chatContentRef = useRef<HTMLDivElement>(null);
	const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<number>(0);
	const device = useDeviceDetect();
	const [messageInput, setMessageInput] = useState<string>('');
	const [open, setOpen] = useState(false);
	const [openButton, setOpenButton] = useState(false);
	const [showScrollButton, setShowScrollButton] = useState(false);
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const [userIsAtBottom, setUserIsAtBottom] = useState(true);

	// useEffects

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
				setOpen(false);
			}
		};

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const storedOnlineUsers = Number(sessionStorage.getItem('onlineUsers')) || 0;
			setOnlineUsers(storedOnlineUsers);
		}
	}, []);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setOpenButton(true);
		}, 100);
		return () => clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		if (userIsAtBottom) {
			scrollToBottom();
		}
	}, [messagesList]);

	useEffect(() => {
		setOpenButton(false);
	}, [router.pathname]);

	useEffect(() => {
		if (open && chatContentRef.current) {
			chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
		}
	}, [open, messagesList]);

	useEffect(() => {
		if (open) {
			const storedMessages = localStorage.getItem('chatMessages');

			if (storedMessages) {
				setMessagesList(JSON.parse(storedMessages));
			} else {
				socket.send(JSON.stringify({ event: 'getMessages' }));
			}
		}
	}, [open]);

	useEffect(() => {
		socket.onmessage = (msg: any) => {
			const data = JSON.parse(msg.data);

			switch (data.event) {
				case 'info':
					setOnlineUsers(data.totalClients);
					break;

				case 'getMessages':
					setMessagesList(data.list);
					localStorage.setItem('chatMessages', JSON.stringify(data.list));
					break;

				case 'message':
					setMessagesList((prevMessages: any) => {
						if (!prevMessages.some((msg: any) => msg.id === data.id)) {
							const updatedMessages = [...prevMessages, data];
							localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
							return updatedMessages;
						}
						return prevMessages;
					});
					break;

				case 'updateMessage':
					if (data.data && data.data.id) {
						setMessagesList((prevMessages) =>
							prevMessages.map((msg) => (msg.id === data.data.id ? { ...msg, text: data.data.newText } : msg)),
						);
						localStorage.setItem(
							'chatMessages',
							JSON.stringify(
								messagesList.map((msg) => (msg.id === data.data.id ? { ...msg, text: data.data.newText } : msg)),
							),
						);
					}
					break;
				case 'removeMessage':
					if (data.data && data.data.id) {
						setMessagesList((prevMessages) => prevMessages.filter((msg) => msg.id !== data.data.id));
					}
					break;

				default:
					break;
			}
		};
	}, [socket, messagesList]);

	// HANDLERS

	const handleEditMessage = (id: string, currentText: string) => {
		const newText = prompt('Edit your message:', currentText);
		if (newText && newText !== currentText) {
			const messagePayload = {
				event: 'updateMessage',
				data: { id, newText },
			};
			socket.send(JSON.stringify(messagePayload));
			setMessagesList((prevMessages) =>
				prevMessages.map((msg) => (msg.id === id ? { ...msg, text: newText, isEdited: true } : msg)),
			);
		}
	};

	const handleRemoveMessage = (id: string) => {
		const confirmDelete = confirm('Are you sure you want to delete this message?');
		if (confirmDelete) {
			setMessagesList((prevMessages) => prevMessages.filter((msg) => msg.id !== id));

			const messagePayload = {
				event: 'removeMessage',
				data: { id },
			};
			socket.send(JSON.stringify(messagePayload));
		}
	};

	const getInputMessageHandler = useCallback(
		(e: any) => {
			const text = e.target.value;
			setMessageInput(text);
		},
		[messageInput],
	);

	const getKeyHandler = (e: any) => {
		try {
			if (e.key === 'Enter') {
				onClickHandler();
			}
		} catch (err: any) {
			console.log(err);
		}
	};

	const handleOpenChat = () => {
		setOpen((prevState) => !prevState);
	};

	const onClickHandler = () => {
		if (!messageInput) {
			sweetErrorAlert(Messages.error4);
		} else {
			const messagePayload = { event: 'message', data: messageInput };
			socket.send(JSON.stringify(messagePayload));
			setMessageInput('');
		}
	};

	const scrollToBottom = () => {
		if (chatContentRef.current) {
			chatContentRef.current.scrollTo({
				top: chatContentRef.current.scrollHeight,
				behavior: 'smooth',
			});
			setShowScrollButton(false);
		}
	};

	const handleScroll = () => {
		if (chatContentRef.current) {
			const { scrollTop, scrollHeight, clientHeight } = chatContentRef.current;
			const isNearBottom = scrollHeight - scrollTop <= clientHeight + 50;

			setUserIsAtBottom(isNearBottom);
			setShowScrollButton(!isNearBottom);
		}
	};

	const renderMessageText = (text = '') => {
		const urlRegex = /(https?:\/\/[^\s]+|(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;

		return (
			<Stack sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
				{text.split(urlRegex).map((part, index) =>
					urlRegex.test(part) ? (
						<Box
							key={index}
							component="a"
							href={part.startsWith('http') ? part : `https://${part}`}
							target="_blank"
							rel="noopener noreferrer"
							sx={{ color: '#1DA1F2', textDecoration: 'underline', fontSize: 15, wordBreak: 'break-word' }}
						>
							{part}
						</Box>
					) : (
						<span key={index} style={{ wordBreak: 'break-word', fontSize: 15 }}>
							{part}
						</span>
					),
				)}
			</Stack>
		);
	};

	if (device === 'mobile') {
		return (
			<>
				{openButton && (
					<button
						onClick={handleOpenChat}
						style={{
							position: 'fixed',
							bottom: '70px',
							right: '10px',
							zIndex: 1100,
							background: 'green',
							border: 'none',
							color: 'white',
							borderRadius: '50%',
							width: '30px',
							height: '30px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
							cursor: 'pointer',
							transition: 'background 0.3s ease',
						}}
						onMouseEnter={(e) => (e.currentTarget.style.background = '#1DA855')}
						onMouseLeave={(e) => (e.currentTarget.style.background = '#25D366')}
					>
						{open ? <CloseFullscreenIcon /> : <MarkChatUnreadIcon />}
					</button>
				)}

				<Stack
					ref={chatContainerRef}
					className={`chat-frame ${open ? 'open' : 'closed'}`}
					sx={{
						position: 'fixed',
						bottom: 0,
						left: 0,
						width: '100%',
						height: open ? '100vh' : '0',
						backgroundColor: '#E5DDD5',
						boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
						transition: 'height 0.4s ease-in-out',
						zIndex: 1000,
						overflowX: 'hidden',
						overflowY: 'hidden',
					}}
				>
					<Box
						className="chat-top"
						component="div"
						sx={{
							padding: '12px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							backgroundColor: '#075E54',
							color: 'white',
						}}
					></Box>
					<Box
						className="chat-content"
						id="chat-content"
						ref={chatContentRef}
						onScroll={handleScroll}
						component="div"
						sx={{
							flexGrow: 1,
							overflowY: 'auto',
							backgroundColor: '#E5DDD5',
							padding: '12px',
						}}
					>
						<ScrollableFeed>
							<Stack spacing={2}>
								{messagesList.map((ele: MessagePayload) => {
									const { id, text, memberData, createdAt } = ele;
									const memberImage = memberData?.memberImage
										? `${REACT_APP_API_URL}/${memberData.memberImage}`
										: '/img/profile/defaultUserr.svg';
									const memberName = memberData?.memberNick || 'Guest';

									return (
										<Stack
											key={id}
											sx={{
												display: 'flex',
												width: '100%',
												marginBottom: '8px',
												padding: '10px',
												backgroundColor: memberData?._id === user?._id ? '#DCF8C6' : '#fff',
												color: '#303030',
												borderRadius: '8px',
												wordBreak: 'break-word',
												overflowX: 'hidden',
												boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)',
											}}
										>
											<Stack justifyContent={'space-between'} flexDirection={'row'} alignItems="center">
												<Stack direction="row" alignItems="center" mb={1}>
													<Avatar src={memberImage} sx={{ width: 28, height: 28, marginRight: '8px' }} />
													<Typography component="span" sx={{ fontSize: '14px', fontWeight: 'bold', color: '#555' }}>
														{memberName}
													</Typography>
												</Stack>
												{memberData?._id === user?._id && (
													<Stack
														display="flex"
														gap={1}
														style={{
															display: 'flex',
															flexDirection: 'row',
														}}
													>
														<IconButton
															onClick={() => handleEditMessage(id, text)}
															sx={{
																width: '25px',
																height: '25px',
																backgroundColor: '#E0E0E0',
																color: '#4CAF50',
																borderRadius: '50%',
																padding: '4px',
																'&:hover': { backgroundColor: '#C8E6C9' },
															}}
														>
															<EditIcon fontSize="small" />
														</IconButton>

														<IconButton
															onClick={() => handleRemoveMessage(id)}
															sx={{
																width: '25px',
																height: '25px',
																backgroundColor: '#E0E0E0',
																color: '#F44336',
																borderRadius: '50%',
																padding: '4px',
																'&:hover': { backgroundColor: '#FFCDD2' },
															}}
														>
															<DeleteIcon fontSize="small" />
														</IconButton>
													</Stack>
												)}
											</Stack>
											<Typography component="div">{renderMessageText(text)}</Typography>
											<span
												style={{
													fontSize: '12px',
													color: 'rgba(0, 0, 0, 0.5)',
												}}
											>
												{new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
												{ele.isEdited && <span style={{ marginLeft: '5px', fontStyle: 'italic' }}>(edited)</span>}
											</span>
										</Stack>
									);
								})}
							</Stack>
						</ScrollableFeed>
					</Box>

					<Stack
						className="chat-bottom"
						sx={{
							display: 'flex',
							alignItems: 'center',
							flexDirection: 'row',
							padding: '15px',
							borderTop: '1px solid #ddd',
							backgroundColor: '#fff',
							position: 'relative',
							bottom: 0,
							left: 0,
							right: 0,
						}}
					>
						<input
							type="text"
							name="message"
							value={messageInput}
							className="msg-input"
							placeholder="Type a message..."
							onChange={getInputMessageHandler}
							onKeyDown={getKeyHandler}
							style={{
								flexGrow: 1,
								padding: '15px',
								borderRadius: '50px',
								border: '1px solid #ccc',
							}}
						/>
						<button
							className="send-msg-btn"
							onClick={onClickHandler}
							style={{
								backgroundColor: '#25D366',
								border: 'none',
								borderRadius: '50%',
								width: '50px',
								height: '50px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: 'white',
								marginLeft: '8px',
							}}
						>
							<SendIcon />
						</button>
					</Stack>
				</Stack>
			</>
		);
	} else {
		return (
			<>
				{openButton && (
					<button
						onClick={handleOpenChat}
						style={{
							position: 'fixed',
							bottom: '30px',
							right: '30px',
							zIndex: 1100,
							background: '#25D366',
							border: 'none',
							color: 'white',
							borderRadius: '50%',
							width: '60px',
							height: '60px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
							cursor: 'pointer',
							transition: 'background 0.3s ease',
						}}
						onMouseEnter={(e: any) => (e.currentTarget.style.background = '#1DA855')}
						onMouseLeave={(e: any) => (e.currentTarget.style.background = '#25D366')}
					>
						{open ? <CloseFullscreenIcon /> : <MarkChatUnreadIcon />}
					</button>
				)}
				<Stack
					ref={chatContainerRef}
					className={`chat-frame ${open ? 'open' : 'closed'}`}
					sx={{
						position: 'fixed',
						top: 0,
						left: 0,
						width: '40%',
						overflowX: 'hidden',
						overflowY: 'hidden',
						height: '100vh',
						backgroundColor: '#E5DDD5',
						boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
						transform: open ? 'translateX(0)' : 'translateX(-100%)',
						transition: 'transform 0.4s ease-in-out',
						zIndex: 1000,
					}}
				>
					<Box
						className="chat-top"
						component="div"
						sx={{
							padding: '20px 25px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							backgroundColor: '#075E54',
							color: 'white',
							boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
						}}
					>
						<div style={{ fontFamily: 'Nunito', fontSize: '22px', fontWeight: 'bold' }}>Chat</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div style={{ fontFamily: 'Nunito', fontSize: '14px', position: 'relative', bottom: 15, left: 5 }}>
								Users Online
							</div>
							<RippleBadge style={{ marginLeft: '20px' }} badgeContent={onlineUsers} />
						</div>
					</Box>
					<Box
						className="chat-content"
						id="chat-content"
						ref={chatContentRef}
						onScroll={handleScroll}
						component="div"
						sx={{
							padding: '15px',
							overflowY: 'auto',
							flexGrow: 1,
							backgroundColor: '#E5DDD5',
						}}
					>
						<ScrollableFeed>
							<Stack className="chat-main" spacing={2}>
								{messagesList.map((ele: MessagePayload) => {
									const { id, text, memberData, createdAt } = ele;
									const memberImage = memberData?.memberImage
										? `${REACT_APP_API_URL}/${memberData.memberImage}`
										: '/img/profile/defaultUserr.svg';
									const memberName = memberData?.memberNick || 'Guest';

									return (
										<Stack
											key={id}
											display="flex"
											flexDirection="column"
											sx={{
												maxWidth: 'auto',
												marginRight: 'auto',
												padding: '10px 15px',
												backgroundColor: memberData?._id === user?._id ? '#DCF8C6' : '#ffffff',
												color: '#303030',
												borderRadius: '10px',
												boxShadow: '0 1px 2px rgba(0, 0, 0, 0.15)',
												overflowWrap: 'break-word',
												wordBreak: 'break-word',
												overflowX: 'hidden',
												overflowY: 'hidden',
											}}
										>
											<Stack
												display="flex"
												flexDirection={'row'}
												justifyContent={'space-between'}
												alignItems={'center'}
											>
												<Stack display="flex" flexDirection={'row'} gap={'5px'} alignItems="center" mb={1}>
													<Avatar
														alt={memberName}
														src={memberImage}
														sx={{ width: 30, height: 30, marginRight: '8px' }}
													/>
													<Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
														{memberName}
													</Typography>
												</Stack>
												{memberData?._id === user?._id && (
													<Stack
														display="flex"
														gap={1}
														style={{
															display: 'flex',
															flexDirection: 'row',
														}}
													>
														<IconButton
															onClick={() => handleEditMessage(id, text)}
															sx={{
																width: '25px',
																height: '25px',
																backgroundColor: '#E0E0E0',
																color: '#4CAF50',
																borderRadius: '50%',
																padding: '4px',
																'&:hover': { backgroundColor: '#C8E6C9' },
															}}
														>
															<EditIcon fontSize="small" />
														</IconButton>

														<IconButton
															onClick={() => handleRemoveMessage(id)}
															sx={{
																width: '25px',
																height: '25px',
																backgroundColor: '#E0E0E0',
																color: '#F44336',
																borderRadius: '50%',
																padding: '4px',
																'&:hover': { backgroundColor: '#FFCDD2' },
															}}
														>
															<DeleteIcon fontSize="small" />
														</IconButton>
													</Stack>
												)}
											</Stack>
											<div>{renderMessageText(text)}</div>

											<Stack
												display="flex"
												alignItems="center"
												justifyContent="space-between"
												width="100%"
												mt={1}
											></Stack>
											<span
												style={{
													fontSize: '12px',
													color: 'rgba(0, 0, 0, 0.5)',
												}}
											>
												{new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
												{ele.isEdited && <span style={{ marginLeft: '5px', fontStyle: 'italic' }}>(edited)</span>}
											</span>
										</Stack>
									);
								})}
							</Stack>
						</ScrollableFeed>
					</Box>

					{showScrollButton && (
						<IconButton
							onClick={() => {
								scrollToBottom();
								setUserIsAtBottom(true);
							}}
							style={{
								position: 'fixed',
								bottom: '85px',
								right: '15px',
								backgroundColor: '#25D366',
								color: 'white',
								zIndex: 1100,
							}}
						>
							<ArrowDownwardIcon />
						</IconButton>
					)}

					<Box
						className="chat-bott"
						component="div"
						sx={{
							display: 'flex',
							alignItems: 'center',
							padding: '15px',
							borderTop: '1px solid #ddd',
							backgroundColor: '#ffffff',
						}}
					>
						<input
							type="text"
							name="message"
							value={messageInput}
							className="msg-input"
							placeholder="Type a message..."
							onChange={getInputMessageHandler}
							onKeyDown={getKeyHandler}
							style={{
								flexGrow: 1,
								padding: '12px',
								border: '1px solid #ccc',
								borderRadius: '20px',
								fontSize: '15px',
							}}
						/>
						<button
							className="send-msg-btn"
							onClick={onClickHandler}
							style={{
								backgroundColor: '#25D366',
								border: 'none',
								borderRadius: '50%',
								width: '45px',
								height: '45px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								cursor: 'pointer',
								color: 'white',
								marginLeft: '10px',
								transition: 'background 0.3s ease',
							}}
							onMouseEnter={(e) => (e.currentTarget.style.background = '#1DA855')}
							onMouseLeave={(e) => (e.currentTarget.style.background = '#25D366')}
						>
							<SendIcon />
						</button>
					</Box>
				</Stack>
			</>
		);
	}
};

export default Chat;
