import { Rating } from "../models/Rating";

export interface IRatingRepository {
    save(rating: Rating): void;
    findById(id: string): Rating | undefined;
    findByUserId(userId: string): Rating[];
    findByRideId(rideId: string): Rating[];
    findAll(): Rating[];
}
