import React, { useState } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Typography, Stack } from '@mui/material';
import CommunityCard from './CommunityCard';
import { BoardArticle } from '../../types/board-article/board-article';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { useTranslation } from 'next-i18next';

const CommunityBoards = () => {
	const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');
	const [newsArticles, setNewsArticles] = useState<BoardArticle[]>([]);
	const [freeArticles, setFreeArticles] = useState<BoardArticle[]>([]);
	const [humorArticles, setHumorArticles] = useState<BoardArticle[]>([]);
	const [recommendedArticles, setRecommendedArticles] = useState<BoardArticle[]>([]);
	const [searchCommunity, setSearchCommunity] = useState({
		page: 1,
		limit: 12,
		sort: 'articleViews',
		direction: 'DESC',
		search: {},
	});
	const {
		loading: getBoardsLoading,
		data: getAgentsData,
		error: getAgentsError,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchCommunity },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			const articles = data?.getBoardArticles?.list || [];
			setNewsArticles(articles.filter((article: T) => article.articleCategory === 'NEWS').slice(0, 3));
			setHumorArticles(articles.filter((article: T) => article.articleCategory === 'HUMOR').slice(0, 3));
			setRecommendedArticles(articles.filter((article: T) => article.articleCategory === 'RECOMMEND').slice(0, 3));
			setFreeArticles(articles.filter((article: T) => article.articleCategory === 'FREE').slice(0, 3));
		},
	});

	if (getBoardsLoading) return <div>Loading...</div>;
	if (getAgentsError) return <div>Error loading community boards: {getAgentsError.message}</div>;

	if (device === 'mobile') {
		return (
			<Stack
				style={{
					padding: '20px',
					width: '100%',
					backgroundColor: '#f9f9f9',
				}}
			>
				<Typography
					variant="h6"
					style={{
						fontSize: '20px',
						fontWeight: 'bold',
						marginBottom: '15px',
						color: '#333',
						textAlign: 'center',
					}}
				>
					{t('Community Board Highlights')}
				</Typography>

				{[
					{ title: 'News', articles: newsArticles, category: 'NEWS' },
					{ title: 'Recommendation', articles: recommendedArticles, category: 'RECOMMEND' },
					{ title: 'Humour', articles: humorArticles, category: 'HUMOR' },
					{ title: 'Free', articles: freeArticles, category: 'FREE' },
				].map(({ title, articles, category }, idx) => (
					<Stack key={idx} style={{ marginBottom: '20px' }}>
						<Stack
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginBottom: '10px',
							}}
						>
							<Typography
								style={{
									fontSize: '18px',
									fontWeight: '600',
									color: '#555',
								}}
							>
								{title}
							</Typography>
							<Link
								href={`/community?articleCategory=${category}`}
								style={{
									fontSize: '14px',
									color: '#1976d2',
									textDecoration: 'none',
									fontWeight: 'bold',
								}}
							>
								{t('See All')}
							</Link>
						</Stack>

						<Stack
							style={{
								gap: '15px',
								display: 'flex',
								flexDirection: 'row',
								overflowX: 'auto',
								paddingBottom: '10px',
							}}
						>
							{articles.length > 0 ? (
								articles.map((article, index) => (
									<Stack
										key={article._id}
										style={{
											minWidth: '370px',
											maxWidth: '200px',
											padding: '10px',
											border: '1px solid #ddd',
											borderRadius: '8px',
											backgroundColor: '#fff',
											boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
											textAlign: 'center',
										}}
									>
										<CommunityCard vertical={true} article={article} index={index} />
									</Stack>
								))
							) : (
								<Stack
									style={{
										padding: '15px',
										backgroundColor: '#f5f5f5',
										borderRadius: '8px',
										textAlign: 'center',
										color: '#777',
										fontSize: '14px',
									}}
								>
									Not available currently
								</Stack>
							)}
						</Stack>
					</Stack>
				))}
			</Stack>
		);
	} else {
		return (
			<Stack className="community-board">
				<Stack className="container">
					<Stack>
						<Typography variant="h1"> {t('Community Board Highlights')}</Typography>
					</Stack>
					<Stack className="community-main">
						<Stack className="community-left">
							<Stack className="content-top">
								<Link href="/community?articleCategory=NEWS">
									<span>News</span>
									<img src="/img/icons/arrowBig.svg" alt="" />
								</Link>
							</Stack>
							<Stack className="card-wrap">
								{newsArticles.length > 0 ? (
									newsArticles.map((article, index) => (
										<CommunityCard vertical={true} article={article} index={index} key={article._id} />
									))
								) : (
									<Stack
										textAlign="center"
										position={'relative'}
										left={'60px'}
										p={1}
										border="1px solid #ddd"
										borderRadius={2}
									>
										<Typography variant="h6" color="textSecondary">
											not available currently
										</Typography>
									</Stack>
								)}
							</Stack>
						</Stack>
						<Stack className="community-left">
							<Stack className="content-top">
								<Link href="/community?articleCategory=RECOMMEND">
									<span>Recommendation</span>
									<img src="/img/icons/arrowBig.svg" alt="" />
								</Link>
							</Stack>
							<Stack className="card-wrap">
								{recommendedArticles.length > 0 ? (
									recommendedArticles.map((article, index) => (
										<CommunityCard vertical={true} article={article} index={index} key={article._id} />
									))
								) : (
									<Stack
										textAlign="center"
										position={'relative'}
										top={'4px'}
										left={'75px'}
										p={1}
										border="1px solid #ddd"
										borderRadius={2}
									>
										<Typography variant="h6" color="textSecondary">
											not available currently
										</Typography>
									</Stack>
								)}
							</Stack>
						</Stack>
						<Stack className="community-left">
							<Stack className="content-top">
								<Link href="/community?articleCategory=HUMOR">
									<span>Humour</span>
									<img src="/img/icons/arrowBig.svg" alt="" />
								</Link>
							</Stack>
							<Stack className="card-wrap">
								{humorArticles.length > 0 ? (
									humorArticles.map((article, index) => (
										<CommunityCard vertical={true} article={article} index={index} key={article._id} />
									))
								) : (
									<Stack
										textAlign="center"
										position={'relative'}
										top={'4px'}
										left={'75px'}
										p={1}
										border="1px solid #ddd"
										borderRadius={2}
									>
										<Typography variant="h6" color="textSecondary">
											not available currently
										</Typography>
									</Stack>
								)}
							</Stack>
						</Stack>
						<Stack className="community-right">
							<Stack className="content-top">
								<Link href="/community?articleCategory=FREE">
									<span>Free</span>
									<img src="/img/icons/arrowBig.svg" alt="" />
								</Link>
							</Stack>
							<Stack className="card-wrap vertical">
								{freeArticles.length > 0 ? (
									freeArticles.map((article, index) => (
										<CommunityCard vertical={false} article={article} index={index} key={article._id} />
									))
								) : (
									<Stack
										textAlign="center"
										position={'relative'}
										top={'4px'}
										left={'75px'}
										p={1}
										border="1px solid #ddd"
										borderRadius={2}
									>
										<Typography variant="h6" color="textSecondary">
											not available currently
										</Typography>
									</Stack>
								)}
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default CommunityBoards;
