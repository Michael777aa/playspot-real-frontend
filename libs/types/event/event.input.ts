import { CommentGroup } from '../../enums/comment.enum';
import { Direction } from '../../enums/common.enum';
import { EventStatus } from '../../enums/event.enum';

export interface EventInput {
	eventStatus: EventStatus;
	eventName: string;
	eventTopic: string;
	eventDesc: string;
	eventLocation: string;
	eventImages: string[];
}

interface ESearch {
	eventStatus?: EventStatus;
	text?: string;
}

export interface EventInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ESearch;
}
