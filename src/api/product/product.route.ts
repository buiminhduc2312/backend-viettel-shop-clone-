import express from 'express';
import { ProductController } from './product.controller';

const router = express.Router();

// [GET] Khớp với fetch("http://localhost:3001/products")
router.get('/', ProductController.getProducts);

// Lấy thông tin chi tiết sản phẩm theo mã từ trang chi tiết.
router.get('/:id', ProductController.getProductById);

// [POST] Khớp với fetch("http://localhost:3001/products", { method: "POST" })
router.post('/', ProductController.createProduct);

// [PUT] Khớp với fetch("http://localhost:3001/products/:id", { method: "PUT" })
router.put('/:id', ProductController.updateProduct);

// [DELETE] Khớp với fetch("http://localhost:3001/products/:id", { method: "DELETE" })
router.delete('/:id', ProductController.deleteProduct);

export default router;
