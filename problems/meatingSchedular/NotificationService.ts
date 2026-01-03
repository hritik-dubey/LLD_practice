import { Meeting } from './Meeting';

export class NotificationService {
    sendMeetingCreated(meeting: Meeting): void {
        // just skeleton, no logic yet
        console.log(`Notification sent to ${meeting.participants.map(u => u.email).join(', ')}`);
    }
}
