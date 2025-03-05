import React from 'react';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';

interface TopAgentProps {
	agent: Member;
	orderNumber: number;
}
const TopAgentCard = (props: TopAgentProps) => {
	const { agent, orderNumber } = props;
	const device = useDeviceDetect();
	const agentImage = agent?.memberImage
		? `${process.env.REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/default-user.png';

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className="top-agent-card">
				<img src={agentImage} alt="" />

				<strong>{agent?.memberNick}</strong>
				<span>{agent?.memberType}</span>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-agent-card">
				<img src={agentImage} alt="" />
				<div className="order-number">#{orderNumber}</div>
				<strong>{agent?.memberNick}</strong>
				<span style={{ marginTop: '7px' }}>Premium</span>
				<h1>{agent?.memberType}</h1>
			</Stack>
		);
	}
};

export default TopAgentCard;
