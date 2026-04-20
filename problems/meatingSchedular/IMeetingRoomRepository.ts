import { MeetingRoom } from './MeetingRoom';

export interface IMeetingRoomRepository {
    findById(roomId: string): MeetingRoom | undefined;
}

