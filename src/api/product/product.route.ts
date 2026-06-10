import { Router } from 'express';
import { ProductController } from './product.controller';
import { ProductValidator } from './product.validator';

const router = Router();

// Lấy danh sách
router.get('/', ProductController.getProducts);

// Thêm mới
router.post('/', ProductValidator.validateCreateOrUpdate, ProductController.createProduct);

// Sửa
router.put('/:id', ProductValidator.validateCreateOrUpdate, ProductController.updateProduct);

// Xóa
router.delete('/:id', ProductController.deleteProduct);

export default router;
