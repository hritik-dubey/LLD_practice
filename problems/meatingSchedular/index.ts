import { User } from './User';
import { MeetingRoom } from './MeetingRoom';
import { MeetingScheduler } from './MeetingScheduler';

// Step 1: Create users
const alice = new User('U1', 'Alice', 'alice@example.com');
const bob = new User('U2', 'Bob', 'bob@example.com');
const charlie = new User('U3', 'Charlie', 'charlie@example.com');

// Step 2: Create meeting rooms
const roomA = new MeetingRoom('R1', 'Conference Room A', 5, '1st Floor');
const roomB = new MeetingRoom('R2', 'Conference Room B', 10, '2nd Floor');

// Step 3: Get the scheduler instance
const scheduler = MeetingScheduler.getInstance();

// Step 4: Book a meeting
try {
    const meeting1 = scheduler.createMeeting(
        roomA,
        new Date('2025-12-23T10:00:00'),
        new Date('2025-12-23T11:00:00'),
        alice,
        [alice, bob, charlie]
    );

    console.log('Meeting successfully created:', meeting1);
} catch (err: any) {
    console.error('Failed to create meeting:', err.message);
}

// Step 5: Try booking overlapping meeting (should throw error)
try {
    const meeting2 = scheduler.createMeeting(
        roomA,
        new Date('2025-12-23T10:30:00'),
        new Date('2025-12-23T11:30:00'),
        bob,
        [bob, charlie]
    );
} catch (err: any) {
    console.error('Failed to create meeting:', err.message);
}

// Step 6: Book meeting in another room (allowed)
try {
    const meeting3 = scheduler.createMeeting(
        roomB,
        new Date('2025-12-23T10:30:00'),
        new Date('2025-12-23T11:30:00'),
        charlie,
        [alice, charlie]
    );

    console.log('Meeting successfully created:', meeting3);
} catch (err: any) {
    console.error('Failed to create meeting:', err.message);
}
