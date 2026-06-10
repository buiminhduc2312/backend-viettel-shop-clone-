import { Request, Response } from 'express';

import Product from '../../biz/user/product/product.model';

export class ProductController {
    // 1. Lấy danh sách
    public static async getProducts(req: Request, res: Response) {
        try {
            const products = await Product.find().sort({ createdAt: -1 });
            res.json({ success: true, message: 'Lấy dữ liệu thành công', data: products });
        } catch (error) {
            console.error('Lỗi lấy sản phẩm:', error);
            res.status(500).json({ success: false, message: 'Lỗi Server!' });
        }
    }

    // 2. Thêm mới
    public static async createProduct(req: Request, res: Response) {
        try {
            const newProduct = new Product(req.body);
            await newProduct.save();
            res.status(201).json({ success: true, message: 'Thêm sản phẩm thành công', data: newProduct });
        } catch (error) {
            console.error('Lỗi thêm sản phẩm:', error);
            res.status(500).json({ success: false, message: 'Lỗi Server!' });
        }
    }

    // 3. Cập nhật (Sửa)
    public static async updateProduct(req: Request, res: Response) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedProduct) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm để sửa' });
            }
            res.json({ success: true, message: 'Cập nhật thành công', data: updatedProduct });
        } catch (error) {
            console.error('Lỗi sửa sản phẩm:', error);
            res.status(500).json({ success: false, message: 'Lỗi Server!' });
        }
    }

    // 4. Xóa
    public static async deleteProduct(req: Request, res: Response) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(req.params.id);
            if (!deletedProduct) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
            }
            res.json({ success: true, message: 'Xóa thành công' });
        } catch (error) {
            console.error('Lỗi xóa sản phẩm:', error);
            res.status(500).json({ success: false, message: 'Lỗi Server!' });
        }
    }
}
