import { Driver, VehicleType } from "../models/Driver";
import { Location } from "../models/Location";

// Factory interface
export interface IDriverFactory {
    createDriver(
        id: string,
        name: string,
        age: number,
        phoneNumber: string,
        email: string,
        licenseNumber: string,
        vehicleNumber: string,
        currentLocation: Location
    ): Driver;
}

// Two Wheeler Driver Factory
export class TwoWheelerDriverFactory implements IDriverFactory {
    createDriver(
        id: string,
        name: string,
        age: number,
        phoneNumber: string,
        email: string,
        licenseNumber: string,
        vehicleNumber: string,
        currentLocation: Location
    ): Driver {
        if (age < 18) {
            throw new Error("Two-wheeler driver must be at least 18 years old");
        }
        return new Driver(
            id,
            name,
            age,
            phoneNumber,
            email,
            licenseNumber,
            VehicleType.TWO_WHEELER,
            vehicleNumber,
            currentLocation
        );
    }
}

// Three Wheeler Driver Factory
export class ThreeWheelerDriverFactory implements IDriverFactory {
    createDriver(
        id: string,
        name: string,
        age: number,
        phoneNumber: string,
        email: string,
        licenseNumber: string,
        vehicleNumber: string,
        currentLocation: Location
    ): Driver {
        if (age < 20) {
            throw new Error("Three-wheeler driver must be at least 20 years old");
        }
        return new Driver(
            id,
            name,
            age,
            phoneNumber,
            email,
            licenseNumber,
            VehicleType.THREE_WHEELER,
            vehicleNumber,
            currentLocation
        );
    }
}

// Four Wheeler Driver Factory
export class FourWheelerDriverFactory implements IDriverFactory {
    createDriver(
        id: string,
        name: string,
        age: number,
        phoneNumber: string,
        email: string,
        licenseNumber: string,
        vehicleNumber: string,
        currentLocation: Location
    ): Driver {
        if (age < 21) {
            throw new Error("Four-wheeler driver must be at least 21 years old");
        }
        return new Driver(
            id,
            name,
            age,
            phoneNumber,
            email,
            licenseNumber,
            VehicleType.FOUR_WHEELER,
            vehicleNumber,
            currentLocation
        );
    }
}

// Main Factory Registry - Factory Method Pattern
export class DriverFactoryRegistry {
    private static factories: Map<VehicleType, IDriverFactory> = new Map([
        [VehicleType.TWO_WHEELER, new TwoWheelerDriverFactory()],
        [VehicleType.THREE_WHEELER, new ThreeWheelerDriverFactory()],
        [VehicleType.FOUR_WHEELER, new FourWheelerDriverFactory()]
    ]);

    static createDriver(
        vehicleType: VehicleType,
        id: string,
        name: string,
        age: number,
        phoneNumber: string,
        email: string,
        licenseNumber: string,
        vehicleNumber: string,
        currentLocation: Location
    ): Driver {
        const factory = this.factories.get(vehicleType);
        
        if (!factory) {
            throw new Error(`Driver factory not found for vehicle type: ${vehicleType}`);
        }

        return factory.createDriver(
            id,
            name,
            age,
            phoneNumber,
            email,
            licenseNumber,
            vehicleNumber,
            currentLocation
        );
    }
}
