import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_AGENTS = gql`
	query GetAgents($input: AgentsInquiry!) {
		getAgents(input: $input) {
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

export const GET_MEMBER = gql(`
query GetMember($input: String!) {
    getMember(memberId: $input) {
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
}`);

/**************************
 *        FACILITY        *
 *************************/

export const GET_FACILITY = gql`
	query GetFacility($input: String!) {
		getFacility(facilityId: $input) {
			_id
			facilityType
			demoUrl
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

export const GET_FACILITIES = gql`
	query GetFacilities($input: FacilitiesInquiry!) {
		getFacilities(input: $input) {
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

export const GET_AGENT_FACILITIES = gql`
	query GetAgentFacilities($input: AgentFacilitiesInquiry!) {
		getAgentFacilities(input: $input) {
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

export const GET_FAVORITES = gql`
	query GetFavorites($input: OrdinaryInquiry!) {
		getFavorites(input: $input) {
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
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_VISITED = gql`
	query GetVisited($input: OrdinaryInquiry!) {
		getVisited(input: $input) {
			list {
				_id
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

export const GET_BOARD_ARTICLE = gql`
	query GetBoardArticle($input: String!) {
		getBoardArticle(articleId: $input) {
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
	}
`;

export const GET_BOARD_ARTICLES = gql`
	query GetBoardArticles($input: BoardArticlesInquiry!) {
		getBoardArticles(input: $input) {
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
			metaCounter {
				total
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
 *         FOLLOW        *
 *************************/
export const GET_MEMBER_FOLLOWERS = gql`
	query GetMemberFollowers($input: FollowInquiry!) {
		getMemberFollowers(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
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
				followerData {
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

export const GET_MEMBER_FOLLOWINGS = gql`
	query GetMemberFollowings($input: FollowInquiry!) {
		getMemberFollowings(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				followingData {
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
 *         NOTIFICATION        *
 *************************/

export const GET_NOTIFICATIONS = gql`
	query GetNotifications($input: NotificationInquiry!) {
		getNotifications(input: $input) {
			list {
				_id
				notificationType
				notificationStatus
				notificationGroup
				notificationTitle
				notificationDesc
				authorId
				receiverId
				facilityId
				articleId
				createdAt
				updatedAt
				notificationName
				notificationNumber
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         EVENTS        *
 *************************/

export const GET_EVENTS = gql`
	query GetEvents($input: EventInquiry!) {
		getEvents(input: $input) {
			list {
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
			metaCounter {
				total
			}
		}
	}
`;
