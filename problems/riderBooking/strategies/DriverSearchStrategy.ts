import { Driver, DriverStatus } from "../models/Driver";
import { Location } from "../models/Location";

// Strategy Interface
export interface IDriverSearchStrategy {
    findDrivers(
        availableDrivers: Driver[], 
        pickupLocation: Location, 
        maxDrivers: number
    ): Driver[];
}

// Nearest Driver Search Strategy
export class NearestDriverStrategy implements IDriverSearchStrategy {
    findDrivers(
        availableDrivers: Driver[], 
        pickupLocation: Location, 
        maxDrivers: number = 5
    ): Driver[] {
        // Filter only available drivers
        const available = availableDrivers.filter(d => d.isAvailable());

        // Calculate distances and sort by nearest
        const driversWithDistance = available.map(driver => ({
            driver,
            distance: pickupLocation.distanceTo(driver.currentLocation)
        }));

        driversWithDistance.sort((a, b) => a.distance - b.distance);

        return driversWithDistance
            .slice(0, maxDrivers)
            .map(d => d.driver);
    }
}

// Highest Rated Driver Search Strategy
export class HighestRatedDriverStrategy implements IDriverSearchStrategy {
    findDrivers(
        availableDrivers: Driver[], 
        pickupLocation: Location, 
        maxDrivers: number = 5
    ): Driver[] {
        // Filter only available drivers within reasonable distance (e.g., 10 km)
        const available = availableDrivers.filter(d => {
            const distance = pickupLocation.distanceTo(d.currentLocation);
            return d.isAvailable() && distance <= 10;
        });

        // Sort by rating (descending)
        available.sort((a, b) => b.getAverageRating() - a.getAverageRating());

        return available.slice(0, maxDrivers);
    }
}

// Balanced Strategy (combination of distance and rating)
export class BalancedDriverStrategy implements IDriverSearchStrategy {
    findDrivers(
        availableDrivers: Driver[], 
        pickupLocation: Location, 
        maxDrivers: number = 5
    ): Driver[] {
        // Filter only available drivers
        const available = availableDrivers.filter(d => d.isAvailable());

        // Calculate score based on distance and rating
        const driversWithScore = available.map(driver => {
            const distance = pickupLocation.distanceTo(driver.currentLocation);
            const rating = driver.getAverageRating() || 3; // Default rating if no ratings
            
            // Score: lower is better
            // Normalize distance (assume max relevant distance is 20km)
            // Normalize rating (5 is max)
            const distanceScore = Math.min(distance / 20, 1); // 0 to 1
            const ratingScore = 1 - (rating / 5); // 0 to 1 (inverted, lower is better)
            
            // Weighted score: 70% distance, 30% rating
            const score = (distanceScore * 0.7) + (ratingScore * 0.3);
            
            return { driver, score, distance, rating };
        });

        driversWithScore.sort((a, b) => a.score - b.score);

        return driversWithScore
            .slice(0, maxDrivers)
            .map(d => d.driver);
    }
}

// Vehicle Type Specific Strategy
export class VehicleTypeDriverStrategy implements IDriverSearchStrategy {
    constructor(
        private vehicleTypes: string[],
        private baseStrategy: IDriverSearchStrategy = new NearestDriverStrategy()
    ) {}

    findDrivers(
        availableDrivers: Driver[], 
        pickupLocation: Location, 
        maxDrivers: number = 5
    ): Driver[] {
        // Filter by vehicle type
        const filteredDrivers = availableDrivers.filter(d => 
            this.vehicleTypes.includes(d.vehicleType)
        );

        // Use base strategy on filtered drivers
        return this.baseStrategy.findDrivers(filteredDrivers, pickupLocation, maxDrivers);
    }
}

// Driver Search Context
export class DriverSearchContext {
    private strategy: IDriverSearchStrategy;

    constructor(strategy: IDriverSearchStrategy = new NearestDriverStrategy()) {
        this.strategy = strategy;
    }

    setStrategy(strategy: IDriverSearchStrategy): void {
        this.strategy = strategy;
    }

    searchDrivers(
        availableDrivers: Driver[], 
        pickupLocation: Location, 
        maxDrivers: number = 5
    ): Driver[] {
        return this.strategy.findDrivers(availableDrivers, pickupLocation, maxDrivers);
    }
}
