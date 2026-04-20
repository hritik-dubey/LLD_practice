// ---------------- Driver Interface ----------------

interface IDriver {
    name: string
    age: number
    registered_number: string
}

// ---------------- Driver Class ----------------

class Driver implements IDriver {
    name: string
    age: number
    registered_number: string

    constructor(name: string, age: number, registered_number: string) {
        this.name = name
        this.age = age
        this.registered_number = registered_number
    }
}

// ---------------- Factory Type ----------------

type DriverFactory = {
    createDriver(
        name: string,
        age: number,
        registered_number: string
    ): IDriver
}

// ---------------- Concrete Driver Factories ----------------

class TwoWheelerDriver {
    static createDriver(
        name: string,
        age: number,
        registered_number: string
    ): IDriver {
        if (age < 18) {
            throw new Error("Two-wheeler driver must be at least 18")
        }
        return new Driver(name, age, registered_number)
    }
}

class FourWheelerDriver {
    static createDriver(
        name: string,
        age: number,
        registered_number: string
    ): IDriver {
        if (age < 21) {
            throw new Error("Four-wheeler driver must be at least 21")
        }
        return new Driver(name, age, registered_number)
    }
}

// ---------------- Enum ----------------

enum DriverType {
    TwoWheeler,
    FourWheeler
}

// ---------------- Main Driver Factory ----------------

class RegisterDriverFactory {
    private static factories: Record<DriverType, DriverFactory> = {
        [DriverType.TwoWheeler]: TwoWheelerDriver,
        [DriverType.FourWheeler]: FourWheelerDriver
    }

    static registerDriver(
        name: string,
        age: number,
        registered_number: string,
        type: DriverType
    ): IDriver {
        const factory = this.factories[type]

        if (!factory) {
            throw new Error("Driver type not supported")
        }

        return factory.createDriver(name, age, registered_number)
    }
}

// ---------------- Usage ----------------

const bikeDriver = RegisterDriverFactory.registerDriver(
    "Rahul",
    22,
    "KA01AB1234",
    DriverType.TwoWheeler
)

const carDriver = RegisterDriverFactory.registerDriver(
    "Amit",
    25,
    "KA02XY5678",
    DriverType.FourWheeler
)

console.log(bikeDriver)
console.log(carDriver)


