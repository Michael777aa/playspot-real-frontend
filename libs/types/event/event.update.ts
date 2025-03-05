import { EventStatus } from '../../enums/event.enum';

export interface EventUpdate {
	_id: string;
	eventStatus?: EventStatus;
	eventName?: string;
	eventTopic?: string;
	eventDesc?: string;
	eventLocation?: string;
	eventImages?: string[];
}
