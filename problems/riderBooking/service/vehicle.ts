interface IVehicle {
    registered_number: string
    wheels: number
}

class Vehicle implements IVehicle {
    registered_number: string
    wheels: number

    constructor(registered_number: string, wheels: number) {
        this.registered_number = registered_number
        this.wheels = wheels
    }
}

// Factory type for static createVehicle method
type VehicleFactory = {
    createVehicle(registered_number: string): IVehicle
}

// Two-wheeler factory
class TwoWheelerVehicle {
    static createVehicle(registered_number: string): IVehicle {
        return new Vehicle(registered_number, 2)
    }
}

// Four-wheeler factory
class FourWheelerVehicle {
    static createVehicle(registered_number: string): IVehicle {
        return new Vehicle(registered_number, 4)
    }
}

// Enum for vehicle types
enum VehicleType {
    TwoWheeler,
    FourWheeler
}

// Main factory registry
class RegisterVehicleFactory {
    private static factories: Record<VehicleType, VehicleFactory> = {
        [VehicleType.TwoWheeler]: TwoWheelerVehicle,
        [VehicleType.FourWheeler]: FourWheelerVehicle
    }

    static registerVehicle(
        registered_number: string,
        type: VehicleType
    ): IVehicle {
        const factory = this.factories[type]

        if (!factory) {
            throw new Error("Vehicle type not supported")
        }

        return factory.createVehicle(registered_number)
    }
}

// ------------------ Usage ------------------

const bike = RegisterVehicleFactory.registerVehicle(
    "KA01AB1234",
    VehicleType.TwoWheeler
)

const car = RegisterVehicleFactory.registerVehicle(
    "KA02XY5678",
    VehicleType.FourWheeler
)

console.log(bike) // Vehicle { wheels: 2 }
console.log(car)  // Vehicle { wheels: 4 }
