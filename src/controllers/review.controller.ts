import { Request, Response } from 'express';

import { ReviewBiz } from '../biz/review/review.biz';

const getReviewErrorStatus = (error: unknown) => {
    if (!(error instanceof Error)) {
        return 500;
    }

    switch (error.message) {
        case 'Invalid product id':
        case 'Invalid review id':
        case 'Rating must be an integer from 1 to 5':
        case 'No review fields to update':
            return 400;
        case 'Product already reviewed':
            return 409;
        case 'Product not found':
        case 'Review not found':
            return 404;
        case 'You are not allowed to update this review':
        case 'You are not allowed to delete this review':
            return 403;
        default:
            return 500;
    }
};

const getReviewErrorMessage = (error: unknown) => (error instanceof Error ? error.message : 'Review error');

export class ReviewController {
    public static async createReview(req: Request, res: Response) {
        try {
            const userId = req.userId as string;
            const review = await ReviewBiz.createReview(userId, req.body);

            return res.status(201).json({
                success: true,
                message: 'Review created successfully',
                data: review,
            });
        } catch (error) {
            console.error('Create review error:', error);
            return res.status(getReviewErrorStatus(error)).json({ success: false, message: getReviewErrorMessage(error) });
        }
    }

    public static async updateReview(req: Request, res: Response) {
        try {
            const userId = req.userId as string;
            const review = await ReviewBiz.updateReview(userId, req.params.id, req.body);

            return res.status(200).json({
                success: true,
                message: 'Review updated successfully',
                data: review,
            });
        } catch (error) {
            console.error('Update review error:', error);
            return res.status(getReviewErrorStatus(error)).json({ success: false, message: getReviewErrorMessage(error) });
        }
    }

    public static async deleteReview(req: Request, res: Response) {
        try {
            const userId = req.userId as string;
            await ReviewBiz.deleteReview(userId, req.userRole, req.params.id);

            return res.status(200).json({
                success: true,
                message: 'Review deleted successfully',
            });
        } catch (error) {
            console.error('Delete review error:', error);
            return res.status(getReviewErrorStatus(error)).json({ success: false, message: getReviewErrorMessage(error) });
        }
    }

    public static async getProductReviews(req: Request, res: Response) {
        try {
            const reviews = await ReviewBiz.getProductReviews(req.params.productId);

            return res.status(200).json({
                success: true,
                data: reviews,
            });
        } catch (error) {
            console.error('Get product reviews error:', error);
            return res.status(getReviewErrorStatus(error)).json({ success: false, message: getReviewErrorMessage(error) });
        }
    }
}
