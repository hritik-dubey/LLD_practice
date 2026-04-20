import { Package, PackageSize, Locker, LockerSize, User, UserType } from "./entities";
import { LockerService, RandomAllocationStrategy } from "./locker.service";
import { OtpService } from "./otp.service";
import { PackageService } from "./package.service";

// --- setup ---
const allocationStrategy = new RandomAllocationStrategy();
const lockerService = new LockerService(allocationStrategy);
const otpService = new OtpService();
const packageService = new PackageService(lockerService, otpService);

// add lockers to the system
lockerService.addLocker(1, LockerSize.SMALL);
lockerService.addLocker(2, LockerSize.MEDIUM);
lockerService.addLocker(3, LockerSize.LARGE);
lockerService.addLocker(4, LockerSize.SMALL);

// create users
const admin = new User(1, UserType.ADMIN, "Jack");
const employee = new User(2, UserType.EMPLOYEE, "Smith");
const customer = new User(3, UserType.CUSTOMER, "Bob");

// create packages (customerId links package to customer)
const pkg1 = new Package(101, PackageSize.SMALL, customer.userId);
const pkg2 = new Package(102, PackageSize.LARGE, customer.userId);

console.log("\n========== FLOW 1: Normal delivery and pickup ==========");

// employee assigns locker for pkg1
const { locker: locker1, otp: otp1 } = packageService.assignLocker(employee, pkg1);
console.log(`Locker assigned: ${locker1.lockerId}, OTP: ${otp1}`);
console.log(`Vacant lockers after assignment: ${lockerService.getVacantLockers().map(l => l.lockerId)}`);

// customer collects pkg1 with correct otp
packageService.collectPackage(customer, locker1.lockerId, otp1);
console.log(`Vacant lockers after collection: ${lockerService.getVacantLockers().map(l => l.lockerId)}`);


console.log("\n========== FLOW 2: Wrong OTP ==========");

const { locker: locker2, otp: otp2 } = packageService.assignLocker(employee, pkg2);
console.log(`Locker assigned: ${locker2.lockerId}, OTP: ${otp2}`);

try {
  packageService.collectPackage(customer, locker2.lockerId, 1234);
} catch (e: any) {
  console.log(`Error: ${e.message}`);
}


console.log("\n========== FLOW 3: Admin clears overdue lockers ==========");

// simulate overdue by backdating occupiedAt
locker2.occupiedAt = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000); // 4 days ago

const cleared = packageService.clearOverdueLockers(admin);
console.log(`Cleared ${cleared.length} overdue locker(s)`);
console.log(`Vacant lockers after admin clear: ${lockerService.getVacantLockers().map(l => l.lockerId)}`);


console.log("\n========== FLOW 4: Unauthorizedcd  access ==========");

try {
  packageService.assignLocker(admin, pkg1); // admin trying to assign
} catch (e: any) {
  console.log(`Error: ${e.message}`);
}

try {
  packageService.clearOverdueLockers(employee); // employee trying admin action
} catch (e: any) {
  console.log(`Error: ${e.message}`);
}
