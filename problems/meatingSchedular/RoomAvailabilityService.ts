import { MeetingRoom } from './MeetingRoom';
import { Slot } from './Slot';

export class RoomAvailabilityService {
    isAvailable(room: MeetingRoom, start: Date, end: Date): boolean {
        for (const slot of room.slots) {
            if (start < slot.endTime && end > slot.startTime) {
                return false; // overlap detected
            }
        }
        return true;
    }

    reserve(room: MeetingRoom, start: Date, end: Date): void {
        if (!this.isAvailable(room, start, end)) {
            throw new Error(`Room ${room.roomId} is not available at this time.`);
        }
        room.slots.push(new Slot(start, end));
        // Sort slots by start time
        room.slots.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    }

    release(room: MeetingRoom, start: Date, end: Date): void {
        room.slots = room.slots.filter(
            slot => !(slot.startTime.getTime() === start.getTime() && slot.endTime.getTime() === end.getTime())
        );
    }
}

