import { Meeting } from './Meeting';

export interface INotificationService {
    sendInvite(meeting: Meeting): void;
    sendCancel(meeting: Meeting): void;
    sendUpdate(meeting: Meeting): void;
}

