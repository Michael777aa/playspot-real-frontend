import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
			_id
			memberType
			memberEmail
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFirstName
			memberLastName
			memberImage
			memberAddress
			memberDesc
			memberFacilities
			memberArticles
			memberFollowers
			memberFollowings
			memberPoints
			memberLikes
			memberViews
			memberComments
			memberRank
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
			meFollowed {
				followingId
				followerId
				myFollowing
			}
		}
	}
`;

/**************************
 *        FACILITY        *
 *************************/

export const UPDATE_FACILITY_BY_ADMIN = gql`
	mutation UpdateFacilityByAdmin($input: FacilityUpdate!) {
		updateFacilityByAdmin(input: $input) {
			_id
			facilityType
			availabilityStatus
			facilityLocation
			facilityAddress
			facilityTitle
			facilityPrice
			facilitySquare
			facilityBalconies
			facilityViews
			facilityLikes
			facilityComments
			facilityRank
			facilityImages
			amenities
			includedUtilities
			facilityDesc
			facilityPetsAllowed
			parkingAvailable
			furnished
			memberId
			deletedAt
			constructedAt
			createdAt
			soldAt
			updatedAt
			memberData {
				_id
				memberType
				memberEmail
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFirstName
				memberLastName
				memberImage
				memberAddress
				memberDesc
				memberFacilities
				memberArticles
				memberFollowers
				memberFollowings
				memberPoints
				memberLikes
				memberViews
				memberComments
				memberRank
				memberWarnings
				memberBlocks
				deletedAt
				createdAt
				updatedAt
				accessToken
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const REMOVE_FACILITY_BY_ADMIN = gql`
	mutation RemoveFacilityByAdmin($input: String!) {
		removeFacilityByAdmin(facilityId: $input) {
			_id
			facilityType
			availabilityStatus
			facilityLocation
			facilityAddress
			facilityTitle
			facilityPrice
			facilitySquare
			facilityBalconies
			facilityViews
			facilityLikes
			facilityComments
			facilityRank
			facilityImages
			amenities
			includedUtilities
			facilityDesc
			facilityPetsAllowed
			parkingAvailable
			furnished
			memberId
			deletedAt
			constructedAt
			createdAt
			soldAt
			updatedAt
			memberData {
				_id
				memberType
				memberEmail
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFirstName
				memberLastName
				memberImage
				memberAddress
				memberDesc
				memberFacilities
				memberArticles
				memberFollowers
				memberFollowings
				memberPoints
				memberLikes
				memberViews
				memberComments
				memberRank
				memberWarnings
				memberBlocks
				deletedAt
				createdAt
				updatedAt
				accessToken
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
		updateBoardArticleByAdmin(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			articleComments
			memberId
			createdAt
			updatedAt
			memberData {
				_id
				memberType
				memberEmail
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFirstName
				memberLastName
				memberImage
				memberAddress
				memberDesc
				memberFacilities
				memberArticles
				memberFollowers
				memberFollowings
				memberPoints
				memberLikes
				memberViews
				memberComments
				memberRank
				memberWarnings
				memberBlocks
				deletedAt
				createdAt
				updatedAt
				accessToken
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation RemoveBoardArticleByAdmin($input: String!) {
		removeBoardArticleByAdmin(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			articleComments
			memberId
			createdAt
			updatedAt
			memberData {
				_id
				memberType
				memberEmail
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFirstName
				memberLastName
				memberImage
				memberAddress
				memberDesc
				memberFacilities
				memberArticles
				memberFollowers
				memberFollowings
				memberPoints
				memberLikes
				memberViews
				memberComments
				memberRank
				memberWarnings
				memberBlocks
				deletedAt
				createdAt
				updatedAt
				accessToken
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const REMOVE_COMMENT_BY_ADMIN = gql`
	mutation RemoveCommentByAdmin($input: String!) {
		removeCommentByAdmin(commentId: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         NOTICE        *
 *************************/

export const CREATE_NOTICE = gql`
	mutation CreateNotice($input: NoticeInput!) {
		createNotice(input: $input) {
			_id
			noticeCategory
			noticeField
			noticeStatus
			noticeTitle
			noticeContent
			createdAt
			updatedAt
			targetAudience
		}
	}
`;

export const UPDATE_NOTICE = gql`
	mutation UpdateNotice($input: NoticeUpdate!) {
		updateNotice(input: $input) {
			_id
			noticeCategory
			noticeStatus
			noticeTitle
			noticeContent
			createdAt
			updatedAt
			targetAudience
			noticeField
		}
	}
`;

/**************************
 *         NOTICE        *
 *************************/

export const CREATE_EVENT = gql`
	mutation CreateEvent($input: EventInput!) {
		createEvent(input: $input) {
			_id
			eventStatus
			eventName
			eventTopic
			eventDesc
			eventLocation
			eventImages
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_EVENT = gql`
	mutation UpdateEventByAdmin($input: EventUpdate!) {
		updateEventByAdmin(input: $input) {
			eventStatus
			eventName
			eventTopic
			eventDesc
			eventLocation
			eventImages
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_EVENT = gql`
	mutation RemoveEventByAdmin($input: String!) {
		removeEventByAdmin(eventId: $input) {
			eventStatus
			eventName
			eventTopic
			eventDesc
			eventLocation
			eventImages
			createdAt
			updatedAt
		}
	}
`;
