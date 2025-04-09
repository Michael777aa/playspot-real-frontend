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
		: '/img/profile/defaultUserr.svg';

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
			<strong >{agent?.memberNick}</strong>
			<h1  style={{marginTop:20}} >{agent?.memberType}</h1>
			<span style={{position:"relative", top:"125px"}}  >Premium</span>
			<span >Premium</span>

		</Stack>
		);
	}
};

export default TopAgentCard;
