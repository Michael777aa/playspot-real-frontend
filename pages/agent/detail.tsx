import React, { ChangeEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import FacilityBigCard from '../../libs/components/common/FacilityBigCard';
import ReviewCard from '../../libs/components/agent/ReviewCard';
import { Stack, Button, Pagination, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Facility } from '../../libs/types/facility/facility';
import { Member } from '../../libs/types/member/member';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { userVar } from '../../apollo/store';
import { FacilitiesInquiry } from '../../libs/types/facility/facility.input';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Messages, REACT_APP_API_URL } from '../../libs/config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { CREATE_COMMENT, LIKE_TARGET_FACILITY } from '../../apollo/user/mutation';
import { GET_COMMENTS, GET_MEMBER, GET_FACILITIES } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { Message } from '../../libs/enums/common.enum';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const AgentDetail: NextPage = ({ initialInput, initialComment, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [agentId, setAgentId] = useState<string | null>(null);
	const [agent, setAgent] = useState<Member | null>(null);
	const [searchFilter, setSearchFilter] = useState<FacilitiesInquiry>(initialInput);
	const [agentFacilities, setAgentFacilities] = useState<Facility[]>([]);
	const [facilityTotal, setFacilityTotal] = useState<number>(0);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [agentComments, setAgentComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.MEMBER,
		commentContent: '',
		commentRefId: '',
	});

	/** APOLLO REQUESTS **/

	const [likeTargetFacility] = useMutation(LIKE_TARGET_FACILITY);
	const [createComment] = useMutation(CREATE_COMMENT);

	const {
		loading: getMemberLoading,
		data: getMemberData,
		error: getMemberError,
		refetch: getMemberRefetch,
	} = useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		variables: { input: agentId },
		skip: !agentId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgent(data?.getMember);
			setSearchFilter({ ...searchFilter, search: { memberId: data?.getMember?._id } });
			setCommentInquiry({ ...commentInquiry, search: { commentRefId: data?.getMember?._id } });
			setInsertCommentData({ ...insertCommentData, commentRefId: data?.getMember?._id });
		},
	});

	const {
		loading: getFacilitiesLoading,
		data: getFacilitiesData,
		error: getFacilitiesError,
		refetch: getFacilitiesRefetch,
	} = useQuery(GET_FACILITIES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter.search.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentFacilities(data?.getFacilities?.list);
			setFacilityTotal(data?.getFacilities?.metaCounter[0]?.total ?? 0);
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'network-only',
		variables: { input: commentInquiry },
		skip: !commentInquiry.search.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentComments(data?.getComments?.list);
			setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.agentId) setAgentId(router.query.agentId as string);
	}, [router]);

	useEffect(() => {
		if (searchFilter.search.memberId) {
			getFacilitiesRefetch({ variables: { input: searchFilter } }).then();
		}
	}, [searchFilter]);
	useEffect(() => {
		if (commentInquiry.search.commentRefId) {
			getCommentsRefetch({ variables: { input: commentInquiry } }).then();
		}
	}, [commentInquiry]);

	/** HANDLERS **/
	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
			else await router.push(`/member?memberId=${memberId}`);
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	const facilityPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		setSearchFilter({ ...searchFilter });
	};

	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};

	const createCommentHandler = async () => {
		try {
			if (!user._id) throw new Error(Messages.error2);
			if (user._id === agentId) throw new Error('Cannot write a review for yourself');
			await createComment({ variables: { input: insertCommentData } });

			setInsertCommentData({ ...insertCommentData, commentContent: '' });

			await getCommentsRefetch({ input: commentInquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const likeFacilityHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetFacility({ variables: { input: id } });

			await getFacilitiesRefetch({ input: searchFilter });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('Erron on likeFacilityHandler', err);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return (
			<Stack
				className="agent-detail-page"
				style={{
					padding: '15px',
					backgroundColor: '#f9f9f9',
					gap: '20px',
				}}
			>
				{/* Agent Info */}
				<Stack
					className="container"
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: '20px',
					}}
				>
					<Stack
						className="agent-info"
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: '10px',
						}}
					>
						<img
							src={agent?.memberImage ? `${REACT_APP_API_URL}/${agent?.memberImage}` : '/img/profile/defaultUserr.svg'}
							alt=""
							style={{
								width: '100px',
								height: '100px',
								borderRadius: '50%',
								objectFit: 'cover',
								boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
							}}
						/>
						<Stack
							component="div"
							className="info"
							onClick={() => redirectToMemberPageHandler(agent?._id as string)}
							style={{
								textAlign: 'center',
							}}
						>
							<strong
								style={{
									fontSize: '1rem',
									fontWeight: '600',
									color: '#007bff',
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									gap: '5px',
								}}
							>
								{`${agent?.memberFirstName ?? ''} ${agent?.memberLastName ?? ''}`.trim()}
								<ArrowOutwardIcon style={{ fontSize: '1rem', color: '#007bff' }} />
							</strong>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: '8px',
									fontSize: '0.85rem',
									color: '#555',
								}}
							>
								<img src="/img/icons/call.svg" alt="" style={{ width: '16px', height: '16px' }} />
								<span>{agent?.memberPhone}</span>
							</div>
						</Stack>
					</Stack>

					{/* Agent Facilities */}
					<Stack className="agent-home-list" style={{ width: '100%', gap: '15px' }}>
						<Stack
							className="card-wrap"
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: '15px',
							}}
						>
							{agentFacilities.map((rent: Facility) => (
								<div
									className="wrap-main"
									key={rent?._id}
									style={{
										width: '100%',
										backgroundColor: '#fff',
										borderRadius: '8px',
										boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
									}}
								>
									<FacilityBigCard facility={rent} likeFacilityHandler={likeFacilityHandler} />
								</div>
							))}
						</Stack>
						<Stack
							className="pagination"
							style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
						>
							{facilityTotal ? (
								<>
									<Pagination
										page={searchFilter.page}
										count={Math.ceil(facilityTotal / searchFilter.limit) || 1}
										onChange={facilityPaginationChangeHandler}
										shape="circular"
										color="primary"
									/>
									<span style={{ fontSize: '0.85rem', color: '#555' }}>
										Total {facilityTotal} facilit{facilityTotal > 1 ? 'ies' : 'y'} available
									</span>
								</>
							) : (
								<div className="no-data" style={{ textAlign: 'center', color: '#777', fontSize: '0.85rem' }}>
									<img src="/img/icons/icoAlert.svg" alt="" style={{ width: '40px', marginBottom: '10px' }} />
									<p>No facilities found!</p>
								</div>
							)}
						</Stack>
					</Stack>

					{/* Reviews Section */}
					<Stack
						className="review-box"
						style={{
							width: '100%',
							backgroundColor: '#fff',
							borderRadius: '8px',
							boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
							padding: '15px',
							gap: '15px',
						}}
					>
						<Stack
							className="main-intro"
							style={{
								textAlign: 'center',
								gap: '5px',
							}}
						>
							<span style={{ fontSize: '1rem', fontWeight: '600', color: '#333' }}>Reviews</span>
							<p style={{ fontSize: '0.85rem', color: '#777' }}>We are glad to see you again</p>
						</Stack>

						{commentTotal !== 0 && (
							<Stack className="review-wrap" style={{ gap: '15px' }}>
								<Stack
									component="div"
									className="title-box"
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: '8px',
										fontSize: '0.9rem',
										color: '#333',
									}}
								>
									<StarIcon style={{ color: '#FFD700', fontSize: '1rem' }} />
									<span>
										{commentTotal} review{commentTotal > 1 ? 's' : ''}
									</span>
								</Stack>
								{agentComments?.map((comment: Comment) => (
									<ReviewCard comment={comment} key={comment?._id} />
								))}
								<Stack
									component="div"
									className="pagination-box"
									style={{
										display: 'flex',
										justifyContent: 'center',
									}}
								>
									<Pagination
										page={commentInquiry.page}
										count={Math.ceil(commentTotal / commentInquiry.limit) || 1}
										onChange={commentPaginationChangeHandler}
										shape="circular"
										color="primary"
									/>
								</Stack>
							</Stack>
						)}

						<Stack className="leave-review-config" style={{ gap: '10px' }}>
							<Typography className="main-title" style={{ fontSize: '1rem', fontWeight: '600', color: '#333' }}>
								Leave A Review
							</Typography>
							<textarea
								onChange={({ target: { value } }: any) => {
									setInsertCommentData({ ...insertCommentData, commentContent: value });
								}}
								value={insertCommentData.commentContent}
								style={{
									width: '100%',
									height: '80px',
									border: '1px solid #ddd',
									borderRadius: '6px',
									padding: '10px',
									fontSize: '0.85rem',
									color: '#555',
									resize: 'none',
								}}
							></textarea>
							<Button
								disabled={insertCommentData.commentContent === '' || user?._id === ''}
								onClick={createCommentHandler}
								style={{
									width: '100%',
									backgroundColor: '#007bff',
									color: '#fff',
									padding: '10px',
									borderRadius: '6px',
									fontSize: '0.9rem',
									fontWeight: '600',
									cursor: 'pointer',
								}}
							>
								Submit Review
							</Button>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'agent-detail-page'}>
				<Stack className={'container'}>
					<Stack className={'agent-info'}>
						<img
							src={agent?.memberImage ? `${REACT_APP_API_URL}/${agent?.memberImage}` : '/img/profile/defaultUserr.svg'}
							alt=""
						/>
						<Stack
							component={'div'}
							className={'info'}
							onClick={() => redirectToMemberPageHandler(agent?._id as string)}
						>
							<strong>
								{`${agent?.memberFirstName ?? ''} ${agent?.memberLastName ?? ''}`.trim()}
								<ArrowOutwardIcon />
							</strong>
							<div>
								<img src="/img/icons/call.svg" alt="" />
								<span>{agent?.memberPhone}</span>
							</div>
						</Stack>
					</Stack>
					<Stack className={'agent-home-list'}>
						<Stack className={'card-wrap'}>
							{agentFacilities.map((rent: Facility) => {
								return (
									<div className={'wrap-main'} key={rent?._id}>
										<FacilityBigCard facility={rent} key={rent?._id} likeFacilityHandler={likeFacilityHandler} />
									</div>
								);
							})}
						</Stack>
						<Stack className={'pagination'}>
							{facilityTotal ? (
								<>
									<Stack className="pagination-box">
										<Pagination
											page={searchFilter.page}
											count={Math.ceil(facilityTotal / searchFilter.limit) || 1}
											onChange={facilityPaginationChangeHandler}
											shape="circular"
											color="primary"
										/>
									</Stack>
									<span>
										Total {facilityTotal} facilit{facilityTotal > 1 ? 'ies' : 'y'} available
									</span>
								</>
							) : (
								<div className={'no-data'}>
									<img src="/img/icons/icoAlert.svg" alt="" />
									<p>No facilities found!</p>
								</div>
							)}
						</Stack>
					</Stack>
					<Stack className={'review-box'}>
						<Stack className={'main-intro'}>
							<span>Reviews</span>
							<p>we are glad to see you again</p>
						</Stack>
						{commentTotal !== 0 && (
							<Stack className={'review-wrap'}>
								<Stack component={'div'} className={'title-box'}>
									<StarIcon />
									<span>
										{commentTotal} review{commentTotal > 1 ? 's' : ''}
									</span>
								</Stack>
								{agentComments?.map((comment: Comment) => {
									return <ReviewCard comment={comment} key={comment?._id} />;
								})}
								<Stack component={'div'} className={'pagination-box'}>
									<Pagination
										page={commentInquiry.page}
										count={Math.ceil(commentTotal / commentInquiry.limit) || 1}
										onChange={commentPaginationChangeHandler}
										shape="circular"
										color="primary"
									/>
								</Stack>
							</Stack>
						)}

						<Stack className={'leave-review-config'}>
							<Typography className={'main-title'}>Leave A Review</Typography>
							<Typography className={'review-title'}>Review</Typography>
							<textarea
								onChange={({ target: { value } }: any) => {
									setInsertCommentData({ ...insertCommentData, commentContent: value });
								}}
								value={insertCommentData.commentContent}
							></textarea>
							<Stack className={'submit-btn'} component={'div'}>
								<Button
									className={'submit-review'}
									disabled={insertCommentData.commentContent === '' || user?._id === ''}
									onClick={createCommentHandler}
								>
									<Typography className={'title'}>Submit Review</Typography>
									<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none">
										<g clipPath="url(#clip0_6975_3642)">
											<path
												d="M16.1571 0.5H6.37936C6.1337 0.5 5.93491 0.698792 5.93491 0.944458C5.93491 1.19012 6.1337 1.38892 6.37936 1.38892H15.0842L0.731781 15.7413C0.558156 15.915 0.558156 16.1962 0.731781 16.3698C0.818573 16.4566 0.932323 16.5 1.04603 16.5C1.15974 16.5 1.27345 16.4566 1.36028 16.3698L15.7127 2.01737V10.7222C15.7127 10.9679 15.9115 11.1667 16.1572 11.1667C16.4028 11.1667 16.6016 10.9679 16.6016 10.7222V0.944458C16.6016 0.698792 16.4028 0.5 16.1571 0.5Z"
												fill="#181A20"
											/>
										</g>
										<defs>
											<clipPath id="clip0_6975_3642">
												<rect width="16" height="16" fill="white" transform="translate(0.601562 0.5)" />
											</clipPath>
										</defs>
									</svg>
								</Button>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

AgentDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			memberId: '',
		},
	},
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'ASC',
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutBasic(AgentDetail);
