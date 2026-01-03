import { Meeting } from './Meeting';
import { MeetingRoom } from './MeetingRoom';
import { User } from './User';
import { NotificationService } from './NotificationService';

export class MeetingScheduler {
    // Singleton instance
    private static instance: MeetingScheduler;

    // In-memory storage: roomId -> sorted meetings
    private roomMeetings: Map<string, Meeting[]> = new Map();

    private notificationService: NotificationService;

    private constructor() {
        this.notificationService = new NotificationService();
    }

    // Singleton accessor
    public static getInstance(): MeetingScheduler {
        if (!MeetingScheduler.instance) {
            MeetingScheduler.instance = new MeetingScheduler();
        }
        return MeetingScheduler.instance;
    }

    // Public method: book a meeting
    public createMeeting(
        room: MeetingRoom,
        startTime: Date,
        endTime: Date,
        organizer: User,
        participants: User[]
    ): Meeting {
        // Step 1: Check room availability
        if (!this.isRoomAvailable(room.id, startTime, endTime)) {
            throw new Error(`Room ${room.name} is not available at this time.`);
        }

        // Step 2: Validate room capacity
        if (!room.canHost(participants.length)) {
            throw new Error(`Room ${room.name} cannot host ${participants.length} participants.`);
        }

        // Step 3: Create Meeting object
        const meeting = new Meeting(
            this.generateMeetingId(),
            room,
            startTime,
            endTime,
            participants,
            organizer
        );

        // Step 4: Insert into sorted meetings list
        this.insertMeetingSorted(room.id, meeting);

        // Step 5: Send notifications
        this.notificationService.sendMeetingCreated(meeting);

        return meeting;
    }

    // Cancel Meeting
    public cancelMeeting(meetingId:string){

    }

    public rescheduleMeeting(meetingId:string,startTime:Date,endtime:Date){
        
    }

    // Check availability
    private isRoomAvailable(roomId: string, startTime: Date, endTime: Date): boolean {
        const meetings = this.roomMeetings.get(roomId) || [];

        for (const m of meetings) {
            if (startTime < m.endTime && endTime > m.startTime) {
                return false; // overlap detected
            }
        }

        return true;
    }

    // Insert meeting into sorted list
    private insertMeetingSorted(roomId: string, meeting: Meeting): void {
        const meetings = this.roomMeetings.get(roomId) || [];
        
        let i = 0;
        while (i < meetings.length && meetings[i].startTime <= meeting.startTime) {
            i++;
        }
        meetings.splice(i, 0, meeting); // insert at correct position

        this.roomMeetings.set(roomId, meetings);
    }

    // Simple meeting ID generator
    private generateMeetingId(): string {
        return `M-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
}
