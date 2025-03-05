import React from 'react';
import { Stack, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Facility } from '../../types/facility/facility';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

interface TopFacilityCardProps {
	facility: Facility;
	likeFacilityHandler: any;
}

const TopFacilityCard = (props: TopFacilityCardProps) => {
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
			<Stack className="top-card-box">
				<Stack
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${facility?.facilityImages[0]})` }}
					onClick={() => {
						pushDetailHandler(facility._id);
					}}
				>
					<div>${facility?.facilityPrice}</div>
				</Stack>
				<Stack component={'div'} className={'info'}>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailHandler(facility._id);
						}}
					>
						{facility?.facilityTitle}
					</strong>
					<p className={'desc'}>{facility?.facilityAddress}</p>
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
							<IconButton color={'default'} onClick={() => likeFacilityHandler(user, facility?._id)}>
								{facility?.meLiked && facility?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{facility?.facilityLikes}</Typography>
						</div>
					</div>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-card-box">
				<Stack
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${facility?.facilityImages[0]})` }}
					onClick={() => {
						pushDetailHandler(facility._id);
					}}
				></Stack>
				<Stack component={'div'} className={'info'}>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailHandler(facility._id);
						}}
					>
						{facility?.facilityTitle} <ArrowOutwardIcon />
					</strong>
					<div className={'options'}>
						<div>
							<span>{facility?.availabilityStatus}</span>
						</div>
						<div></div>
						<div>
							<span>{facility?.facilityPetsAllowed ? 'pets allowed' : 'pets prohibited'}</span>
						</div>
					</div>
					<div className={'options'}>
						<div>
							<span>{facility?.parkingAvailable ? 'parking' : 'no parking'}</span>
						</div>
						<div></div>
						<div>
							<span>{facility?.furnished ? 'furnished' : 'no furnished'}</span>
						</div>
					</div>

					<div className={'options'}>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{facility?.facilityBalconies} balconies</span>
						</div>
						<div></div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{facility?.facilitySquare} m2</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div>${facility?.facilityPrice}/week</div>

						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{facility?.facilityViews}</Typography>
							<IconButton color={'default'} onClick={() => likeFacilityHandler(user, facility?._id)}>
								{facility?.meLiked && facility?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{facility?.facilityLikes}</Typography>
						</div>
					</div>
				</Stack>
			</Stack>
		);
	}
};

export default TopFacilityCard;
