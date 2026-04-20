import { Payment, PaymentStatus } from "../models/Payment";

export interface IPaymentRepository {
    save(payment: Payment): void;
    findById(id: string): Payment | undefined;
    findByRideId(rideId: string): Payment | undefined;
    findByPassengerId(passengerId: string): Payment[];
    findByStatus(status: PaymentStatus): Payment[];
    findAll(): Payment[];
    update(payment: Payment): void;
}
