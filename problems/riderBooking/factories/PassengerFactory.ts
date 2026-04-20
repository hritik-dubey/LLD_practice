import { Passenger } from "../models/Passenger";
import { Location } from "../models/Location";

// Factory interface
export interface IPassengerFactory {
    createPassenger(
        id: string,
        name: string,
        age: number,
        phoneNumber: string,
        email: string,
        currentLocation: Location
    ): Passenger;
}

// Regular Passenger Factory
export class RegularPassengerFactory implements IPassengerFactory {
    createPassenger(
        id: string,
        name: string,
        age: number,
        phoneNumber: string,
        email: string,
        currentLocation: Location
    ): Passenger {
        if (age < 13) {
            throw new Error("Passenger must be at least 13 years old to book independently");
        }
        return new Passenger(id, name, age, phoneNumber, email, currentLocation);
    }
}

// Premium Passenger Factory (can be extended with additional features)
export class PremiumPassengerFactory implements IPassengerFactory {
    createPassenger(
        id: string,
        name: string,
        age: number,
        phoneNumber: string,
        email: string,
        currentLocation: Location
    ): Passenger {
        if (age < 18) {
            throw new Error("Premium passenger must be at least 18 years old");
        }
        return new Passenger(id, name, age, phoneNumber, email, currentLocation);
    }
}

export enum PassengerType {
    REGULAR = "REGULAR",
    PREMIUM = "PREMIUM"
}

// Main Factory Registry
export class PassengerFactoryRegistry {
    private static factories: Map<PassengerType, IPassengerFactory> = new Map([
        [PassengerType.REGULAR, new RegularPassengerFactory()],
        [PassengerType.PREMIUM, new PremiumPassengerFactory()]
    ]);

    static createPassenger(
        passengerType: PassengerType,
        id: string,
        name: string,
        age: number,
        phoneNumber: string,
        email: string,
        currentLocation: Location
    ): Passenger {
        const factory = this.factories.get(passengerType);
        
        if (!factory) {
            throw new Error(`Passenger factory not found for type: ${passengerType}`);
        }

        return factory.createPassenger(id, name, age, phoneNumber, email, currentLocation);
    }
}
