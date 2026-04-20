import { Location } from "./Location";

export enum RideStatus {
    REQUESTED = "REQUESTED",
    ACCEPTED = "ACCEPTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}

export class Ride {
    constructor(
        public id: string,
        public passengerId: string,
        public pickupLocation: Location,
        public dropLocation: Location,
        public requestedAt: Date,
        public status: RideStatus = RideStatus.REQUESTED,
        public driverId?: string,
        public acceptedAt?: Date,
        public startedAt?: Date,
        public completedAt?: Date,
        public fare?: number,
        public distance?: number,
        public paymentId?: string
    ) {}

    accept(driverId: string): void {
        if (this.status !== RideStatus.REQUESTED) {
            throw new Error("Ride cannot be accepted in current status");
        }
        this.driverId = driverId;
        this.status = RideStatus.ACCEPTED;
        this.acceptedAt = new Date();
    }

    start(): void {
        if (this.status !== RideStatus.ACCEPTED) {
            throw new Error("Ride must be accepted before starting");
        }
        this.status = RideStatus.IN_PROGRESS;
        this.startedAt = new Date();
    }

    complete(distance: number, fare: number): void {
        if (this.status !== RideStatus.IN_PROGRESS) {
            throw new Error("Ride must be in progress to complete");
        }
        this.status = RideStatus.COMPLETED;
        this.completedAt = new Date();
        this.distance = distance;
        this.fare = fare;
    }

    cancel(): void {
        if (this.status === RideStatus.COMPLETED) {
            throw new Error("Cannot cancel completed ride");
        }
        this.status = RideStatus.CANCELLED;
    }

    setPaymentId(paymentId: string): void {
        this.paymentId = paymentId;
    }
}
