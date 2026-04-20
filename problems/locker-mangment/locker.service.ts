import { Locker, LockerSize, Package, PackageSize } from "./entities";

const OVERDUE_DAYS = 3;

const sizePriority: Record<PackageSize, number> = {
  [PackageSize.SMALL]: 1,
  [PackageSize.MEDIUM]: 2,
  [PackageSize.LARGE]: 3,
};

export interface LockerAllocationStrategy {
  allocate(pkg: Package, vacantLockers: Locker[]): Locker | null;
}

export class RandomAllocationStrategy implements LockerAllocationStrategy {
  allocate(pkg: Package, vacantLockers: Locker[]): Locker | null {
    const compatible = vacantLockers.filter(
      (l) => sizePriority[l.size as unknown as PackageSize] >= sizePriority[pkg.size]
    );

    if (compatible.length === 0) return null;

    return compatible[Math.floor(Math.random() * compatible.length)];
  }
}

export class LockerService {
  private lockers: Locker[] = [];

  constructor(private allocationStrategy: LockerAllocationStrategy) {}

  addLocker(lockerId: number, size: LockerSize): void {
    this.lockers.push(new Locker(lockerId, size));
  }

  allocateLocker(pkg: Package): Locker {
    const vacantLockers = this.getVacantLockers();
    const locker = this.allocationStrategy.allocate(pkg, vacantLockers);

    if (!locker) throw new Error("No compatible locker available");

    locker.isVacant = false;
    locker.occupiedAt = new Date();
    locker.packageId = pkg.packageId;

    return locker;
  }

  vacateLocker(lockerId: number): void {
    const locker = this.findLocker(lockerId);

    locker.isVacant = true;
    locker.occupiedAt = null;
    locker.packageId = null;
  }

  getVacantLockers(): Locker[] {
    return this.lockers.filter((l) => l.isVacant);
  }

  getOverdueLockers(): Locker[] {
    const now = Date.now();
    return this.lockers.filter((l) => {
      if (l.isVacant || !l.occupiedAt) return false;
      const elapsedDays = (now - l.occupiedAt.getTime()) / 1000 / 60 / 60 / 24;
      return elapsedDays > OVERDUE_DAYS;
    });
  }

  private findLocker(lockerId: number): Locker {
    const locker = this.lockers.find((l) => l.lockerId === lockerId);
    if (!locker) throw new Error(`Locker ${lockerId} not found`);
    return locker;
  }
}
