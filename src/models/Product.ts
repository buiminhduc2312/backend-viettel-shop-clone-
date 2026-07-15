import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    price: number;
    originalPrice?: number;
    description: string;
    image: string;
    brand: string;
    category: string;
    stock: number;
    status: 'available' | 'unavailable';
    averageRating?: number;
    totalReviews?: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        originalPrice: { type: Number, default: 0, min: 0 },
        description: { type: String, default: '' },
        image: { type: String, required: true, trim: true },
        brand: { type: String, required: true, trim: true, lowercase: true },
        category: { type: String, required: true, trim: true, lowercase: true },
        stock: { type: Number, default: 0, min: 0 },
        averageRating: { type: Number, default: 0, min: 0, max: 5 },
        totalReviews: { type: Number, default: 0, min: 0 },
        status: {
            type: String,
            enum: ['available', 'unavailable'],
            default: 'unavailable',
        },
    },
    {
        timestamps: true,
    },
);

ProductSchema.index({ name: 'text' });
ProductSchema.index({ category: 1, brand: 1, stock: 1, price: 1, createdAt: -1 });

const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
