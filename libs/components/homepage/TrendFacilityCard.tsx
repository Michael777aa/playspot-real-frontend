import React from 'react';
import { Stack, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Facility } from '../../types/facility/facility';

interface TrendFacilityCardProps {
	facility: Facility;
	likeFacilityHandler: any;
}

const TrendFacilityCard = (props: TrendFacilityCardProps) => {
	const { facility, likeFacilityHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/

	const pushDetailHandler = async (facilityId: string) => {
		console.log(facilityId);
		await router.push({ pathname: '/facility/detail', query: { id: facilityId } });
	};

	if (device === 'mobile') {
		return (
			<Stack className="trend-card-box" key={facility._id}>
				<Stack
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${facility?.facilityImages[0]})` }}
					onClick={() => {
						pushDetailHandler(facility._id);
					}}
				>
					<div>${facility.facilityPrice}</div>
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
					<p className={'desc'}>{facility.facilityDesc ?? 'no description'}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{facility.facilityBalconies} rooms</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{facility.facilitySquare} m2</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{facility?.facilityViews}</Typography>
							<IconButton
								color={'default'}
								className="liked-facilities"
								onClick={() => likeFacilityHandler(user, facility?._id)}
							>
								{facility?.meLiked && facility?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="liked-facilities">{facility?.facilityLikes}</Typography>
						</div>
					</div>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className="trend-card-box" key={facility._id}>
				<Stack
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${facility?.facilityImages[0]})` }}
				>
					<div>${facility.facilityPrice}/week</div>
				</Stack>
				<Stack component={'div'} className={'info'}>
					<strong className={'title'}>{facility.facilityTitle}</strong>
					<p className={'desc'}>{facility.facilityDesc ?? 'no description'}</p>
					<Stack className="two-items">
						<p className={'decoratis'}>{facility.parkingAvailable ? 'parking available' : 'parking unavailable'}</p>
						<p className={'decoratis'}>{facility.furnished ? 'furnished' : 'unfurnished'}</p>
					</Stack>

					<div className={'options'}>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{facility.facilityBalconies} balconies</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{facility.facilitySquare} m2</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{facility?.facilityViews}</Typography>
							<IconButton
								className="likee-cnt"
								color={'default'}
								onClick={() => likeFacilityHandler(user, facility?._id)}
							>
								{facility?.meLiked && facility?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt likee-cnt">{facility?.facilityLikes}</Typography>
						</div>
					</div>
				</Stack>
			</Stack>
		);
	}
};

export default TrendFacilityCard;
