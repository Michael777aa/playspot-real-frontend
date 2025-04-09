import React from 'react';
import { Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Comment } from '../../types/comment/comment';
import { REACT_APP_API_URL } from '../../config';
import Moment from 'react-moment';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface ReviewProps {
	comment: Comment;
}

const Review = (props: ReviewProps) => {
	const { comment } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const imagePath: string = comment?.memberData?.memberImage
		? `${REACT_APP_API_URL}/${comment?.memberData?.memberImage}`
		: '/img/profile/defaultUserr.svg';

	/** HANDLERS **/
	const goMemberPage = (id: string) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};
	if (device === 'mobile') {
		return (
			<Stack
				className="review-config"
				style={{
					padding: '15px',
					backgroundColor: '#f9f9f9',
					borderRadius: '8px',
					boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
					marginBottom: '10px',
					gap: '10px',
				}}
			>
				{/* Reviewer Info */}
				<Stack
					className="review-mb-info"
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						gap: '10px',
					}}
				>
					<Stack
						className="img-name-box"
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							gap: '10px',
						}}
					>
						<img
							src={imagePath}
							alt=""
							className="img-box"
							style={{
								width: '50px',
								height: '50px',
								borderRadius: '50%',
								objectFit: 'cover',
								boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
							}}
						/>
						<Stack>
							<Typography
								className="name"
								onClick={() => goMemberPage(comment?.memberData?._id as string)}
								style={{
									fontSize: '1rem',
									fontWeight: '600',
									color: '#333',
									cursor: 'pointer',
								}}
							>
								{comment.memberData?.memberNick}
							</Typography>
							<Typography
								className="date"
								style={{
									fontSize: '0.8rem',
									color: '#777',
								}}
							>
								<Moment format={'DD MMMM, YYYY'}>{comment.createdAt}</Moment>
							</Typography>
						</Stack>
					</Stack>
				</Stack>

				{/* Review Content */}
				<Stack
					className="desc-box"
					style={{
						marginTop: '5px',
					}}
				>
					<Typography
						className="description"
						style={{
							fontSize: '0.9rem',
							color: '#555',
							lineHeight: '1.5',
						}}
					>
						{comment.commentContent}
					</Typography>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'review-config'}>
				<Stack className={'review-mb-info'}>
					<Stack className={'img-name-box'}>
						<img src={imagePath} alt="" className={'img-box'} />
						<Stack>
							<Typography className={'name'} onClick={() => goMemberPage(comment?.memberData?._id as string)}>
								{comment.memberData?.memberNick}
							</Typography>
							<Typography className={'date'}>
								<Moment format={'DD MMMM, YYYY'}>{comment.createdAt}</Moment>
							</Typography>
						</Stack>
					</Stack>
				</Stack>
				<Stack className={'desc-box'}>
					<Typography className={'description'}>{comment.commentContent}</Typography>
				</Stack>
			</Stack>
		);
	}
};

export default Review;
