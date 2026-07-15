import Review from '../models/Review';

const REVIEW_USER_PROJECTION = 'username first_name last_name email avatar';

export class ReviewRepository {
    public static create(payload: { userId: string; productId: string; rating: number; comment: string }) {
        return Review.create(payload);
    }

    public static findById(reviewId: string) {
        return Review.findById(reviewId).exec();
    }

    public static findOneByUserAndProduct(userId: string, productId: string) {
        return Review.findOne({ userId, productId }).lean().exec();
    }

    public static findByProduct(productId: string) {
        return Review.find({ productId })
            .populate('userId', REVIEW_USER_PROJECTION)
            .sort({ createdAt: -1 })
            .lean()
            .exec();
    }

    public static findRatingsByProduct(productId: string) {
        return Review.find({ productId }).select('rating').lean().exec();
    }

    public static updateById(reviewId: string, payload: { rating?: number; comment?: string }) {
        return Review.findByIdAndUpdate(reviewId, { $set: payload }, { new: true, runValidators: true }).exec();
    }

    public static deleteById(reviewId: string) {
        return Review.findByIdAndDelete(reviewId).lean().exec();
    }
}
