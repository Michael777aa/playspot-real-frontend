import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/router';

import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Stack, Paper } from '@mui/material';
import { useMutation } from '@apollo/client';
import { CREATE_NOTICE } from '../../../apollo/admin/mutation';
import { NoticeCategory, NoticeField, NoticeStatus } from '../../../libs/enums/notice.enum';
import { MemberType } from '../../../libs/enums/member.enum';
import { NoticeInput } from '../../../libs/types/notice/notice.input';
import { sweetErrorHandling, sweetMixinSuccessAlert } from '../../../libs/sweetAlert';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';

const AddNotice = ({ initialValues, ...props }: any) => {
	const router = useRouter();
	const [noticeData, setNoticeData] = useState<NoticeInput>(initialValues);
	const [categories] = useState<NoticeCategory[]>(Object.values(NoticeCategory));
	const [fields] = useState<NoticeField[]>(Object.values(NoticeField));
	const [audiences] = useState<MemberType[]>(Object.values(MemberType));

	const [createNotice] = useMutation(CREATE_NOTICE);

	/** Handlers **/
	const handleInputChange = (key: keyof NoticeInput, value: any) => {
		setNoticeData((prev) => ({ ...prev, [key]: value }));
	};

	const handleCreateNotice = useCallback(async () => {
		try {
			const { targetAudience, ...notice } = noticeData;
			const noticePayload = targetAudience ? { ...notice, targetAudience } : { ...notice };

			await createNotice({
				variables: { input: noticePayload },
			});

			await sweetMixinSuccessAlert('Notice created successfully!');
			router.push('/_admin/cs/faq');
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	}, [noticeData]);

	return (
		<Stack
			component="div"
			sx={{
				backgroundColor: '#f4f6f9',
				minHeight: 'auto',
				padding: '3rem',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Paper
				elevation={4}
				sx={{
					width: '100%',
					maxWidth: '1000px',
					padding: '2rem',
					borderRadius: '12px',
					display: 'flex',
					gap: '2rem',
					backgroundColor: '#ffffff',
				}}
			>
				{/* Form Section */}
				<Stack sx={{ flex: 2 }}>
					<Typography variant="h4" fontWeight="bold" gutterBottom>
						Create Notice
					</Typography>
					<Typography variant="subtitle1" color="textSecondary" sx={{ mb: 4 }}>
						Fill in the details below to create a new notice.
					</Typography>

					<Stack spacing={3}>
						<TextField
							label="Title"
							variant="outlined"
							fullWidth
							value={noticeData.noticeTitle}
							onChange={(e) => handleInputChange('noticeTitle', e.target.value)}
						/>

						<TextField
							label="Content"
							variant="outlined"
							fullWidth
							minRows={4}
							value={noticeData.noticeContent}
							onChange={(e) => handleInputChange('noticeContent', e.target.value)}
						/>

						<FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
							<InputLabel id="category-label" sx={{ fontWeight: 'bold' }}>
								Category
							</InputLabel>
							<Select
								labelId="category-label"
								value={noticeData.noticeCategory}
								onChange={(e) => handleInputChange('noticeCategory', e.target.value)}
								label="Category"
								sx={{
									borderRadius: 1,
									'&:hover .MuiOutlinedInput-notchedOutline': {},
									'&.Mui-focused .MuiOutlinedInput-notchedOutline': {},
								}}
							>
								{categories.map((category) => (
									<MenuItem key={category} value={category}>
										{category}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
							<InputLabel id="category-label" sx={{ fontWeight: 'bold' }}>
								Field
							</InputLabel>
							<Select
								labelId="category-label"
								value={noticeData.noticeField}
								onChange={(e) => handleInputChange('noticeField', e.target.value)}
								label="Category"
								sx={{
									borderRadius: 1,
									'&:hover .MuiOutlinedInput-notchedOutline': {},
									'&.Mui-focused .MuiOutlinedInput-notchedOutline': {},
								}}
							>
								{fields.map((field) => (
									<MenuItem key={field} value={field}>
										{field}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Stack>

					<Button
						variant="contained"
						color="primary"
						size="large"
						onClick={handleCreateNotice}
						sx={{
							width: '100%',
							padding: '12px',
							marginTop: '2rem',
							borderRadius: '10px',
							fontWeight: 'bold',
							boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
						}}
					>
						Create Notice
					</Button>
				</Stack>

				{/* Target Audience Side Panel */}
				<Stack
					sx={{
						flex: 1,
						padding: '1rem',
						borderRadius: '12px',
						backgroundColor: '#f9f9f9',
						boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
						display: 'flex',
						flexDirection: 'column',
						gap: '1rem',
					}}
				>
					<Typography variant="h6" fontWeight="bold" gutterBottom>
						Target Audience (Optional)
					</Typography>
					<Typography variant="body2" color="textSecondary">
						Select the target audience for this notice specifically for members. If you choose a specific user type
						here, the message will only be delivered to all those selected members. Use this field thoughtfully,
						especially for critical announcements.
					</Typography>
					<Typography variant="h6" fontWeight="bold" gutterBottom>
						Note: This field is optional
					</Typography>
					<FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
						<InputLabel id="category-label" sx={{ fontWeight: 'bold' }}>
							Audience
						</InputLabel>
						<Select
							labelId="category-label"
							value={noticeData.targetAudience || ''}
							onChange={(e) => handleInputChange('targetAudience', e.target.value)}
							label="Category"
							sx={{
								borderRadius: 1,
								'&:hover .MuiOutlinedInput-notchedOutline': {},
								'&.Mui-focused .MuiOutlinedInput-notchedOutline': {},
							}}
						>
							{audiences.map((audience) => (
								<MenuItem key={audience} value={audience}>
									{audience}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Stack>
			</Paper>
		</Stack>
	);
};

AddNotice.defaultProps = {
	initialValues: {
		noticeTitle: '',
		noticeField: '',
		noticeCategory: '',
		noticeStatus: NoticeStatus.ACTIVE,
		noticeContent: '',
		targetAudience: '',
	},
};

export default withAdminLayout(AddNotice);
