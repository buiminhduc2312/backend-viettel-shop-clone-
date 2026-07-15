import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { CustomError } from '@common/error/custom.error';
import { ProductRepository } from '../../repositories/product.repository';
import { UserModel } from './user.model'; // Gọi kho chứa MongoDB vừa tạo ở trên
import { CartModel } from './cart.model';
import { BlacklistModel } from './blacklist.model';
import { FULL_NAME_ERROR_MESSAGE, isValidFullName } from '../../utils/fullNameValidation';

type CartQuantityDelta = {
    productId: string;
    quantity: number;
};

export class UserBiz {
    // =====================================
    // 1. HÀM ĐĂNG KÝ (Đã chuyển sang MongoDB)
    // =====================================
    public static async registerPostgres(userData: any) {
        // Giữ tên cũ để Controller khỏi giật mình
        try {
            const rawFullName = String(
                userData.fullName || userData.name || [userData.firstName || userData.first_name, userData.lastName || userData.last_name].filter(Boolean).join(' '),
            ).trim();

            if (!isValidFullName(rawFullName)) {
                throw new Error(FULL_NAME_ERROR_MESSAGE);
            }

            const nameParts = rawFullName.split(/\s+/);
            const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : nameParts[0];
            const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

            // Kiểm tra email đã tồn tại chưa
            const existingUser = await UserModel.findOne({ email: userData.email });

            if (existingUser) {
                throw new Error('Email này đã được đăng ký!');
            }

            // Kiểm tra username
            const existingUsername = await UserModel.findOne({ username: userData.username || userData.email });

            if (existingUsername) {
                throw new Error('Tên đăng nhập này đã tồn tại!');
            }

            // Băm mật khẩu
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            // Tạo User mới, lưu thẳng vào MongoDB
            const newUser = new UserModel({
                email: userData.email,
                username: userData.username || userData.email,
                password: hashedPassword,
                first_name: firstName,
                last_name: lastName,
                phone: userData.phone || '',
                role: userData.role || 'user',
            });

            await newUser.save(); // Lệnh lưu của MongoDB

            // Ẩn password trước khi trả về
            const userObj = newUser.toObject();
            const { password, ...userWithoutPassword } = userObj;

            return userWithoutPassword;
        } catch (error: any) {
            console.error('🚨 LỖI TỪ MONGODB:', error);
            throw new Error(error.message);
        }
    }

    // =====================================
    // 2. HÀM ĐĂNG NHẬP (Đã chuyển sang MongoDB)
    // =====================================
    public static async loginPostgres(credentials: any) {
        try {
            // 1. Tìm user theo email trong MongoDB
            const user = await UserModel.findOne({ email: credentials.email });

            if (!user) {
                throw new Error('Tài khoản hoặc mật khẩu không chính xác!');
            }

            // 2. So sánh mật khẩu
            const isMatch = await bcrypt.compare(credentials.password, user.password);

            if (!isMatch) {
                throw new Error('Tài khoản hoặc mật khẩu không chính xác!');
            }

            // 3. Tạo Token
            const token = jwt.sign(
                { id: user._id, email: user.email, role: user.role, jti: randomUUID() }, // MongoDB dùng _id
                process.env.JWT_SECRET as string,
                { expiresIn: '7d' },
            );

            // 4. Bóc tách dữ liệu, bỏ password đi
            const userObj = user.toObject();
            const { password, ...userWithoutPassword } = userObj;

            return {
                token,
                user: userWithoutPassword,
            };
        } catch (error: any) {
            console.error('🚨 LỖI ĐĂNG NHẬP MONGODB:', error);
            throw new Error(error.message);
        }
    }

    public static async postRegister(userData: any) {
        return null;
    }

    public static async getUserById(userId: string) {
        try {
            const user = await UserModel.findById(userId);

            if (!user) {
                throw new Error('Khong tim thay nguoi dung!');
            }

            const userObj = user.toObject();
            const { password, ...userWithoutPassword } = userObj;

            return userWithoutPassword;
        } catch (error: any) {
            console.error('LOI LAY USER MONGODB:', error);
            throw new Error(error.message);
        }
    }

    public static async getCart(userId: string) {
        const cart = await CartModel.findOne({ userId });

        return cart ? cart.items : [];
    }

    private static getCartItemProductId(item: any) {
        return String(item?.product?.id ?? item?.product?._id ?? item?.productId ?? '').trim();
    }

    private static getCartItemQuantity(item: any) {
        const quantity = Number(item?.quantity);

        if (!Number.isInteger(quantity) || quantity < 0) {
            throw CustomError.CustomMessage('Invalid cart quantity');
        }

        return quantity;
    }

    private static buildCartQuantityMap(cartItems: any[]) {
        const quantityMap = new Map<string, number>();

        if (!Array.isArray(cartItems)) {
            throw CustomError.CustomMessage('Invalid cart items');
        }

        cartItems.forEach((item) => {
            const productId = UserBiz.getCartItemProductId(item);
            const quantity = UserBiz.getCartItemQuantity(item);

            if (!productId) {
                throw CustomError.CustomMessage('Invalid cart product');
            }

            quantityMap.set(productId, (quantityMap.get(productId) ?? 0) + quantity);
        });

        return quantityMap;
    }

    private static getCartQuantityDeltas(currentCartItems: any[], nextCartItems: any[]) {
        const currentQuantities = UserBiz.buildCartQuantityMap(currentCartItems);
        const nextQuantities = UserBiz.buildCartQuantityMap(nextCartItems);
        const productIds = new Set([...currentQuantities.keys(), ...nextQuantities.keys()]);

        return Array.from(productIds)
            .map((productId) => ({
                productId,
                quantity: (nextQuantities.get(productId) ?? 0) - (currentQuantities.get(productId) ?? 0),
            }))
            .filter((delta) => delta.quantity !== 0);
    }

    private static async reserveProductStock(delta: CartQuantityDelta, session: mongoose.ClientSession) {
        console.log('=== RESERVE STOCK ===');
        console.log('delta:', delta);

        const product = await ProductRepository.findProductById(delta.productId, session);

        console.log('product:', product?.name);
        console.log('stock before:', product?.stock);

        if (!product) {
            throw CustomError.CustomMessage('Product not found');
        }

        const currentStock = Number(product.stock ?? 0);

        if (currentStock <= 0) {
            throw CustomError.CustomMessage('Product is out of stock');
        }

        if (delta.quantity > currentStock) {
            throw CustomError.CustomMessage('Not enough stock');
        }

        const nextStock = currentStock - delta.quantity;
        const nextStatus = nextStock > 0 ? 'available' : 'unavailable';
        const updatedProduct = await ProductRepository.updateProductInventory(delta.productId, delta.quantity, nextStatus, session);

        console.log('stock updated');
        if (!updatedProduct) {
            throw CustomError.CustomMessage('Not enough stock');
        }
    }

    private static async restoreProductStock(delta: CartQuantityDelta, session: mongoose.ClientSession) {
        const product = await ProductRepository.findProductById(delta.productId, session);

        if (!product) {
            return;
        }

        const quantityToRestore = Math.abs(delta.quantity);
        const nextStock = Number(product.stock ?? 0) + quantityToRestore;
        const nextStatus = nextStock > 0 ? 'available' : 'unavailable';
        await ProductRepository.restoreProductInventory(delta.productId, quantityToRestore, nextStatus, session);
    }

    public static async updateCart(userId: string, cartItems: any[]) {
        console.log('=== UPDATE CART ===');
        console.log(JSON.stringify(cartItems, null, 2));
        const session = await mongoose.startSession();
        let updatedCartItems: any[] = [];

        try {
            await session.withTransaction(async () => {
                const currentCart = await CartModel.findOne({ userId }).session(session).lean().exec();
                const deltas = UserBiz.getCartQuantityDeltas(currentCart?.items ?? [], cartItems);

                for (const delta of deltas) {
                    if (delta.quantity > 0) {
                        await UserBiz.reserveProductStock(delta, session);
                    } else {
                        await UserBiz.restoreProductStock(delta, session);
                    }
                }

                const cart = await CartModel.findOneAndUpdate({ userId }, { items: cartItems }, { new: true, upsert: true, session });
                updatedCartItems = cart ? cart.items : [];
            });
        } finally {
            await session.endSession();
        }

        return updatedCartItems;
    }

    public static async logout(token: string) {
        try {
            const blacklistedToken = new BlacklistModel({ token });
            await blacklistedToken.save();
            return true;
        } catch (error: any) {
            if (error.code === 11000) return true;
            throw new Error('Loi khi dang xuat!');
        }
    }
}
