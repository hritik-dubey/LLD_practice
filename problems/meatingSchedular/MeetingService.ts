import { Meeting } from './Meeting';
import { User } from './User';
import { IMeetingRepository } from './IMeetingRepository';
import { IMeetingRoomRepository } from './IMeetingRoomRepository';
import { RoomAvailabilityService } from './RoomAvailabilityService';
import { RecurrenceService } from './RecurrenceService';
import { INotificationService } from './INotificationService';
import { RecurrenceRule } from './RecurrenceRule';

export class MeetingService {
    private meetingRepo: IMeetingRepository;
    private roomRepo: IMeetingRoomRepository;
    private availabilityService: RoomAvailabilityService;
    private recurrenceService: RecurrenceService;
    private notificationService: INotificationService;

    constructor(
        meetingRepo: IMeetingRepository,
        roomRepo: IMeetingRoomRepository,
        availabilityService: RoomAvailabilityService,
        recurrenceService: RecurrenceService,
        notificationService: INotificationService
    ) {
        this.meetingRepo = meetingRepo;
        this.roomRepo = roomRepo;
        this.availabilityService = availabilityService;
        this.recurrenceService = recurrenceService;
        this.notificationService = notificationService;
    }

    createMeeting(
        roomId: string,
        startTime: Date,
        endTime: Date,
        participants: User[],
        recurrenceRule?: RecurrenceRule
    ): Meeting[] {
        const room = this.roomRepo.findById(roomId);
        if (!room) {
            throw new Error(`Room ${roomId} not found.`);
        }

        // Validate room capacity
        if (participants.length > room.capacity) {
            throw new Error(`Room ${roomId} cannot host ${participants.length} participants.`);
        }

        const meetings: Meeting[] = [];
        const recurringId = recurrenceRule ? this.generateRecurringId() : undefined;

        if (recurrenceRule) {
            // Expand recurrence rule to get all time ranges
            const timeRanges = this.recurrenceService.expand(recurrenceRule, startTime, endTime);
            
            for (const timeRange of timeRanges) {
                // Check availability for each occurrence
                if (!this.availabilityService.isAvailable(room, timeRange.start, timeRange.end)) {
                    throw new Error(`Room ${roomId} is not available at ${timeRange.start}.`);
                }
            }

            // Create all meetings
            for (const timeRange of timeRanges) {
                const meeting = new Meeting(
                    this.generateMeetingId(),
                    roomId,
                    timeRange.start,
                    timeRange.end,
                    participants,
                    recurringId
                );
                
                this.availabilityService.reserve(room, timeRange.start, timeRange.end);
                this.meetingRepo.save(meeting);
                this.notificationService.sendInvite(meeting);
                meetings.push(meeting);
            }
        } else {
            // Single meeting
            if (!this.availabilityService.isAvailable(room, startTime, endTime)) {
                throw new Error(`Room ${roomId} is not available at this time.`);
            }

            const meeting = new Meeting(
                this.generateMeetingId(),
                roomId,
                startTime,
                endTime,
                participants,
                recurringId
            );

            this.availabilityService.reserve(room, startTime, endTime);
            this.meetingRepo.save(meeting);
            this.notificationService.sendInvite(meeting);
            meetings.push(meeting);
        }

        return meetings;
    }

    cancelMeeting(meetingId: string): void {
        const meeting = this.meetingRepo.findById(meetingId);
        if (!meeting) {
            throw new Error(`Meeting ${meetingId} not found.`);
        }

        const room = this.roomRepo.findById(meeting.roomId);
        if (room) {
            this.availabilityService.release(room, meeting.startTime, meeting.endTime);
        }

        this.meetingRepo.delete(meetingId);
        this.notificationService.sendCancel(meeting);
    }

    rescheduleMeeting(meetingId: string, start: Date, end: Date): Meeting {
        const meeting = this.meetingRepo.findById(meetingId);
        if (!meeting) {
            throw new Error(`Meeting ${meetingId} not found.`);
        }

        const room = this.roomRepo.findById(meeting.roomId);
        if (!room) {
            throw new Error(`Room ${meeting.roomId} not found.`);
        }

        // Release old slot
        this.availabilityService.release(room, meeting.startTime, meeting.endTime);

        // Check new availability
        if (!this.availabilityService.isAvailable(room, start, end)) {
            throw new Error(`Room ${meeting.roomId} is not available at the new time.`);
        }

        // Update meeting
        meeting.startTime = start;
        meeting.endTime = end;
        this.availabilityService.reserve(room, start, end);
        this.meetingRepo.save(meeting);
        this.notificationService.sendUpdate(meeting);

        return meeting;
    }

    cancelRecurringFrom(meetingId: string): void {
        const meeting = this.meetingRepo.findById(meetingId);
        if (!meeting || !meeting.recurringId) {
            throw new Error(`Meeting ${meetingId} is not part of a recurring series.`);
        }

        const recurringMeetings = this.meetingRepo.findByRecurringId(meeting.recurringId);
        const room = this.roomRepo.findById(meeting.roomId);
        
        // Cancel all meetings from this one onwards
        for (const m of recurringMeetings) {
            if (m.startTime >= meeting.startTime) {
                if (room) {
                    this.availabilityService.release(room, m.startTime, m.endTime);
                }
                this.meetingRepo.delete(m.meetingId);
                this.notificationService.sendCancel(m);
            }
        }
    }

    cancelRecurringSeries(recurringId: string): void {
        const recurringMeetings = this.meetingRepo.findByRecurringId(recurringId);
        
        if (recurringMeetings.length === 0) {
            throw new Error(`Recurring series ${recurringId} not found.`);
        }

        const room = this.roomRepo.findById(recurringMeetings[0].roomId);

        // Cancel all meetings in the series
        for (const meeting of recurringMeetings) {
            if (room) {
                this.availabilityService.release(room, meeting.startTime, meeting.endTime);
            }
            this.meetingRepo.delete(meeting.meetingId);
            this.notificationService.sendCancel(meeting);
        }
    }

    private generateMeetingId(): string {
        return `M-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    private generateRecurringId(): string {
        return `R-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
}

