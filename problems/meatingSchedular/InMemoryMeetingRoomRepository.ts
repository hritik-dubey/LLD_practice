import { MeetingRoom } from './MeetingRoom';
import { IMeetingRoomRepository } from './IMeetingRoomRepository';

export class InMemoryMeetingRoomRepository implements IMeetingRoomRepository {
    private rooms: Map<string, MeetingRoom> = new Map();

    findById(roomId: string): MeetingRoom | undefined {
        return this.rooms.get(roomId);
    }

    save(room: MeetingRoom): void {
        this.rooms.set(room.roomId, room);
    }
}

