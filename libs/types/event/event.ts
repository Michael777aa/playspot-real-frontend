import { TotalCounter } from '../facility/facility';
import { EventStatus } from '../../enums/event.enum';

export interface Event {
	_id: string;
	eventStatus: EventStatus;
	eventName: string;
	eventTopic: string;
	eventDesc: string;
	eventLocation: string;
	eventImages: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface allEvents {
	list: Event[];
	metaCounter: TotalCounter[];
}
