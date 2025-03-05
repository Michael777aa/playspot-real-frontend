import React from 'react';
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
	Typography,
	Stack,
} from '@mui/material';

import Moment from 'react-moment';
import { Event } from '../../../types/event/event';
import { EventStatus } from '../../../enums/event.enum';
import { REACT_APP_API_URL } from '../../../config';
import Avatar from '@mui/material/Avatar';

interface Data {
	category: string;
	targetAudience: string;
	sort: string;
	title: string;
	writer: string;
	register: string;
	view: number;
	like: number;
	status: string;
	article_id: string;
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'article_id',
		numeric: true,
		disablePadding: false,
		label: 'Event Id',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'Title',
	},
	{
		id: 'sort',
		numeric: true,
		disablePadding: false,
		label: 'Topic',
	},
	{
		id: 'targetAudience',
		numeric: true,
		disablePadding: false,
		label: 'Description',
	},
	{
		id: 'category',
		numeric: true,
		disablePadding: false,
		label: 'Location',
	},

	{
		id: 'register',
		numeric: true,
		disablePadding: false,
		label: 'Register Date',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'Status',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, facility: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
export interface EventsPanelListType {
	allEvents: Event[];
	anchorEl: any;
	handleMenuIconClick: any;
	handleMenuIconClose: any;
	updateEventHandler: any;
}

export const EventsPanelList = (props: EventsPanelListType) => {
	const { allEvents, anchorEl, handleMenuIconClick, handleMenuIconClose, updateEventHandler } = props;

	return (
		<TableContainer>
			<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
				{/*@ts-ignore*/}
				<EnhancedTableHead />
				<TableBody>
					{allEvents.length === 0 && (
						<TableRow>
							<TableCell align="center" colSpan={8}>
								<span className={'no-data'}>data not found!</span>
							</TableCell>
						</TableRow>
					)}

					{allEvents.length !== 0 &&
						allEvents.map((event: Event, index: number) => {
							const event_image = `${REACT_APP_API_URL}/${event.eventImages[0]}`;

							return (
								<TableRow hover key={event._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
									<TableCell align="left">{event._id}</TableCell>
									<Stack direction={'row'} style={{ position: 'relative', top: '5px' }}>
										<div>
											<Avatar alt="Remy Sharp" src={event_image} sx={{ ml: '2px', mr: '10px' }} />
										</div>
										<div>{event.eventName}</div>
									</Stack>
									<TableCell align="left">{event.eventTopic}</TableCell>

									<TableCell align="left">{event.eventDesc}</TableCell>

									<TableCell align="left">{event.eventLocation}</TableCell>

									<TableCell align="left">
										<Moment format={'DD.MM.YY HH:mm'}>{event?.createdAt}</Moment>
									</TableCell>
									<TableCell align="center">
										<>
											<Button onClick={(e: any) => handleMenuIconClick(e, index)} className={'badge success'}>
												{event.eventStatus}
											</Button>

											<Menu
												className={'menu-modal'}
												MenuListProps={{
													'aria-labelledby': 'fade-button',
												}}
												anchorEl={anchorEl[index]}
												open={Boolean(anchorEl[index])}
												onClose={handleMenuIconClose}
												TransitionComponent={Fade}
												sx={{ p: 1 }}
											>
												{Object.values(EventStatus)
													.filter((ele) => ele !== event.eventStatus)
													.map((status: string) => (
														<MenuItem
															onClick={() => updateEventHandler({ _id: event._id, eventStatus: status })}
															key={status}
														>
															<Typography variant={'subtitle1'} component={'span'}>
																{status}
															</Typography>
														</MenuItem>
													))}
											</Menu>
										</>
									</TableCell>
								</TableRow>
							);
						})}
				</TableBody>
			</Table>
		</TableContainer>
	);
};
