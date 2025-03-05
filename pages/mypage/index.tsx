import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import MyFacilities from '../../libs/components/mypage/MyFacilities';
import MyFavorites from '../../libs/components/mypage/MyFavorites';
import RecentlyVisited from '../../libs/components/mypage/RecentlyVisited';
import MyArticles from '../../libs/components/mypage/MyArticles';
import { useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import MyMenu from '../../libs/components/mypage/MyMenu';
import WriteArticle from '../../libs/components/mypage/WriteArticle';
import MemberFollowers from '../../libs/components/member/MemberFollowers';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import MemberFollowings from '../../libs/components/member/MemberFollowings';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { LIKE_TARGET_MEMBER, SUBSCRIBE, UNSUBSCRIBE } from '../../apollo/user/mutation';
import { Messages } from '../../libs/config';
import AddFacility from '../../libs/components/mypage/AddNewFacility';
import MyProfile from '../../libs/components/mypage/MyProfile';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const MyPage: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const category: any = router.query?.category ?? 'myProfile';

	/** APOLLO REQUESTS **/
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	/** LIFECYCLES **/

	/** HANDLERS **/
	const subscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			console.log('id', id);
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw new Error(Messages.error2);

			await subscribe({
				variables: { input: id },
			});
			await sweetTopSmallSuccessAlert('Subscribed!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const unsubscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			console.log('id', id);
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw new Error(Messages.error2);

			await unsubscribe({
				variables: { input: id },
			});
			await sweetTopSmallSuccessAlert('Unsubscribed!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};
	const likeMemberHandler = async (id: string, refetch: any, query: any) => {
		try {
			console.log('id', id);
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetMember({
				variables: { input: id },
			});
			await sweetTopSmallSuccessAlert('Success!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
			else await router.push(`/member?memberId=${memberId}`);
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	if (device === 'mobile') {
		return (
			<div
				id="my-page"
				style={{
					position: 'relative',
					width: '100%',
					backgroundColor: '#f9f9f9',
					padding: '10px',
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
						className="my-page"
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: '15px',
						}}
					>
						<Stack
							className="back-frame"
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: '20px',
							}}
						>
							{/* Left Menu */}
							<Stack
								className="left-config"
								sx={{
									width: '100%',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									backgroundColor: '#ffffff',
									padding: '10px',
									borderRadius: '12px',
									boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
								}}
							>
								<MyMenu />
							</Stack>

							{/* Main Content */}
							<Stack
								className="main-config"
								mb={'76px'}
								sx={{
									display: 'flex',
									flexDirection: 'column',
									gap: '20px',
								}}
							>
								<Stack
									className="list-config"
									sx={{
										display: 'flex',
										flexDirection: 'column',
										gap: '15px',
										backgroundColor: '#ffffff',
										padding: '10px',
										borderRadius: '12px',
										boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
									}}
								>
									{category === 'addFacility' && <AddFacility />}
									{category === 'myFacilities' && <MyFacilities />}
									{category === 'myFavorites' && <MyFavorites />}
									{category === 'recentlyVisited' && <RecentlyVisited />}
									{category === 'myArticles' && <MyArticles />}
									{category === 'writeArticle' && <WriteArticle />}
									{category === 'myProfile' && <MyProfile />}
									{category === 'followers' && (
										<MemberFollowers
											subscribeHandler={subscribeHandler}
											unsubscribeHandler={unsubscribeHandler}
											likeMemberHandler={likeMemberHandler}
											redirectToMemberPageHandler={redirectToMemberPageHandler}
										/>
									)}
									{category === 'followings' && (
										<MemberFollowings
											subscribeHandler={subscribeHandler}
											unsubscribeHandler={unsubscribeHandler}
											likeMemberHandler={likeMemberHandler}
											redirectToMemberPageHandler={redirectToMemberPageHandler}
										/>
									)}
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	} else {
		return (
			<div id="my-page" style={{ position: 'relative' }}>
				<div className="container">
					<Stack className={'my-page'}>
						<Stack className={'back-frame'}>
							<Stack className={'left-config'}>
								<MyMenu />
							</Stack>
							<Stack className="main-config" mb={'76px'}>
								<Stack className={'list-config'}>
									{category === 'addFacility' && <AddFacility />}
									{category === 'myFacilities' && <MyFacilities />}
									{category === 'myFavorites' && <MyFavorites />}
									{category === 'recentlyVisited' && <RecentlyVisited />}
									{category === 'myArticles' && <MyArticles />}
									{category === 'writeArticle' && <WriteArticle />}
									{category === 'myProfile' && <MyProfile />}
									{category === 'followers' && (
										<MemberFollowers
											subscribeHandler={subscribeHandler}
											unsubscribeHandler={unsubscribeHandler}
											likeMemberHandler={likeMemberHandler}
											redirectToMemberPageHandler={redirectToMemberPageHandler}
										/>
									)}
									{category === 'followings' && (
										<MemberFollowings
											subscribeHandler={subscribeHandler}
											unsubscribeHandler={unsubscribeHandler}
											likeMemberHandler={likeMemberHandler}
											redirectToMemberPageHandler={redirectToMemberPageHandler}
										/>
									)}
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

export default withLayoutBasic(MyPage);
