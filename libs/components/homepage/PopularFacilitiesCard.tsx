import React from 'react';
import { Stack, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL, topFacilityRank } from '../../config';
import { useRouter } from 'next/router';
import BalconyIcon from '@mui/icons-material/Balcony';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { Facility } from '../../types/facility/facility';

interface PopularFacilityCardProps {
	facility: Facility;
}

const PopularFacilityCard = (props: PopularFacilityCardProps) => {
	const { facility } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	/** HANDLERS **/

	const pushDetailHandler = async (facilityId: string) => {
		console.log(facilityId);
		await router.push({ pathname: '/facility/detail', query: { id: facilityId } });
	};
	if (device === 'mobile') {
		return (
			<Stack className="popular-card-box">
				<Stack
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${facility?.facilityImages[0]})` }}
					onClick={() => {
						pushDetailHandler(facility._id);
					}}
				>
					<div className={'price'}>${facility.facilityPrice}</div>
				</Stack>
				<Stack component={'div'} className={'info'}>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailHandler(facility._id);
						}}
					>
						{facility.facilityTitle}
					</strong>
					<p className={'desc'}>{facility.facilityAddress}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{facility?.facilityBalconies} balconies</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{facility?.facilitySquare} m2</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{facility?.facilityViews}</Typography>
						</div>
					</div>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className="popular-card-box">
				<Stack
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${facility?.facilityImages[0]})` }}
					onClick={() => {
						pushDetailHandler(facility._id);
					}}
				>
					{(facility?.facilityRank ?? 0) >= topFacilityRank && (
						<div className="status">
							<img src="/img/icons/electricity.svg" alt="Top Facility Icon" />
							<span>Top</span>
						</div>
					)}
				</Stack>

				<Stack component={'div'} className={'info'}>
					<div className={'options'}>
						<div>
							<BalconyIcon />
							<span>{facility?.facilityBalconies} balconies</span>
						</div>

						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{facility?.facilitySquare} m2</span>
						</div>
					</div>
					<strong
						className={'title'}
						style={{ position: 'relative', top: '-5px' }}
						onClick={() => {
							pushDetailHandler(facility._id);
						}}
					>
						{facility.facilityTitle} <ArrowOutwardIcon />
					</strong>
					<p className={'desc'}>{facility.facilityDesc}</p>
					<p className={'address'}>Address: {facility.facilityAddress}</p>
					<div className="div-rent-location">
						<p className={'type'}>Facility Type: {facility.facilityType}</p>
						<p className={'location'}>Location: {facility.facilityLocation}</p>
					</div>

					<div className="bottom-card">
						<div className={'price'}>${facility.facilityPrice}/week</div>

						<div className="viewsss">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{facility?.facilityViews}</Typography>
						</div>
					</div>
				</Stack>
			</Stack>
		);
	}
};

export default PopularFacilityCard;
