import { ProductRepository } from '../repositories/product.repository';
import { ProductListQuery } from '../validators/product.validator';

export class ProductService {
    // lấy danh sách sản phẩm
    public static async getProducts(query: ProductListQuery) {
        // lấy danh sách sản phẩm theo điều kiện lọc và phân trang
        const [products, totalItems] = await ProductRepository.findProducts(query); // lấy danh sách sản phẩm và đếm số lượng
        const totalPages = Math.max(Math.ceil(totalItems / query.limit), 1); // tính số lượng trang tối thiểu là 1

        // trả dữ liệu về controller
        return {
            products,
            page: query.page,
            limit: query.limit,
            totalItems,
            totalPages,
            hasNext: query.page < totalPages,
            hasPrevious: query.page > 1,
            hasNextPage: query.page < totalPages,
            hasPreviousPage: query.page > 1,
        };
    }

    public static getProductById(id: string) {
        // lấy chi tiết sản phẩm theo ID
        return ProductRepository.findProductById(id); // trả về sản phẩm theo ID từ repository
    }

    public static createProduct(payload: Record<string, unknown>) {
        return ProductRepository.createProduct(ProductService.normalizeWritePayload(payload));
    }

    public static updateProduct(id: string, payload: Record<string, unknown>) {
        return ProductRepository.updateProduct(id, ProductService.normalizeWritePayload(payload));
    }

    public static deleteProduct(id: string) {
        return ProductRepository.deleteProduct(id);
    }

    private static normalizeWritePayload(payload: Record<string, unknown>) {
        const normalizedPayload = { ...payload };

        if (typeof normalizedPayload.category === 'string') {
            normalizedPayload.category = normalizedPayload.category.toLowerCase();
        }

        if (typeof normalizedPayload.brand === 'string') {
            normalizedPayload.brand = normalizedPayload.brand.toLowerCase();
        }

        if (normalizedPayload.stock !== undefined) {
            const parsedStock = Number(normalizedPayload.stock);
            normalizedPayload.stock = Number.isInteger(parsedStock) && parsedStock >= 0 ? parsedStock : 0;
        }

        if (normalizedPayload.price !== undefined) {
            normalizedPayload.price = Number(normalizedPayload.price);
        }

        if (normalizedPayload.originalPrice !== undefined) {
            normalizedPayload.originalPrice = Number(normalizedPayload.originalPrice);
        }

        if (normalizedPayload.stock !== undefined) {
            normalizedPayload.status = Number(normalizedPayload.stock) > 0 ? 'available' : 'unavailable';
        }

        return normalizedPayload;
    }
}
