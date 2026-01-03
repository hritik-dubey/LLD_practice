export class MeetingRoom {
    constructor(
        public id: string,
        public name: string,
        public capacity: number,
        public location: string
    ) {}

    // Room-specific check example
    canHost(participantCount: number): boolean {
        return participantCount <= this.capacity;
    }
}
