import { VehicleType } from "../models/Driver";

// Strategy Interface
export interface IFareCalculationStrategy {
    calculateFare(distance: number, duration: number, surge: number): number;
}

// Base Fare Strategy
export class BaseFareStrategy implements IFareCalculationStrategy {
    private baseFare: number;
    private perKmRate: number;
    private perMinuteRate: number;

    constructor(baseFare: number, perKmRate: number, perMinuteRate: number) {
        this.baseFare = baseFare;
        this.perKmRate = perKmRate;
        this.perMinuteRate = perMinuteRate;
    }

    calculateFare(distance: number, duration: number, surge: number = 1): number {
        const fare = this.baseFare + 
                    (distance * this.perKmRate) + 
                    (duration * this.perMinuteRate);
        return Math.round(fare * surge * 100) / 100; // Round to 2 decimal places
    }
}

// Two Wheeler Fare Strategy
export class TwoWheelerFareStrategy extends BaseFareStrategy {
    constructor() {
        super(20, 8, 1); // Base: 20, Per km: 8, Per minute: 1
    }
}

// Three Wheeler Fare Strategy
export class ThreeWheelerFareStrategy extends BaseFareStrategy {
    constructor() {
        super(30, 12, 1.5); // Base: 30, Per km: 12, Per minute: 1.5
    }
}

// Four Wheeler Fare Strategy
export class FourWheelerFareStrategy extends BaseFareStrategy {
    constructor() {
        super(50, 15, 2); // Base: 50, Per km: 15, Per minute: 2
    }
}

// Premium Fare Strategy (with additional premium charges)
export class PremiumFareStrategy implements IFareCalculationStrategy {
    private baseStrategy: IFareCalculationStrategy;
    private premiumMultiplier: number;

    constructor(baseStrategy: IFareCalculationStrategy, premiumMultiplier: number = 1.5) {
        this.baseStrategy = baseStrategy;
        this.premiumMultiplier = premiumMultiplier;
    }

    calculateFare(distance: number, duration: number, surge: number = 1): number {
        const baseFare = this.baseStrategy.calculateFare(distance, duration, surge);
        return Math.round(baseFare * this.premiumMultiplier * 100) / 100;
    }
}

// Night Fare Strategy (with night charges)
export class NightFareStrategy implements IFareCalculationStrategy {
    private baseStrategy: IFareCalculationStrategy;
    private nightSurgeMultiplier: number;

    constructor(baseStrategy: IFareCalculationStrategy, nightSurgeMultiplier: number = 1.25) {
        this.baseStrategy = baseStrategy;
        this.nightSurgeMultiplier = nightSurgeMultiplier;
    }

    calculateFare(distance: number, duration: number, surge: number = 1): number {
        const hour = new Date().getHours();
        const isNightTime = hour >= 23 || hour < 6;
        
        const effectiveSurge = isNightTime 
            ? surge * this.nightSurgeMultiplier 
            : surge;
        
        return this.baseStrategy.calculateFare(distance, duration, effectiveSurge);
    }
}

// Fare Calculator Context - Strategy Pattern
export class FareCalculator {
    private strategies: Map<VehicleType, IFareCalculationStrategy>;

    constructor() {
        this.strategies = new Map([
            [VehicleType.TWO_WHEELER, new TwoWheelerFareStrategy()],
            [VehicleType.THREE_WHEELER, new ThreeWheelerFareStrategy()],
            [VehicleType.FOUR_WHEELER, new FourWheelerFareStrategy()]
        ]);
    }

    calculateFare(
        vehicleType: VehicleType, 
        distance: number, 
        duration: number, 
        surge: number = 1
    ): number {
        const strategy = this.strategies.get(vehicleType);
        
        if (!strategy) {
            throw new Error(`Fare strategy not found for vehicle type: ${vehicleType}`);
        }

        return strategy.calculateFare(distance, duration, surge);
    }

    setStrategy(vehicleType: VehicleType, strategy: IFareCalculationStrategy): void {
        this.strategies.set(vehicleType, strategy);
    }
}
