import { Direction } from '../../enums/common.enum';
import { AvailabilityStatus, FacilityLocation, FacilityType } from '../../enums/facility.enum';

export interface FacilityInput {
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
	deletedAt?: Date;
	demoUrl?: string;
	constructedAt?: Date;
	createdAt: Date;
	soldAt?: Date;
}

interface PISearch {
	memberId?: string;
	locationList?: FacilityLocation[];
	typeList?: FacilityType[];
	pricesRange?: Range;
	periodsRange?: PeriodsRange;
	squaresRange?: Range;
	balconiesList?: Number[];
	text?: string;
}

export interface FacilitiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

interface APISearch {
	availabilityStatus?: AvailabilityStatus;
}

export interface AgentFacilitiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

interface ALPISearch {
	availabilityStatus?: AvailabilityStatus;
	facilityLocationList?: FacilityLocation[];
}

export interface AllFacilitiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALPISearch;
}

interface Range {
	start: number;
	end: number;
}

interface PeriodsRange {
	start: Date | number;
	end: Date | number;
}
