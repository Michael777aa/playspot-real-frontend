import { FacilityLocation, AvailabilityStatus, FacilityType } from '../../enums/facility.enum';
import { NoticeCategory, NoticeField, NoticeStatus } from '../../enums/notice.enum';
import { MemberType } from '../../enums/member.enum';

export interface Notice {
	_id: string;
	noticeCategory: NoticeCategory;
	noticeStatus: NoticeStatus;
	noticeField: NoticeField;
	targetAudience: MemberType;
	noticeTitle: string;
	noticeContent: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface TotalCounter {
	field: string;
	count: number;
}

export interface Notices {
	list: Notice[];
	metaCounter?: TotalCounter[];
}
