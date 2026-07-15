import { isValidObjectId } from 'mongoose';

import { ProductRepository } from '../../repositories/product.repository';
import { ReviewRepository } from '../../repositories/review.repository';

type ReviewPayload = {
    productId?: string;
    rating?: unknown;
    comment?: unknown;
};

type ReviewUpdatePayload = {
    rating?: unknown;
    comment?: unknown;
};

export class ReviewBiz {
    private static validateObjectId(id: string | undefined, fieldName: string) {
        if (!id || !isValidObjectId(id)) {
            throw new Error(`Invalid ${fieldName}`);
        }
    }

    private static validateRating(rating: unknown) {
        const parsedRating = Number(rating);

        if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
            throw new Error('Rating must be an integer from 1 to 5');
        }

        return parsedRating;
    }

    private static normalizeComment(comment: unknown) {
        return typeof comment === 'string' ? comment.trim() : '';
    }

    private static async ensureProductExists(productId: string) {
        const product = await ProductRepository.findProductById(productId);

        if (!product) {
            throw new Error('Product not found');
        }
    }

    private static async recalculateProductStats(productId: string) {
        const ratings = (await ReviewRepository.findRatingsByProduct(productId)) as Array<{ rating?: number }>;
        const totalReviews = ratings.length;
        const totalRating = ratings.reduce((total: number, review: { rating?: number }) => total + Number(review.rating ?? 0), 0);
        const averageRating = totalReviews === 0 ? 0 : totalRating / totalReviews;

        await ProductRepository.updateReviewStats(productId, Number(averageRating.toFixed(2)), totalReviews);
    }

    public static async createReview(userId: string, payload: ReviewPayload) {
        const productId = payload.productId;
        ReviewBiz.validateObjectId(productId, 'product id');
        const rating = ReviewBiz.validateRating(payload.rating);
        await ReviewBiz.ensureProductExists(productId as string);

        const existingReview = await ReviewRepository.findOneByUserAndProduct(userId, productId as string);

        if (existingReview) {
            throw new Error('Product already reviewed');
        }

        try {
            const review = await ReviewRepository.create({
                userId,
                productId: productId as string,
                rating,
                comment: ReviewBiz.normalizeComment(payload.comment),
            });

            await ReviewBiz.recalculateProductStats(productId as string);
            return review;
        } catch (error: any) {
            if (error?.code === 11000) {
                throw new Error('Product already reviewed');
            }

            throw error;
        }
    }

    public static async updateReview(userId: string, reviewId: string, payload: ReviewUpdatePayload) {
        ReviewBiz.validateObjectId(reviewId, 'review id');
        const review = await ReviewRepository.findById(reviewId);

        if (!review) {
            throw new Error('Review not found');
        }

        if (String(review.userId) !== String(userId)) {
            throw new Error('You are not allowed to update this review');
        }

        const updatePayload: { rating?: number; comment?: string } = {};

        if (payload.rating !== undefined) {
            updatePayload.rating = ReviewBiz.validateRating(payload.rating);
        }

        if (payload.comment !== undefined) {
            updatePayload.comment = ReviewBiz.normalizeComment(payload.comment);
        }

        if (Object.keys(updatePayload).length === 0) {
            throw new Error('No review fields to update');
        }

        const updatedReview = await ReviewRepository.updateById(reviewId, updatePayload);
        await ReviewBiz.recalculateProductStats(String(review.productId));

        return updatedReview;
    }

    public static async deleteReview(userId: string, userRole: string | undefined, reviewId: string) {
        ReviewBiz.validateObjectId(reviewId, 'review id');
        const review = await ReviewRepository.findById(reviewId);

        if (!review) {
            throw new Error('Review not found');
        }

        const isOwner = String(review.userId) === String(userId);
        const isAdmin = userRole === 'admin' || userRole === 'root';

        if (!isOwner && !isAdmin) {
            throw new Error('You are not allowed to delete this review');
        }

        const productId = String(review.productId);
        await ReviewRepository.deleteById(reviewId);
        await ReviewBiz.recalculateProductStats(productId);
    }

    public static async getProductReviews(productId: string) {
        ReviewBiz.validateObjectId(productId, 'product id');
        await ReviewBiz.ensureProductExists(productId);

        return ReviewRepository.findByProduct(productId);
    }
}
