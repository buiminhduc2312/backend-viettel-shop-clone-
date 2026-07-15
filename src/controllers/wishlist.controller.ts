import { Request, Response } from 'express';

import { WishlistBiz } from '../biz/wishlist/wishlist.biz';

const getWishlistErrorStatus = (error: unknown) => {
    if (!(error instanceof Error)) {
        return 500;
    }

    switch (error.message) {
        case 'Invalid product id':
            return 400;
        case 'Product already exists in wishlist':
            return 409;
        case 'Product not found':
        case 'Wishlist item not found':
            return 404;
        default:
            return 500;
    }
};

export class WishlistController {
    public static async addWishlist(req: Request, res: Response) {
        try {
            const userId = req.userId as string;
            const item = await WishlistBiz.addWishlist(userId, req.params.productId);

            return res.status(201).json({
                success: true,
                message: 'Added product to wishlist',
                data: item,
            });
        } catch (error) {
            console.error('Add wishlist error:', error);
            const status = getWishlistErrorStatus(error);
            return res.status(status).json({ success: false, message: error instanceof Error ? error.message : 'Wishlist error' });
        }
    }

    public static async getWishlist(req: Request, res: Response) {
        try {
            const userId = req.userId as string;
            const items = await WishlistBiz.getWishlist(userId);

            return res.status(200).json({
                success: true,
                message: 'Get wishlist successfully',
                data: items,
            });
        } catch (error) {
            console.error('Get wishlist error:', error);
            return res.status(500).json({ success: false, message: 'Wishlist error' });
        }
    }

    public static async removeWishlist(req: Request, res: Response) {
        try {
            const userId = req.userId as string;
            await WishlistBiz.removeWishlist(userId, req.params.productId);

            return res.status(200).json({
                success: true,
                message: 'Removed product from wishlist',
            });
        } catch (error) {
            console.error('Remove wishlist error:', error);
            const status = getWishlistErrorStatus(error);
            return res.status(status).json({ success: false, message: error instanceof Error ? error.message : 'Wishlist error' });
        }
    }
}
