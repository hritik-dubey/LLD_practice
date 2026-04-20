import { User } from "./entities";

interface OtpRecord {
  otp: number;
  generatedAt: Date;
}

const OTP_EXPIRY_MINUTES = 10;

export class OtpService {
  // key: `${userId}_${lockerId}`
  private otpStore: Map<string, OtpRecord> = new Map();

  private buildKey(userId: number, lockerId: number): string {
    return `${userId}_${lockerId}`;
  }

  generateOtp(user: User, lockerId: number): number {
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit otp
    const key = this.buildKey(user.userId, lockerId);

    this.otpStore.set(key, {
      otp,
      generatedAt: new Date(),
    });

    return otp;
  }

  verifyOtp(userId: number, lockerId: number, otp: number): boolean {
    const key = this.buildKey(userId, lockerId);
    const record = this.otpStore.get(key);

    if (!record) return false;
    if (record.otp !== otp) return false;

    const elapsedMinutes =
      (Date.now() - record.generatedAt.getTime()) / 1000 / 60;
    if (elapsedMinutes > OTP_EXPIRY_MINUTES) return false;

    this.otpStore.delete(key);
    return true;
  }

  invalidateOtp(userId: number, lockerId: number): void {
    const key = this.buildKey(userId, lockerId);
    this.otpStore.delete(key);
  }
}
