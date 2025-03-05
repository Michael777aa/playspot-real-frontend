import { Direction } from '../../enums/common.enum';
import { MemberType } from '../../enums/member.enum';
import { NoticeCategory, NoticeField, NoticeStatus } from '../../enums/notice.enum';

export interface NoticeUpdate {
	_id: string;
	noticeCategory?: NoticeCategory;
	noticeStatus?: NoticeStatus;
	noticeTitle?: string;
	noticeField?: NoticeField;
	noticeContent?: string;
	targetAudience?: MemberType;
}
