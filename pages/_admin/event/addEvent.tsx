import React, { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Typography, Stack, TextField } from '@mui/material';
import { useMutation } from '@apollo/client';
import { CREATE_EVENT } from '../../../apollo/admin/mutation';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../../libs/sweetAlert';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { EventStatus } from '../../../libs/enums/event.enum';
import { EventInput } from '../../../libs/types/event/event.input';
import axios from 'axios';
import { getJwtToken } from '../../../libs/auth';
import useDeviceDetect from '../../../libs/hooks/useDeviceDetect';
import { REACT_APP_API_URL } from '../../../libs/config';

const CreateEvent = ({ initialValues, ...props }: any) => {
	const router = useRouter();
	const device = useDeviceDetect();
	const inputRef = useRef<any>(null);

	const [eventData, setEventData] = useState<EventInput>(initialValues);
	const token = getJwtToken();

	const [createEvent] = useMutation(CREATE_EVENT);
	async function uploadImages() {
		try {
			const formData = new FormData();
			const selectedFiles = inputRef.current.files;

			if (selectedFiles.length == 0) return false;
			if (selectedFiles.length > 5) throw new Error('Cannot upload more than 5 images!');

			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) { 
						imagesUploader(files: $files, target: $target)
				  }`,
					variables: {
						files: [null, null, null, null, null],
						target: 'facility',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.files.0'],
					'1': ['variables.files.1'],
					'2': ['variables.files.2'],
					'3': ['variables.files.3'],
					'4': ['variables.files.4'],
				}),
			);
			for (const key in selectedFiles) {
				if (/^\d+$/.test(key)) formData.append(`${key}`, selectedFiles[key]);
			}

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImages = response.data.data.imagesUploader;

			console.log('+responseImages: ', responseImages);
			setEventData({ ...eventData, eventImages: responseImages });
		} catch (err: any) {
			console.log('err: ', err.message);
			await sweetMixinErrorAlert(err.message);
		}
	}

	/** Handlers **/

	const doDisabledCheck = () => {
		if (
			eventData.eventName === '' ||
			eventData.eventTopic === '' || // @ts-ignore
			eventData.eventDesc === '' || // @ts-ignore
			eventData.eventLocation === '' || // @ts-ignore
			eventData.eventStatus === '' || // @ts-ignore
			eventData.facilityBalconies === 0 ||
			eventData.eventImages.length === 0
		) {
			return true;
		}
	};

	const insertEventHandler = useCallback(async () => {
		try {
			const { eventName, eventTopic, eventDesc, eventStatus, eventLocation, eventImages } = eventData;

			if (!eventName || !eventTopic || !eventDesc || !eventStatus || !eventLocation || !eventImages.length) {
				throw new Error('All fields are required');
			}

			await createEvent({
				variables: {
					input: {
						eventName,
						eventTopic,
						eventDesc,
						eventStatus,
						eventLocation,
						eventImages,
					},
				},
			});

			await sweetMixinSuccessAlert('This event has been created successfully!');
			router.push('/_admin/event/listEvent');
		} catch (err) {
			sweetErrorHandling(err);
		}
	}, [eventData, createEvent, router]);

	if (device === 'mobile') {
		return <div>Add new Event MOBILE PAGE</div>;
	} else {
		return (
			<Stack
				sx={{ width: 600, margin: '0 auto', padding: 3, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 1 }}
			>
				<Typography variant="h1" component="h2" align="center" gutterBottom>
					Create Event
				</Typography>
				<Stack spacing={3}>
					{/* Name Field */}
					<TextField
						label="Event Name"
						variant="outlined"
						fullWidth
						value={eventData.eventName}
						onChange={(e) => setEventData({ ...eventData, eventName: e.target.value })}
					/>

					{/* Topic Field */}
					<TextField
						label="Event Topic"
						variant="outlined"
						fullWidth
						value={eventData.eventTopic}
						onChange={(e) => setEventData({ ...eventData, eventTopic: e.target.value })}
					/>

					{/* Description Field */}
					<TextField
						label="Event Description"
						variant="outlined"
						fullWidth
						value={eventData.eventDesc}
						onChange={(e) => setEventData({ ...eventData, eventDesc: e.target.value })}
					/>
					{/* Location Field */}
					<TextField
						label="Event Location"
						variant="outlined"
						fullWidth
						value={eventData.eventLocation}
						onChange={(e) => setEventData({ ...eventData, eventLocation: e.target.value })}
					/>

					{/* Upload Section */}
					<Stack>
						<Typography variant="body1" sx={{ marginBottom: 1 }}>
							Upload Images (Max: 5)
						</Typography>
						<Button
							variant="outlined"
							component="label"
							sx={{ display: 'block', textAlign: 'center', padding: 2, border: '2px dashed #ccc' }}
						>
							Drag & Drop or Click to Upload
							<input
								ref={inputRef}
								type="file"
								hidden
								multiple={true}
								accept="image/jpg, image/jpeg, image/png"
								onChange={uploadImages}
							/>
						</Button>
						{/* Display Uploaded Images */}
						<Stack direction="row" spacing={2} sx={{ marginTop: 2, overflowX: 'auto' }}>
							{eventData.eventImages.map((image: string) => {
								const imagePath: string = `${REACT_APP_API_URL}/${image}`;

								return (
									<Stack
										sx={{
											width: 80,
											height: 80,
											borderRadius: 1,
											backgroundImage: `url(${imagePath})`,
											backgroundSize: 'cover',
											backgroundPosition: 'center',
											border: '1px solid #ccc',
										}}
									/>
								);
							})}
						</Stack>
					</Stack>

					{/* Save Button */}
					<Button
						variant="contained"
						color="primary"
						fullWidth
						disabled={doDisabledCheck()}
						onClick={insertEventHandler}
					>
						Create Event
					</Button>
				</Stack>
			</Stack>
		);
	}
};

CreateEvent.defaultProps = {
	initialValues: {
		eventTitle: '',
		eventTopic: '',
		eventDesc: '',
		eventStatus: EventStatus.ACTIVE,
		eventLocation: '',
		eventImages: [],
	},
};

export default withAdminLayout(CreateEvent);
