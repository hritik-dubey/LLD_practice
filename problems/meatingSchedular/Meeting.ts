import { User } from './User.js';
import { MeetingRoom } from './MeetingRoom';

export class Meeting {
    constructor(
        public id: string,
        public room: MeetingRoom,
        public startTime: Date,
        public endTime: Date,
        public participants: User[],
        public organizer: User
    ) {}
}
