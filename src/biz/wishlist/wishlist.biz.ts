import { isValidObjectId } from 'mongoose';

import { ProductRepository } from '../../repositories/product.repository';
import { WishlistRepo } from '../../repositories/wishlist.repository';

export class WishlistBiz {
    private static validateProductId(productId: string) {
        if (!productId || !isValidObjectId(productId)) {
            throw new Error('Invalid product id');
        }
    }

    private static async ensureProductExists(productId: string) {
        const product = await ProductRepository.findProductById(productId);

        if (!product) {
            throw new Error('Product not found');
        }
    }

    public static async addWishlist(userId: string, productId: string) {
        WishlistBiz.validateProductId(productId);
        await WishlistBiz.ensureProductExists(productId);

        const existing = await WishlistRepo.findOne(userId, productId);

        if (existing) {
            throw new Error('Product already exists in wishlist');
        }

        try {
            return await WishlistRepo.create(userId, productId);
        } catch (error: any) {
            if (error?.code === 11000) {
                throw new Error('Product already exists in wishlist');
            }

            throw error;
        }
    }

    public static getWishlist(userId: string) {
        return WishlistRepo.findByUserId(userId);
    }

    public static async removeWishlist(userId: string, productId: string) {
        WishlistBiz.validateProductId(productId);

        const deletedItem = await WishlistRepo.deleteOne(userId, productId);

        if (!deletedItem) {
            throw new Error('Wishlist item not found');
        }

        return deletedItem;
    }
}
