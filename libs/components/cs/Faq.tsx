import React, { SyntheticEvent, useEffect, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { AccordionDetails, Stack, ListItem, Typography } from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { GET_ALL_NOTICES } from '../../../apollo/admin/query';
import { useQuery } from '@apollo/client';
import { NoticiesInquiry } from '../../types/notice/notice.input';
import { Notice } from '../../types/notice/notice';
import { T } from '../../types/common';
import { NoticeField } from '../../enums/notice.enum';
import { NextPage } from 'next';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
	}),
);
const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />} {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#fff',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(180deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const Faq: NextPage = ({ initialInquiry, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [noticesInquiry, setNoticesInquiry] = useState<NoticiesInquiry>(initialInquiry);
	const [category, setCategory] = useState<any>(
		noticesInquiry?.search?.noticeField ? noticesInquiry?.search?.noticeField : 'FACILITY',
	);
	const [allNotices, setAllNotices] = useState<Notice[]>([]);

	const [expanded, setExpanded] = useState<string | false>('panel1');
	/** APOLLO REQUESTS **/

	const {
		loading: getNoticesLoading,
		data: getNoticesData,
		error: getNoticesError,
		refetch: getNoticesRefetch,
	} = useQuery(GET_ALL_NOTICES, {
		fetchPolicy: 'network-only',
		variables: { input: noticesInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAllNotices(data?.getNotices?.list || []);
		},
	});
	/** LIFECYCLES **/

	useEffect(() => {
		getNoticesRefetch({ input: noticesInquiry });
	}, [noticesInquiry]);

	/** HANDLERS **/

	const tabChangeHandler = async (event: any, newValue: string) => {
		setCategory(newValue);

		setNoticesInquiry({ ...noticesInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'FACILITY':
				setNoticesInquiry({ ...noticesInquiry, search: { noticeField: NoticeField.FACILITY } });
				break;
			case 'AGENTS':
				setNoticesInquiry({ ...noticesInquiry, search: { noticeField: NoticeField.AGENTS } });
				break;
			case 'BUYERS':
				setNoticesInquiry({ ...noticesInquiry, search: { noticeField: NoticeField.BUYERS } });
				break;
			case 'COMMUNITY':
				setNoticesInquiry({ ...noticesInquiry, search: { noticeField: NoticeField.COMMUNITY } });
				break;
			case 'MEMBERSHIP':
				setNoticesInquiry({ ...noticesInquiry, search: { noticeField: NoticeField.MEMBERSHIP } });
				break;
			case 'OTHER':
				setNoticesInquiry({ ...noticesInquiry, search: { noticeField: NoticeField.OTHER } });
				break;
			case 'PAYMENT':
				setNoticesInquiry({ ...noticesInquiry, search: { noticeField: NoticeField.PAYMENT } });
				break;
			default:
				setNoticesInquiry({ ...noticesInquiry, search: { noticeField: NoticeField.FACILITY } });
				break;
		}
	};

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	if (device === 'mobile') {
		return (
			<Stack
				className="faq-content"
				sx={{
					padding: '10px',
					gap: '20px',
					backgroundColor: '#f9f9f9',
				}}
			>
				<Stack
					className="categories"
					component="div"
					sx={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'flex-start',
						alignItems: 'center',
						gap: 2,
						flexWrap: 'nowrap',
						padding: '10px',
						borderRadius: '12px',
						backgroundColor: '#ffffff',
						boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
						overflowX: 'auto',
					}}
				>
					{[
						{ label: 'FACILITY', value: 'FACILITY' },
						{ label: 'PAYMENT', value: 'PAYMENT' },
						{ label: 'AGENTS', value: 'AGENTS' },
						{ label: 'MEMBERSHIP', value: 'MEMBERSHIP' },
						{ label: 'COMMUNITY', value: 'COMMUNITY' },
						{ label: 'BUYERS', value: 'BUYERS' },
						{ label: 'OTHER', value: 'OTHER' },
					].map((item) => (
						<ListItem
							key={item.value}
							onClick={(e) => tabChangeHandler(e, item.value)}
							className={category === item.value ? 'active' : ''}
							sx={{
								cursor: 'pointer',
								padding: '8px 12px',
								borderRadius: '8px',
								fontWeight: 'bold',
								textAlign: 'center',
								backgroundColor: category === item.value ? '#1976d2' : '#fff',
								color: category === item.value ? '#fff' : '#1976d2',
								border: '1px solid #1976d2',
								transition: 'all 0.3s ease',
								whiteSpace: 'nowrap',
								'&:hover': {
									backgroundColor: '#1976d2',
									color: '#fff',
								},
							}}
						>
							{item.label}
						</ListItem>
					))}
				</Stack>

				<Stack
					className="wrap"
					component="div"
					sx={{
						marginTop: '20px',
					}}
				>
					{allNotices.length !== 0 ? (
						allNotices.map((notice: Notice) => (
							<Accordion
								expanded={expanded === notice._id}
								onChange={handleChange(notice._id)}
								key={notice._id}
								sx={{
									borderRadius: '8px',
									overflow: 'hidden',
									boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
									marginBottom: '10px',
									backgroundColor: '#ffffff',
									border: '1px solid #e0e0e0',
								}}
							>
								<AccordionSummary
									id={`panel-${notice._id}`}
									aria-controls={`panel-${notice._id}-content`}
									sx={{
										backgroundColor: '#f9f9f9',
										padding: '12px',
										'&:hover': { backgroundColor: '#f1f1f1' },
									}}
								>
									<Stack direction="row" spacing={2} alignItems="center">
										<Typography
											sx={{
												fontWeight: 'bold',
												fontSize: '1rem',
												color: '#1976d2',
												backgroundColor: '#e3f2fd',
												padding: '4px 8px',
												borderRadius: '8px',
											}}
										>
											Q
										</Typography>
										<Typography
											sx={{
												fontWeight: 'bold',
												fontSize: '0.95rem',
												color: '#333',
											}}
										>
											{notice.noticeTitle}
										</Typography>
									</Stack>
								</AccordionSummary>
								<AccordionDetails
									sx={{
										backgroundColor: '#f7f7f7',
										padding: '12px',
									}}
								>
									<Typography
										sx={{
											fontSize: '0.9rem',
											lineHeight: 1.5,
											color: '#555',
											paddingLeft: '16px',
											borderLeft: '4px solid #1976d2',
										}}
									>
										{notice.noticeContent}
									</Typography>
								</AccordionDetails>
							</Accordion>
						))
					) : (
						<Stack
							sx={{
								textAlign: 'center',
								padding: '20px',
								borderRadius: '8px',
								backgroundColor: '#fff',
								boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
							}}
						>
							<Typography variant="h6" color="textSecondary">
								No FAQs are available for this category at the moment.
							</Typography>
						</Stack>
					)}
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'faq-content'}>
				<Stack
					className="categories"
					component="div"
					sx={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
						gap: 2,
						flexWrap: 'nowrap',
						padding: '1rem',
						borderRadius: 2,
						backgroundColor: '#f5f5f5',
						boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
						overflowX: 'auto',
					}}
				>
					{[
						{ label: 'FACILITY', value: 'FACILITY' },
						{ label: 'PAYMENT', value: 'PAYMENT' },
						{ label: 'AGENTS', value: 'AGENTS' },
						{ label: 'MEMBERSHIP', value: 'MEMBERSHIP' },
						{ label: 'COMMUNITY', value: 'COMMUNITY' },
						{ label: 'BUYERS', value: 'BUYERS' },
						{ label: 'OTHER', value: 'OTHER' },
					].map((item) => (
						<ListItem
							key={item.value}
							onClick={(e) => tabChangeHandler(e, item.value)}
							className={category === item.value ? 'active' : ''}
							sx={{
								cursor: 'pointer',
								padding: '0.5rem 1rem',
								borderRadius: 2,
								fontWeight: 'bold',
								textAlign: 'center',
								backgroundColor: category === item.value ? '#1976d2' : '#fff',
								color: category === item.value ? '#fff' : '#1976d2',
								border: '1px solid #1976d2',
								transition: 'all 0.3s ease',
								whiteSpace: 'nowrap',
								'&:hover': {
									backgroundColor: '#1976d2',
									color: '#fff',
								},
							}}
						>
							{item.label}
						</ListItem>
					))}
				</Stack>

				<Stack className="wrap" component="div" sx={{ mt: 4 }}>
					{allNotices.length !== 0 ? (
						allNotices.map((notice: Notice) => (
							<Accordion
								expanded={expanded === notice._id}
								onChange={handleChange(notice._id)}
								key={notice._id}
								sx={{
									borderRadius: 2,
									overflow: 'hidden',
									boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
									mb: 2,
									backgroundColor: '#ffffff',
									border: '1px solid #e0e0e0',
								}}
							>
								<AccordionSummary
									id={`panel-${notice._id}`}
									aria-controls={`panel-${notice._id}-content`}
									sx={{
										backgroundColor: '#f9f9f9',
										padding: '1rem',
										'&:hover': { backgroundColor: '#f1f1f1' },
									}}
								>
									<Stack direction="row" spacing={2} alignItems="center">
										<Typography
											sx={{
												fontWeight: 'bold',
												fontSize: '1.2rem',
												color: '#1976d2',
												backgroundColor: '#e3f2fd',

												borderRadius: '12px',
											}}
										>
											Q
										</Typography>
										<Typography sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333' }}>
											{notice.noticeTitle}
										</Typography>
									</Stack>
								</AccordionSummary>
								<AccordionDetails sx={{ backgroundColor: '#f7f7f7' }}>
									<Typography
										sx={{
											fontSize: '1rem',
											lineHeight: 1.5,
											color: '#555',
											paddingLeft: '2rem',
											borderLeft: '4px solid #1976d2',
										}}
									>
										{notice.noticeContent}
									</Typography>
								</AccordionDetails>
							</Accordion>
						))
					) : (
						<Stack
							sx={{
								textAlign: 'center',
								padding: '2rem',
								borderRadius: 2,
								backgroundColor: '#fff',
								boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
							}}
						>
							<Typography variant="h6" color="textSecondary">
								No FAQs are available for this category at the moment.
							</Typography>
						</Stack>
					)}
				</Stack>
			</Stack>
		);
	}
};

Faq.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			noticeField: 'FACILITY',
		},
	},
};

export default Faq;
