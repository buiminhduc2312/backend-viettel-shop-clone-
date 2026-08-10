import Order from '../models/Order';
type OrderStatus = 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled';
const ORDER_PROJECTION = '_id userId products totalAmount status createdAt updatedAt';

export class OrderRepository {
    // class OrderRepository được sử dụng để quản lý các thao tác liên quan đến đơn hàng (Order) trong cơ sở dữ liệu. Nó cung cấp các phương thức để tạo đơn hàng, lấy danh sách đơn hàng, cập nhật trạng thái đơn hàng và truy vấn thông tin đơn hàng từ cơ sở dữ liệu.
    public static createOrder(payload: Record<string, unknown>) {
        const order = new Order(payload);
        return order.save();
    }

    public static getAllOrders(status?: OrderStatus) {
        const filter = status ? { status } : {}; // Nếu có trạng thái được cung cấp, tạo bộ lọc để tìm kiếm theo trạng thái, nếu không thì lấy tất cả các đơn hàng
        return Order.find(filter).select(ORDER_PROJECTION).populate('userId', 'email username first_name last_name').sort({ createdAt: -1 }).lean().exec();
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
