import { Ride, RideStatus } from "../models/Ride";

export interface IRideRepository {
    save(ride: Ride): void;
    findById(id: string): Ride | undefined;
    findAll(): Ride[];
    findByPassengerId(passengerId: string): Ride[];
    findByDriverId(driverId: string): Ride[];
    findByStatus(status: RideStatus): Ride[];
    update(ride: Ride): void;
    delete(id: string): boolean;
}
