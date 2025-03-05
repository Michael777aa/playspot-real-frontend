import React from 'react';
import { Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const Article = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>FACILITY CARD</div>;
	} else {
		return (
			<Stack className="card-config">
				<Stack className="top">
					<img src="/img/apartmentMain.png" alt="" />
					<Stack component={'div'} className={'date'}>
						<Typography>July 28</Typography>
					</Stack>
				</Stack>
				<Stack className="bottom">
					<Stack className="name-address">
						<Stack className="name">
							<Typography>Equestrian Family Complex</Typography>
						</Stack>
						<Stack className="address">
							<Typography>Shillymdong, Kwanak-ku, Seoul </Typography>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Article;
