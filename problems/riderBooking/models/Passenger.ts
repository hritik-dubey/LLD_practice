import { Location } from "./Location";
import { Rating } from "./Rating";

export class Passenger {
    private ratings: Rating[] = [];

    constructor(
        public id: string,
        public name: string,
        public age: number,
        public phoneNumber: string,
        public email: string,
        public currentLocation: Location
    ) {}

    updateLocation(location: Location): void {
        this.currentLocation = location;
    }

    addRating(rating: Rating): void {
        this.ratings.push(rating);
    }

    getAverageRating(): number {
        if (this.ratings.length === 0) return 0;
        const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
        return sum / this.ratings.length;
    }

    getRatings(): Rating[] {
        return [...this.ratings];
    }
}
