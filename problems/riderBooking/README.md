# 🚗 Ride Sharing Application - Low Level Design

A comprehensive ride-sharing system implementation in TypeScript following SOLID principles and multiple design patterns.

## 📋 Features

### Functional Requirements
- ✅ Passenger booking
- ✅ Driver acceptance
- ✅ Passenger rating system
- ✅ Driver rating system
- ✅ Payment processing
- ✅ Driver search
- ✅ Fare calculations
- ✅ Details management for riders and passengers

### Non-Functional Requirements
- ✅ No duplicate booking prevention
- ✅ Scalable architecture
- ✅ Reliable data management

## 🏗️ Architecture & Design Patterns

### 1. **Factory Pattern**
Used for creating drivers and passengers with different types and validation rules.

**Implementation:**
- `DriverFactory` - Creates drivers based on vehicle type (Two-wheeler, Three-wheeler, Four-wheeler)
- `PassengerFactory` - Creates passengers based on type (Regular, Premium)

**Benefits:**
- Centralized object creation
- Type-specific validation
- Easy to extend with new vehicle types

### 2. **Strategy Pattern**
Used for fare calculation and driver search algorithms.

**Implementation:**
- `FareCalculationStrategy` - Different fare calculation based on vehicle type
  - Two Wheeler Fare Strategy
  - Three Wheeler Fare Strategy
  - Four Wheeler Fare Strategy
  - Premium Fare Strategy
  - Night Fare Strategy

- `DriverSearchStrategy` - Different driver search algorithms
  - Nearest Driver Strategy
  - Highest Rated Driver Strategy
  - Balanced Strategy (Distance + Rating)
  - Vehicle Type Specific Strategy

**Benefits:**
- Runtime algorithm selection
- Easy to add new strategies
- Clean separation of concerns

### 3. **Repository Pattern**
Provides abstraction over data access layer.

**Implementation:**
- `PassengerRepository` - Passenger data management
- `DriverRepository` - Driver data management
- `RideRepository` - Ride data management
- `RatingRepository` - Rating data management
- `PaymentRepository` - Payment data management

**Benefits:**
- Data access abstraction
- Easy to switch between in-memory and database
- Testability

### 4. **Service Pattern**
Encapsulates business logic in dedicated service classes.

**Implementation:**
- `PassengerService` - Passenger operations
- `DriverService` - Driver operations
- `RideService` - Ride booking and management
- `RatingService` - Rating management
- `PaymentService` - Payment processing

**Benefits:**
- Business logic separation
- Single responsibility
- Reusability

## 📁 Project Structure

```
riderBooking/
├── models/                    # Entity models
│   ├── Location.ts
│   ├── Passenger.ts
│   ├── Driver.ts
│   ├── Ride.ts
│   ├── Rating.ts
│   └── Payment.ts
├── factories/                 # Factory Pattern
│   ├── DriverFactory.ts
│   └── PassengerFactory.ts
├── strategies/                # Strategy Pattern
│   ├── FareCalculationStrategy.ts
│   └── DriverSearchStrategy.ts
├── repository/                # Repository Pattern
│   ├── IPassengerRepository.ts
│   ├── InMemoryPassengerRepository.ts
│   ├── IDriverRepository.ts
│   ├── InMemoryDriverRepository.ts
│   ├── IRideRepository.ts
│   ├── InMemoryRideRepository.ts
│   ├── IRatingRepository.ts
│   ├── InMemoryRatingRepository.ts
│   ├── IPaymentRepository.ts
│   └── InMemoryPaymentRepository.ts
├── services/                  # Service Pattern
│   ├── PassengerService.ts
│   ├── DriverService.ts
│   ├── RideService.ts
│   ├── RatingService.ts
│   └── PaymentService.ts
├── index.ts                   # Main application
├── package.json
├── tsconfig.json
├── requirment.txt
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run the application
npm start

# Development mode with auto-reload
npm run dev
```

## 💡 Usage Example

```typescript
// Initialize repositories
const passengerRepository = new InMemoryPassengerRepository();
const driverRepository = new InMemoryDriverRepository();
const rideRepository = new InMemoryRideRepository();

// Initialize strategies
const driverSearchContext = new DriverSearchContext(new NearestDriverStrategy());
const fareCalculator = new FareCalculator();

// Initialize services
const passengerService = new PassengerService(passengerRepository);
const driverService = new DriverService(driverRepository);
const rideService = new RideService(
    rideRepository,
    driverRepository,
    passengerRepository,
    driverSearchContext,
    fareCalculator
);

// Register a passenger
const passenger = passengerService.registerPassenger(
    "P001",
    "Alice Johnson",
    25,
    "+1234567890",
    "alice@example.com",
    new Location(12.9716, 77.5946, "MG Road"),
    PassengerType.REGULAR
);

// Register a driver
const driver = driverService.registerDriver(
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

// Driver goes online
driverService.driverGoOnline(driver.id);

// Request a ride
const ride = rideService.requestRide(
    passenger.id,
    new Location(12.9716, 77.5946, "MG Road"),
    new Location(12.9352, 77.6245, "Whitefield")
);

// Find available drivers
const availableDrivers = rideService.findAvailableDrivers(ride.id);

// Driver accepts ride
rideService.acceptRide(ride.id, driver.id);

// Start ride
rideService.startRide(ride.id);

// Complete ride
const completedRide = rideService.completeRide(ride.id, 15.5, 30);

// Process payment
const payment = paymentService.createPayment(ride.id, PaymentMethod.UPI);
paymentService.processPayment(payment.id);

// Rate driver
ratingService.rateDriver(passenger.id, driver.id, ride.id, 5, "Excellent!");
```

## 🎯 Key Design Decisions

### 1. **Separation of Concerns**
Each layer has a specific responsibility:
- Models: Data structure
- Factories: Object creation
- Strategies: Algorithms
- Repositories: Data access
- Services: Business logic

### 2. **Interface-Based Design**
All repositories and strategies use interfaces, allowing easy mocking and testing.

### 3. **No Duplicate Bookings**
The system prevents passengers from having multiple active rides simultaneously.

### 4. **Flexible Fare Calculation**
Different fare strategies can be applied based on vehicle type, time of day, or premium features.

### 5. **Multiple Driver Search Algorithms**
The system supports different driver search strategies that can be switched at runtime.

## 🔄 Workflow

1. **Passenger Registration** → Factory creates passenger with validation
2. **Driver Registration** → Factory creates driver with age/vehicle validation
3. **Driver Goes Online** → Status changed to AVAILABLE
4. **Ride Request** → Passenger requests ride with pickup and drop locations
5. **Driver Search** → Strategy finds best matching drivers
6. **Ride Acceptance** → Driver accepts ride, status changes to BUSY
7. **Ride Start** → Ride begins
8. **Ride Completion** → Fare calculated using strategy, driver available again
9. **Payment Processing** → Payment created and processed
10. **Ratings** → Both parties can rate each other

## 🧪 Testing Features

The main application (`index.ts`) demonstrates:
- Passenger and driver registration
- Multiple vehicle types
- Ride booking and completion
- Payment processing
- Rating system
- Different search strategies
- Duplicate booking prevention
- Comprehensive statistics

## 🌟 Extensibility

The system is designed to be easily extended:

### Add New Vehicle Type
```typescript
// 1. Add to enum
enum VehicleType {
    ELECTRIC_SCOOTER = "ELECTRIC_SCOOTER"
}

// 2. Create factory
class ElectricScooterDriverFactory implements IDriverFactory {
    // Implementation
}

// 3. Register in DriverFactoryRegistry
```

### Add New Fare Strategy
```typescript
class WeekendFareStrategy implements IFareCalculationStrategy {
    calculateFare(distance: number, duration: number, surge: number): number {
        // Custom weekend pricing
    }
}
```

### Add New Search Strategy
```typescript
class EcoFriendlyDriverStrategy implements IDriverSearchStrategy {
    findDrivers(drivers: Driver[], location: Location, max: number): Driver[] {
        // Filter for eco-friendly vehicles
    }
}
```

## 📊 System Statistics

The system tracks:
- Total passengers and drivers
- Active and completed rides
- Driver availability
- Payment summaries
- User ratings and averages

## 🛡️ Error Handling

The system includes comprehensive error handling for:
- Invalid age for driver types
- Duplicate bookings
- Non-existent users
- Invalid ride status transitions
- Payment failures
- Rating validation

## 📝 License

MIT

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
