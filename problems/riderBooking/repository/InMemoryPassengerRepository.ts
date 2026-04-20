import { Passenger } from "../models/Passenger";
import { IPassengerRepository } from "./IPassengerRepository";

export class InMemoryPassengerRepository implements IPassengerRepository {
    private passengers: Map<string, Passenger> = new Map();

    save(passenger: Passenger): void {
        if (this.passengers.has(passenger.id)) {
            throw new Error(`Passenger with id ${passenger.id} already exists`);
        }
        this.passengers.set(passenger.id, passenger);
    }

    findById(id: string): Passenger | undefined {
        return this.passengers.get(id);
    }

    findAll(): Passenger[] {
        return Array.from(this.passengers.values());
    }

    update(passenger: Passenger): void {
        if (!this.passengers.has(passenger.id)) {
            throw new Error(`Passenger with id ${passenger.id} not found`);
        }
        this.passengers.set(passenger.id, passenger);
    }

    delete(id: string): boolean {
        return this.passengers.delete(id);
    }
}
