import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Tab, Typography, Button, Pagination } from '@mui/material';
import CommunityCard from '../../libs/components/common/CommunityCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticlesInquiry } from '../../libs/types/board-article/board-article.input';
import { BoardArticleCategory } from '../../libs/enums/board-article.enum';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../apollo/user/mutation';
import { useMutation, useQuery } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../apollo/user/query';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Community: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;
	const articleCategory = query?.articleCategory as string;
	const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>(initialInput);
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	if (articleCategory) initialInput.search.articleCategory = articleCategory;

	/** APOLLO REQUESTS **/

	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	const {
		loading: boardArticlesLoading,
		data: boardArticlesData,
		error: boardArticlesError,
		refetch: boardArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchCommunity },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBoardArticles(data?.getBoardArticles?.list);
			setTotalCount(data?.getBoardArticles?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (!query?.articleCategory)
			router.push(
				{
					pathname: router.pathname,
					query: { articleCategory: 'FREE' },
				},
				router.pathname,
				{ shallow: true },
			);
	}, []);

	/** HANDLERS **/
	const tabChangeHandler = async (e: T, value: string) => {
		console.log(value);

		setSearchCommunity({ ...searchCommunity, page: 1, search: { articleCategory: value as BoardArticleCategory } });
		await router.push(
			{
				pathname: '/community',
				query: { articleCategory: value },
			},
			router.pathname,
			{ shallow: true },
		);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
	};

	const likeArticleHandler = async (e: any, user: any, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetBoardArticle({ variables: { input: id } });

			await boardArticlesRefetch({ input: searchCommunity });
		} catch (err: any) {
			console.log('Erron on likeArticleandler', err);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return (
			<TabContext value={searchCommunity.search.articleCategory}>
				<div
					id="community-list-page"
					style={{
						width: '100%',
						padding: '10px',
						marginTop: '55px',
						backgroundColor: '#f9f9f9',
					}}
				>
					<div
						className="container"
						style={{
							maxWidth: '100%',
							margin: '0 auto',
							display: 'flex',
							flexDirection: 'column',
							gap: '15px',
						}}
					>
						<Stack
							className="main-box"
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: '20px',
							}}
						>
							{/* Left Config */}
							<Stack
								className="left-config"
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: '15px',
								}}
							>
								<Stack
									className="image-info"
									style={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
									}}
								>
									<img
										src="/img/logo/2024-10-19 21.42.01.jpg"
										alt="Community Logo"
										style={{
											width: '80px',
											height: '80px',
											borderRadius: '50%',
											objectFit: 'cover',
										}}
									/>
									<Typography
										className="community-name"
										style={{
											marginTop: '10px',
											fontSize: '1.2rem',
											fontWeight: '600',
											color: '#333',
										}}
									>
										PlaySpot Community
									</Typography>
								</Stack>

								{/* Tabs */}
								<TabList
									orientation="horizontal"
									aria-label="community tabs"
									TabIndicatorProps={{
										style: { display: 'none' },
									}}
									onChange={tabChangeHandler}
									style={{
										display: 'flex',
										gap: '10px',
										overflowX: 'auto',
										padding: '10px 0',
										borderBottom: '2px solid #e0e0e0',
									}}
								>
									{['FREE', 'RECOMMEND', 'NEWS', 'HUMOR'].map((value) => (
										<Tab
											key={value}
											value={value}
											label={value}
											style={{
												padding: '8px 12px',
												borderRadius: '6px',
												fontSize: '14px',
												fontWeight: '600',
												textTransform: 'none',
												color: searchCommunity.search.articleCategory === value ? '#ffffff' : '#333',
												backgroundColor: searchCommunity.search.articleCategory === value ? '#007bff' : '#f4f4f4',
												transition: 'background-color 0.3s ease, color 0.3s ease',
											}}
										/>
									))}
								</TabList>
							</Stack>

							{/* Right Config */}
							<Stack
								className="right-config"
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: '15px',
								}}
							>
								{/* Panel Config */}
								<Stack
									className="panel-config"
									style={{
										display: 'flex',
										flexDirection: 'column',
										gap: '15px',
									}}
								>
									{/* Title Stack */}
									<Stack
										className="title-box"
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
										}}
									>
										<Stack
											className="left"
											style={{
												display: 'flex',
												flexDirection: 'column',
											}}
										>
											<Typography
												className="title"
												style={{
													fontSize: '1.2rem',
													fontWeight: '600',
													color: '#333',
												}}
											>
												{searchCommunity.search.articleCategory} BOARD
											</Typography>
											<Typography
												className="sub-title"
												style={{
													fontSize: '0.9rem',
													color: '#666',
												}}
											>
												Share your thoughts openly without limitations
											</Typography>
										</Stack>
										<Button
											onClick={() =>
												router.push({
													pathname: '/mypage',
													query: {
														category: 'writeArticle',
													},
												})
											}
											style={{
												padding: '8px 16px',
												backgroundColor: '#007bff',
												color: '#fff',
												fontWeight: '600',
												borderRadius: '8px',
											}}
										>
											Write
										</Button>
									</Stack>

									{/* Tab Panels */}
									{['FREE', 'RECOMMEND', 'NEWS', 'HUMOR'].map((value) => (
										<TabPanel key={value} value={value}>
											<Stack
												className="list-box"
												style={{
													display: 'flex',
													flexDirection: 'column',
													gap: '15px',
												}}
											>
												{totalCount ? (
													boardArticles?.map((boardArticle: BoardArticle) => (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													))
												) : (
													<Stack
														className="no-data"
														style={{
															display: 'flex',
															flexDirection: 'column',
															alignItems: 'center',
															gap: '10px',
														}}
													>
														<img
															src="/img/icons/icoAlert.svg"
															alt="No data"
															style={{
																width: '50px',
																height: '50px',
															}}
														/>
														<p style={{ fontSize: '0.9rem', color: '#777' }}>No Article found!</p>
													</Stack>
												)}
											</Stack>
										</TabPanel>
									))}
								</Stack>
							</Stack>
						</Stack>

						{/* Pagination */}
						{totalCount > 0 && (
							<Stack
								className="pagination-config"
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: '10px',
									marginTop: '20px',
								}}
							>
								<Pagination
									count={Math.ceil(totalCount / searchCommunity.limit)}
									page={searchCommunity.page}
									shape="circular"
									color="primary"
									onChange={paginationHandler}
								/>
								<Typography
									style={{
										fontSize: '0.9rem',
										color: '#555',
									}}
								>
									Total {totalCount} article{totalCount > 1 ? 's' : ''} available
								</Typography>
							</Stack>
						)}
					</div>
				</div>
			</TabContext>
		);
	} else {
		return (
			<div id="community-list-page">
				<div className="container">
					<TabContext value={searchCommunity.search.articleCategory}>
						<Stack className="main-box">
							<Stack className="left-config">
								<Stack className={'image-info'}>
									<img src={'/img/logo/2024-10-19 21.42.01.jpg'} />
									<Stack className={'community-name'}>
										<Typography className={'name'}>PlaySpot Community</Typography>
									</Stack>
								</Stack>

								<TabList
									orientation="horizontal"
									aria-label="community tabs"
									TabIndicatorProps={{
										style: { display: 'none' }, // Hide the default tab indicator
									}}
									onChange={tabChangeHandler}
									style={{
										display: 'flex',
										marginTop: '10px',
										gap: '16px',
										borderBottom: '2px solid #e0e0e0',
										paddingBottom: '8px',
									}}
								>
									<Tab
										value="FREE"
										label="Free Board"
										className={`tab-button ${searchCommunity.search.articleCategory === 'FREE' ? 'active' : ''}`}
										style={{
											padding: '10px 20px',
											borderRadius: '6px',
											fontSize: '14px',
											width: '300px',
											marginRight: 20,
											fontWeight: '600',
											textTransform: 'none',
											color: searchCommunity.search.articleCategory === 'FREE' ? '#ffffff' : '#333',
											backgroundColor: searchCommunity.search.articleCategory === 'FREE' ? '#007bff' : '#f4f4f4',
											transition: 'background-color 0.3s ease, color 0.3s ease',
										}}
									/>
									<Tab
										value="RECOMMEND"
										label="Recommendation"
										className={`tab-button ${searchCommunity.search.articleCategory === 'RECOMMEND' ? 'active' : ''}`}
										style={{
											padding: '10px 20px',
											borderRadius: '6px',
											width: '300px',
											marginRight: 20,
											fontSize: '14px',
											fontWeight: '600',
											textTransform: 'none',
											color: searchCommunity.search.articleCategory === 'RECOMMEND' ? '#ffffff' : '#333',
											backgroundColor: searchCommunity.search.articleCategory === 'RECOMMEND' ? '#007bff' : '#f4f4f4',
											transition: 'background-color 0.3s ease, color 0.3s ease',
										}}
									/>
									<Tab
										value="NEWS"
										label="News"
										className={`tab-button ${searchCommunity.search.articleCategory === 'NEWS' ? 'active' : ''}`}
										style={{
											padding: '10px 20px',
											width: '300px',
											marginRight: 20,
											borderRadius: '6px',
											fontSize: '14px',
											fontWeight: '600',
											textTransform: 'none',
											color: searchCommunity.search.articleCategory === 'NEWS' ? '#ffffff' : '#333',
											backgroundColor: searchCommunity.search.articleCategory === 'NEWS' ? '#007bff' : '#f4f4f4',
											transition: 'background-color 0.3s ease, color 0.3s ease',
										}}
									/>
									<Tab
										value="HUMOR"
										label="Humor"
										className={`tab-button ${searchCommunity.search.articleCategory === 'HUMOR' ? 'active' : ''}`}
										style={{
											padding: '10px 20px',
											borderRadius: '6px',
											width: '300px',
											fontSize: '14px',
											fontWeight: '600',
											textTransform: 'none',
											color: searchCommunity.search.articleCategory === 'HUMOR' ? '#ffffff' : '#333',
											backgroundColor: searchCommunity.search.articleCategory === 'HUMOR' ? '#007bff' : '#f4f4f4',
											transition: 'background-color 0.3s ease, color 0.3s ease',
										}}
									/>
								</TabList>
							</Stack>
							<Stack className="right-config">
								<Stack className="panel-config">
									<Stack className="title-box">
										<Stack className="left">
											<Typography className="title">{searchCommunity.search.articleCategory} BOARD</Typography>
											<Typography className="sub-title">Share your thoughts openly without limitations</Typography>
										</Stack>
										<Button
											onClick={() =>
												router.push({
													pathname: '/mypage',
													query: {
														category: 'writeArticle',
													},
												})
											}
											className="right"
										>
											Write
										</Button>
									</Stack>

									<TabPanel value="FREE">
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
									<TabPanel value="RECOMMEND">
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
									<TabPanel value="NEWS">
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
									<TabPanel value="HUMOR">
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
								</Stack>
							</Stack>
						</Stack>
					</TabContext>

					{totalCount > 0 && (
						<Stack className="pagination-config">
							<Stack className="pagination-box">
								<Pagination
									count={Math.ceil(totalCount / searchCommunity.limit)}
									page={searchCommunity.page}
									shape="circular"
									color="primary"
									onChange={paginationHandler}
								/>
							</Stack>
							<Stack className="total-result">
								<Typography>
									Total {totalCount} article{totalCount > 1 ? 's' : ''} available
								</Typography>
							</Stack>
						</Stack>
					)}
				</div>
			</div>
		);
	}
};

Community.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'ASC',
		search: {
			articleCategory: 'FREE',
		},
	},
};

export default withLayoutBasic(Community);
