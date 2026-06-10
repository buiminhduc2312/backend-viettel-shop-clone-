import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    price: number;
    originalPrice?: number;
    description: string;
    image: string;
    brand: string;
    category: string;
    stock: number;
}

const ProductSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        originalPrice: { type: Number, default: 0 },
        description: { type: String },
        image: { type: String, required: true },
        category: { type: String, required: true },
        stock: { type: Number, default: 0, min: 0 },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model<IProduct>('Product', ProductSchema);
