import { User } from './User';
import { MeetingRoom } from './MeetingRoom';
import { MeetingScheduler } from './MeetingScheduler';
import { MeetingService } from './MeetingService';
import { InMemoryMeetingRepository } from './InMemoryMeetingRepository';
import { InMemoryMeetingRoomRepository } from './InMemoryMeetingRoomRepository';
import { RoomAvailabilityService } from './RoomAvailabilityService';
import { RecurrenceService } from './RecurrenceService';
import { EmailNotificationService } from './EmailNotificationService';

// Step 1: Create users
const alice = new User('U1', 'Alice', 'alice@example.com');
const bob = new User('U2', 'Bob', 'bob@example.com');
const charlie = new User('U3', 'Charlie', 'charlie@example.com');

// Step 2: Create meeting rooms
const roomA = new MeetingRoom('R1', 5, '1st Floor');
const roomB = new MeetingRoom('R2', 10, '2nd Floor');

// Step 3: Initialize dependencies
const meetingRepo = new InMemoryMeetingRepository();
const roomRepo = new InMemoryMeetingRoomRepository();
const availabilityService = new RoomAvailabilityService();
const recurrenceService = new RecurrenceService();
const notificationService = new EmailNotificationService();

// Save rooms to repository
roomRepo.save(roomA);
roomRepo.save(roomB);

// Step 4: Create services and scheduler
const meetingService = new MeetingService(
    meetingRepo,
    roomRepo,
    availabilityService,
    recurrenceService,
    notificationService
);
const scheduler = new MeetingScheduler(meetingService);

// Step 5: Book a meeting
try {
    const meetings1 = scheduler.createMeeting(
        'R1',
        new Date('2025-12-23T10:00:00'),
        new Date('2025-12-23T11:00:00'),
        [alice, bob, charlie]
    );

    console.log('Meeting successfully created:', meetings1);
} catch (err: any) {
    console.error('Failed to create meeting:', err.message);
}

// Step 6: Try booking overlapping meeting (should throw error)
try {
    const meetings2 = scheduler.createMeeting(
        'R1',
        new Date('2025-12-23T10:30:00'),
        new Date('2025-12-23T11:30:00'),
        [bob, charlie]
    );
} catch (err: any) {
    console.error('Failed to create meeting:', err.message);
}

// Step 7: Book meeting in another room (allowed)
try {
    const meetings3 = scheduler.createMeeting(
        'R2',
        new Date('2025-12-23T10:30:00'),
        new Date('2025-12-23T11:30:00'),
        [alice, charlie]
    );

    console.log('Meeting successfully created:', meetings3);
} catch (err: any) {
    console.error('Failed to create meeting:', err.message);
}
