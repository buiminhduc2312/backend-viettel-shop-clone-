import mongoose, { Document, Schema } from 'mongoose'; // Import thư viện mongoose và các type cần thiết

// Interface quy định kiểu dữ liệu cho từng sản phẩm nằm trong giỏ hàng
export interface IOrderItem {
    productId: mongoose.Types.ObjectId; // ID liên kết với bảng Product
    name: string; // Tên sản phẩm
    image?: string; // Ảnh sản phẩm
    price: number; // Đơn giá của sản phẩm
    quantity: number; // Số lượng mua
}

// Interface quy định kiểu dữ liệu cho toàn bộ đơn hàng
export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId; // ID của người dùng đặt hàng (liên kết bảng User)
    products: IOrderItem[]; // Mảng chứa danh sách các sản phẩm đã đặt
    totalAmount: number; // Tổng số tiền của toàn bộ đơn hàng
    status: 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled'; // Các trạng thái cho phép của đơn
    createdAt: Date; // Thời gian tạo đơn
    updatedAt: Date; // Thời gian cập nhật đơn gần nhất
}

// Khởi tạo Schema cho sản phẩm con (dùng để nhúng vào Schema Order chính)
const OrderItemSchema: Schema = new Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Tham chiếu tới Product Model
        name: { type: String, required: true, trim: true }, // Bắt buộc nhập tên, tự động xóa khoảng trắng 2 đầu
        image: { type: String, default: '', trim: true }, // Mặc định là chuỗi rỗng nếu không có ảnh
        price: { type: Number, required: true, min: 0 }, // Bắt buộc nhập, giá không được là số âm
        quantity: { type: Number, required: true, min: 1 }, // Bắt buộc nhập, số lượng mua ít nhất phải là 1
    },
    {
        _id: false, // Tắt tự động tạo _id cho các item con này để tránh rác database
    },
);

// Khởi tạo Schema chính cho Đơn hàng (Order)
const OrderSchema: Schema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Tham chiếu tới User Model
        products: { type: [OrderItemSchema], required: true, default: [] }, // Mảng sản phẩm sử dụng Schema con ở trên
        totalAmount: { type: Number, required: true, min: 0 }, // Tổng tiền đơn hàng, không được là số âm
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipping', 'completed', 'cancelled'], // Giới hạn chỉ nhận 1 trong 5 trạng thái này
            default: 'pending', // Nếu không truyền lên thì mặc định là 'pending' (chờ xử lý)
        },
    },
    {
        timestamps: true, // Tự động tạo và quản lý 2 trường: createdAt và updatedAt
    },
);

// Khởi tạo và export Model 'Order' để sử dụng ở các file Controller/Service
export default mongoose.model('Order', OrderSchema);
