import { Driver, DriverStatus, VehicleType } from "../models/Driver";

export interface IDriverRepository {
    save(driver: Driver): void;
    findById(id: string): Driver | undefined;
    findAll(): Driver[];
    findByStatus(status: DriverStatus): Driver[];
    findByVehicleType(vehicleType: VehicleType): Driver[];
    update(driver: Driver): void;
    delete(id: string): boolean;
}
