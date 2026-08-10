import { CartModel } from '../biz/user/cart.model';
import { OrderRepository } from '../repositories/order.repository';
import { ProductRepository } from '../repositories/product.repository';

type OrderStatus = 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled';

type OrderProductInput = {
    productId: string;
    name: string;
    image?: string;
    price: number;
    quantity: number;
};

type ReducedInventoryItem = {
    productId: string;
    quantity: number;
};

const ORDER_STATUSES: OrderStatus[] = ['pending', 'processing', 'shipping', 'completed', 'cancelled'];

export class OrderService {
    // class OrderService được sử dụng để quản lý các chức năng liên quan đến đơn hàng (Order) trong hệ thống. Nó cung cấp các phương thức để tạo đơn hàng, lấy danh sách đơn hàng, cập nhật trạng thái đơn hàng và quản lý tồn kho sản phẩm liên quan đến đơn hàng.
    public static async createOrder(userId: string, products: OrderProductInput[]) {
        // phương thức createOrder được sử dụng để tạo một đơn hàng mới dựa trên thông tin người dùng và danh sách sản phẩm. Nó thực hiện các bước kiểm tra, tính toán tổng số tiền, kiểm tra tồn kho và tạo đơn hàng trong cơ sở dữ liệu.
        OrderService.validateUserId(userId);
        const normalizedProducts = OrderService.normalizeProducts(products);
        const totalAmount = normalizedProducts.reduce((total, product) => total + product.price * product.quantity, 0); // tính tổng số tiền của đơn hàng bằng cách nhân giá sản phẩm với số lượng và cộng dồn vào tổng.

        await OrderService.ensureAvailableInventory(normalizedProducts);
        const reducedProducts = await OrderService.reduceInventory(normalizedProducts);

        try {
            const createdOrder = await OrderRepository.createOrder({
                userId,
                products: normalizedProducts,
                totalAmount,
            });

            await CartModel.findOneAndUpdate({ userId }, { items: [] }, { new: true, upsert: true }).exec();
            return createdOrder;
        } catch (error) {
            await OrderService.restoreInventory(reducedProducts);
            throw error;
        }
    }

    public static getOrdersByUser(userId: string) {
        OrderService.validateUserId(userId);
        return OrderRepository.getOrdersByUser(userId);
    }

    public static getAllOrders(status?: OrderStatus) {
        if (status && !ORDER_STATUSES.includes(status as OrderStatus)) {
            throw new Error('Trang thai don hang khong hop le!');
        }
        return OrderRepository.getAllOrders(status);
    }

    public static getOrderById(orderId: string) {
        OrderService.validateOrderId(orderId);
        return OrderRepository.getOrderById(orderId);
    }

    public static updateOrderStatus(orderId: string, status: OrderStatus) {
        OrderService.validateOrderId(orderId);

        if (!ORDER_STATUSES.includes(status)) {
            throw new Error('Trang thai don hang khong hop le!');
        }

        return OrderRepository.updateOrderStatus(orderId, status);
    }

    private static validateUserId(userId: string) {
        if (!userId || typeof userId !== 'string' || !userId.trim()) {
            throw new Error('User ID bat buoc!');
        }
    }

    private static validateOrderId(orderId: string) {
        if (!orderId || typeof orderId !== 'string' || !orderId.trim()) {
            throw new Error('Order ID bat buoc!');
        }
    }

    private static normalizeProducts(products: OrderProductInput[]) {
        OrderService.validateProducts(products);

        return products.map((product) => {
            const normalizedPrice = Number(product.price);
            const normalizedQuantity = Number(product.quantity);

            return {
                productId: product.productId,
                name: product.name.trim(),
                image: typeof product.image === 'string' ? product.image.trim() : '',
                price: normalizedPrice,
                quantity: normalizedQuantity,
            };
        });
    }

    private static validateProducts(products: OrderProductInput[]) {
        if (!Array.isArray(products) || products.length === 0) {
            throw new Error('Danh sach san pham khong duoc de trong!');
        }

        products.forEach((product) => {
            if (!product.productId || typeof product.productId !== 'string' || !product.productId.trim()) {
                throw new Error('Product ID bat buoc!');
            }

            if (!product.name || typeof product.name !== 'string' || !product.name.trim()) {
                throw new Error('Ten san pham bat buoc!');
            }

            const normalizedPrice = Number(product.price);
            if (Number.isNaN(normalizedPrice) || normalizedPrice < 0) {
                throw new Error('Gia san pham khong hop le!');
            }

            const normalizedQuantity = Number(product.quantity);
            if (!Number.isInteger(normalizedQuantity) || normalizedQuantity <= 0) {
                throw new Error('So luong san pham khong hop le!');
            }
        });
    }

    private static async ensureAvailableInventory(products: ReturnType<typeof OrderService.normalizeProducts>) {
        const productIds = products.map((product) => product.productId);
        const productDocuments = await ProductRepository.findProductsByIds(productIds);
        const productMap = new Map(productDocuments.map((product: any) => [String(product._id), product]));

        products.forEach((product) => {
            const productDocument = productMap.get(String(product.productId));

            if (!productDocument) {
                throw new Error(`San pham ${product.name} khong con ton tai!`);
            }

            if ((productDocument.stock ?? 0) < product.quantity) {
                throw new Error(`San pham ${product.name} khong du ton kho!`);
            }
        });
    }

    private static async reduceInventory(products: ReturnType<typeof OrderService.normalizeProducts>) {
        const productIds = products.map((product) => product.productId);
        const productDocuments = await ProductRepository.findProductsByIds(productIds);
        const productMap = new Map(productDocuments.map((product: any) => [String(product._id), product]));

        const reducedProducts: ReducedInventoryItem[] = [];

        try {
            for (const product of products) {
                const productDocument = productMap.get(String(product.productId));

                const nextStock = (productDocument?.stock ?? 0) - product.quantity;
                const nextStatus = nextStock > 0 ? 'available' : 'unavailable';

                const updatedProduct = await ProductRepository.updateProductInventory(product.productId, product.quantity, nextStatus);

                if (!updatedProduct) {
                    throw new Error(`San pham ${product.name} khong du ton kho !`);
                }
                reducedProducts.push({ productId: product.productId, quantity: product.quantity });
            }
            return reducedProducts;
        } catch (error) {
            await OrderService.restoreInventory(reducedProducts);
            throw error;
        }
    }

    private static async restoreInventory(products: ReducedInventoryItem[]) {
        const restoredProducts = await ProductRepository.findProductsByIds(products.map((product) => product.productId));
        const restoredProductMap = new Map(restoredProducts.map((product: any) => [String(product._id), product]));

        for (const product of products) {
            const restoredProduct = restoredProductMap.get(String(product.productId));
            const nextStock = (restoredProduct?.stock ?? 0) + product.quantity;
            const nextStatus = nextStock > 0 ? 'available' : 'unavailable';
            await ProductRepository.restoreProductInventory(product.productId, product.quantity, nextStatus);
        }
    }
}
