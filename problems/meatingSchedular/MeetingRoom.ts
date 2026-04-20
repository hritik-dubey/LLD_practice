import { Slot } from './Slot';

export class MeetingRoom {
    constructor(
        public roomId: string,
        public capacity: number,
        public location: string,
        public slots: Slot[] = []
    ) {}
}
