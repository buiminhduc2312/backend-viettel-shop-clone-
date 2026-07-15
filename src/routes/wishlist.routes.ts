import { Router } from 'express';

import { WishlistController } from '../controllers/wishlist.controller';

const router = Router();

router.post('/:productId', WishlistController.addWishlist);
router.get('/', WishlistController.getWishlist);
router.delete('/:productId', WishlistController.removeWishlist);

export default router;
