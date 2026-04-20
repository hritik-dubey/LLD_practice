import { Payment, PaymentMethod, PaymentStatus } from "../models/Payment";
import { IPaymentRepository } from "../repository/IPaymentRepository";
import { IRideRepository } from "../repository/IRideRepository";
import { RideStatus } from "../models/Ride";
import { v4 as uuidv4 } from "uuid";

export class PaymentService {
    constructor(
        private paymentRepository: IPaymentRepository,
        private rideRepository: IRideRepository
    ) {}

    // Create payment for a ride
    createPayment(
        rideId: string,
        paymentMethod: PaymentMethod
    ): Payment {
        // Verify ride exists and is completed
        const ride = this.rideRepository.findById(rideId);
        if (!ride) {
            throw new Error(`Ride with id ${rideId} not found`);
        }

        if (ride.status !== RideStatus.COMPLETED) {
            throw new Error(`Ride must be completed before creating payment`);
        }

        if (!ride.fare) {
            throw new Error(`Ride fare not calculated`);
        }

        // Check if payment already exists for this ride
        const existingPayment = this.paymentRepository.findByRideId(rideId);
        if (existingPayment) {
            throw new Error(`Payment already exists for ride ${rideId}`);
        }

        // Create payment
        const payment = new Payment(
            uuidv4(),
            rideId,
            ride.passengerId,
            ride.fare,
            paymentMethod,
            PaymentStatus.PENDING,
            new Date(),
            new Date()
        );

        this.paymentRepository.save(payment);

        // Link payment to ride
        ride.setPaymentId(payment.id);
        this.rideRepository.update(ride);

        return payment;
    }

    // Process payment
    processPayment(paymentId: string): Payment {
        const payment = this.paymentRepository.findById(paymentId);
        if (!payment) {
            throw new Error(`Payment with id ${paymentId} not found`);
        }

        if (payment.status !== PaymentStatus.PENDING) {
            throw new Error(`Payment is not in pending status`);
        }

        // Simulate payment processing
        try {
            // In real implementation, this would integrate with payment gateway
            payment.markCompleted();
            this.paymentRepository.update(payment);
            return payment;
        } catch (error) {
            payment.markFailed();
            this.paymentRepository.update(payment);
            throw new Error(`Payment processing failed: ${error}`);
        }
    }

    // Get payment by id
    getPayment(paymentId: string): Payment {
        const payment = this.paymentRepository.findById(paymentId);
        if (!payment) {
            throw new Error(`Payment with id ${paymentId} not found`);
        }
        return payment;
    }

    // Get payment by ride id
    getPaymentByRideId(rideId: string): Payment | undefined {
        return this.paymentRepository.findByRideId(rideId);
    }

    // Get all payments by passenger
    getPassengerPayments(passengerId: string): Payment[] {
        return this.paymentRepository.findByPassengerId(passengerId);
    }

    // Get payments by status
    getPaymentsByStatus(status: PaymentStatus): Payment[] {
        return this.paymentRepository.findByStatus(status);
    }

    // Calculate total earnings for a passenger
    calculatePassengerSpending(passengerId: string): number {
        const payments = this.paymentRepository.findByPassengerId(passengerId);
        const completedPayments = payments.filter(
            p => p.status === PaymentStatus.COMPLETED
        );
        return completedPayments.reduce((sum, p) => sum + p.amount, 0);
    }
}
