export class Location {
    constructor(
        public latitude: number,
        public longitude: number,
        public address: string
    ) {}

    // Calculate distance between two locations (simplified Haversine formula)
    distanceTo(other: Location): number {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(other.latitude - this.latitude);
        const dLon = this.toRad(other.longitude - this.longitude);
        
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(this.latitude)) * 
            Math.cos(this.toRad(other.latitude)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private toRad(degrees: number): number {
        return degrees * (Math.PI / 180);
    }
}
