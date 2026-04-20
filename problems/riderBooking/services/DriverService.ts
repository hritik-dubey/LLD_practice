import { Driver, VehicleType, DriverStatus } from "../models/Driver";
import { Location } from "../models/Location";
import { IDriverRepository } from "../repository/IDriverRepository";
import { DriverFactoryRegistry } from "../factories/DriverFactory";

export class DriverService {
    constructor(private driverRepository: IDriverRepository) {}

    registerDriver(
        id: string,
        name: string,
        age: number,
        phoneNumber: string,
        email: string,
        licenseNumber: string,
        vehicleType: VehicleType,
        vehicleNumber: string,
        currentLocation: Location
    ): Driver {
        // Check if driver already exists
        const existingDriver = this.driverRepository.findById(id);
        if (existingDriver) {
            throw new Error(`Driver with id ${id} already exists`);
        }

        // Create driver using factory
        const driver = DriverFactoryRegistry.createDriver(
            vehicleType,
            id,
            name,
            age,
            phoneNumber,
            email,
            licenseNumber,
            vehicleNumber,
            currentLocation
        );

        // Save to repository
        this.driverRepository.save(driver);
        return driver;
    }

    getDriver(id: string): Driver {
        const driver = this.driverRepository.findById(id);
        if (!driver) {
            throw new Error(`Driver with id ${id} not found`);
        }
        return driver;
    }

    updateDriverLocation(id: string, location: Location): void {
        const driver = this.getDriver(id);
        driver.updateLocation(location);
        this.driverRepository.update(driver);
    }

    setDriverStatus(id: string, status: DriverStatus): void {
        const driver = this.getDriver(id);
        driver.setStatus(status);
        this.driverRepository.update(driver);
    }

    driverGoOnline(id: string): void {
        const driver = this.getDriver(id);
        driver.goOnline();
        this.driverRepository.update(driver);
    }

    driverGoOffline(id: string): void {
        const driver = this.getDriver(id);
        driver.goOffline();
        this.driverRepository.update(driver);
    }

    getAvailableDrivers(): Driver[] {
        return this.driverRepository.findByStatus(DriverStatus.AVAILABLE);
    }

    getDriversByVehicleType(vehicleType: VehicleType): Driver[] {
        return this.driverRepository.findByVehicleType(vehicleType);
    }

    getAllDrivers(): Driver[] {
        return this.driverRepository.findAll();
    }

    deleteDriver(id: string): boolean {
        return this.driverRepository.delete(id);
    }
}
