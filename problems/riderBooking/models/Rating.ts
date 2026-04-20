export class Rating {
    constructor(
        public id: string,
        public fromUserId: string,
        public toUserId: string,
        public rideId: string,
        public rating: number, // 1-5 stars
        public comment: string,
        public date: Date
    ) {
        if (rating < 1 || rating > 5) {
            throw new Error("Rating must be between 1 and 5");
        }
    }
}
