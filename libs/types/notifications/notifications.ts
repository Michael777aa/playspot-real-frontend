import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';
import { Direction } from '../../enums/common.enum';

export interface Notification {
	_id: string;
	notificationType: NotificationType;
	notificationStatus?: NotificationStatus; // Optional
	notificationGroup: NotificationGroup;
	notificationTitle: string; // Should be between 3 and 100 characters
	notificationDesc?: string; // Optional, should be between 3 and 500 characters
	authorId: string;
	notificationName?: string;
	notificationNumber?: string;
	memberId?: string; // Optional
	receiverId: string;
	facilityId?: string; // Optional
	articleId?: string; // Optional
	createdAt: string;
}

export interface NISearch {
	receiverId: string;
}

export interface NotificationInquiry {
	page: number; // Should be greater than or equal to 1
	limit: number; // Should be greater than or equal to 1
	direction?: Direction; // Optional
	search: NISearch;
}
