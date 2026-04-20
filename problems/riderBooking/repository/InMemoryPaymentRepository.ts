import { Payment, PaymentStatus } from "../models/Payment";
import { IPaymentRepository } from "./IPaymentRepository";

export class InMemoryPaymentRepository implements IPaymentRepository {
    private payments: Map<string, Payment> = new Map();

    save(payment: Payment): void {
        if (this.payments.has(payment.id)) {
            throw new Error(`Payment with id ${payment.id} already exists`);
        }
        this.payments.set(payment.id, payment);
    }

    findById(id: string): Payment | undefined {
        return this.payments.get(id);
    }

    findByRideId(rideId: string): Payment | undefined {
        return Array.from(this.payments.values())
            .find(payment => payment.rideId === rideId);
    }

    findByPassengerId(passengerId: string): Payment[] {
        return Array.from(this.payments.values())
            .filter(payment => payment.passengerId === passengerId);
    }

    findByStatus(status: PaymentStatus): Payment[] {
        return Array.from(this.payments.values())
            .filter(payment => payment.status === status);
    }

    findAll(): Payment[] {
        return Array.from(this.payments.values());
    }

    update(payment: Payment): void {
        if (!this.payments.has(payment.id)) {
            throw new Error(`Payment with id ${payment.id} not found`);
        }
        this.payments.set(payment.id, payment);
    }
}
