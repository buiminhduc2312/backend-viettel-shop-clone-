import { Request, Response } from 'express';

import { ProductService } from '../services/product.service';
import { ProductValidator } from '../validators/product.validator';

export class ProductController {
    private static setFreshInventoryHeaders(res: Response) {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        res.set('Surrogate-Control', 'no-store');
    }

    public static async getProductById(req: Request, res: Response) {
        try {
            const product = await ProductService.getProductById(req.params.id);

            if (!product) {
                return res.status(404).json({ success: false, message: 'Khong tim thay san pham' });
            }

            ProductController.setFreshInventoryHeaders(res);

            return res.json({
                success: true,
                message: 'Lay chi tiet san pham thanh cong',
                data: product,
            });
        } catch (error) {
            console.error('Loi lay chi tiet san pham:', error);
            return res.status(500).json({ success: false, message: 'Loi Server!' });
        }
    }

    public static async getProducts(req: Request, res: Response) {
        try {
            const query = ProductValidator.parseListQuery(req.query);
            const result = await ProductService.getProducts(query);

            ProductController.setFreshInventoryHeaders(res);

            return res.json({
                success: true,
                message: 'Lay du lieu thanh cong',
                products: result.products,
                data: result.products,
                page: result.page,
                limit: result.limit,
                totalItems: result.totalItems,
                totalPages: result.totalPages,
                hasNext: result.hasNext,
                hasPrevious: result.hasPrevious,
                hasNextPage: result.hasNextPage,
                hasPreviousPage: result.hasPreviousPage,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    totalItems: result.totalItems,
                    totalPages: result.totalPages,
                    hasNext: result.hasNext,
                    hasPrevious: result.hasPrevious,
                    hasNextPage: result.hasNextPage,
                    hasPreviousPage: result.hasPreviousPage,
                },
            });
        } catch (error) {
            console.error('Loi lay san pham:', error);
            return res.status(500).json({ success: false, message: 'Loi Server!' });
        }
    }

    public static async createProduct(req: Request, res: Response) {
        try {
            const newProduct = await ProductService.createProduct(req.body);
            return res.status(201).json({ success: true, message: 'Them san pham thanh cong', data: newProduct });
        } catch (error) {
            console.error('Loi them san pham:', error);
            return res.status(500).json({ success: false, message: 'Loi Server!' });
        }
    }

    public static async updateProduct(req: Request, res: Response) {
        try {
            const updatedProduct = await ProductService.updateProduct(req.params.id, req.body);

            if (!updatedProduct) {
                return res.status(404).json({ success: false, message: 'Khong tim thay san pham de sua' });
            }

            return res.json({ success: true, message: 'Cap nhat thanh cong', data: updatedProduct });
        } catch (error) {
            console.error('Loi sua san pham:', error);
            return res.status(500).json({ success: false, message: 'Loi Server!' });
        }
    }

    public static async deleteProduct(req: Request, res: Response) {
        try {
            const deletedProduct = await ProductService.deleteProduct(req.params.id);

            if (!deletedProduct) {
                return res.status(404).json({ success: false, message: 'Khong tim thay san pham' });
            }

            return res.json({ success: true, message: 'Xoa thanh cong' });
        } catch (error) {
            console.error('Loi xoa san pham:', error);
            return res.status(500).json({ success: false, message: 'Loi Server!' });
        }
    }
}
