import mongoose from 'mongoose';
import Product from './biz/user/product/product.model';

const MONGO_URI =
    'mongodb://bmda2vth_db_user:duc123456@ac-pgp5ivh-shard-00-00.8xo0fry.mongodb.net:27017,ac-pgp5ivh-shard-00-01.8xo0fry.mongodb.net:27017,ac-pgp5ivh-shard-00-02.8xo0fry.mongodb.net:27017/viettel_store?ssl=true&replicaSet=atlas-l2321d-shard-0&authSource=admin';

const rawData = [
    {
        name: 'Samsung Galaxy S24 Ultra 12GB 256GB',
        price: '30.990.000 ₫',
        oldPrice: '36.990.000 ₫',
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80',
        promoText: 'Giảm thêm 500.000đ khi trả góp qua Samsung Finance+',
    },
    {
        name: 'Samsung Galaxy S24 12GB 256GB',
        price: '21.190.000 ₫',
        oldPrice: '25.990.000 ₫',
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80',
        promoText: 'Giảm thêm 500.000đ khi trả góp qua Samsung Finance+',
    },
    {
        name: 'iPhone 15 Pro Max 256GB',
        price: '29.490.000 ₫',
        oldPrice: '34.990.000 ₫',
        image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&q=80',
        promoText: 'Bảo hành 24 tháng chính hãng',
    },
    {
        name: 'iPhone 15 128GB',
        price: '19.990.000 ₫',
        oldPrice: '22.990.000 ₫',
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80',
        promoText: 'Trả góp 0% qua thẻ tín dụng',
    },
    {
        name: 'OPPO Find N3 Flip 5G',
        price: '22.990.000 ₫',
        oldPrice: '25.990.000 ₫',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80',
        promoText: 'Tặng tai nghe Enco Air 3',
    },
    {
        name: 'Xiaomi 14 5G',
        price: '20.990.000 ₫',
        oldPrice: '22.990.000 ₫',
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80',
        promoText: 'Bảo hành Premium 24 tháng',
    },
    {
        name: 'Samsung Galaxy Z Fold5 5G',
        price: '35.990.000 ₫',
        oldPrice: '40.990.000 ₫',
        image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500&q=80',
        promoText: 'Giảm thêm 1 triệu qua Galaxy Gifts',
    },
    {
        name: 'iPhone 14 Pro Max 256GB',
        price: '26.890.000 ₫',
        oldPrice: '29.990.000 ₫',
        image: 'https://images.unsplash.com/photo-1530319067432-f2a729c03db5?w=500&q=80',
        promoText: 'Trả góp 0% duyệt hồ sơ 5 phút',
    },
    {
        name: 'Apple MacBook Pro 14 M3 2023',
        price: '39.990.000 ₫',
        oldPrice: '42.990.000 ₫',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
        promoText: 'Tặng chuột Magic Mouse',
    },
    {
        name: 'Dell XPS 15 9530 (Core i7, 16GB RAM)',
        price: '45.490.000 ₫',
        oldPrice: '49.990.000 ₫',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80',
        promoText: 'Bảo hành tận nhà 12 tháng',
    },
    {
        name: 'ASUS ROG Strix G16 Gaming',
        price: '35.990.000 ₫',
        oldPrice: '39.990.000 ₫',
        image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80',
        promoText: 'Tặng Balo ROG xịn xò',
    },
    {
        name: 'Lenovo ThinkPad X1 Carbon Gen 11',
        price: '41.990.000 ₫',
        oldPrice: '45.990.000 ₫',
        image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80',
        promoText: 'Giảm 500k khi thanh toán VNPay',
    },
    {
        name: 'iPad Pro 11 inch M2 2022 WiFi 128GB',
        price: '20.490.000 ₫',
        oldPrice: '23.990.000 ₫',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80',
        promoText: 'Giảm thêm 300k cho Học sinh - Sinh viên',
    },
    {
        name: 'Samsung Galaxy Tab S9 FE WiFi',
        price: '9.990.000 ₫',
        oldPrice: '11.990.000 ₫',
        image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=500&q=80',
        promoText: 'Tặng bao da kèm bàn phím chính hãng',
    },
    {
        name: 'iPad Air 5 10.9 inch M1 WiFi 64GB',
        price: '14.990.000 ₫',
        oldPrice: '16.990.000 ₫',
        image: 'https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=500&q=80',
        promoText: 'Giảm 20% khi mua kèm Apple Pencil',
    },
    {
        name: 'Xiaomi Pad 6 8GB/256GB',
        price: '8.490.000 ₫',
        oldPrice: '9.490.000 ₫',
        image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80',
        promoText: 'Bảo hành 18 tháng',
    },
    {
        name: 'Apple Watch Series 9 GPS 41mm',
        price: '9.990.000 ₫',
        oldPrice: '11.990.000 ₫',
        image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&q=80',
        promoText: 'Tặng dây đeo thể thao chính hãng',
    },
    {
        name: 'Samsung Galaxy Watch5 Pro LTE',
        price: '7.490.000 ₫',
        oldPrice: '8.990.000 ₫',
        image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80',
        promoText: 'Giảm thêm 500k khi mua kèm tai nghe Galaxy Buds2 Pro',
    },
    {
        name: 'Garmin Fenix 7X Sapphire Solar',
        price: '15.990.000 ₫',
        oldPrice: '18.990.000 ₫',
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80',
        promoText: 'Tặng dây đeo Garmin QuickFit',
    },
    {
        name: 'Xiaomi Watch S1 Pro',
        price: '4.990.000 ₫',
        oldPrice: '5.990.000 ₫',
        image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=500&q=80',
        promoText: 'Bảo hành 24 tháng',
    },
];

const parsePrice = (priceStr: string) => {
    return Number(priceStr.replace(/[^0-9]/g, ''));
};

const getBrand = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('samsung')) return 'Samsung';
    if (n.includes('iphone') || n.includes('ipad') || n.includes('apple') || n.includes('macbook')) return 'Apple';
    if (n.includes('xiaomi')) return 'Xiaomi';
    if (n.includes('oppo')) return 'OPPO';
    if (n.includes('dell')) return 'Dell';
    if (n.includes('asus')) return 'ASUS';
    if (n.includes('lenovo')) return 'Lenovo';
    if (n.includes('garmin')) return 'Garmin';
    return 'Khác';
};

const getCategory = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('macbook') || n.includes('xps') || n.includes('strix') || n.includes('thinkpad')) return 'laptop';
    if (n.includes('ipad') || n.includes('tab') || n.includes('pad')) return 'tablet';
    if (n.includes('watch') || n.includes('fenix')) return 'smartwatch';
    return 'phone';
};

const seedDatabase = async () => {
    try {
        console.log('Đang kết nối database...');
        await mongoose.connect(MONGO_URI);

        console.log('Đang dọn dẹp kho cũ...');
        await Product.deleteMany({});

        console.log('Đang tạo và bơm dữ liệu mới...');
        const formattedProducts = rawData.map((item) => ({
            name: item.name,
            price: parsePrice(item.price),
            originalPrice: parsePrice(item.oldPrice),
            description: item.promoText,
            image: item.image,
            brand: getBrand(item.name),
            category: getCategory(item.name),
            stock: 50,
        }));

        await Product.insertMany(formattedProducts);
        console.log('BƠM DỮ LIỆU THÀNH CÔNG 100%!');
        process.exit(0);
    } catch (error) {
        console.error('Lỗi:', error);
        process.exit(1);
    }
};

seedDatabase();
