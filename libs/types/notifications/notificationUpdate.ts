import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';
import { Direction } from '../../enums/common.enum';

export interface NotificationUpdate {
	_id: string;
	notificationStatus?: NotificationStatus; // Optional
}
