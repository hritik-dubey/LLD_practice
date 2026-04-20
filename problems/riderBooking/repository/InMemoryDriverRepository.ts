import { Driver, DriverStatus, VehicleType } from "../models/Driver";
import { IDriverRepository } from "./IDriverRepository";

export class InMemoryDriverRepository implements IDriverRepository {
    private drivers: Map<string, Driver> = new Map();

    save(driver: Driver): void {
        if (this.drivers.has(driver.id)) {
            throw new Error(`Driver with id ${driver.id} already exists`);
        }
        this.drivers.set(driver.id, driver);
    }

    findById(id: string): Driver | undefined {
        return this.drivers.get(id);
    }

    findAll(): Driver[] {
        return Array.from(this.drivers.values());
    }

    findByStatus(status: DriverStatus): Driver[] {
        return Array.from(this.drivers.values())
            .filter(driver => driver.getStatus() === status);
    }

    findByVehicleType(vehicleType: VehicleType): Driver[] {
        return Array.from(this.drivers.values())
            .filter(driver => driver.vehicleType === vehicleType);
    }

    update(driver: Driver): void {
        if (!this.drivers.has(driver.id)) {
            throw new Error(`Driver with id ${driver.id} not found`);
        }
        this.drivers.set(driver.id, driver);
    }

    delete(id: string): boolean {
        return this.drivers.delete(id);
    }
}
