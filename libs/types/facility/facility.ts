import { AvailabilityStatus, FacilityLocation, FacilityType } from '../../enums/facility.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Facility {
	_id: string;
	facilityType: FacilityType;
	availabilityStatus: AvailabilityStatus;
	facilityLocation: FacilityLocation;
	facilityAddress: string;
	facilityTitle: string;
	facilityPrice: number;
	facilitySquare: number;
	facilityBalconies: number;
	facilityViews?: number;
	demoUrl?: string;
	facilityLikes?: number;
	facilityComments?: number;
	facilityRank: number;
	facilityImages: string[];
	amenities: string[];
	includedUtilities: string[];
	facilityDesc?: string;
	facilityPetsAllowed?: boolean;
	furnished?: boolean;
	parkingAvailable?: boolean;
	memberId: string;
	deletedAt?: Date;
	constructedAt?: Date;
	createdAt: Date;
	soldAt?: Date;
	updatedAt: Date;
	memberData?: Member;
	meLiked?: MeLiked[];
}

export interface Facilities {
	list: Facility[];
	metaCounter: TotalCounter[];
}
