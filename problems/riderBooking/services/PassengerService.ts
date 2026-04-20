import { Passenger } from "../models/Passenger";
import { Location } from "../models/Location";
import { IPassengerRepository } from "../repository/IPassengerRepository";
import { PassengerFactoryRegistry, PassengerType } from "../factories/PassengerFactory";

export class PassengerService {
    constructor(private passengerRepository: IPassengerRepository) {}

    registerPassenger(
        id: string,
        name: string,
        age: number,
        phoneNumber: string,
        email: string,
        currentLocation: Location,
        type: PassengerType = PassengerType.REGULAR
    ): Passenger {
        // Check if passenger already exists
        const existingPassenger = this.passengerRepository.findById(id);
        if (existingPassenger) {
            throw new Error(`Passenger with id ${id} already exists`);
        }

        // Create passenger using factory
        const passenger = PassengerFactoryRegistry.createPassenger(
            type,
            id,
            name,
            age,
            phoneNumber,
            email,
            currentLocation
        );

        // Save to repository
        this.passengerRepository.save(passenger);
        return passenger;
    }

    getPassenger(id: string): Passenger {
        const passenger = this.passengerRepository.findById(id);
        if (!passenger) {
            throw new Error(`Passenger with id ${id} not found`);
        }
        return passenger;
    }

    updatePassengerLocation(id: string, location: Location): void {
        const passenger = this.getPassenger(id);
        passenger.updateLocation(location);
        this.passengerRepository.update(passenger);
    }

    getAllPassengers(): Passenger[] {
        return this.passengerRepository.findAll();
    }

    deletePassenger(id: string): boolean {
        return this.passengerRepository.delete(id);
    }
}
