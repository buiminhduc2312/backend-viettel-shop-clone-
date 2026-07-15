import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
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
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            validate: {
                validator: Number.isInteger,
                message: 'Rating must be an integer',
            },
        },
        comment: {
            type: String,
            default: '',
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

ReviewSchema.index({ userId: 1, productId: 1 }, { unique: true });
ReviewSchema.index({ productId: 1, createdAt: -1 });

const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
