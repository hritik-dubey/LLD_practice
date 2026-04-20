import { Location } from "./Location";
import { Rating } from "./Rating";

export enum DriverStatus {
    AVAILABLE = "AVAILABLE",
    BUSY = "BUSY",
    OFFLINE = "OFFLINE"
}

export enum VehicleType {
    TWO_WHEELER = "TWO_WHEELER",
    THREE_WHEELER = "THREE_WHEELER",
    FOUR_WHEELER = "FOUR_WHEELER"
}

export class Driver {
    private ratings: Rating[] = [];
    private status: DriverStatus = DriverStatus.OFFLINE;

    constructor(
        public id: string,
        public name: string,
        public age: number,
        public phoneNumber: string,
        public email: string,
        public licenseNumber: string,
        public vehicleType: VehicleType,
        public vehicleNumber: string,
        public currentLocation: Location
    ) {}

    updateLocation(location: Location): void {
        this.currentLocation = location;
    }

    addRating(rating: Rating): void {
        this.ratings.push(rating);
    }

    getAverageRating(): number {
        if (this.ratings.length === 0) return 0;
        const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
        return sum / this.ratings.length;
    }

    getRatings(): Rating[] {
        return [...this.ratings];
    }

    setStatus(status: DriverStatus): void {
        this.status = status;
    }

    getStatus(): DriverStatus {
        return this.status;
    }

    isAvailable(): boolean {
        return this.status === DriverStatus.AVAILABLE;
    }

    goOnline(): void {
        this.status = DriverStatus.AVAILABLE;
    }

    goOffline(): void {
        this.status = DriverStatus.OFFLINE;
    }

    markBusy(): void {
        this.status = DriverStatus.BUSY;
    }
}
