import Product from '../models/Product';
import { ClientSession } from 'mongoose';
import { ProductListQuery } from '../validators/product.validator';

type ProductFilterQuery = Record<string, unknown>;

const PRODUCT_PROJECTION = '_id name price originalPrice description image category brand stock status averageRating totalReviews createdAt';

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class ProductRepository {
    public static findProductsByIds(ids: string[]) {
        return Product.find({ _id: { $in: ids } }).select(PRODUCT_PROJECTION).lean().exec();
    }

    public static restoreProductInventory(id: string, quantity: number, nextStatus: 'available' | 'unavailable', session?: ClientSession) {
        const query = Product.findByIdAndUpdate(id, { $inc: { stock: quantity }, status: nextStatus }, { new: true }).lean();

        if (session) {
            query.session(session);
        }

        return query.exec();
    }

    // tạo filter
    public static buildFilter(query: ProductListQuery): ProductFilterQuery {
        const filter: ProductFilterQuery = {};

        // search theo tên sản phẩm
        if (query.search) {
            filter.name = { $regex: escapeRegex(query.search), $options: 'i' };
        }

        // lọc theo category
        if (query.category) {
            filter.category = query.category;
        }

        // lọc theo brand
        if (query.brand) {
            filter.brand = query.brand;
        }

        // lọc theo trạng thái tồn kho
        if (query.inStock !== undefined) {
            filter.stock = query.inStock ? { $gt: 0 } : { $lte: 0 };
        }

        // lọc theo khoảng giá
        if (query.minPrice !== undefined || query.maxPrice !== undefined) {
            const priceFilter: Record<string, number> = {};

            //  giá >= minPrice
            if (query.minPrice !== undefined) {
                priceFilter.$gte = query.minPrice;
            }

            // giá <= maxPrice
            if (query.maxPrice !== undefined) {
                priceFilter.$lte = query.maxPrice;
            }

            filter.price = priceFilter;
        }

        // trả điều kiện để query MongoDB
        return filter;
    }

    // tạo điều kiện sắp xếp
    public static buildSort(sort: ProductListQuery['sort']) {
        switch (sort) {
            case 'oldest':
                return { createdAt: 1 };
            case 'priceAsc':
                return { price: 1, createdAt: -1 };
            case 'priceDesc':
                return { price: -1, createdAt: -1 };
            case 'nameAsc':
                return { name: 1 };
            case 'nameDesc':
                return { name: -1 };
            case 'newest':
            default:
                return { createdAt: -1 };
        }
    }

    // lấy danh sách sản phẩm theo điều kiện lọc và phân trang
    public static async findProducts(query: ProductListQuery) {
        const filter = ProductRepository.buildFilter(query); // tạo điều kiện filter
        const skip = (query.page - 1) * query.limit; // tính số lượng sản phẩm bỏ qua để sang trang tiếp

        return Promise.all([
            Product.find(filter) // query lấy danh sách sản phẩm
                .select(PRODUCT_PROJECTION)
                .sort(ProductRepository.buildSort(query.sort))
                .skip(skip)
                .limit(query.limit)
                .lean()
                .exec(),
            Product.countDocuments(filter).exec(), //đếm tổng số sản phẩm
        ]);
    }

    // lấy chi tiết sản phẩm theo ID
    public static findProductById(id: string, session?: ClientSession) {
        const query = Product.findById(id).select(PRODUCT_PROJECTION).lean();

        if (session) {
            query.session(session);
        }

        return query.exec();
    }

    // thêm sản phẩm
    public static createProduct(payload: Record<string, unknown>) {
        const product = new Product(payload);
        return product.save();
    }

    // cập nhật sản phẩm theo ID
    public static updateProduct(id: string, payload: Record<string, unknown>) {
        return Product.findByIdAndUpdate(id, payload, { new: true }).lean().exec(); // new: true -> trả về bản ghi sau khi update
    }

    public static updateReviewStats(id: string, averageRating: number, totalReviews: number) {
        return Product.findByIdAndUpdate(id, { averageRating, totalReviews }, { new: true }).lean().exec();
    }

    // trừ tồn kho sau khi tạo đơn hàng
    public static updateProductInventory(id: string, quantity: number, nextStatus: 'available' | 'unavailable', session?: ClientSession) {
        const query = Product.findOneAndUpdate({ _id: id, stock: { $gte: quantity } }, { $inc: { stock: -quantity }, status: nextStatus }, { new: true }).lean();

        if (session) {
            query.session(session);
        }

        return query.exec();
    }

    // xóa sản phẩm theo ID
    public static deleteProduct(id: string) {
        return Product.findByIdAndDelete(id).lean().exec();
    }

    // đếm tổng số sản phẩm
    public static countProducts() {
        return Product.countDocuments({}).exec();
    }

    // thêm nhiều sản phẩm cùng lúc
    public static insertMany(payload: Record<string, unknown>[]) {
        return Product.insertMany(payload);
    }
}

