import { Request, Response } from 'express';

import { StatisticsBiz } from '../biz/statistics/statistics.biz';

export class StatisticsController {
    public static async getOverview(req: Request, res: Response) {
        try {
            const data = await StatisticsBiz.getOverview();
            return res.status(200).json({ success: true, data });
        } catch (error) {
            console.error('Get statistics overview error:', error);
            return res.status(500).json({ success: false, message: 'Statistics error' });
        }
    }

    public static async getTopRatedProducts(req: Request, res: Response) {
        try {
            const data = await StatisticsBiz.getTopRatedProducts();
            return res.status(200).json({ success: true, data });
        } catch (error) {
            console.error('Get top rated products error:', error);
            return res.status(500).json({ success: false, message: 'Statistics error' });
        }
    }

    public static async getTopWishlistProducts(req: Request, res: Response) {
        try {
            const data = await StatisticsBiz.getTopWishlistProducts();
            return res.status(200).json({ success: true, data });
        } catch (error) {
            console.error('Get top wishlist products error:', error);
            return res.status(500).json({ success: false, message: 'Statistics error' });
        }
    }
}
