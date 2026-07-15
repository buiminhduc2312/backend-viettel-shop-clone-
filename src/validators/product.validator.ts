import { NextFunction, Request, Response } from 'express';

const toFiniteNumber = (value: unknown) => {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }

    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : undefined;
};

export interface ProductListQuery { 
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    page: number;
    limit: number;
    sort: 'newest' | 'oldest' | 'priceAsc' | 'priceDesc' | 'nameAsc' | 'nameDesc';
}

const toNonNegativeInteger = (value: unknown) => {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }

    const parsedValue = Number(value);
    return Number.isInteger(parsedValue) && parsedValue >= 0 ? parsedValue : undefined;
};

export class ProductValidator {
    public static validateCreateOrUpdate(req: Request, res: Response, next: NextFunction) {
        const { name, price, image, category, brand, stock } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Tên sản phẩm không được để trống!' });
        }

        if (price === undefined || price === null || Number(price) < 0) {
            return res.status(400).json({ success: false, message: 'Giá sản phẩm không hợp lệ!' });
        }

        if (!image) {
            return res.status(400).json({ success: false, message: 'Ảnh sản phẩm không được để trống!' });
        }

        if (!category) {
            return res.status(400).json({ success: false, message: 'Danh mục sản phẩm không được để trống!' });
        }

        if (!brand) {
            return res.status(400).json({ success: false, message: 'Thương hiệu sản phẩm không được để trống!' });
        }

        if (stock !== undefined && toNonNegativeInteger(stock) === undefined) {
            return res.status(400).json({ success: false, message: 'Số lượng tồn kho phải là số nguyên không âm!' });
        }

        next();
    }

    public static parseListQuery(query: Request['query']): ProductListQuery {
        const page = Math.max(toFiniteNumber(query.page) || 1, 1);
        const limit = Math.max(toFiniteNumber(query.limit) || 10, 1);
        const minPrice = toFiniteNumber(query.minPrice ?? query.priceMin);
        const maxPrice = toFiniteNumber(query.maxPrice ?? query.priceMax);
        const stockValue = typeof query.inStock === 'string' ? query.inStock : query.stock;

        const parsedQuery: ProductListQuery = {
            page,
            limit,
            sort: ProductValidator.parseSort(query.sort),
        };

        if (typeof query.search === 'string' && query.search.trim()) {
            parsedQuery.search = query.search.trim();
        }

        if (typeof query.category === 'string' && query.category.trim()) {
            parsedQuery.category = query.category.trim().toLowerCase();
        }

        if (typeof query.brand === 'string' && query.brand.trim()) {
            parsedQuery.brand = query.brand.trim().toLowerCase();
        }

        if (minPrice !== undefined) {
            parsedQuery.minPrice = minPrice;
        }

        if (maxPrice !== undefined) {
            parsedQuery.maxPrice = maxPrice;
        }

        if (typeof stockValue === 'string' && stockValue.trim()) {
            const normalizedStock = stockValue.trim().toLowerCase();
            if (normalizedStock === 'in' || normalizedStock === 'true' || normalizedStock === 'available') {
                parsedQuery.inStock = true;
            } else if (normalizedStock === 'out' || normalizedStock === 'false' || normalizedStock === 'unavailable') {
                parsedQuery.inStock = false;
            }
        }

        return parsedQuery;
    }

    private static parseSort(value: unknown): ProductListQuery['sort'] {
        switch (value) {
            case 'oldest':
            case 'priceAsc':
            case 'priceDesc':
            case 'nameAsc':
            case 'nameDesc':
                return value;
            case 'newest':
            default:
                return 'newest';
        }
    }
}
