# 🎨 Design Patterns - Detailed Explanation

This document provides a comprehensive explanation of all design patterns used in the Ride Sharing Application.

---

## Table of Contents
1. [Factory Pattern](#1-factory-pattern)
2. [Strategy Pattern](#2-strategy-pattern)
3. [Repository Pattern](#3-repository-pattern)
4. [Service Pattern](#4-service-pattern)

---

## 1. Factory Pattern

### 🎯 Purpose
Centralize object creation with validation and business rules.

### 📍 Location
`factories/DriverFactory.ts` and `factories/PassengerFactory.ts`

### 🤔 Problem It Solves
- Different vehicle types require different age validations
- Direct object creation spreads validation logic
- Hard to maintain and extend

### ✅ Solution
Use Factory Method Pattern with registry for extensibility.

### 📝 Implementation

#### Driver Factory Hierarchy

```typescript
// Interface - Contract for all factories
interface IDriverFactory {
    createDriver(...): Driver;
}

// Concrete Factories
class TwoWheelerDriverFactory implements IDriverFactory {
    createDriver(...): Driver {
        if (age < 18) throw Error("Must be 18+");
        return new Driver(..., VehicleType.TWO_WHEELER);
    }
}

class ThreeWheelerDriverFactory implements IDriverFactory {
    createDriver(...): Driver {
        if (age < 20) throw Error("Must be 20+");
        return new Driver(..., VehicleType.THREE_WHEELER);
    }
}

class FourWheelerDriverFactory implements IDriverFactory {
    createDriver(...): Driver {
        if (age < 21) throw Error("Must be 21+");
        return new Driver(..., VehicleType.FOUR_WHEELER);
    }
}

// Registry - Maps vehicle type to factory
class DriverFactoryRegistry {
    private static factories: Map<VehicleType, IDriverFactory> = new Map([
        [VehicleType.TWO_WHEELER, new TwoWheelerDriverFactory()],
        [VehicleType.THREE_WHEELER, new ThreeWheelerDriverFactory()],
        [VehicleType.FOUR_WHEELER, new FourWheelerDriverFactory()]
    ]);

    static createDriver(vehicleType: VehicleType, ...): Driver {
        const factory = this.factories.get(vehicleType);
        return factory.createDriver(...);
    }
}
```

### 🎯 Usage Example

```typescript
// ❌ Without Factory - Manual validation everywhere
if (vehicleType === "TWO_WHEELER" && age < 18) {
    throw Error("Must be 18+");
}
const driver = new Driver(...);

// ✅ With Factory - Centralized validation
const driver = DriverFactoryRegistry.createDriver(
    VehicleType.TWO_WHEELER,
    id, name, 22, phone, email, license, vehicleNum, location
);
```

### 🚀 Benefits
1. **Centralized Validation** - All age checks in one place
2. **Easy Extension** - Add new vehicle types without changing existing code
3. **Type Safety** - TypeScript ensures correct factory selection
4. **Single Responsibility** - Each factory handles one vehicle type

### 📈 Extensibility Example

```typescript
// Adding Electric Bike
enum VehicleType {
    ELECTRIC_BIKE = "ELECTRIC_BIKE"
}

class ElectricBikeDriverFactory implements IDriverFactory {
    createDriver(...): Driver {
        if (age < 16) throw Error("Must be 16+");
        return new Driver(..., VehicleType.ELECTRIC_BIKE);
    }
}

// Register
DriverFactoryRegistry.factories.set(
    VehicleType.ELECTRIC_BIKE,
    new ElectricBikeDriverFactory()
);
```

---

## 2. Strategy Pattern

### 🎯 Purpose
Define a family of algorithms, encapsulate each one, and make them interchangeable at runtime.

### 📍 Location
`strategies/FareCalculationStrategy.ts` and `strategies/DriverSearchStrategy.ts`

### 🤔 Problem It Solves
- Different fare calculations for different vehicle types
- Multiple driver search algorithms needed
- Need to switch algorithms at runtime

### ✅ Solution
Strategy Pattern with Context class.

---

### 2.1 Fare Calculation Strategy

#### 📝 Implementation

```typescript
// Strategy Interface
interface IFareCalculationStrategy {
    calculateFare(distance: number, duration: number, surge: number): number;
}

// Base Strategy
class BaseFareStrategy implements IFareCalculationStrategy {
    constructor(
        private baseFare: number,
        private perKmRate: number,
        private perMinuteRate: number
    ) {}

    calculateFare(distance: number, duration: number, surge: number): number {
        const fare = this.baseFare + 
                    (distance * this.perKmRate) + 
                    (duration * this.perMinuteRate);
        return fare * surge;
    }
}

// Concrete Strategies
class TwoWheelerFareStrategy extends BaseFareStrategy {
    constructor() {
        super(20, 8, 1); // Base: ₹20, Per km: ₹8, Per min: ₹1
    }
}

class FourWheelerFareStrategy extends BaseFareStrategy {
    constructor() {
        super(50, 15, 2); // Base: ₹50, Per km: ₹15, Per min: ₹2
    }
}

// Decorator Pattern + Strategy
class NightFareStrategy implements IFareCalculationStrategy {
    constructor(
        private baseStrategy: IFareCalculationStrategy,
        private nightMultiplier: number = 1.25
    ) {}

    calculateFare(distance: number, duration: number, surge: number): number {
        const hour = new Date().getHours();
        const isNight = hour >= 23 || hour < 6;
        const effectiveSurge = isNight ? surge * this.nightMultiplier : surge;
        return this.baseStrategy.calculateFare(distance, duration, effectiveSurge);
    }
}

// Context Class
class FareCalculator {
    private strategies: Map<VehicleType, IFareCalculationStrategy>;

    constructor() {
        this.strategies = new Map([
            [VehicleType.TWO_WHEELER, new TwoWheelerFareStrategy()],
            [VehicleType.FOUR_WHEELER, new FourWheelerFareStrategy()]
        ]);
    }

    calculateFare(vehicleType: VehicleType, distance: number, 
                  duration: number, surge: number = 1): number {
        const strategy = this.strategies.get(vehicleType);
        return strategy.calculateFare(distance, duration, surge);
    }

    setStrategy(vehicleType: VehicleType, strategy: IFareCalculationStrategy): void {
        this.strategies.set(vehicleType, strategy);
    }
}
```

#### 🎯 Usage Example

```typescript
const calculator = new FareCalculator();

// Two wheeler ride
const fare1 = calculator.calculateFare(VehicleType.TWO_WHEELER, 10, 20);
// Calculation: 20 + (10 × 8) + (20 × 1) = ₹120

// Four wheeler ride
const fare2 = calculator.calculateFare(VehicleType.FOUR_WHEELER, 10, 20);
// Calculation: 50 + (10 × 15) + (20 × 2) = ₹240

// Night time four wheeler with surge
calculator.setStrategy(
    VehicleType.FOUR_WHEELER,
    new NightFareStrategy(new FourWheelerFareStrategy())
);
const fare3 = calculator.calculateFare(VehicleType.FOUR_WHEELER, 10, 20, 1.5);
// At night: ₹240 × 1.5 (surge) × 1.25 (night) = ₹450
```

---

### 2.2 Driver Search Strategy

#### 📝 Implementation

```typescript
// Strategy Interface
interface IDriverSearchStrategy {
    findDrivers(
        availableDrivers: Driver[], 
        pickupLocation: Location, 
        maxDrivers: number
    ): Driver[];
}

// Concrete Strategy 1: Nearest Driver
class NearestDriverStrategy implements IDriverSearchStrategy {
    findDrivers(drivers: Driver[], pickup: Location, max: number): Driver[] {
        const available = drivers.filter(d => d.isAvailable());
        
        const withDistance = available.map(driver => ({
            driver,
            distance: pickup.distanceTo(driver.currentLocation)
        }));
        
        withDistance.sort((a, b) => a.distance - b.distance);
        return withDistance.slice(0, max).map(d => d.driver);
    }
}

// Concrete Strategy 2: Highest Rated
class HighestRatedDriverStrategy implements IDriverSearchStrategy {
    findDrivers(drivers: Driver[], pickup: Location, max: number): Driver[] {
        const available = drivers.filter(d => {
            const distance = pickup.distanceTo(d.currentLocation);
            return d.isAvailable() && distance <= 10;
        });
        
        available.sort((a, b) => b.getAverageRating() - a.getAverageRating());
        return available.slice(0, max);
    }
}

// Concrete Strategy 3: Balanced
class BalancedDriverStrategy implements IDriverSearchStrategy {
    findDrivers(drivers: Driver[], pickup: Location, max: number): Driver[] {
        const available = drivers.filter(d => d.isAvailable());
        
        const withScore = available.map(driver => {
            const distance = pickup.distanceTo(driver.currentLocation);
            const rating = driver.getAverageRating() || 3;
            
            // Normalize and weight
            const distanceScore = Math.min(distance / 20, 1); // 0-1
            const ratingScore = 1 - (rating / 5); // 0-1, inverted
            const score = (distanceScore * 0.7) + (ratingScore * 0.3);
            
            return { driver, score };
        });
        
        withScore.sort((a, b) => a.score - b.score);
        return withScore.slice(0, max).map(d => d.driver);
    }
}

// Context Class
class DriverSearchContext {
    private strategy: IDriverSearchStrategy;

    constructor(strategy: IDriverSearchStrategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy: IDriverSearchStrategy): void {
        this.strategy = strategy;
    }

    searchDrivers(drivers: Driver[], pickup: Location, max: number): Driver[] {
        return this.strategy.findDrivers(drivers, pickup, max);
    }
}
```

#### 🎯 Usage Example

```typescript
const searchContext = new DriverSearchContext(new NearestDriverStrategy());

// Find nearest drivers
const nearest = searchContext.searchDrivers(allDrivers, pickupLocation, 5);

// Switch to highest rated
searchContext.setStrategy(new HighestRatedDriverStrategy());
const topRated = searchContext.searchDrivers(allDrivers, pickupLocation, 5);

// Switch to balanced
searchContext.setStrategy(new BalancedDriverStrategy());
const balanced = searchContext.searchDrivers(allDrivers, pickupLocation, 5);
```

### 🚀 Benefits
1. **Runtime Selection** - Choose algorithm at runtime
2. **Easy Extension** - Add new strategies without modifying existing code
3. **Clean Separation** - Each algorithm isolated
4. **Testability** - Test each strategy independently

---

## 3. Repository Pattern

### 🎯 Purpose
Abstract data access layer and provide a collection-like interface.

### 📍 Location
`repository/` folder

### 🤔 Problem It Solves
- Direct database access couples business logic to data layer
- Hard to switch between storage mechanisms
- Difficult to test with real databases

### ✅ Solution
Repository Pattern with interfaces.

### 📝 Implementation

```typescript
// Repository Interface
interface IDriverRepository {
    save(driver: Driver): void;
    findById(id: string): Driver | undefined;
    findAll(): Driver[];
    findByStatus(status: DriverStatus): Driver[];
    findByVehicleType(type: VehicleType): Driver[];
    update(driver: Driver): void;
    delete(id: string): boolean;
}

// In-Memory Implementation
class InMemoryDriverRepository implements IDriverRepository {
    private drivers: Map<string, Driver> = new Map();

    save(driver: Driver): void {
        if (this.drivers.has(driver.id)) {
            throw new Error(`Driver with id ${driver.id} already exists`);
        }
        this.drivers.set(driver.id, driver);
    }

    findById(id: string): Driver | undefined {
        return this.drivers.get(id);
    }

    findAll(): Driver[] {
        return Array.from(this.drivers.values());
    }

    findByStatus(status: DriverStatus): Driver[] {
        return this.findAll().filter(d => d.getStatus() === status);
    }

    findByVehicleType(type: VehicleType): Driver[] {
        return this.findAll().filter(d => d.vehicleType === type);
    }

    update(driver: Driver): void {
        if (!this.drivers.has(driver.id)) {
            throw new Error(`Driver with id ${driver.id} not found`);
        }
        this.drivers.set(driver.id, driver);
    }

    delete(id: string): boolean {
        return this.drivers.delete(id);
    }
}

// Can easily add database implementation
class PostgresDriverRepository implements IDriverRepository {
    constructor(private db: PostgresClient) {}

    async save(driver: Driver): Promise<void> {
        await this.db.query(
            'INSERT INTO drivers VALUES ($1, $2, ...)',
            [driver.id, driver.name, ...]
        );
    }

    async findById(id: string): Promise<Driver | undefined> {
        const result = await this.db.query(
            'SELECT * FROM drivers WHERE id = $1',
            [id]
        );
        return result.rows[0] ? this.mapToDriver(result.rows[0]) : undefined;
    }

    // ... other methods
}
```

### 🎯 Usage Example

```typescript
// In production, switch implementations easily
const driverRepo: IDriverRepository = 
    process.env.NODE_ENV === 'production'
        ? new PostgresDriverRepository(dbClient)
        : new InMemoryDriverRepository();

const driverService = new DriverService(driverRepo);

// Service doesn't know or care about storage implementation
const driver = driverService.getDriver("D001");
```

### 🚀 Benefits
1. **Abstraction** - Business logic independent of data access
2. **Testability** - Easy to mock repositories in tests
3. **Flexibility** - Switch storage without changing business logic
4. **Centralized Queries** - All data access in one place

---

## 4. Service Pattern

### 🎯 Purpose
Encapsulate business logic and orchestrate between layers.

### 📍 Location
`services/` folder

### 🤔 Problem It Solves
- Business logic scattered across application
- Controllers/routes become fat
- Hard to reuse logic
- Difficult to test

### ✅ Solution
Service Layer Pattern.

### 📝 Implementation

```typescript
// Service uses repositories and strategies
class RideService {
    constructor(
        private rideRepository: IRideRepository,
        private driverRepository: IDriverRepository,
        private passengerRepository: IPassengerRepository,
        private driverSearchContext: DriverSearchContext,
        private fareCalculator: FareCalculator
    ) {}

    // Business logic: Request a ride
    requestRide(
        passengerId: string,
        pickupLocation: Location,
        dropLocation: Location
    ): Ride {
        // 1. Verify passenger exists
        const passenger = this.passengerRepository.findById(passengerId);
        if (!passenger) {
            throw new Error(`Passenger not found`);
        }

        // 2. Check for duplicate booking (business rule)
        const activeRides = this.rideRepository
            .findByPassengerId(passengerId)
            .filter(ride => 
                ride.status === RideStatus.REQUESTED || 
                ride.status === RideStatus.ACCEPTED ||
                ride.status === RideStatus.IN_PROGRESS
            );

        if (activeRides.length > 0) {
            throw new Error(`Passenger already has an active ride`);
        }

        // 3. Create ride
        const ride = new Ride(
            uuidv4(),
            passengerId,
            pickupLocation,
            dropLocation,
            new Date()
        );

        // 4. Save to repository
        this.rideRepository.save(ride);
        return ride;
    }

    // Business logic: Complete ride
    completeRide(rideId: string, distance: number, duration: number): Ride {
        // 1. Get ride
        const ride = this.rideRepository.findById(rideId);
        if (!ride) throw new Error(`Ride not found`);

        // 2. Get driver
        if (!ride.driverId) throw new Error(`No driver assigned`);
        const driver = this.driverRepository.findById(ride.driverId);
        if (!driver) throw new Error(`Driver not found`);

        // 3. Calculate fare using strategy
        const fare = this.fareCalculator.calculateFare(
            driver.vehicleType,
            distance,
            duration
        );

        // 4. Update ride and driver
        ride.complete(distance, fare);
        driver.goOnline();

        // 5. Save changes
        this.rideRepository.update(ride);
        this.driverRepository.update(driver);

        return ride;
    }

    // Other business logic methods...
}
```

### 🎯 Usage Example

```typescript
// Initialize dependencies
const rideRepository = new InMemoryRideRepository();
const driverRepository = new InMemoryDriverRepository();
const passengerRepository = new InMemoryPassengerRepository();
const searchStrategy = new DriverSearchContext(new NearestDriverStrategy());
const fareCalculator = new FareCalculator();

// Create service
const rideService = new RideService(
    rideRepository,
    driverRepository,
    passengerRepository,
    searchStrategy,
    fareCalculator
);

// Use service - all business logic encapsulated
const ride = rideService.requestRide(
    "P001",
    pickupLocation,
    dropLocation
);

const drivers = rideService.findAvailableDrivers(ride.id, 5);
rideService.acceptRide(ride.id, drivers[0].id);
rideService.startRide(ride.id);
const completed = rideService.completeRide(ride.id, 15.5, 30);
```

### 🚀 Benefits
1. **Centralized Logic** - All business rules in one place
2. **Reusability** - Logic can be used from anywhere
3. **Testability** - Easy to test with mocked dependencies
4. **Separation of Concerns** - Services orchestrate, don't handle data/UI
5. **Transaction Management** - Services can manage transactions

---

## 🎯 Pattern Interaction Flow

### Complete Ride Flow with All Patterns

```
1. User Action: Register Driver
   ↓
   DriverService.registerDriver()
   ↓
   DriverFactoryRegistry.createDriver() ← Factory Pattern
   ↓
   Validate age for vehicle type
   ↓
   Create Driver entity
   ↓
   DriverRepository.save() ← Repository Pattern
   ↓
   Stored in Map

2. User Action: Request Ride
   ↓
   RideService.requestRide() ← Service Pattern
   ↓
   PassengerRepository.findById()
   ↓
   Check duplicate booking (business rule)
   ↓
   Create Ride entity
   ↓
   RideRepository.save()

3. System Action: Find Drivers
   ↓
   RideService.findAvailableDrivers()
   ↓
   DriverRepository.findAll()
   ↓
   DriverSearchContext.searchDrivers() ← Strategy Pattern
   ↓
   NearestDriverStrategy.findDrivers()
   ↓
   Returns sorted drivers

4. User Action: Complete Ride
   ↓
   RideService.completeRide()
   ↓
   RideRepository.findById()
   ↓
   DriverRepository.findById()
   ↓
   FareCalculator.calculateFare() ← Strategy Pattern
   ↓
   TwoWheelerFareStrategy.calculateFare()
   ↓
   Update Ride & Driver
   ↓
   Repository.update() × 2
```

---

## 📚 Summary

| Pattern | Purpose | Key Benefit | Example |
|---------|---------|-------------|---------|
| **Factory** | Object creation | Centralized validation | Driver creation with age rules |
| **Strategy** | Algorithm selection | Runtime flexibility | Fare calculation per vehicle |
| **Repository** | Data access | Storage independence | Swap in-memory ↔ database |
| **Service** | Business logic | Logic centralization | Ride lifecycle management |

---

## 🎓 Learning Takeaways

1. **Factory Pattern** - When you need controlled object creation
2. **Strategy Pattern** - When you have multiple algorithms for same task
3. **Repository Pattern** - When you want to abstract data access
4. **Service Pattern** - When you need to organize business logic

All patterns work together to create a:
- ✅ Maintainable codebase
- ✅ Testable system
- ✅ Extensible architecture
- ✅ SOLID-compliant design

---

**End of Design Patterns Explanation**
