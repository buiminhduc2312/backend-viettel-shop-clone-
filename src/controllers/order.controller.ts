import { Request, Response } from 'express';

import { OrderService } from '../services/order.service';

const isBadRequestError = (error: unknown) => {
    if (!(error instanceof Error)) {
        return false;
    }

    return (
        error.message.includes('bat buoc') ||
        error.message.includes('khong duoc de trong') ||
        error.message.includes('khong hop le') ||
        error.message.includes('khong du') ||
        error.message.includes('khong con ton tai')
    );
};

export class OrderController {
    public static async getAllOrders(req: Request, res: Response) {
        try {
            const orders = await OrderService.getAllOrders();

            return res.status(200).json({
                success: true,
                message: 'Lay danh sach tat ca don hang thanh cong',
                data: orders,
            });
        } catch (error) {
            console.error('Loi lay tat ca don hang:', error);
            return res.status(500).json({ success: false, message: 'Loi Server!' });
        }
    }

    public static async createOrder(req: Request, res: Response) {
        try {
            const userId = req.userId as string;
            const { products } = req.body;

            const newOrder = await OrderService.createOrder(userId, products);

            return res.status(201).json({
                success: true,
                message: 'Tao don hang thanh cong',
                data: newOrder,
            });
        } catch (error) {
            console.error('Loi tao don hang:', error);

            if (isBadRequestError(error)) {
                return res.status(400).json({ success: false, message: (error as Error).message });
            }

            return res.status(500).json({ success: false, message: 'Loi Server!' });
        }
    }

    public static async getOrdersByUser(req: Request, res: Response) {
        try {
            const userId = req.userId as string;
            const orders = await OrderService.getOrdersByUser(userId);

            return res.status(200).json({
                success: true,
                message: 'Lay danh sach don hang thanh cong',
                data: orders,
            });
        } catch (error) {
            console.error('Loi lay danh sach don hang:', error);

            if (isBadRequestError(error)) {
                return res.status(400).json({ success: false, message: (error as Error).message });
            }

            return res.status(500).json({ success: false, message: 'Loi Server!' });
        }
    }

    public static async getOrderById(req: Request, res: Response) {
        try {
            const order = await OrderService.getOrderById(req.params.id);

            if (!order) {
                return res.status(404).json({ success: false, message: 'Khong tim thay don hang' });
            }

            return res.status(200).json({
                success: true,
                message: 'Lay chi tiet don hang thanh cong',
                data: order,
            });
        } catch (error) {
            console.error('Loi lay chi tiet don hang:', error);

            if (isBadRequestError(error)) {
                return res.status(400).json({ success: false, message: (error as Error).message });
            }

            return res.status(500).json({ success: false, message: 'Loi Server!' });
        }
    }

    public static async updateOrderStatus(req: Request, res: Response) {
        try {
            const updatedOrder = await OrderService.updateOrderStatus(req.params.id, req.body.status);

            if (!updatedOrder) {
                return res.status(404).json({ success: false, message: 'Khong tim thay don hang de cap nhat' });
            }

            return res.status(200).json({
                success: true,
                message: 'Cap nhat trang thai don hang thanh cong',
                data: updatedOrder,
            });
        } catch (error) {
            console.error('Loi cap nhat trang thai don hang:', error);

            if (isBadRequestError(error)) {
                return res.status(400).json({ success: false, message: (error as Error).message });
            }

            return res.status(500).json({ success: false, message: 'Loi Server!' });
        }
    }
}
