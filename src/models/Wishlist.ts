import mongoose, { Document, Schema } from 'mongoose';

export interface IWishlist extends Document {
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    createdAt: Date;
}

const WishlistSchema: Schema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    },
);

WishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

const WishlistModel = mongoose.models.Wishlist || mongoose.model<IWishlist>('Wishlist', WishlistSchema);

export default WishlistModel;
