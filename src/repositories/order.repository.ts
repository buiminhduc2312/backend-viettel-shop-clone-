import Order from '../models/Order';

const ORDER_PROJECTION = '_id userId products totalAmount status createdAt updatedAt';

export class OrderRepository {
    public static createOrder(payload: Record<string, unknown>) {
        const order = new Order(payload);
        return order.save();
    }

    public static getAllOrders() {
        return Order.find({})
            .select(ORDER_PROJECTION)
            .populate('userId', 'email username first_name last_name')
            .sort({ createdAt: -1 })
            .lean()
            .exec();
    }

    public static getOrdersByUser(userId: string) {
        return Order.find({ userId }).select(ORDER_PROJECTION).sort({ createdAt: -1 }).lean().exec();
    }

    public static getOrderById(orderId: string) {
        return Order.findById(orderId).select(ORDER_PROJECTION).lean().exec();
    }

    public static updateOrderStatus(orderId: string, status: string) {
        return Order.findByIdAndUpdate(orderId, { status }, { new: true }).select(ORDER_PROJECTION).lean().exec();
    }
}
