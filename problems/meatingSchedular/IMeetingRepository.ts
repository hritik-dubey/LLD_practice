import { Meeting } from './Meeting';

export interface IMeetingRepository {
    save(meeting: Meeting): void;
    delete(meetingId: string): void;
    findById(meetingId: string): Meeting | undefined;
    findByRecurringId(recurringId: string): Meeting[];
}

