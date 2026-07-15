import mongoose, { Schema } from 'mongoose';
// bảng cart độc lập
const cartSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true, // Mỗi user chỉ có một cart
        },

        items: { type: Array, default: [] },
    },
    { timestamps: true },
);

export const CartModel = mongoose.model('Cart', cartSchema);
