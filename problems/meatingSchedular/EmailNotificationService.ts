import { Meeting } from './Meeting';
import { INotificationService } from './INotificationService';

export class EmailNotificationService implements INotificationService {
    sendInvite(meeting: Meeting): void {
        console.log(`Sending invite email for meeting ${meeting.meetingId} to participants`);
        // Implementation would send actual emails
    }

    sendCancel(meeting: Meeting): void {
        console.log(`Sending cancellation email for meeting ${meeting.meetingId} to participants`);
        // Implementation would send actual emails
    }

    sendUpdate(meeting: Meeting): void {
        console.log(`Sending update email for meeting ${meeting.meetingId} to participants`);
        // Implementation would send actual emails
    }
}

