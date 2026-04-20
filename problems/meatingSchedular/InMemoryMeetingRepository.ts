import { Meeting } from './Meeting';
import { IMeetingRepository } from './IMeetingRepository';

export class InMemoryMeetingRepository implements IMeetingRepository {
    private meetings: Map<string, Meeting> = new Map();
    private recurringIndex: Map<string, Meeting[]> = new Map();

    save(meeting: Meeting): void {
        this.meetings.set(meeting.meetingId, meeting);
        
        if (meeting.recurringId) {
            const recurringMeetings = this.recurringIndex.get(meeting.recurringId) || [];
            recurringMeetings.push(meeting);
            this.recurringIndex.set(meeting.recurringId, recurringMeetings);
        }
    }

    delete(meetingId: string): void {
        const meeting = this.meetings.get(meetingId);
        if (meeting) {
            this.meetings.delete(meetingId);
            
            if (meeting.recurringId) {
                const recurringMeetings = this.recurringIndex.get(meeting.recurringId) || [];
                const index = recurringMeetings.findIndex(m => m.meetingId === meetingId);
                if (index !== -1) {
                    recurringMeetings.splice(index, 1);
                }
            }
        }
    }

    findById(meetingId: string): Meeting | undefined {
        return this.meetings.get(meetingId);
    }

    findByRecurringId(recurringId: string): Meeting[] {
        return this.recurringIndex.get(recurringId) || [];
    }
}

