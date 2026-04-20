export enum PaymentStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}

export enum PaymentMethod {
    CASH = "CASH",
    CARD = "CARD",
    UPI = "UPI",
    WALLET = "WALLET"
}

export class Payment {
    constructor(
        public id: string,
        public rideId: string,
        public passengerId: string,
        public amount: number,
        public method: PaymentMethod,
        public status: PaymentStatus,
        public createdAt: Date,
        public updatedAt: Date
    ) {}

    markCompleted(): void {
        this.status = PaymentStatus.COMPLETED;
        this.updatedAt = new Date();
    }

    markFailed(): void {
        this.status = PaymentStatus.FAILED;
        this.updatedAt = new Date();
    }
}
