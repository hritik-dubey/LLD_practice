# 🏗️ System Architecture Documentation

## Overview
This document describes the architecture and design patterns used in the Ride Sharing Application.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│                        (index.ts)                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                     Service Layer                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ PassengerService │ DriverService │ RideService       │   │
│  │ RatingService    │ PaymentService                    │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                 Strategy/Factory Layer                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Factories:                                           │   │
│  │   - DriverFactory                                    │   │
│  │   - PassengerFactory                                 │   │
│  │                                                       │   │
│  │ Strategies:                                          │   │
│  │   - FareCalculationStrategy                          │   │
│  │   - DriverSearchStrategy                             │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                  Repository Layer                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ IPassengerRepository │ IDriverRepository            │   │
│  │ IRideRepository      │ IRatingRepository            │   │
│  │ IPaymentRepository                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                     Data Layer                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ In-Memory Storage (Maps)                             │   │
│  │ Can be replaced with Database implementations        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Design Patterns

### 1. Factory Pattern

**Purpose:** Centralized object creation with validation

```
┌─────────────────────────────────────────┐
│      DriverFactoryRegistry              │
│  (Factory Method Pattern)               │
└──────────┬──────────────────────────────┘
           │
           ├──► TwoWheelerDriverFactory
           │    • Age validation (18+)
           │    • Creates TWO_WHEELER driver
           │
           ├──► ThreeWheelerDriverFactory
           │    • Age validation (20+)
           │    • Creates THREE_WHEELER driver
           │
           └──► FourWheelerDriverFactory
                • Age validation (21+)
                • Creates FOUR_WHEELER driver
```

**Code Flow:**
```typescript
DriverFactoryRegistry.createDriver(
    VehicleType.FOUR_WHEELER, // Selects factory
    ...params
) → FourWheelerDriverFactory → validates → creates Driver
```

### 2. Strategy Pattern (Fare Calculation)

**Purpose:** Runtime selection of fare calculation algorithm

```
┌─────────────────────────────────────────┐
│         FareCalculator                  │
│       (Context Class)                   │
└──────────┬──────────────────────────────┘
           │
           ├──► TwoWheelerFareStrategy
           │    • Base: ₹20
           │    • Per km: ₹8
           │    • Per min: ₹1
           │
           ├──► ThreeWheelerFareStrategy
           │    • Base: ₹30
           │    • Per km: ₹12
           │    • Per min: ₹1.5
           │
           ├──► FourWheelerFareStrategy
           │    • Base: ₹50
           │    • Per km: ₹15
           │    • Per min: ₹2
           │
           ├──► PremiumFareStrategy
           │    • Multiplier: 1.5x
           │
           └──► NightFareStrategy
                • Multiplier: 1.25x (11PM-6AM)
```

**Calculation Formula:**
```
Fare = (BaseFare + (Distance × PerKmRate) + (Duration × PerMinRate)) × Surge
```

### 3. Strategy Pattern (Driver Search)

**Purpose:** Different algorithms to find best driver

```
┌─────────────────────────────────────────┐
│     DriverSearchContext                 │
│       (Context Class)                   │
└──────────┬──────────────────────────────┘
           │
           ├──► NearestDriverStrategy
           │    • Sorts by distance
           │    • Returns closest drivers
           │
           ├──► HighestRatedDriverStrategy
           │    • Filters within 10km
           │    • Sorts by rating
           │
           ├──► BalancedDriverStrategy
           │    • Score = 70% distance + 30% rating
           │    • Balanced approach
           │
           └──► VehicleTypeDriverStrategy
                • Filters by vehicle type
                • Uses base strategy
```

**Search Algorithm (Balanced):**
```
Score = (distance/20 × 0.7) + ((5-rating)/5 × 0.3)
Lower score = Better match
```

### 4. Repository Pattern

**Purpose:** Abstract data access layer

```
┌──────────────────────────────────────────────┐
│          Service Layer                       │
│  (Uses interfaces, not implementations)      │
└──────────┬───────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────┐
│       Repository Interfaces                  │
│  IPassengerRepository                        │
│  IDriverRepository                           │
│  IRideRepository                             │
└──────────┬───────────────────────────────────┘
           │
           ├──► In-Memory Implementations
           │    • InMemoryPassengerRepository
           │    • InMemoryDriverRepository
           │    • etc.
           │
           └──► Can add Database Implementations
                • PostgresPassengerRepository
                • MongoDriverRepository
                • etc.
```

**Benefits:**
- Easy to swap implementations
- Testability (mock repositories)
- No direct database coupling in services

### 5. Service Pattern

**Purpose:** Encapsulate business logic

```
Services coordinate between layers:

PassengerService ──┐
DriverService ─────┤
RideService ───────┼──► Uses ──► Repositories
RatingService ─────┤          ┌─► Factories
PaymentService ────┘          └─► Strategies
```

## Data Flow Example: Complete Ride Journey

```
1. Request Ride
   User Input → PassengerService.registerPassenger()
             → PassengerFactory validates & creates
             → PassengerRepository.save()

2. Driver Registration
   User Input → DriverService.registerDriver()
             → DriverFactory validates & creates
             → DriverRepository.save()

3. Driver Goes Online
   Driver Action → DriverService.driverGoOnline()
                → Updates driver status
                → DriverRepository.update()

4. Passenger Requests Ride
   Passenger Action → RideService.requestRide()
                   → Checks for duplicate booking
                   → Creates Ride entity
                   → RideRepository.save()

5. Find Available Drivers
   System → RideService.findAvailableDrivers()
         → DriverRepository.findAll()
         → DriverSearchStrategy.findDrivers()
         → Returns sorted driver list

6. Driver Accepts Ride
   Driver Action → RideService.acceptRide()
                → Updates ride (adds driverId)
                → Updates driver (BUSY status)
                → Repositories updated

7. Start Ride
   Driver Action → RideService.startRide()
                → Updates ride status (IN_PROGRESS)
                → RideRepository.update()

8. Complete Ride
   Driver Action → RideService.completeRide()
                → FareCalculator.calculateFare()
                → Updates ride (COMPLETED, fare)
                → Updates driver (AVAILABLE)
                → Repositories updated

9. Process Payment
   System → PaymentService.createPayment()
         → Creates Payment entity
         → PaymentRepository.save()
         → PaymentService.processPayment()
         → Updates payment status

10. Rate Each Other
    Both Users → RatingService.rateDriver()
              → RatingService.ratePassenger()
              → Creates Rating entities
              → Updates user ratings
              → Repositories updated
```

## Class Diagram

```
┌──────────────┐         ┌──────────────┐
│  Passenger   │         │   Driver     │
├──────────────┤         ├──────────────┤
│ - id         │         │ - id         │
│ - name       │         │ - name       │
│ - age        │         │ - vehicleType│
│ - location   │         │ - status     │
│ - ratings[]  │         │ - ratings[]  │
└──────┬───────┘         └──────┬───────┘
       │                        │
       │      ┌─────────────┐   │
       └─────►│    Ride     │◄──┘
              ├─────────────┤
              │ - id        │
              │ - status    │
              │ - pickup    │
              │ - drop      │
              │ - fare      │
              └──────┬──────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    ┌────▼─────┐          ┌─────▼────┐
    │ Payment  │          │  Rating  │
    ├──────────┤          ├──────────┤
    │ - amount │          │ - rating │
    │ - method │          │ - comment│
    │ - status │          │ - date   │
    └──────────┘          └──────────┘
```

## State Transitions

### Ride Status
```
REQUESTED → ACCEPTED → IN_PROGRESS → COMPLETED
    │                                     ▲
    └──────────► CANCELLED ◄──────────────┘
```

### Driver Status
```
OFFLINE → AVAILABLE ◄──► BUSY
   ▲          │
   └──────────┘
```

### Payment Status
```
PENDING → COMPLETED
   │
   └──► FAILED → REFUNDED
```

## Key Features Implementation

### 1. No Duplicate Booking
```typescript
// Check in RideService.requestRide()
const activeRides = rideRepository
    .findByPassengerId(passengerId)
    .filter(ride => 
        ride.status === REQUESTED || 
        ride.status === ACCEPTED ||
        ride.status === IN_PROGRESS
    );

if (activeRides.length > 0) {
    throw new Error("Passenger already has an active ride");
}
```

### 2. Dynamic Strategy Selection
```typescript
// Runtime strategy switching
driverSearchContext.setStrategy(new NearestDriverStrategy());
const nearby = driverSearchContext.searchDrivers(...);

driverSearchContext.setStrategy(new BalancedDriverStrategy());
const balanced = driverSearchContext.searchDrivers(...);
```

### 3. Extensibility
```typescript
// Add new vehicle type
enum VehicleType {
    ELECTRIC_BIKE = "ELECTRIC_BIKE" // Just add here
}

// Create factory
class ElectricBikeDriverFactory implements IDriverFactory {
    // Implement interface
}

// Register
DriverFactoryRegistry.register(
    VehicleType.ELECTRIC_BIKE,
    new ElectricBikeDriverFactory()
);
```

## SOLID Principles Applied

### Single Responsibility (S)
- Each service handles one entity
- Repositories only handle data access
- Strategies only handle algorithms

### Open/Closed (O)
- New strategies can be added without modifying existing code
- New factories can be added without changing factory registry
- New repositories can be added by implementing interfaces

### Liskov Substitution (L)
- All repository implementations are interchangeable
- All strategy implementations are interchangeable
- Interfaces ensure contracts

### Interface Segregation (I)
- Repository interfaces are specific to entity needs
- Strategy interfaces are focused on single algorithm
- No client depends on methods it doesn't use

### Dependency Inversion (D)
- Services depend on repository interfaces, not implementations
- High-level modules (services) don't depend on low-level modules (repositories)
- Both depend on abstractions (interfaces)

## Performance Considerations

### In-Memory Storage
- O(1) lookups using Map
- O(n) for filtered searches
- Suitable for demonstration and testing

### Scalability
- Repository pattern allows database integration
- Service layer can be distributed
- Strategies can be optimized independently

### Future Enhancements
- Add caching layer
- Implement database repositories
- Add message queues for async operations
- Implement connection pooling
- Add rate limiting

## Testing Strategy

### Unit Tests
- Test each service independently
- Mock repositories
- Test strategies separately

### Integration Tests
- Test complete workflows
- Use in-memory repositories
- Test error scenarios

### Example Test Structure
```typescript
describe('RideService', () => {
    it('should prevent duplicate bookings', () => {
        // Test duplicate booking prevention
    });
    
    it('should calculate fare correctly', () => {
        // Test fare calculation
    });
});
```

## Conclusion

This architecture provides:
- ✅ Clean separation of concerns
- ✅ High testability
- ✅ Easy extensibility
- ✅ SOLID principles adherence
- ✅ Multiple design patterns
- ✅ Production-ready structure
