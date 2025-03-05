import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';
import { Direction } from '../../enums/common.enum';

export interface NotificationInput {
	notificationType: NotificationType;
	notificationStatus?: NotificationStatus; // Optional
	notificationGroup: NotificationGroup;
	notificationTitle: string; // Should be between 3 and 100 characters
	notificationDesc?: string;
	notificationName?: string;
	notificationNumber?: string;
	authorId: string;
	memberId?: string; // Optional
	receiverId: string;
	facilityId?: string; // Optional
	articleId?: string; // Optional
	createdAt: string;
}

export interface INISearch {
	receiverId: string;
}

export interface INotificationInquiry {
	page: number; // Should be greater than or equal to 1
	limit: number; // Should be greater than or equal to 1
	direction?: Direction; // Optional
	search: INISearch;
}
