import { Direction } from '../../enums/common.enum';
import { MemberType } from '../../enums/member.enum';
import { NoticeCategory, NoticeField, NoticeStatus } from '../../enums/notice.enum';

export interface NoticeInput {
	noticeCategory: NoticeCategory;
	noticeStatus: NoticeStatus;
	noticeField: NoticeField;
	noticeTitle: string;
	noticeContent: string;
	targetAudience: MemberType;
	memberId?: string;
}

interface NoticeSearch {
	noticeStatus?: NoticeStatus;
	text?: string;
	noticeCategory?: NoticeCategory;
	noticeField?: NoticeField;
}

export interface NoticiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: NoticeSearch;
}
