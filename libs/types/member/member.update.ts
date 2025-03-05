import { MemberStatus, MemberType } from '../../enums/member.enum';

export interface MemberUpdate {
	_id: string;
	memberType?: MemberType;
	memberStatus?: MemberStatus;
	memberPhone?: string;
	memberNick?: string;
	memberPassword?: string;
	memberFirstName?: string;
	memberLastName?: string;
	memberEmail?: string;
	memberImage?: string;
	memberAddress?: string;
	memberDesc?: string;
	deletedAt?: Date;
}

export interface AdminMemberUpdate {
	_id: string;
	memberType?: MemberType;
	memberStatus?: MemberStatus;
	memberPhone?: string;
	memberNick?: string;
	memberFirstName?: string;
	memberLastName?: string;
	memberEmail?: string;
	memberImage?: string;
	memberAddress?: string;
	memberDesc?: string;
	deletedAt?: Date;
}
