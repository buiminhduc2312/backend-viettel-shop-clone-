import Product from '../models/Product';
import Order from '../models/Order';
import Review from '../models/Review';
import WishlistModel from '../models/Wishlist';
import { UserModel } from '../biz/user/user.model';

const getCountValue = (result: Array<{ total: number }>) => result[0]?.total ?? 0;

export class StatisticsRepository {
    public static async getOverview() {
        const [productCount, userCount, orderCount, reviewCount, completedOrderStats] = await Promise.all([
            Product.aggregate([{ $count: 'total' }]).exec(),
            UserModel.aggregate([{ $count: 'total' }]).exec(),
            Order.aggregate([{ $count: 'total' }]).exec(),
            Review.aggregate([{ $count: 'total' }]).exec(),
            Order.aggregate([
                { $match: { status: 'completed' } },
                {
                    $group: {
                        _id: null,
                        completedOrders: { $sum: 1 },
                        totalRevenue: { $sum: '$totalAmount' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        completedOrders: 1,
                        totalRevenue: 1,
                    },
                },
            ]).exec(),
        ]);

        return {
            totalProducts: getCountValue(productCount),
            totalUsers: getCountValue(userCount),
            totalOrders: getCountValue(orderCount),
            totalReviews: getCountValue(reviewCount),
            totalRevenue: completedOrderStats[0]?.totalRevenue ?? 0,
            completedOrders: completedOrderStats[0]?.completedOrders ?? 0,
        };
    }

    public static getTopRatedProducts() {
        return Product.aggregate([
            {
                $project: {
                    _id: 1,
                    name: 1,
                    image: 1,
                    averageRating: { $ifNull: ['$averageRating', 0] },
                    totalReviews: { $ifNull: ['$totalReviews', 0] },
                },
            },
            { $sort: { averageRating: -1, totalReviews: -1 } },
            { $limit: 10 },
        ]).exec();
    }

    public static getTopWishlistProducts() {
        return WishlistModel.aggregate([
            {
                $group: {
                    _id: '$productId',
                    wishlistCount: { $sum: 1 },
                },
            },
            { $sort: { wishlistCount: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            { $unwind: '$product' },
            {
                $project: {
                    _id: '$product._id',
                    name: '$product.name',
                    image: '$product.image',
                    wishlistCount: 1,
                },
            },
        ]).exec();
    }
}
