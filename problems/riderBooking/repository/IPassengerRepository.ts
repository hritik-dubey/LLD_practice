import { Passenger } from "../models/Passenger";

export interface IPassengerRepository {
    save(passenger: Passenger): void;
    findById(id: string): Passenger | undefined;
    findAll(): Passenger[];
    update(passenger: Passenger): void;
    delete(id: string): boolean;
}
