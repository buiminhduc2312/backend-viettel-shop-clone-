import { Request, Response, NextFunction } from 'express';

export class ProductValidator {
    // Hàm kiểm tra khi thêm/sửa sản phẩm
    public static validateCreateOrUpdate(req: Request, res: Response, next: NextFunction) {
        const { name, price } = req.body; // kiểm tra các trường bắt buộc: name và price

        if (!name) { // nếu name không tồn tại thì trả về lỗi
            return res.status(400).json({ success: false, message: 'Tên sản phẩm không được để trống!' });
        }
        if (!price) { // nếu price không tồn tại thì trả về lỗi
            return res.status(400).json({ success: false, message: 'Giá sản phẩm không được để trống!' });
        }

        next(); // nếu hợp lệ thì cho request đi tiếp vào controller
    }
}
