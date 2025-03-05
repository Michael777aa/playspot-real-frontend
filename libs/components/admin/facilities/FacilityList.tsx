import React from 'react';
import Link from 'next/link';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { Stack } from '@mui/material';
import { Facility } from '../../../types/facility/facility';
import { REACT_APP_API_URL } from '../../../config';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { AvailabilityStatus } from '../../../enums/facility.enum';

interface Data {
	id: string;
	title: string;
	price: string;
	agent: string;
	location: string;
	type: string;
	status: string;
	remove: string;
}

type Order = 'asc' | 'desc';

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id',
		numeric: true,
		disablePadding: false,
		label: 'MB ID',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'TITLE',
	},
	{
		id: 'price',
		numeric: false,
		disablePadding: false,
		label: 'PRICE',
	},
	{
		id: 'agent',
		numeric: false,
		disablePadding: false,
		label: 'AGENT',
	},
	{
		id: 'location',
		numeric: false,
		disablePadding: false,
		label: 'LOCATION',
	},
	{
		id: 'type',
		numeric: false,
		disablePadding: false,
		label: 'TYPE',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, facility: keyof Data) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface FacilityPanelListType {
	facilities: Facility[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateFacilityHandler: any;
	removeFacilityHandler: any;
}

export const FacilityPanelList = (props: FacilityPanelListType) => {
	const {
		facilities,
		anchorEl,
		menuIconClickHandler,
		menuIconCloseHandler,
		updateFacilityHandler,
		removeFacilityHandler,
	} = props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					{/* Table Header */}
					{/*@ts-ignore*/}
					<EnhancedTableHead />
					<TableBody>
						{/* No Data Row */}
						{facilities.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={headCells.length}>
									<span className="no-data">No data found!</span>
								</TableCell>
							</TableRow>
						)}

						{/* Data Rows */}
						{facilities.length !== 0 &&
							facilities.map((facility: Facility, index: number) => {
								const facilityImage = `${REACT_APP_API_URL}/${facility?.facilityImages[0]}`;

								return (
									<TableRow hover key={facility?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										{/* Facility ID */}
										<TableCell align="left">{facility._id}</TableCell>

										{/* Facility Title with Image */}
										<TableCell align="left">
											<Stack direction={'row'}>
												<Link href={`/facility/detail?id=${facility?._id}`}>
													<Avatar
														alt={facility.facilityTitle}
														src={facilityImage}
														sx={{ ml: '2px', mr: '10px', width: 50, height: 50 }}
													/>
												</Link>
												<Link href={`/facility/detail?id=${facility?._id}`}>
													<Typography>{facility.facilityTitle}</Typography>
												</Link>
											</Stack>
										</TableCell>

										<TableCell align="center">${facility.facilityPrice}</TableCell>

										<TableCell align="center">{facility.memberData?.memberNick || 'N/A'}</TableCell>

										<TableCell align="center">{facility.facilityLocation}</TableCell>

										<TableCell align="center">{facility.facilityType}</TableCell>

										<TableCell align="center">
											<Button
												className={`badge ${facility.availabilityStatus.toLowerCase()}`}
												onClick={(e) => menuIconClickHandler(e, index)}
											>
												{facility.availabilityStatus}
											</Button>
											<Menu
												anchorEl={anchorEl[index]}
												open={Boolean(anchorEl[index])}
												onClose={menuIconCloseHandler}
												TransitionComponent={Fade}
											>
												{Object.values(AvailabilityStatus)
													.filter((status) => status !== facility.availabilityStatus)
													.map((status) => (
														<MenuItem
															key={status}
															onClick={() =>
																updateFacilityHandler({
																	_id: facility._id,
																	availabilityStatus: status,
																})
															}
														>
															<Typography>{status}</Typography>
														</MenuItem>
													))}
											</Menu>
										</TableCell>

										{facility.availabilityStatus === 'DELETE' && (
											<TableCell align="center">
												<Button
													variant="outlined"
													color="error"
													onClick={() => removeFacilityHandler(facility._id)}
													sx={{ p: '3px' }}
												>
													<DeleteIcon fontSize="small" />
												</Button>
											</TableCell>
										)}
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
