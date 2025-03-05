import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import IconButton from '@mui/material/IconButton';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import { Facility } from '../../types/facility/facility';
import { formatterStr } from '../../utils';
import Moment from 'react-moment';
import { useRouter } from 'next/router';
import { AvailabilityStatus } from '../../enums/facility.enum';

interface FacilityCardProps {
	facility: Facility;
	deleteFacilityHandler?: any;
	memberPage?: boolean;
	updateFacilityHandler?: any;
}

export const FacilityCard = (props: FacilityCardProps) => {
	const { facility, deleteFacilityHandler, memberPage, updateFacilityHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	/** HANDLERS **/
	const pushEditFacility = async (id: string) => {
		console.log('+pushEditFacility: ', id);
		await router.push({
			pathname: '/mypage',
			query: { category: 'addFacility', facilityId: id },
		});
	};

	const pushFacilityDetail = async (id: string) => {
		if (memberPage)
			await router.push({
				pathname: '/facility/detail',
				query: { id: id },
			});
		else return;
	};

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return (
			<Stack
				className="facility-card-box"
				sx={{
					opacity: facility.availabilityStatus === 'DELETE' ? 0.6 : 1,
					width: '100%',
					padding: '16px',
					border: '1px solid #e0e0e0',
					borderRadius: '12px',
					backgroundColor: '#fff',
					boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
					marginBottom: '16px',
				}}
			>
				{/* Image Section */}
				<Stack
					className="image-box"
					onClick={() => facility.availabilityStatus !== 'DELETE' && pushFacilityDetail(facility?._id)}
					sx={{
						filter: facility.availabilityStatus === 'DELETE' ? 'grayscale(100%)' : 'none',
						pointerEvents: facility.availabilityStatus === 'DELETE' ? 'none' : 'auto',
						width: '100%',
						height: '150px',
						borderRadius: '8px',
						overflow: 'hidden',
						marginBottom: '12px',
					}}
				>
					<img
						src={`${process.env.REACT_APP_API_URL}/${facility.facilityImages[0]}`}
						alt="facility"
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
						}}
					/>
				</Stack>

				{/* Information Section */}
				<Stack
					className="information-box"
					spacing={1}
					onClick={() => facility.availabilityStatus !== 'DELETE' && pushFacilityDetail(facility?._id)}
					sx={{
						marginBottom: '12px',
					}}
				>
					<Typography
						className="name"
						sx={{
							fontSize: '16px',
							fontWeight: 'bold',
							textDecoration: facility.availabilityStatus === 'DELETE' ? 'line-through' : 'none',
							color: '#333',
						}}
					>
						{facility.facilityTitle}
					</Typography>
					<Typography
						className="address"
						sx={{
							fontSize: '14px',
							color: facility.availabilityStatus === 'DELETE' ? '#999' : '#555',
						}}
					>
						{facility.facilityAddress}
					</Typography>
					<Typography
						className="price"
						sx={{
							fontSize: '14px',
							fontWeight: 'bold',
							color: facility.availabilityStatus === 'DELETE' ? '#D32F2F' : '#1976d2',
						}}
					>
						{facility.availabilityStatus !== 'DELETE' ? `$${formatterStr(facility?.facilityPrice)}` : 'Deleted'}
					</Typography>
				</Stack>

				{/* Date Section */}
				<Stack className="date-box" sx={{ marginBottom: '8px' }}>
					<Typography className="date" sx={{ fontSize: '12px', color: '#777' }}>
						<Moment format="DD MMMM, YYYY">{facility.createdAt}</Moment>
					</Typography>
				</Stack>

				{/* Status Section */}
				<Stack
					className="status-box"
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					sx={{ marginBottom: '8px' }}
				>
					<Stack
						className="coloured-box"
						alignItems="center"
						justifyContent="center"
						sx={{
							backgroundColor: facility.availabilityStatus === 'DELETE' ? '#FCE4EC' : '#E5F0FD',
							padding: '6px 12px',
							borderRadius: '8px',
							cursor: facility.availabilityStatus === 'DELETE' ? 'default' : 'pointer',
						}}
						onClick={facility.availabilityStatus !== 'DELETE' ? handleClick : undefined}
					>
						<Typography
							className="status"
							sx={{
								fontSize: '12px',
								color: facility.availabilityStatus === 'DELETE' ? '#D32F2F' : '#3554d1',
								fontWeight: facility.availabilityStatus === 'DELETE' ? 'bold' : 'normal',
							}}
						>
							{facility.availabilityStatus}
						</Typography>
					</Stack>
					{!memberPage && facility.availabilityStatus !== 'DELETE' && (
						<Menu
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
							PaperProps={{
								elevation: 2,
								sx: {
									width: '120px',
									mt: 1,
									ml: '10px',
									overflow: 'hidden',
									borderRadius: '8px',
									boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
								},
							}}
						>
							{facility.availabilityStatus === 'AVAILABLE' && (
								<MenuItem
									onClick={() => {
										handleClose();
										updateFacilityHandler(AvailabilityStatus.RESERVED, facility?._id);
									}}
								>
									OCCUPIED
								</MenuItem>
							)}
							{facility.availabilityStatus === 'RESERVED' && (
								<MenuItem
									onClick={() => {
										handleClose();
										updateFacilityHandler(AvailabilityStatus.AVAILABLE, facility?._id);
									}}
								>
									AVAILABLE
								</MenuItem>
							)}
						</Menu>
					)}
				</Stack>

				{/* Views Section */}
				<Stack className="views-box" sx={{ textAlign: 'center', marginBottom: '8px' }}>
					<Typography className="views" sx={{ fontSize: '14px', color: '#777' }}>
						{facility.facilityViews?.toLocaleString() || '0'} views
					</Typography>
				</Stack>

				{/* Action Buttons */}
				{!memberPage && facility.availabilityStatus === AvailabilityStatus.AVAILABLE && (
					<Stack className="action-box" direction="row" spacing={1} justifyContent="flex-end" sx={{ marginTop: '8px' }}>
						<IconButton
							className="icon-button"
							onClick={() => pushEditFacility(facility._id)}
							sx={{
								backgroundColor: '#E3F2FD',
								color: '#1976d2',
								borderRadius: '8px',
							}}
						>
							<ModeIcon />
						</IconButton>
						<IconButton
							className="icon-button"
							onClick={() => deleteFacilityHandler(facility._id)}
							sx={{
								backgroundColor: '#FFEBEE',
								color: '#D32F2F',
								borderRadius: '8px',
							}}
						>
							<DeleteIcon />
						</IconButton>
					</Stack>
				)}
			</Stack>
		);
	} else
		return (
			<Stack className="facility-card-box" sx={{ opacity: facility.availabilityStatus === 'DELETE' ? 0.6 : 1 }}>
				<Stack
					className="image-box"
					onClick={() => facility.availabilityStatus !== 'DELETE' && pushFacilityDetail(facility?._id)}
					sx={{
						filter: facility.availabilityStatus === 'DELETE' ? 'grayscale(100%)' : 'none',
						pointerEvents: facility.availabilityStatus === 'DELETE' ? 'none' : 'auto',
					}}
				>
					<img src={`${process.env.REACT_APP_API_URL}/${facility.facilityImages[0]}`} alt="" />
				</Stack>
				<Stack
					className="information-box"
					onClick={() => facility.availabilityStatus !== 'DELETE' && pushFacilityDetail(facility?._id)}
				>
					<Typography
						className="name"
						sx={{ textDecoration: facility.availabilityStatus === 'DELETE' ? 'line-through' : 'none' }}
					>
						{facility.facilityTitle}
					</Typography>
					<Typography className="address" sx={{ color: facility.availabilityStatus === 'DELETE' ? '#999' : '#333' }}>
						{facility.facilityAddress}
					</Typography>
					<Typography className="price">
						<strong>
							{facility.availabilityStatus !== 'DELETE' ? `$${formatterStr(facility?.facilityPrice)}` : 'Deleted'}
						</strong>
					</Typography>
				</Stack>
				<Stack className="date-box">
					<Typography className="date">
						<Moment format="DD MMMM, YYYY">{facility.createdAt}</Moment>
					</Typography>
				</Stack>
				<Stack className="status-box">
					<Stack
						className="coloured-box"
						sx={{
							background: facility.availabilityStatus === 'DELETE' ? '#FCE4EC' : '#E5F0FD',
							cursor: facility.availabilityStatus === 'DELETE' ? 'default' : 'pointer',
						}}
						onClick={facility.availabilityStatus !== 'DELETE' ? handleClick : undefined}
					>
						<Typography
							className="status"
							sx={{
								color: facility.availabilityStatus === 'DELETE' ? '#D32F2F' : '#3554d1',
								fontWeight: facility.availabilityStatus === 'DELETE' ? 'bold' : 'normal',
							}}
						>
							{facility.availabilityStatus}
						</Typography>
					</Stack>
					{!memberPage && facility.availabilityStatus !== 'DELETE' && (
						<Menu
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
							PaperProps={{
								elevation: 2,
								sx: {
									width: '100px',
									mt: 1,
									ml: '10px',
									overflow: 'hidden',
									borderRadius: '8px',
									boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
								},
							}}
						>
							{facility.availabilityStatus === 'AVAILABLE' && (
								<MenuItem
									onClick={() => {
										handleClose();
										updateFacilityHandler(AvailabilityStatus.RESERVED, facility?._id);
									}}
								>
									OCCUPIED
								</MenuItem>
							)}
							{facility.availabilityStatus === 'RESERVED' && (
								<MenuItem
									onClick={() => {
										handleClose();
										updateFacilityHandler(AvailabilityStatus.AVAILABLE, facility?._id);
									}}
								>
									AVAILABLE
								</MenuItem>
							)}
						</Menu>
					)}
				</Stack>

				<Stack className="views-box">
					<Typography className="views">{facility.facilityViews?.toLocaleString() || '0'}</Typography>
				</Stack>

				{!memberPage && facility.availabilityStatus === AvailabilityStatus.AVAILABLE && (
					<Stack className="action-box">
						<IconButton className="icon-button" onClick={() => pushEditFacility(facility._id)}>
							<ModeIcon className="buttons" />
						</IconButton>
						<IconButton className="icon-button" onClick={() => deleteFacilityHandler(facility._id)}>
							<DeleteIcon className="buttons" />
						</IconButton>
					</Stack>
				)}
			</Stack>
		);
};
