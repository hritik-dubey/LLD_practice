import { Locker, Package, User, UserType } from "./entities";
import { LockerService } from "./locker.service";
import { OtpService } from "./otp.service";

export class PackageService {
  constructor(
    private lockerService: LockerService,
    private otpService: OtpService
  ) {}

  // called by delivery person (employee)
  assignLocker(employee: User, pkg: Package): { locker: Locker; otp: number } {
    if (employee.type !== UserType.EMPLOYEE) {
      throw new Error("Only employees can assign lockers");
    }

    const locker = this.lockerService.allocateLocker(pkg);
    const otp = this.otpService.generateOtp({ userId: pkg.customerId } as User, locker.lockerId);

    console.log(
      `[Notification] OTP ${otp} sent to customer ${pkg.customerId} for locker ${locker.lockerId}`
    );

    return { locker, otp };
  }

  // called by customer to pick up package
  collectPackage(customer: User, lockerId: number, otp: number): void {
    if (customer.type !== UserType.CUSTOMER) {
      throw new Error("Only customers can collect packages");
    }

    const isValid = this.otpService.verifyOtp(customer.userId, lockerId, otp);
    if (!isValid) throw new Error("Invalid or expired OTP");

    this.lockerService.vacateLocker(lockerId);

    console.log(
      `[Notification] Customer ${customer.userId} collected package from locker ${lockerId}`
    );
  }

  // called by admin to force-vacate overdue lockers
  clearOverdueLockers(admin: User): Locker[] {
    if (admin.type !== UserType.ADMIN) {
      throw new Error("Only admins can clear overdue lockers");
    }

    const overdueLockers = this.lockerService.getOverdueLockers();

    overdueLockers.forEach((locker) => {
      this.otpService.invalidateOtp(locker.packageId!, locker.lockerId);
      this.lockerService.vacateLocker(locker.lockerId);
      console.log(`[Admin] Force-vacated overdue locker ${locker.lockerId}`);
    });

    return overdueLockers;
  }
}
