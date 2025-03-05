import React from 'react';
import { Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Facility } from '../../types/facility/facility';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import WifiIcon from '@mui/icons-material/Wifi';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import ElevatorIcon from '@mui/icons-material/Elevator';
import SecurityIcon from '@mui/icons-material/Security';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import BuildIcon from '@mui/icons-material/Build';
import WeekendIcon from '@mui/icons-material/Weekend';
interface FacilityCardType {
	facility: Facility;
	likeFacilityHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const FacilityCard = (props: FacilityCardType) => {
	const { facility, likeFacilityHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = facility?.facilityImages[0]
		? `${REACT_APP_API_URL}/${facility?.facilityImages[0]}`
		: '/img/banner/header1.svg';

	const amenityIcons: any = {
		WiFi: <WifiIcon />,
		'Air Conditioning': <AcUnitIcon />,
		'Washer/Dryer': <LocalLaundryServiceIcon />,
		Elevator: <ElevatorIcon />,
		'Security System': <SecurityIcon />,
		'Lounge Area': <WeekendIcon />,
		'24-Hour Maintenance': <BuildIcon />,
		Breakfast: <LocalCafeIcon />,
	};
	if (device === 'mobile') {
		return (
			<Stack
				className="card-config"
				style={{
					display: 'flex',
					flexDirection: 'column',
					backgroundColor: '#fff',
					borderRadius: '12px',
					boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
					overflow: 'hidden',
					marginBottom: '15px',
					padding: '10px',
					gap: '10px',
					zIndex: 0,
				}}
			>
				{/* Top Image Section */}
				<Stack
					className="top"
					style={{
						position: 'relative',
						width: '100%',
						height: '200px',
						overflow: 'hidden',
						borderRadius: '12px',
					}}
				>
					<Link
						href={{
							pathname: '/facility/detail',
							query: { id: facility?._id },
						}}
					>
						<img
							src={imagePath}
							alt={facility?.facilityTitle}
							style={{
								width: '100%',
								height: '100%',
								objectFit: 'cover',
								borderRadius: '12px',
							}}
						/>
					</Link>
				</Stack>

				{/* Bottom Content Section */}
				<Stack
					className="bottom"
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '10px',
					}}
				>
					{/* Name and Address */}
					<Stack className="name-address" style={{ gap: '5px' }}>
						<Stack className="name">
							<Link
								href={{
									pathname: '/facility/detail',
									query: { id: facility?._id },
								}}
							>
								<Typography
									style={{
										fontSize: '1rem',
										fontWeight: '600',
										color: '#333',
									}}
								>
									{facility?.facilityTitle}
								</Typography>
							</Link>
						</Stack>
						<Stack className="address">
							<Typography style={{ fontSize: '0.9rem', color: '#777' }}>
								{facility.facilityAddress}, {facility.facilityLocation}
							</Typography>
						</Stack>
					</Stack>

					{/* Options */}
					<Stack
						className="options"
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							gap: '10px',
							flexWrap: 'wrap',
						}}
					>
						<Stack className="option">
							<Typography style={{ fontSize: '0.85rem', color: '#555' }}>
								{facility.facilityBalconies} balconies
							</Typography>
						</Stack>
						<Stack
							className=""
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
								gap: '20px',
							}}
						>
							<Stack
								className="button-box"
								style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: '10px' }}
							>
								<RemoveRedEyeIcon fontSize="medium" />
								<Typography>{facility?.facilityViews}</Typography>
							</Stack>
							<Stack
								className="button-box"
								style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: '10px' }}
							>
								{facility?.meLiked && facility?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon
										color="primary"
										fontSize={'medium'} // @ts-ignore
										onClick={() => likeFacilityHandler(user, facility?._id)}
									/>
								) : (
									<FavoriteBorderIcon
										fontSize={'medium'}
										// @ts-ignore
										onClick={() => likeFacilityHandler(user, facility?._id)}
									/>
								)}
								<Typography>{facility?.facilityLikes}</Typography>
							</Stack>
						</Stack>
						<Stack className="option">
							<Typography style={{ fontSize: '0.85rem', color: '#555' }}>{facility.facilitySquare} m²</Typography>
						</Stack>
					</Stack>

					<Stack
						className="options"
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							gap: '5px',
						}}
					>
						<div style={{ fontSize: '0.85rem', color: facility?.furnished ? '#4CAF50' : '#d32f2f' }}>
							{facility?.furnished ? 'Furnished' : 'Not Furnished'}
						</div>
						<div style={{ fontSize: '0.85rem', color: facility?.parkingAvailable ? '#4CAF50' : '#d32f2f' }}>
							{facility?.parkingAvailable ? 'Parking Available' : 'No Parking'}
						</div>
						<div style={{ fontSize: '0.85rem', color: facility?.facilityPetsAllowed ? '#4CAF50' : '#d32f2f' }}>
							{facility?.facilityPetsAllowed ? 'Pets Allowed' : 'No Pets'}
						</div>
					</Stack>

					{/* Price and Book Button */}
					<Stack
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginTop: '10px',
						}}
					>
						<Stack
							style={{
								backgroundColor: '#4CAF50',
								padding: '10px 15px',
								borderRadius: '8px',
								color: '#fff',
								fontWeight: '600',
								fontSize: '0.9rem',
							}}
						>
							${facility?.facilityPrice}/week
						</Stack>
						<Link
							href={{
								pathname: '/facility/detail',
								query: { id: facility?._id },
							}}
						>
							<button
								style={{
									padding: '10px 20px',
									backgroundColor: '#FF5722',
									borderRadius: '8px',
									color: '#fff',
									fontSize: '0.9rem',
									fontWeight: '600',
									border: 'none',
									cursor: 'pointer',
								}}
							>
								Book Now
							</button>
						</Link>
					</Stack>

					{/* Amenities */}
					<Stack
						className="amenities"
						style={{
							display: 'flex',
							flexDirection: 'row',
							flexWrap: 'wrap',
							gap: '5px',
							alignItems: 'center',
						}}
					>
						<Typography style={{ fontSize: '0.85rem', fontWeight: '600', color: '#333' }}>Amenities:</Typography>
						{facility?.amenities?.map((amenity) => (
							<Stack
								key={amenity}
								style={{
									backgroundColor: '#f1f8e9',
									padding: '5px 10px',
									borderRadius: '6px',
									fontSize: '0.8rem',
									fontWeight: '500',
									color: '#4CAF50',
								}}
							>
								{amenity}
							</Stack>
						))}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className="card-config">
				<Stack className="top">
					<Link
						href={{
							pathname: '/facility/detail',
							query: { id: facility?._id },
						}}
					>
						<img src={imagePath} alt="" />
					</Link>
				</Stack>
				<Stack className="bottom">
					<Stack className="name-address">
						<Stack className="name">
							<Link
								href={{
									pathname: '/facility/detail',
									query: { id: facility?._id },
								}}
							>
								<Typography className="rent-title">{facility?.facilityTitle}</Typography>
							</Link>
						</Stack>
						<Stack className="address">
							<Typography>
								{facility.facilityAddress}, {facility.facilityLocation}
							</Typography>
						</Stack>
					</Stack>

					<Stack className="options">
						<Stack className="option">
							<Typography>{facility.facilityBalconies} balconies</Typography>
						</Stack>
						<Stack className="option">
							<Typography>{facility.facilitySquare} m2</Typography>
						</Stack>
					</Stack>

					<Stack className="options">
						<div className="option">
							<span>{facility?.furnished ? 'furnished' : 'no furnished'}</span>
						</div>
						<div className="option ">
							<span>{facility?.parkingAvailable ? 'parking available' : 'parking unavailable'}</span>
						</div>
						<div className="option">
							<span>{facility?.facilityPetsAllowed ? 'pets  allowed' : 'pets not allowed'}</span>
						</div>
					</Stack>
					<Stack className="type-buttons">
						<Stack className="type"></Stack>
						{!recentlyVisited && (
							<Stack className="buttons">
								<IconButton color={'default'}>
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="view-cnt">{facility?.facilityViews}</Typography>
								<IconButton color={'default'} onClick={() => likeFacilityHandler(user, facility?._id)}>
									{myFavorites ? (
										<FavoriteIcon color="primary" />
									) : facility?.meLiked && facility?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon color="primary" />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<Typography className="view-cnt">{facility?.facilityLikes}</Typography>
							</Stack>
						)}
					</Stack>
					<Stack
						component={'div'}
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							position: 'relative',
							bottom: '18px',
							padding: '8px 20px',
							background: 'linear-gradient(135deg, #4CAF50, #2E7D32)', // Green gradient background
							borderRadius: '50px', // Fully rounded for a pill shape
							color: '#ffffff', // White text for contrast
							fontWeight: '600',
							width: '150px',
							fontSize: '10px',
							textAlign: 'center',
							boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
							transition: 'transform 0.3s ease, box-shadow 0.3s ease',
							cursor: 'pointer',
						}}
						onMouseEnter={(e: any) => {
							e.currentTarget.style.transform = 'scale(1.05)';
							e.currentTarget.style.boxShadow = '0px 8px 20px rgba(0, 0, 0, 0.2)';
						}}
						onMouseLeave={(e: any) => {
							e.currentTarget.style.transform = 'scale(1)';
							e.currentTarget.style.boxShadow = '0px 6px 12px rgba(0, 0, 0, 0.15)';
						}}
					>
						<Typography style={{ fontSize: '15px' }}>${facility?.facilityPrice}/week</Typography>
					</Stack>
					<Link
						href={{
							pathname: '/facility/detail',
							query: { id: facility?._id },
						}}
					>
						<button
							style={{
								position: 'relative',
								top: '-55px',
								left: '520px',
								padding: '10px 24px',
								fontSize: '16px',
								fontWeight: '600',
								color: '#ffffff',
								background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
								border: 'none',
								borderRadius: '50px',
								cursor: 'pointer',
							}}
						>
							Book Now
						</button>
					</Link>

					<Stack
						className="amenities"
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'flex-start',
							position: 'relative',
							top: '-130px',
						}}
					>
						Amenities:
						{facility?.amenities?.map((amenity) => (
							<Stack
								key={amenity}
								style={{
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between',
									margin: '5px',
									color: '#4CAF50',
									fontSize: '20px',
								}}
							>
								{amenityIcons[amenity] || <span>{amenity}</span>}
							</Stack>
						))}
					</Stack>
					<Stack className="divider"></Stack>
				</Stack>
			</Stack>
		);
	}
};

export default FacilityCard;
