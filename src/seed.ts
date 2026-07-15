import mongoose from 'mongoose';

import { MONGODB_URI } from './config/environment';
import Product from './models/Product';
import { DEFAULT_SEED_PRODUCT_COUNT, reseedProducts } from './services/productSeeder';

const seedDatabase = async () => {
    try {
        console.log('Đang kết nối database...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            keepAlive: true,
        });

        console.log('Đang tạo dữ liệu mẫu sản phẩm...');
        const insertedCount = await reseedProducts(DEFAULT_SEED_PRODUCT_COUNT);
        const productCount = await Product.countDocuments({});
        console.log(`Đã seed ${insertedCount} sản phẩm.`);
        console.log(`Tổng số sản phẩm hiện tại: ${productCount}.`);
        process.exit(0);
    } catch (error) {
        console.error('Lỗi seed sản phẩm:', error);
        process.exit(1);
    }
};

seedDatabase();
