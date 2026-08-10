import { Request, Response } from 'express';

import Product from '../../biz/user/product/product.model';

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildFlexibleSearchPattern = (value: string) => // tạo mẫu tìm kiếm linh hoạt 
    escapeRegex(value.trim().toLowerCase()).replace(/[\s-]+/g, '[-\\s]*');

export class ProductController {
    public static async getProducts(req: Request, res: Response) { // lấy danh sách sản phẩm 
        try { // rút các từ khóa gửi lên từ URL ( req.query )
            const { 
                search = '',
                category,
                brand,
                priceMin,
                priceMax,
                stock,
                page = '1',
                limit = '8',
            } = req.query;
            // xử lí phân trang: số trang và số lượng trang luôn lớn hơn 1 
            const currentPage = Math.max(parseInt(page as string, 10) || 1, 1);
            const pageSize = Math.max(parseInt(limit as string, 10) || 8, 1);
            // tính số lượng sản phẩm bỏ qua để sang trang tiếp 
            const skip = (currentPage - 1) * pageSize;
            // tạo 1 giỏ rỗng để chứa điều kiện lọc 
            const query: Record<string, unknown> = {};
           
            // nếu người dùng gõ từ khóa tìm kiếm 
            if (typeof search === 'string' && search.trim()) {
                const pattern = buildFlexibleSearchPattern(search);
                // tính bằng toán tử $or: tên, thương hiệu hoặc danh mục có chứa từ khóa
                query.$or = [
                    { name: { $regex: pattern, $options: 'i' } },
                    { brand: { $regex: pattern, $options: 'i' } },
                    { category: { $regex: pattern, $options: 'i' } },
                ];
            }
            
            // nếu người dùng bấm lọc theo danh mục 
            if (typeof category === 'string' && category.trim()) {
                query.category = category.trim().toLowerCase();
            }
            // lọc theo thương hiệu 
            if (typeof brand === 'string' && brand.trim()) {
                query.brand = { $regex: `^${escapeRegex(brand.trim().toLowerCase())}$`, $options: 'i' };
            }
            // lọc theo tình trạng kho hàng
            if (typeof stock === 'string' && stock.trim()) {
                query.stock = stock === 'out' ? { $lte: 0 } : { $gt: 0 };
            }
            // thanh trượt lọc khoảng giá
            if (priceMin !== undefined || priceMax !== undefined) {
                const priceQuery: Record<string, number> = {};

                if (priceMin !== undefined) {
                    priceQuery.$gte = Number(priceMin); // lớn hơn hoặc bằng giá Min 
                }

                if (priceMax !== undefined) {
                    priceQuery.$lte = Number(priceMax); // nhỏ hơn hoặc bằng giá Max
                }

                query.price = priceQuery; // gắn điều kiện vào query
            }

            const [products, totalItems] = await Promise.all([ // lấy danh sách sản phẩm và đếm số lượng sản phẩm thỏa mãn bộ lọc 
                Product.find(query)  
                    .select('name price originalPrice description image category brand stock createdAt')
                    .sort({ createdAt: -1 }) // sắp xếp mới nhất lên đầu 
                    .skip(skip)  // bỏ qua sản phẩm trang trước
                    .limit(pageSize) // lấy đúng số lượng của trang hiện tại 
                    .lean(),  // ép kiểu về JSON cho nhẹ RAM server
                Product.countDocuments(query), // đếm tổng 
            ]);

            // tính xem chia được tất cả bao nhiêu trang 
            const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);

            // trả dữ liệu về cho frontend
            res.json({
                success: true,
                message: 'Lấy dữ liệu thành công',
                // Giữ cả hai tên trường để tương thích với các phiên bản frontend sau refactor.
                products,
                data: products,  // danh sách sản phẩm 
                pagination: {   // thống kê phân trang 
                    page: currentPage,
                    limit: pageSize,
                    totalPages,
                    totalItems,
                    hasNextPage: currentPage < totalPages, // còn trang sau
                    hasPreviousPage: currentPage > 1,   // còn trang trước 
                    hasNext: currentPage < totalPages,
                    hasPrevious: currentPage > 1,
                },
            });
        } catch (error) {
            console.error('Lỗi lấy sản phẩm:', error);
            res.status(500).json({ success: false, message: 'Lỗi Server!' });
        }
    }

    public static async getProductById(req: Request, res: Response) {
        try {
            // Lấy sản phẩm theo ID để trang chi tiết không bị gọi nhầm vào danh sách.
            const product = await Product.findById(req.params.id).lean();

            if (!product) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
            }

            // Trả về payload thống nhất với các API sản phẩm còn lại.
            return res.json({ success: true, data: product, product });
        } catch (error) {
            console.error('Lỗi lấy chi tiết sản phẩm:', error);
            return res.status(500).json({ success: false, message: 'Lỗi Server!' });
        }
    }

    // thêm sản phẩm mới 
    public static async createProduct(req: Request, res: Response) {
        try {
            const newProduct = new Product(req.body); // nhét toàn bộ dữ liệu form vào model 
            await newProduct.save(); // lưu vào database 
            res.status(201).json({ success: true, message: 'Thêm sản phẩm thành công', data: newProduct });
        } catch (error) {
            console.error('Lỗi thêm sản phẩm:', error);
            res.status(500).json({ success: false, message: 'Lỗi Server!' });
        }
    }

    // cập nhật ( sửa ) sản phẩm 
    public static async updateProduct(req: Request, res: Response) {
        try { // tìm theo ID lấy từ URL và ghi đè dữ liệu mới 
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

    // xóa sản phẩm
    public static async deleteProduct(req: Request, res: Response) {
        try {
            // xóa dựa theo ID 
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
