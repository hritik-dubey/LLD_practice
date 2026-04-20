export enum PackageSize {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

export enum UserType {
  EMPLOYEE = "EMPLOYEE",
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}

export enum LockerSize {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

export class Package {
  constructor(
    public readonly packageId: number,
    public readonly size: PackageSize,
    public readonly customerId: number
  ) {}
}

export class Locker {
  public isVacant: boolean = true;
  public occupiedAt: Date | null = null;
  public packageId: number | null = null;

  constructor(
    public readonly lockerId: number,
    public readonly size: LockerSize
  ) {}
}

export class User {
  constructor(
    public readonly userId: number,
    public readonly type: UserType,
    public readonly name: string
  ) {}
}
