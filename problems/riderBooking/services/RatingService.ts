import { Rating } from "../models/Rating";
import { IRatingRepository } from "../repository/IRatingRepository";
import { IRideRepository } from "../repository/IRideRepository";
import { IDriverRepository } from "../repository/IDriverRepository";
import { IPassengerRepository } from "../repository/IPassengerRepository";
import { RideStatus } from "../models/Ride";
import { v4 as uuidv4 } from "uuid";

export class RatingService {
    constructor(
        private ratingRepository: IRatingRepository,
        private rideRepository: IRideRepository,
        private driverRepository: IDriverRepository,
        private passengerRepository: IPassengerRepository
    ) {}

    // Passenger rates driver
    rateDriver(
        passengerId: string,
        driverId: string,
        rideId: string,
        rating: number,
        comment: string = ""
    ): Rating {
        // Verify ride exists and is completed
        const ride = this.rideRepository.findById(rideId);
        if (!ride) {
            throw new Error(`Ride with id ${rideId} not found`);
        }

        if (ride.status !== RideStatus.COMPLETED) {
            throw new Error(`Ride must be completed before rating`);
        }

        if (ride.passengerId !== passengerId) {
            throw new Error(`Passenger ${passengerId} is not associated with ride ${rideId}`);
        }

        if (ride.driverId !== driverId) {
            throw new Error(`Driver ${driverId} is not associated with ride ${rideId}`);
        }

        // Check if rating already exists for this ride (from passenger to driver)
        const existingRatings = this.ratingRepository.findByRideId(rideId);
        const alreadyRated = existingRatings.some(
            r => r.fromUserId === passengerId && r.toUserId === driverId
        );

        if (alreadyRated) {
            throw new Error(`Passenger has already rated this ride`);
        }

        // Create rating
        const newRating = new Rating(
            uuidv4(),
            passengerId,
            driverId,
            rideId,
            rating,
            comment,
            new Date()
        );

        this.ratingRepository.save(newRating);

        // Update driver's ratings
        const driver = this.driverRepository.findById(driverId);
        if (driver) {
            driver.addRating(newRating);
            this.driverRepository.update(driver);
        }

        return newRating;
    }

    // Driver rates passenger
    ratePassenger(
        driverId: string,
        passengerId: string,
        rideId: string,
        rating: number,
        comment: string = ""
    ): Rating {
        // Verify ride exists and is completed
        const ride = this.rideRepository.findById(rideId);
        if (!ride) {
            throw new Error(`Ride with id ${rideId} not found`);
        }

        if (ride.status !== RideStatus.COMPLETED) {
            throw new Error(`Ride must be completed before rating`);
        }

        if (ride.driverId !== driverId) {
            throw new Error(`Driver ${driverId} is not associated with ride ${rideId}`);
        }

        if (ride.passengerId !== passengerId) {
            throw new Error(`Passenger ${passengerId} is not associated with ride ${rideId}`);
        }

        // Check if rating already exists
        const existingRatings = this.ratingRepository.findByRideId(rideId);
        const alreadyRated = existingRatings.some(
            r => r.fromUserId === driverId && r.toUserId === passengerId
        );

        if (alreadyRated) {
            throw new Error(`Driver has already rated this ride`);
        }

        // Create rating
        const newRating = new Rating(
            uuidv4(),
            driverId,
            passengerId,
            rideId,
            rating,
            comment,
            new Date()
        );

        this.ratingRepository.save(newRating);

        // Update passenger's ratings
        const passenger = this.passengerRepository.findById(passengerId);
        if (passenger) {
            passenger.addRating(newRating);
            this.passengerRepository.update(passenger);
        }

        return newRating;
    }

    // Get ratings for a user (driver or passenger)
    getUserRatings(userId: string): Rating[] {
        return this.ratingRepository.findByUserId(userId);
    }

    // Get ratings for a specific ride
    getRideRatings(rideId: string): Rating[] {
        return this.ratingRepository.findByRideId(rideId);
    }

    // Get average rating for a user
    getUserAverageRating(userId: string): number {
        const ratings = this.ratingRepository.findByUserId(userId);
        if (ratings.length === 0) return 0;

        const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
        return Math.round((sum / ratings.length) * 100) / 100;
    }
}
