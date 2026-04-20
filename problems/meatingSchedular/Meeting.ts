import { User } from './User.js';
import { MeetingRoom } from './MeetingRoom';

export class Meeting {
    constructor(
        public meetingId: string,
        public roomId: string,
        public startTime: Date,
        public endTime: Date,
        public participants: User[],
        public recurringId?: string
    ) {}
}
