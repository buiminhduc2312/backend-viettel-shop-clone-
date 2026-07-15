import express from 'express';

import { ProductController } from '../controllers/product.controller';
import { ReviewController } from '../controllers/review.controller';
import { ProductValidator } from '../validators/product.validator';

const router = express.Router();

router.get('/', ProductController.getProducts);
router.get('/:productId/reviews', ReviewController.getProductReviews);
router.get('/:id', ProductController.getProductById);
router.post('/', ProductValidator.validateCreateOrUpdate, ProductController.createProduct);
router.put('/:id', ProductValidator.validateCreateOrUpdate, ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

export default router;
