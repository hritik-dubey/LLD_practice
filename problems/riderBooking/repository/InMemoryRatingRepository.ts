import { Rating } from "../models/Rating";
import { IRatingRepository } from "./IRatingRepository";

export class InMemoryRatingRepository implements IRatingRepository {
    private ratings: Map<string, Rating> = new Map();

    save(rating: Rating): void {
        if (this.ratings.has(rating.id)) {
            throw new Error(`Rating with id ${rating.id} already exists`);
        }
        this.ratings.set(rating.id, rating);
    }

    findById(id: string): Rating | undefined {
        return this.ratings.get(id);
    }

    findByUserId(userId: string): Rating[] {
        return Array.from(this.ratings.values())
            .filter(rating => rating.toUserId === userId);
    }

    findByRideId(rideId: string): Rating[] {
        return Array.from(this.ratings.values())
            .filter(rating => rating.rideId === rideId);
    }

    findAll(): Rating[] {
        return Array.from(this.ratings.values());
    }
}
