# 🚀 Quick Start Guide

## Installation

```bash
# Navigate to project directory
cd riderBooking

# Install dependencies
npm install
```

## Running the Application

```bash
# Run the demo application
npm start
```

## Expected Output

When you run `npm start`, you'll see a complete demo of the ride-sharing system:

```
========================================
🚗 Ride Sharing Application Demo 🚗
========================================

📝 Step 1: Registering Passengers...
✅ Registered: Alice Johnson (P001)
✅ Registered: Bob Smith (P002)

📝 Step 2: Registering Drivers...
✅ Registered: Rajesh Kumar - TWO_WHEELER (D001)
✅ Registered: Suresh Patel - FOUR_WHEELER (D002)
✅ Registered: Amit Sharma - THREE_WHEELER (D003)

📝 Step 3: Drivers Going Online...
✅ Rajesh Kumar is now ONLINE
✅ Suresh Patel is now ONLINE
✅ Amit Sharma is now ONLINE

📝 Step 4: Passenger Requesting Ride...
✅ Ride requested by Alice Johnson
   Pickup: MG Road
   Drop: Whitefield
   Ride ID: <uuid>
   Status: REQUESTED

📝 Step 5: Finding Available Drivers...
✅ Found 3 available drivers:
   1. Suresh Patel (FOUR_WHEELER) - 0.23 km away
   2. Amit Sharma (THREE_WHEELER) - 0.38 km away
   3. Rajesh Kumar (TWO_WHEELER) - 0.46 km away

📝 Step 6: Driver Accepting Ride...
✅ Suresh Patel accepted the ride
   Ride Status: ACCEPTED
   Driver Status: BUSY

📝 Step 7: Starting Ride...
✅ Ride started
   Status: IN_PROGRESS

📝 Step 8: Completing Ride...
✅ Ride completed
   Distance: 15.32 km
   Duration: 25 minutes
   Fare: ₹329.80
   Status: COMPLETED
   Driver Status: AVAILABLE

📝 Step 9: Processing Payment...
✅ Payment created
   Payment ID: <uuid>
   Amount: ₹329.80
   Method: UPI
   Status: PENDING
✅ Payment processed successfully
   Status: COMPLETED

📝 Step 10: Rating Driver...
✅ Alice Johnson rated Suresh Patel: 5/5 stars
   Comment: "Excellent driver! Very professional and safe driving."
   Suresh Patel's Average Rating: 5/5

📝 Step 11: Rating Passenger...
✅ Suresh Patel rated Alice Johnson: 5/5 stars
   Comment: "Great passenger! Very polite and punctual."
   Alice Johnson's Average Rating: 5/5

📝 Step 12: Testing Balanced Search Strategy...
✅ Using Balanced Strategy (Distance + Rating):
   1. Rajesh Kumar - 16.28 km, Rating: 0/5
   2. Amit Sharma - 16.46 km, Rating: 0/5
   3. Suresh Patel - 16.36 km, Rating: 5/5

📝 Step 13: Summary...
📊 System Statistics:
   Total Passengers: 2
   Total Drivers: 3
   Total Rides: 2
   Completed Rides: 1
   Available Drivers: 3

💰 Payment Summary for Alice Johnson:
   Total Spending: ₹329.80

🏆 Driver Ratings:
   Suresh Patel: 5/5 stars

📝 Step 14: Testing Duplicate Booking Prevention...
✅ Duplicate booking prevented: Passenger P002 already has an active ride

========================================
✅ Demo Completed Successfully!
========================================

🎯 Design Patterns Demonstrated:
   ✓ Factory Pattern - Driver & Passenger creation
   ✓ Strategy Pattern - Fare calculation & Driver search
   ✓ Repository Pattern - In-memory data management
   ✓ Service Pattern - Business logic separation
```

## Project Structure

```
riderBooking/
├── models/              # Entity definitions
├── factories/           # Factory Pattern
├── strategies/          # Strategy Pattern
├── repository/          # Repository Pattern
├── services/            # Service Pattern (Business Logic)
├── index.ts             # Main application demo
├── exports.ts           # Central export file
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── README.md            # Detailed documentation
├── ARCHITECTURE.md      # Architecture guide
└── QUICKSTART.md        # This file
```

## Key Components

### 1. Models (Entities)
- `Location` - Geolocation with distance calculation
- `Passenger` - Passenger entity with ratings
- `Driver` - Driver entity with status and vehicle type
- `Ride` - Ride entity with status lifecycle
- `Rating` - Rating system for both drivers and passengers
- `Payment` - Payment processing with multiple methods

### 2. Factories (Creational Pattern)
- `DriverFactory` - Creates drivers with vehicle-specific validation
  - TwoWheelerDriverFactory (18+ years)
  - ThreeWheelerDriverFactory (20+ years)
  - FourWheelerDriverFactory (21+ years)
- `PassengerFactory` - Creates passengers with type validation
  - RegularPassengerFactory (13+ years)
  - PremiumPassengerFactory (18+ years)

### 3. Strategies (Behavioral Pattern)

#### Fare Calculation Strategies
- `TwoWheelerFareStrategy` - Base: ₹20, Per km: ₹8
- `ThreeWheelerFareStrategy` - Base: ₹30, Per km: ₹12
- `FourWheelerFareStrategy` - Base: ₹50, Per km: ₹15
- `PremiumFareStrategy` - Applies premium multiplier
- `NightFareStrategy` - Night time surge pricing

#### Driver Search Strategies
- `NearestDriverStrategy` - Finds closest drivers
- `HighestRatedDriverStrategy` - Finds best-rated drivers
- `BalancedDriverStrategy` - Balance of distance and rating
- `VehicleTypeDriverStrategy` - Filter by vehicle type

### 4. Repositories (Data Access Pattern)
- Interface-based design for easy swapping
- Current implementation: In-memory (Map-based)
- Can be replaced with database implementations

### 5. Services (Business Logic)
- `PassengerService` - Passenger management
- `DriverService` - Driver management
- `RideService` - Ride lifecycle management
- `RatingService` - Rating system
- `PaymentService` - Payment processing

## Using Individual Components

### Register a Passenger
```typescript
import { PassengerService } from './services/PassengerService';
import { InMemoryPassengerRepository } from './repository/InMemoryPassengerRepository';
import { Location } from './models/Location';
import { PassengerType } from './factories/PassengerFactory';

const repo = new InMemoryPassengerRepository();
const service = new PassengerService(repo);

const passenger = service.registerPassenger(
    "P001",
    "John Doe",
    25,
    "+1234567890",
    "john@example.com",
    new Location(12.9716, 77.5946, "MG Road"),
    PassengerType.REGULAR
);
```

### Register a Driver
```typescript
import { DriverService } from './services/DriverService';
import { InMemoryDriverRepository } from './repository/InMemoryDriverRepository';
import { VehicleType } from './models/Driver';

const repo = new InMemoryDriverRepository();
const service = new DriverService(repo);

const driver = service.registerDriver(
    "D001",
    "Rajesh Kumar",
    28,
    "+1234567892",
    "rajesh@example.com",
    "DL123456",
    VehicleType.FOUR_WHEELER,
    "KA01AB1234",
    new Location(12.9700, 77.5900, "Near MG Road")
);
```

### Calculate Fare
```typescript
import { FareCalculator } from './strategies/FareCalculationStrategy';
import { VehicleType } from './models/Driver';

const calculator = new FareCalculator();
const fare = calculator.calculateFare(
    VehicleType.FOUR_WHEELER,
    15.5,  // distance in km
    30,    // duration in minutes
    1.0    // surge multiplier
);
console.log(`Fare: ₹${fare}`);
```

### Find Nearest Drivers
```typescript
import { DriverSearchContext, NearestDriverStrategy } from './strategies/DriverSearchStrategy';

const searchContext = new DriverSearchContext(new NearestDriverStrategy());
const nearestDrivers = searchContext.searchDrivers(
    allDrivers,
    pickupLocation,
    5  // max drivers to return
);
```

## Testing Different Scenarios

### Scenario 1: Two-Wheeler Ride
```typescript
const driver = driverService.registerDriver(
    "D001", "Driver Name", 20, "...", "...", "DL123",
    VehicleType.TWO_WHEELER, "KA01AB1234",
    new Location(12.97, 77.59, "Location")
);

const fare = fareCalculator.calculateFare(
    VehicleType.TWO_WHEELER,
    10,  // 10 km
    20   // 20 minutes
);
// Expected: Base(20) + Distance(10×8) + Time(20×1) = ₹120
```

### Scenario 2: Premium Passenger
```typescript
const premiumPassenger = passengerService.registerPassenger(
    "P002", "Premium User", 25, "...", "...",
    new Location(12.97, 77.59, "Location"),
    PassengerType.PREMIUM  // Premium type
);
```

### Scenario 3: Night Fare
```typescript
import { NightFareStrategy, FourWheelerFareStrategy } from './strategies/FareCalculationStrategy';

const nightStrategy = new NightFareStrategy(new FourWheelerFareStrategy());
const nightFare = nightStrategy.calculateFare(10, 20, 1.0);
// Applies 1.25x multiplier if between 11PM-6AM
```

### Scenario 4: Duplicate Booking Prevention
```typescript
// First booking
const ride1 = rideService.requestRide(passengerId, pickup, drop);

// Try to book again - will throw error
try {
    const ride2 = rideService.requestRide(passengerId, pickup, drop);
} catch (error) {
    console.log("Duplicate booking prevented!");
}
```

## Design Patterns Quick Reference

| Pattern | Usage | Location |
|---------|-------|----------|
| **Factory** | Creating drivers/passengers with validation | `factories/` |
| **Strategy** | Runtime algorithm selection (fare/search) | `strategies/` |
| **Repository** | Data access abstraction | `repository/` |
| **Service** | Business logic encapsulation | `services/` |

## Common Operations

### Complete Ride Workflow
```typescript
// 1. Register
const passenger = passengerService.registerPassenger(...);
const driver = driverService.registerDriver(...);

// 2. Driver online
driverService.driverGoOnline(driver.id);

// 3. Request ride
const ride = rideService.requestRide(passenger.id, pickup, drop);

// 4. Find drivers
const drivers = rideService.findAvailableDrivers(ride.id);

// 5. Accept
rideService.acceptRide(ride.id, driver.id);

// 6. Start
rideService.startRide(ride.id);

// 7. Complete
const completed = rideService.completeRide(ride.id, distance, duration);

// 8. Payment
const payment = paymentService.createPayment(ride.id, PaymentMethod.UPI);
paymentService.processPayment(payment.id);

// 9. Rate
ratingService.rateDriver(passenger.id, driver.id, ride.id, 5, "Great!");
ratingService.ratePassenger(driver.id, passenger.id, ride.id, 5, "Nice!");
```

## Troubleshooting

### TypeScript Errors
```bash
npm install
npm run build
```

### Missing uuid Module
```bash
npm install uuid
npm install --save-dev @types/uuid
```

### Cannot Find Module
Make sure you're in the correct directory:
```bash
cd /home/hritik/PERSONAL/LLD/problems/riderBooking
npm install
```

## Next Steps

1. ✅ Run the demo: `npm start`
2. 📖 Read the architecture: `ARCHITECTURE.md`
3. 💻 Modify and experiment with the code
4. 🧪 Add your own test scenarios
5. 🚀 Extend with new features

## Additional Resources

- `README.md` - Comprehensive project documentation
- `ARCHITECTURE.md` - Detailed architecture and design patterns
- `requirment.txt` - Original requirements
- Code files - Well-commented implementation

## Support

For questions or issues, refer to:
- Architecture documentation
- Code comments
- Design pattern implementations
- TypeScript documentation

Happy Coding! 🎉
