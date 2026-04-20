/**
 * Ride Sharing Application - Complete Low Level Design
 * 
 * Design Patterns Used:
 * 1. Factory Pattern - For creating drivers and passengers
 * 2. Strategy Pattern - For fare calculation and driver search
 * 3. Repository Pattern - For data management
 * 4. Service Pattern - For business logic
 */

import { Location } from "./models/Location";
import { VehicleType } from "./models/Driver";
import { PaymentMethod } from "./models/Payment";

// Repositories
import { InMemoryPassengerRepository } from "./repository/InMemoryPassengerRepository";
import { InMemoryDriverRepository } from "./repository/InMemoryDriverRepository";
import { InMemoryRideRepository } from "./repository/InMemoryRideRepository";
import { InMemoryRatingRepository } from "./repository/InMemoryRatingRepository";
import { InMemoryPaymentRepository } from "./repository/InMemoryPaymentRepository";

// Services
import { PassengerService } from "./services/PassengerService";
import { DriverService } from "./services/DriverService";
import { RideService } from "./services/RideService";
import { RatingService } from "./services/RatingService";
import { PaymentService } from "./services/PaymentService";

// Strategies
import { DriverSearchContext, NearestDriverStrategy, BalancedDriverStrategy } from "./strategies/DriverSearchStrategy";
import { FareCalculator } from "./strategies/FareCalculationStrategy";

// Factories
import { PassengerType } from "./factories/PassengerFactory";
import { RideStatus } from "./exports";

// Initialize Repositories
const passengerRepository = new InMemoryPassengerRepository();
const driverRepository = new InMemoryDriverRepository();
const rideRepository = new InMemoryRideRepository();
const ratingRepository = new InMemoryRatingRepository();
const paymentRepository = new InMemoryPaymentRepository();

// Initialize Strategies
const driverSearchContext = new DriverSearchContext(new NearestDriverStrategy());
const fareCalculator = new FareCalculator();

// Initialize Services
const passengerService = new PassengerService(passengerRepository);
const driverService = new DriverService(driverRepository);
const rideService = new RideService(
    rideRepository,
    driverRepository,
    passengerRepository,
    driverSearchContext,
    fareCalculator
);
const ratingService = new RatingService(
    ratingRepository,
    rideRepository,
    driverRepository,
    passengerRepository
);
const paymentService = new PaymentService(paymentRepository, rideRepository);

// ============================================================
// Demo Application
// ============================================================

console.log("\n========================================");
console.log("🚗 Ride Sharing Application Demo 🚗");
console.log("========================================\n");

try {
    // ============================================================
    // 1. Register Passengers
    // ============================================================
    console.log("📝 Step 1: Registering Passengers...\n");

    const passenger1 = passengerService.registerPassenger(
        "P001",
        "Alice Johnson",
        25,
        "+1234567890",
        "alice@example.com",
        new Location(12.9716, 77.5946, "Bangalore MG Road"),
        PassengerType.REGULAR
    );
    console.log(`✅ Registered: ${passenger1.name} (${passenger1.id})`);

    const passenger2 = passengerService.registerPassenger(
        "P002",
        "Bob Smith",
        30,
        "+1234567891",
        "bob@example.com",
        new Location(12.9352, 77.6245, "Bangalore Whitefield"),
        PassengerType.PREMIUM
    );
    console.log(`✅ Registered: ${passenger2.name} (${passenger2.id})\n`);

    // ============================================================
    // 2. Register Drivers
    // ============================================================
    console.log("📝 Step 2: Registering Drivers...\n");

    const driver1 = driverService.registerDriver(
        "D001",
        "Rajesh Kumar",
        28,
        "+1234567892",
        "rajesh@example.com",
        "DL123456",
        VehicleType.TWO_WHEELER,
        "KA01AB1234",
        new Location(12.9700, 77.5900, "Near MG Road")
    );
    console.log(`✅ Registered: ${driver1.name} - ${driver1.vehicleType} (${driver1.id})`);

    const driver2 = driverService.registerDriver(
        "D002",
        "Suresh Patel",
        32,
        "+1234567893",
        "suresh@example.com",
        "DL789012",
        VehicleType.FOUR_WHEELER,
        "KA02XY5678",
        new Location(12.9720, 77.5950, "Near Cubbon Park")
    );
    console.log(`✅ Registered: ${driver2.name} - ${driver2.vehicleType} (${driver2.id})`);

    const driver3 = driverService.registerDriver(
        "D003",
        "Amit Sharma",
        25,
        "+1234567894",
        "amit@example.com",
        "DL345678",
        VehicleType.THREE_WHEELER,
        "KA03CD9012",
        new Location(12.9750, 77.5980, "Near Brigade Road")
    );
    console.log(`✅ Registered: ${driver3.name} - ${driver3.vehicleType} (${driver3.id})\n`);

    // ============================================================
    // 3. Drivers go online
    // ============================================================
    console.log("📝 Step 3: Drivers Going Online...\n");

    driverService.driverGoOnline(driver1.id);
    console.log(`✅ ${driver1.name} is now ONLINE`);

    driverService.driverGoOnline(driver2.id);
    console.log(`✅ ${driver2.name} is now ONLINE`);

    driverService.driverGoOnline(driver3.id);
    console.log(`✅ ${driver3.name} is now ONLINE\n`);

    // ============================================================
    // 4. Passenger requests a ride
    // ============================================================
    console.log("📝 Step 4: Passenger Requesting Ride...\n");

    const pickupLocation = new Location(12.9716, 77.5946, "MG Road");
    const dropLocation = new Location(12.9352, 77.6245, "Whitefield");

    const ride = rideService.requestRide(
        passenger1.id,
        pickupLocation,
        dropLocation
    );
    console.log(`✅ Ride requested by ${passenger1.name}`);
    console.log(`   Pickup: ${ride.pickupLocation.address}`);
    console.log(`   Drop: ${ride.dropLocation.address}`);
    console.log(`   Ride ID: ${ride.id}`);
    console.log(`   Status: ${ride.status}\n`);

    // ============================================================
    // 5. Find available drivers
    // ============================================================
    console.log("📝 Step 5: Finding Available Drivers...\n");

    const availableDrivers = rideService.findAvailableDrivers(ride.id, 3);
    console.log(`✅ Found ${availableDrivers.length} available drivers:`);
    availableDrivers.forEach((driver, index) => {
        const distance = pickupLocation.distanceTo(driver.currentLocation);
        console.log(`   ${index + 1}. ${driver.name} (${driver.vehicleType}) - ${distance.toFixed(2)} km away`);
    });
    console.log();

    // ============================================================
    // 6. Driver accepts the ride
    // ============================================================
    console.log("📝 Step 6: Driver Accepting Ride...\n");

    const acceptedRide = rideService.acceptRide(ride.id, driver2.id);
    console.log(`✅ ${driver2.name} accepted the ride`);
    console.log(`   Ride Status: ${acceptedRide.status}`);
    console.log(`   Driver Status: ${driverService.getDriver(driver2.id).getStatus()}\n`);

    // ============================================================
    // 7. Start the ride
    // ============================================================
    console.log("📝 Step 7: Starting Ride...\n");

    const startedRide = rideService.startRide(ride.id);
    console.log(`✅ Ride started`);
    console.log(`   Status: ${startedRide.status}`);
    console.log(`   Started At: ${startedRide.startedAt?.toLocaleTimeString()}\n`);

    // ============================================================
    // 8. Complete the ride
    // ============================================================
    console.log("📝 Step 8: Completing Ride...\n");

    const distance = pickupLocation.distanceTo(dropLocation);
    const duration = 25; // minutes
    const completedRide = rideService.completeRide(ride.id, distance, duration);

    console.log(`✅ Ride completed`);
    console.log(`   Distance: ${completedRide.distance?.toFixed(2)} km`);
    console.log(`   Duration: ${duration} minutes`);
    console.log(`   Fare: ₹${completedRide.fare?.toFixed(2)}`);
    console.log(`   Status: ${completedRide.status}`);
    console.log(`   Driver Status: ${driverService.getDriver(driver2.id).getStatus()}\n`);

    // ============================================================
    // 9. Create payment
    // ============================================================
    console.log("📝 Step 9: Processing Payment...\n");

    const payment = paymentService.createPayment(ride.id, PaymentMethod.UPI);
    console.log(`✅ Payment created`);
    console.log(`   Payment ID: ${payment.id}`);
    console.log(`   Amount: ₹${payment.amount}`);
    console.log(`   Method: ${payment.method}`);
    console.log(`   Status: ${payment.status}`);

    const processedPayment = paymentService.processPayment(payment.id);
    console.log(`✅ Payment processed successfully`);
    console.log(`   Status: ${processedPayment.status}\n`);

    // ============================================================
    // 10. Rate driver
    // ============================================================
    console.log("📝 Step 10: Rating Driver...\n");

    const driverRating = ratingService.rateDriver(
        passenger1.id,
        driver2.id,
        ride.id,
        5,
        "Excellent driver! Very professional and safe driving."
    );
    console.log(`✅ ${passenger1.name} rated ${driver2.name}: ${driverRating.rating}/5 stars`);
    console.log(`   Comment: "${driverRating.comment}"`);

    const driverAvgRating = ratingService.getUserAverageRating(driver2.id);
    console.log(`   ${driver2.name}'s Average Rating: ${driverAvgRating}/5\n`);

    // ============================================================
    // 11. Rate passenger
    // ============================================================
    console.log("📝 Step 11: Rating Passenger...\n");

    const passengerRating = ratingService.ratePassenger(
        driver2.id,
        passenger1.id,
        ride.id,
        5,
        "Great passenger! Very polite and punctual."
    );
    console.log(`✅ ${driver2.name} rated ${passenger1.name}: ${passengerRating.rating}/5 stars`);
    console.log(`   Comment: "${passengerRating.comment}"`);

    const passengerAvgRating = ratingService.getUserAverageRating(passenger1.id);
    console.log(`   ${passenger1.name}'s Average Rating: ${passengerAvgRating}/5\n`);

    // ============================================================
    // 12. Test different search strategy (Balanced)
    // ============================================================
    console.log("📝 Step 12: Testing Balanced Search Strategy...\n");

    // Create another ride request
    const ride2 = rideService.requestRide(
        passenger2.id,
        new Location(12.9352, 77.6245, "Whitefield"),
        new Location(12.9716, 77.5946, "MG Road")
    );

    // Switch to balanced strategy
    driverSearchContext.setStrategy(new BalancedDriverStrategy());
    const balancedDrivers = rideService.findAvailableDrivers(ride2.id, 3);
    
    console.log(`✅ Using Balanced Strategy (Distance + Rating):`);
    balancedDrivers.forEach((driver, index) => {
        const dist = ride2.pickupLocation.distanceTo(driver.currentLocation);
        const rating = driver.getAverageRating() || 0;
        console.log(`   ${index + 1}. ${driver.name} - ${dist.toFixed(2)} km, Rating: ${rating}/5`);
    });
    console.log();

    // ============================================================
    // 13. Display Summary
    // ============================================================
    console.log("📝 Step 13: Summary...\n");

    console.log("📊 System Statistics:");
    console.log(`   Total Passengers: ${passengerService.getAllPassengers().length}`);
    console.log(`   Total Drivers: ${driverService.getAllDrivers().length}`);
    console.log(`   Total Rides: ${rideRepository.findAll().length}`);
    console.log(`   Completed Rides: ${rideService.getRidesByStatus(RideStatus.COMPLETED).length}`);
    console.log(`   Available Drivers: ${driverService.getAvailableDrivers().length}`);
    console.log();

    console.log(`💰 Payment Summary for ${passenger1.name}:`);
    const totalSpending = paymentService.calculatePassengerSpending(passenger1.id);
    console.log(`   Total Spending: ₹${totalSpending.toFixed(2)}`);
    console.log();

    console.log(`🏆 Driver Ratings:`);
    const allDrivers = driverService.getAllDrivers();
    allDrivers.forEach(driver => {
        const avgRating = ratingService.getUserAverageRating(driver.id);
        if (avgRating > 0) {
            console.log(`   ${driver.name}: ${avgRating}/5 stars`);
        }
    });
    console.log();

    // ============================================================
    // 14. Test duplicate booking prevention
    // ============================================================
    console.log("📝 Step 14: Testing Duplicate Booking Prevention...\n");

    try {
        // Try to create another ride for passenger2 who already has an active ride
        rideService.requestRide(
            passenger2.id,
            new Location(12.9352, 77.6245, "Whitefield"),
            new Location(12.9716, 77.5946, "MG Road")
        );
    } catch (error: any) {
        console.log(`✅ Duplicate booking prevented: ${error.message}\n`);
    }

    // ============================================================
    // Success Message
    // ============================================================
    console.log("========================================");
    console.log("✅ Demo Completed Successfully!");
    console.log("========================================\n");

    console.log("🎯 Design Patterns Demonstrated:");
    console.log("   ✓ Factory Pattern - Driver & Passenger creation");
    console.log("   ✓ Strategy Pattern - Fare calculation & Driver search");
    console.log("   ✓ Repository Pattern - In-memory data management");
    console.log("   ✓ Service Pattern - Business logic separation");
    console.log();

} catch (error: any) {
    console.error("❌ Error:", error.message);
    console.error(error.stack);
}
