import { Meeting } from './Meeting';
import { User } from './User';
import { MeetingService } from './MeetingService';
import { RecurrenceRule } from './RecurrenceRule';

/**
 * Facade class that provides a simplified interface to the meeting scheduling system
 */
export class MeetingScheduler {
    private meetingService: MeetingService;

    constructor(meetingService: MeetingService) {
        this.meetingService = meetingService;
    }

    createMeeting(
        roomId: string,
        startTime: Date,
        endTime: Date,
        participants: User[],
        recurrenceRule?: RecurrenceRule
    ): Meeting[] {
        return this.meetingService.createMeeting(roomId, startTime, endTime, participants, recurrenceRule);
    }

    cancelMeeting(meetingId: string): void {
        this.meetingService.cancelMeeting(meetingId);
    }

    rescheduleMeeting(meetingId: string, start: Date, end: Date): Meeting {
        return this.meetingService.rescheduleMeeting(meetingId, start, end);
    }

    cancelRecurringFrom(meetingId: string): void {
        this.meetingService.cancelRecurringFrom(meetingId);
    }

    cancelRecurringSeries(recurringId: string): void {
        this.meetingService.cancelRecurringSeries(recurringId);
    }
}
