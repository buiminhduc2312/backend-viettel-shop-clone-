import mongoose from 'mongoose';

import { MONGODB_URI } from '../src/config/environment';
import Product from '../src/models/Product';
import { DEFAULT_SEED_PRODUCT_COUNT, reseedProducts } from '../src/services/productSeeder';

const run = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            keepAlive: true,
        });

        const insertedCount = await reseedProducts(DEFAULT_SEED_PRODUCT_COUNT);
        const productCount = await Product.countDocuments({});

        console.log(`Inserted ${insertedCount} products.`);
        console.log(`Current product count: ${productCount}.`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Failed to seed products:', error);
        try {
            await mongoose.disconnect();
        } catch {
            // noop
        }
        process.exit(1);
    }
};

run();
