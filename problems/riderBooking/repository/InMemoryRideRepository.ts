import { Ride, RideStatus } from "../models/Ride";
import { IRideRepository } from "./IRideRepository";

export class InMemoryRideRepository implements IRideRepository {
    private rides: Map<string, Ride> = new Map();

    save(ride: Ride): void {
        if (this.rides.has(ride.id)) {
            throw new Error(`Ride with id ${ride.id} already exists`);
        }
        this.rides.set(ride.id, ride);
    }

    findById(id: string): Ride | undefined {
        return this.rides.get(id);
    }

    findAll(): Ride[] {
        return Array.from(this.rides.values());
    }

    findByPassengerId(passengerId: string): Ride[] {
        return Array.from(this.rides.values())
            .filter(ride => ride.passengerId === passengerId);
    }

    findByDriverId(driverId: string): Ride[] {
        return Array.from(this.rides.values())
            .filter(ride => ride.driverId === driverId);
    }

    findByStatus(status: RideStatus): Ride[] {
        return Array.from(this.rides.values())
            .filter(ride => ride.status === status);
    }

    update(ride: Ride): void {
        if (!this.rides.has(ride.id)) {
            throw new Error(`Ride with id ${ride.id} not found`);
        }
        this.rides.set(ride.id, ride);
    }

    delete(id: string): boolean {
        return this.rides.delete(id);
    }
}
