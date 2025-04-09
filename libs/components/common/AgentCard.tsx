import React, { useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography, Divider, Button } from '@mui/material';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Member } from '../../types/member/member';
import { GET_MEMBER } from '../../../apollo/user/query';
import { T } from '../../types/common';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
interface AgentCardProps {
	agent: any;
	likeMemberHandler: any;
	subscribeHandler: any;
	unsubscribeHandler: any;
}

const AgentCard = (props: AgentCardProps) => {
	const { agent, likeMemberHandler, subscribeHandler, unsubscribeHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const [member, setMember] = useState<Member | null>(null);

	const {
		loading: getMemberLoading,
		data: getMemberData,
		error: getMemberError,
		refetch: getMemberRefetch,
	} = useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		variables: { input: agent._id },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMember(data?.getMember);
		},
	});
	const imagePath: string = agent?.memberImage
		? `${REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUserr.svg';

	if (device === 'mobile') {
		return (
			<Stack
				className="agent-general-card"
				style={{
					display: 'flex',
					flexDirection: 'column',
					padding: '15px',
					backgroundColor: '#f9f9f9',
					borderRadius: '12px',
					boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
					gap: '10px',
					alignItems: 'center',
				}}
			>
				<Link
					href={{
						pathname: '/agent/detail',
						query: { agentId: agent?._id },
					}}
				>
					<Stack
						component="div"
						className="agent-img"
						style={{
							width: '100px',
							height: '100px',
							borderRadius: '50%',
							backgroundImage: `url(${imagePath})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							backgroundRepeat: 'no-repeat',
							boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
						}}
					></Stack>
				</Link>

				<span
					className="special-agent"
					style={{
						fontSize: '0.85rem',
						color: '#777',
						textAlign: 'center',
					}}
				>
					Sport Facility Agent
				</span>

				<div
					className="count-facilities"
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						fontSize: '0.9rem',
						color: '#555',
					}}
				>
					<span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>{agent?.memberFacilities}</span>
					<span>Sport Arenas</span>
				</div>

				<Divider style={{ width: '100%', margin: '10px 0' }} />

				<Stack
					className="agent-desc"
					style={{
						width: '100%',
						alignItems: 'center',
						gap: '10px',
					}}
				>
					<Stack component="div" className="agent-info" style={{ textAlign: 'center' }}>
						<Link
							href={{
								pathname: '/agent/detail',
								query: { agentId: agent?._id },
							}}
						>
							<strong
								className="namee"
								style={{
									fontSize: '1rem',
									fontWeight: '600',
									color: '#007bff',
									cursor: 'pointer',
								}}
							>
								{agent?.memberFirstName ?? agent?.memberNick}
							</strong>
						</Link>
					</Stack>

					<Stack
						className="buttons"
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							gap: '10px',
						}}
					>
						<IconButton style={{ color: '#333' }}>
							<RemoveRedEyeIcon />
						</IconButton>
						<Typography
							className="view-cnt"
							style={{
								fontSize: '0.85rem',
								color: '#555',
							}}
						>
							{agent?.memberViews}
						</Typography>
						<IconButton
							style={{ color: agent?.meLiked && agent?.meLiked[0]?.myFavorite ? '#f44336' : '#555' }}
							onClick={() => likeMemberHandler(user, agent?._id)}
						>
							{agent?.meLiked && agent?.meLiked[0]?.myFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
						</IconButton>
						<Typography
							className="view-cnt"
							style={{
								fontSize: '0.85rem',
								color: '#555',
							}}
						>
							{agent?.memberLikes}
						</Typography>
					</Stack>
				</Stack>

				<Stack
					className="follow-button-box"
					direction="row"
					spacing={1}
					alignItems="center"
					justifyContent="center"
					style={{
						width: '100%',
						marginTop: '10px',
					}}
				>
					{member?.meFollowed && member?.meFollowed[0]?.myFollowing ? (
						<Button
							variant="contained"
							style={{
								background: 'linear-gradient(135deg, #ff8a8a 0%, #e57373 100%)',
								color: '#fff',
								borderRadius: '50px',
								padding: '8px 15px',
								fontWeight: '600',
								fontSize: '0.85rem',
								boxShadow: '0px 4px 6px rgba(255, 90, 90, 0.4)',
							}}
							onClick={() => unsubscribeHandler(member?._id, getMemberRefetch, agent._id)}
						>
							<FavoriteIcon style={{ marginRight: '5px', fontSize: '18px' }} />
							Unfollow
						</Button>
					) : (
						<Button
							variant="contained"
							style={{
								background: 'linear-gradient(135deg, #ff8f00 0%, #ff6f00 100%)',
								color: '#fff',
								borderRadius: '50px',
								padding: '8px 15px',
								fontWeight: '600',
								fontSize: '0.85rem',
								boxShadow: '0px 4px 6px rgba(255, 111, 0, 0.4)',
							}}
							onClick={() => subscribeHandler(member?._id, getMemberRefetch, agent._id)}
						>
							<FavoriteBorderIcon style={{ marginRight: '5px', fontSize: '18px' }} />
							Follow
						</Button>
					)}
				</Stack>

				{agent?.memberEmail && (
					<strong
						className="namee3"
						style={{
							fontSize: '0.85rem',
							color: '#777',
							textAlign: 'center',
						}}
					>
						Email: {agent.memberEmail}
					</strong>
				)}
				<strong
					className="namee2"
					style={{
						fontSize: '0.85rem',
						color: '#777',
						textAlign: 'center',
					}}
				>
					Phone: {agent?.memberPhone}
				</strong>
				<strong
					className="namee4"
					style={{
						fontSize: '0.85rem',
						color: '#777',
						textAlign: 'center',
					}}
				>
					Address: {agent?.memberAddress || 'Address not set'}
				</strong>
			</Stack>
		);
	} else {
		return (
			<Stack className="agent-general-card">
				<Link
					href={{
						pathname: '/agent/detail',
						query: { agentId: agent?._id },
					}}
				>
					<Stack
						component={'div'}
						className={'agent-img'}
						style={{
							backgroundImage: `url(${imagePath})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							backgroundRepeat: 'no-repeat',
						}}
					></Stack>
				</Link>
				<span className="special-agent">
					<span>Sport</span>
					<span>Facility</span>
					<span>Agent</span>
				</span>
				<div className="count-facilities">
					<span style={{ fontSize: '45px' }}>{agent?.memberFacilities}</span>
					<span>sport</span>
					<span>arenas</span>
				</div>
				<span className="sport-facility">Sport Facility</span>
				<Divider style={{ position: 'relative', top: '-155px' }}></Divider>
				<Stack className={'agent-desc'}>
					<Stack component={'div'} className={'agent-info'}>
						<Link
							href={{
								pathname: '/agent/detail',
								query: { agentId: 'id' },
							}}
						>
							<strong className="namee">
								{agent?.memberFirstName ?? agent?.memberNick}
								<ArrowOutwardIcon />
							</strong>
						</Link>
					</Stack>
					<Stack component={'div'} className={'buttons'}>
						<IconButton style={{ color: '#fff' }}>
							<RemoveRedEyeIcon />
						</IconButton>
						<Typography className="view-cnt">{agent?.memberViews}</Typography>
						<IconButton style={{ color: '#fff' }} onClick={() => likeMemberHandler(user, agent?._id)}>
							{agent?.meLiked && agent?.meLiked[0]?.myFavorite ? (
								<FavoriteIcon color={'primary'} />
							) : (
								<FavoriteBorderIcon />
							)}
						</IconButton>
						<Typography className="view-cnt">{agent?.memberLikes}</Typography>
					</Stack>
				</Stack>

				<Stack
					className="follow-button-box"
					direction="row"
					style={{ position: 'relative', top: '-120px', left: '80px' }}
					spacing={1}
					alignItems="center"
					justifyContent="center"
				>
					{member?.meFollowed && member?.meFollowed[0]?.myFollowing ? (
						<Button
							className="buttons"
							variant="contained"
							sx={{
								background: 'linear-gradient(135deg, #ff8a8a 0%, #e57373 100%)',
								color: '#fff',
								borderRadius: '50px',
								padding: '10px 20px',
								fontWeight: 'bold',
								fontSize: '14px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0px 6px 10px rgba(255, 90, 90, 0.4)',
							}}
							onClick={() => unsubscribeHandler(member?._id, getMemberRefetch, agent._id)}
						>
							<FavoriteIcon sx={{ marginRight: '5px', fontSize: '20px', color: '#fff' }} />
							Unfollow
						</Button>
					) : (
						<Button
							className="buttons"
							variant="contained"
							sx={{
								background: 'linear-gradient(135deg, #ff8f00 0%, #ff6f00 100%)',
								color: '#fff',
								borderRadius: '50px',
								padding: '10px 20px',
								fontWeight: 'bold',
								fontSize: '14px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0px 6px 10px rgba(255, 111, 0, 0.4)',
							}}
							onClick={() => subscribeHandler(member?._id, getMemberRefetch, agent._id)}
						>
							<FavoriteBorderIcon sx={{ marginRight: '5px', fontSize: '20px', color: '#fff' }} />
							Follow
						</Button>
					)}
				</Stack>
				{agent?.memberEmail && <strong className="namee3">email: {agent.memberEmail}</strong>}

				<strong className="namee2">phone: {agent?.memberPhone}</strong>
				<strong className="namee4">address: {agent?.memberAddress ? agent.memberAddress : 'address not set'}</strong>
			</Stack>
		);
	}
};

export default AgentCard;
