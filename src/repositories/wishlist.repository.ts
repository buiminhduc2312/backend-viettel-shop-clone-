import WishlistModel from '../models/Wishlist';

const WISHLIST_PRODUCT_PROJECTION = '_id name price originalPrice description image category brand stock status createdAt';

export class WishlistRepo {
    public static create(userId: string, productId: string) {
        return WishlistModel.create({ userId, productId });
    }

    public static findByUserId(userId: string) {
        return WishlistModel.find({ userId })
            .populate('productId', WISHLIST_PRODUCT_PROJECTION)
            .sort({ createdAt: -1 })
            .lean()
            .exec();
    }

    public static findOne(userId: string, productId: string) {
        return WishlistModel.findOne({ userId, productId }).lean().exec();
    }

    public static deleteOne(userId: string, productId: string) {
        return WishlistModel.findOneAndDelete({ userId, productId }).lean().exec();
    }
}
