import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_ALL_MEMBERS_BY_ADMIN = gql`
	query GetAllMembersByAdmin($input: MembersInquiry!) {
		getAllMembersByAdmin(input: $input) {
			list {
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
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *        FACILITY        *
 *************************/

export const GET_ALL_FACILITIES_BY_ADMIN = gql`
	query GetAllFacilitiesByAdmin($input: AllFacilitiesInquiry!) {
		getAllFacilitiesByAdmin(input: $input) {
			list {
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
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_ALL_BOARD_ARTICLES_BY_ADMIN = gql`
	query GetAllBoardArticlesByAdmin($input: AllBoardArticlesInquiry!) {
		getAllBoardArticlesByAdmin(input: $input) {
			list {
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
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const GET_COMMENTS = gql`
	query GetComments($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
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
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *      NOTICE     *
 *************************/

export const GET_ALL_NOTICES = gql`
	query GetNotices($input: NoticiesInquiry!) {
		getNotices(input: $input) {
			list {
				_id
				noticeCategory
				noticeStatus
				noticeTitle
				noticeContent
				createdAt
				updatedAt
				noticeField
				targetAudience
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
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *      EVENTS     *
 *************************/

export const GET_ALL_EVENTS = gql`
	query GetAllEventsByAdmin($input: EventInquiry!) {
		getAllEventsByAdmin(input: $input) {
			list {
				eventStatus
				eventName
				eventTopic
				eventDesc
				eventLocation
				eventImages
				createdAt
				updatedAt
				_id
			}
			metaCounter {
				total
			}
		}
	}
`;
