import { Request, Response, NextFunction } from 'express';

export class ProductValidator {
    // Hàm kiểm tra khi thêm/sửa sản phẩm
    public static validateCreateOrUpdate(req: Request, res: Response, next: NextFunction) {
        const { name, price } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Tên sản phẩm không được để trống!' });
        }
        if (!price) {
            return res.status(400).json({ success: false, message: 'Giá sản phẩm không được để trống!' });
        }

        next();
    }
}
