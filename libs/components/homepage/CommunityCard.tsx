import React from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography } from '@mui/material';
import Moment from 'react-moment';
import { BoardArticle } from '../../types/board-article/board-article';

interface CommunityCardProps {
	vertical: boolean;
	article: BoardArticle;
	index: number;
}

const CommunityCard = ({ vertical, article, index }: CommunityCardProps) => {
	const device = useDeviceDetect();
	const articleImage = article?.articleImage
		? `${process.env.REACT_APP_API_URL}/${article.articleImage}`
		: '/img/events/SPORTS.webp';

	if (!article) {
		return null;
	}

	if (device === 'mobile') {
		return (
			<Link href={`/community/detail?articleCategory=${article.articleCategory}&id=${article._id}`} passHref>
				<Stack
					component="div"
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						backgroundColor: '#fff',
						borderRadius: '10px',
						overflow: 'hidden',
						boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
						textAlign: 'center',
						width: '100%',
						padding: '10px',
					}}
				>
					<div
						style={{
							width: '100%',
							height: '150px',
							backgroundImage: `url(${articleImage})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							borderRadius: '10px 10px 0 0',
							marginBottom: '10px',
						}}
					></div>
					<Typography
						variant="h6"
						style={{
							fontSize: '16px',
							fontWeight: 'bold',
							color: '#333',
							marginBottom: '5px',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
						}}
					>
						{article.articleTitle}
					</Typography>
					<Typography
						variant="caption"
						style={{
							fontSize: '12px',
							color: '#777',
						}}
					>
						<Moment format="DD.MM.YY">{article.createdAt}</Moment>
					</Typography>
				</Stack>
			</Link>
		);
	} else {
		return (
			<Link href={`/community/detail?articleCategory=${article.articleCategory}&id=${article._id}`} passHref>
				<Stack component="div" className={vertical ? 'vertical-card' : 'horizontal-card'}>
					{vertical ? (
						<>
							<div className="community-img" style={{ backgroundImage: `url(${articleImage})` }}></div>
							<strong>{article.articleTitle}</strong>

							<span className="time">
								<Moment format="DD.MM.YY">{article.createdAt}</Moment>
							</span>
						</>
					) : (
						<>
							<img src={articleImage} alt={`${article.articleTitle} thumbnail`} />

							<strong>{article.articleTitle}</strong>

							<span>
								<Moment format="DD.MM.YY">{article.createdAt}</Moment>
							</span>
						</>
					)}
				</Stack>
			</Link>
		);
	}
};

export default CommunityCard;
