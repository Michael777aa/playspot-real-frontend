import { AvailabilityStatus, FacilityLocation, FacilityType } from '../../enums/facility.enum';

export interface FacilityUpdate {
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
	facilityLikes?: number;
	facilityComments?: number;
	facilityRank?: number;
	facilityImages: string[];
	amenities: string[];
	includedUtilities: string[];
	facilityDesc?: string;
	facilityPetsAllowed?: boolean;
	furnished?: boolean;
	parkingAvailable?: boolean;
	memberId: string;
	demoUrl?: string;
	deletedAt?: Date;
	constructedAt?: Date;
	createdAt: Date;
	soldAt?: Date;
}
