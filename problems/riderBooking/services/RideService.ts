import { Ride, RideStatus } from "../models/Ride";
import { Location } from "../models/Location";
import { IRideRepository } from "../repository/IRideRepository";
import { IDriverRepository } from "../repository/IDriverRepository";
import { IPassengerRepository } from "../repository/IPassengerRepository";
import { DriverSearchContext } from "../strategies/DriverSearchStrategy";
import { FareCalculator } from "../strategies/FareCalculationStrategy";
import { v4 as uuidv4 } from "uuid";

export class RideService {
    constructor(
        private rideRepository: IRideRepository,
        private driverRepository: IDriverRepository,
        private passengerRepository: IPassengerRepository,
        private driverSearchContext: DriverSearchContext,
        private fareCalculator: FareCalculator
    ) {}

    // Passenger requests a ride
    requestRide(
        passengerId: string,
        pickupLocation: Location,
        dropLocation: Location
    ): Ride {
        // Verify passenger exists
        const passenger = this.passengerRepository.findById(passengerId);
        if (!passenger) {
            throw new Error(`Passenger with id ${passengerId} not found`);
        }

        // Check for duplicate booking (no active rides for this passenger)
        const activeRides = this.rideRepository
            .findByPassengerId(passengerId)
            .filter(ride => 
                ride.status === RideStatus.REQUESTED || 
                ride.status === RideStatus.ACCEPTED ||
                ride.status === RideStatus.IN_PROGRESS
            );

        if (activeRides.length > 0) {
            throw new Error(`Passenger ${passengerId} already has an active ride`);
        }

        // Create new ride
        const ride = new Ride(
            uuidv4(),
            passengerId,
            pickupLocation,
            dropLocation,
            new Date()
        );

        this.rideRepository.save(ride);
        return ride;
    }

    // Find available drivers for a ride
    findAvailableDrivers(rideId: string, maxDrivers: number = 5) {
        const ride = this.rideRepository.findById(rideId);
        if (!ride) {
            throw new Error(`Ride with id ${rideId} not found`);
        }

        const availableDrivers = this.driverRepository.findAll();
        return this.driverSearchContext.searchDrivers(
            availableDrivers,
            ride.pickupLocation,
            maxDrivers
        );
    }

    // Driver accepts a ride
    acceptRide(rideId: string, driverId: string): Ride {
        const ride = this.rideRepository.findById(rideId);
        if (!ride) {
            throw new Error(`Ride with id ${rideId} not found`);
        }

        const driver = this.driverRepository.findById(driverId);
        if (!driver) {
            throw new Error(`Driver with id ${driverId} not found`);
        }

        if (!driver.isAvailable()) {
            throw new Error(`Driver ${driverId} is not available`);
        }

        // Accept the ride
        ride.accept(driverId);
        driver.markBusy();

        this.rideRepository.update(ride);
        this.driverRepository.update(driver);

        return ride;
    }

    // Start the ride
    startRide(rideId: string): Ride {
        const ride = this.rideRepository.findById(rideId);
        if (!ride) {
            throw new Error(`Ride with id ${rideId} not found`);
        }

        ride.start();
        this.rideRepository.update(ride);
        return ride;
    }

    // Complete the ride
    completeRide(rideId: string, actualDistance: number, duration: number): Ride {
        const ride = this.rideRepository.findById(rideId);
        if (!ride) {
            throw new Error(`Ride with id ${rideId} not found`);
        }

        if (!ride.driverId) {
            throw new Error(`Ride ${rideId} has no assigned driver`);
        }

        const driver = this.driverRepository.findById(ride.driverId);
        if (!driver) {
            throw new Error(`Driver not found`);
        }

        // Calculate fare using strategy pattern
        const fare = this.fareCalculator.calculateFare(
            driver.vehicleType,
            actualDistance,
            duration
        );

        // Complete the ride
        ride.complete(actualDistance, fare);
        driver.goOnline(); // Driver becomes available again

        this.rideRepository.update(ride);
        this.driverRepository.update(driver);

        return ride;
    }

    // Cancel a ride
    cancelRide(rideId: string): Ride {
        const ride = this.rideRepository.findById(rideId);
        if (!ride) {
            throw new Error(`Ride with id ${rideId} not found`);
        }

        // If driver was assigned, make them available again
        if (ride.driverId) {
            const driver = this.driverRepository.findById(ride.driverId);
            if (driver) {
                driver.goOnline();
                this.driverRepository.update(driver);
            }
        }

        ride.cancel();
        this.rideRepository.update(ride);
        return ride;
    }

    // Get ride details
    getRide(rideId: string): Ride {
        const ride = this.rideRepository.findById(rideId);
        if (!ride) {
            throw new Error(`Ride with id ${rideId} not found`);
        }
        return ride;
    }

    // Get rides by passenger
    getPassengerRides(passengerId: string): Ride[] {
        return this.rideRepository.findByPassengerId(passengerId);
    }

    // Get rides by driver
    getDriverRides(driverId: string): Ride[] {
        return this.rideRepository.findByDriverId(driverId);
    }

    // Get rides by status
    getRidesByStatus(status: RideStatus): Ride[] {
        return this.rideRepository.findByStatus(status);
    }
}
