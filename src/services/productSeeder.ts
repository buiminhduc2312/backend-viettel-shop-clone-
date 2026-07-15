import Product from '../models/Product';
import { ProductRepository } from '../repositories/product.repository';

export const DEFAULT_SEED_PRODUCT_COUNT = 120;

type SeedCategory = 'dien-thoai' | 'laptop' | 'may-tinh-bang' | 'dong-ho-thong-minh' | 'phu-kien';
type ProductStatus = 'available' | 'unavailable';

interface CatalogDefinition {
    category: SeedCategory;
    categoryLabel: string;
    brand: string;
    brandLabel: string;
    series: string;
    variants: string[];
    priceRange: {
        min: number;
        max: number;
    };
    imageKey: string;
    imageUrls: string[];
    descriptionTemplate: string;
}

interface SeedProductPayload extends Record<string, unknown> {
    name: string;
    description: string;
    category: SeedCategory;
    brand: string;
    price: number;
    originalPrice: number;
    stock: number;
    image: string;
    status: ProductStatus;
    createdAt: Date;
    updatedAt: Date;
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const CATALOG: CatalogDefinition[] = [
    {
        category: 'dien-thoai',
        categoryLabel: 'Điện thoại',
        brand: 'apple',
        brandLabel: 'Apple',
        series: 'iPhone',
        variants: ['15 128GB', '15 Plus 128GB', '15 Pro 256GB', '15 Pro Max 256GB', '14 128GB', '14 Plus 128GB'],
        priceRange: { min: 16990000, max: 34990000 },
        imageKey: 'apple-iphone',
        imageUrls: [
            'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80',
        ],
        descriptionTemplate: 'Điện thoại cao cấp với màn hình sắc nét, camera ổn định và hiệu năng mượt cho nhu cầu hằng ngày.',
    },
    {
        category: 'dien-thoai',
        categoryLabel: 'Điện thoại',
        brand: 'samsung',
        brandLabel: 'Samsung',
        series: 'Galaxy',
        variants: ['S24 256GB', 'S24+ 256GB', 'S24 Ultra 256GB', 'A55 128GB', 'A35 128GB', 'Z Flip6 256GB'],
        priceRange: { min: 7990000, max: 31990000 },
        imageKey: 'samsung-galaxy',
        imageUrls: [
            'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=900&q=80',
        ],
        descriptionTemplate: 'Smartphone cân bằng giữa thiết kế, pin và camera, phù hợp cả công việc lẫn giải trí.',
    },
    {
        category: 'dien-thoai',
        categoryLabel: 'Điện thoại',
        brand: 'xiaomi',
        brandLabel: 'Xiaomi',
        series: 'Xiaomi',
        variants: ['14 256GB', '14T 256GB', 'Redmi Note 13 Pro 256GB', 'POCO X6 Pro 256GB', 'Redmi 13 128GB', 'POCO C65 128GB'],
        priceRange: { min: 3190000, max: 18990000 },
        imageKey: 'xiaomi-phone',
        imageUrls: [
            'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
        ],
        descriptionTemplate: 'Điện thoại cấu hình tốt trong tầm giá, màn hình đẹp và sạc nhanh tiện dụng.',
    },
    {
        category: 'dien-thoai',
        categoryLabel: 'Điện thoại',
        brand: 'oppo',
        brandLabel: 'Oppo',
        series: 'Oppo',
        variants: ['Reno11 F 256GB', 'Reno12 256GB', 'Find X8 256GB', 'A79 256GB', 'A60 128GB', 'A3 128GB'],
        priceRange: { min: 4290000, max: 22990000 },
        imageKey: 'oppo-phone',
        imageUrls: [
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=900&q=80',
        ],
        descriptionTemplate: 'Điện thoại chú trọng trải nghiệm chụp ảnh chân dung, thiết kế mỏng nhẹ và giao diện dễ dùng.',
    },
    {
        category: 'dien-thoai',
        categoryLabel: 'Điện thoại',
        brand: 'vivo',
        brandLabel: 'Vivo',
        series: 'Vivo',
        variants: ['V30 256GB', 'V40 256GB', 'Y100 256GB', 'Y28 128GB', 'Y03 64GB', 'X100 256GB'],
        priceRange: { min: 2690000, max: 23990000 },
        imageKey: 'vivo-phone',
        imageUrls: [
            'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=900&q=80',
        ],
        descriptionTemplate: 'Mẫu điện thoại phù hợp người dùng trẻ với camera trước tốt, pin khỏe và hiệu năng ổn định.',
    },
    {
        category: 'laptop',
        categoryLabel: 'Laptop',
        brand: 'apple',
        brandLabel: 'Apple',
        series: 'MacBook',
        variants: ['Air M2 13 inch', 'Air M3 13 inch', 'Air M3 15 inch', 'Pro M3 14 inch', 'Pro M3 Pro 14 inch', 'Pro M3 Max 16 inch'],
        priceRange: { min: 24490000, max: 68990000 },
        imageKey: 'apple-macbook',
        imageUrls: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
        ],
        descriptionTemplate: 'Laptop cao cấp cho công việc sáng tạo và văn phòng, nổi bật với màn hình đẹp và thời lượng pin tốt.',
    },
    {
        category: 'laptop',
        categoryLabel: 'Laptop',
        brand: 'asus',
        brandLabel: 'Asus',
        series: 'Asus',
        variants: ['Vivobook 15 OLED', 'Zenbook 14 OLED', 'TUF Gaming A15', 'ROG Strix G16', 'ExpertBook B1', 'Vivobook Go 14'],
        priceRange: { min: 8990000, max: 42990000 },
        imageKey: 'asus-laptop',
        imageUrls: [
            'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=900&q=80',
        ],
        descriptionTemplate: 'Laptop đa dạng cấu hình, đáp ứng từ học tập, văn phòng đến gaming với tản nhiệt và bàn phím tốt.',
    },
    {
        category: 'laptop',
        categoryLabel: 'Laptop',
        brand: 'dell',
        brandLabel: 'Dell',
        series: 'Dell',
        variants: ['Inspiron 15 3530', 'Vostro 15 3520', 'Latitude 5440', 'XPS 13', 'G15 5530', 'Inspiron 14 5430'],
        priceRange: { min: 10490000, max: 45990000 },
        imageKey: 'dell-laptop',
        imageUrls: [
            'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
        ],
        descriptionTemplate: 'Laptop bền bỉ, phù hợp doanh nghiệp và cá nhân cần độ ổn định cao trong quá trình sử dụng lâu dài.',
    },
    {
        category: 'laptop',
        categoryLabel: 'Laptop',
        brand: 'hp',
        brandLabel: 'HP',
        series: 'HP',
        variants: ['15s fq5', 'Pavilion 14', 'Envy x360 14', 'Victus 15', 'ProBook 440 G10', 'Spectre x360 14'],
        priceRange: { min: 9790000, max: 39990000 },
        imageKey: 'hp-laptop',
        imageUrls: [
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=900&q=80',
        ],
        descriptionTemplate: 'Laptop có thiết kế thực dụng, trải nghiệm gõ phím dễ chịu và hiệu năng phù hợp cho nhiều nhu cầu.',
    },
    {
        category: 'laptop',
        categoryLabel: 'Laptop',
        brand: 'lenovo',
        brandLabel: 'Lenovo',
        series: 'Lenovo',
        variants: ['IdeaPad Slim 3', 'IdeaPad 5 Pro', 'Yoga 7', 'LOQ 15', 'ThinkBook 14', 'Legion 5'],
        priceRange: { min: 8990000, max: 38990000 },
        imageKey: 'lenovo-laptop',
        imageUrls: [
            'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
        ],
        descriptionTemplate: 'Laptop cân đối giữa giá bán, chất lượng hoàn thiện và hiệu năng cho học tập, làm việc và giải trí.',
    },
    {
        category: 'laptop',
        categoryLabel: 'Laptop',
        brand: 'acer',
        brandLabel: 'Acer',
        series: 'Acer',
        variants: ['Aspire 5', 'Swift Go 14', 'Nitro V 15', 'Predator Helios Neo 16', 'TravelMate P2', 'Aspire Lite 15'],
        priceRange: { min: 8290000, max: 35990000 },
        imageKey: 'acer-laptop',
        imageUrls: [
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=900&q=80',
        ],
        descriptionTemplate: 'Laptop có nhiều lựa chọn trong từng phân khúc, phù hợp cả văn phòng lẫn game thủ phổ thông.',
    },
    {
        category: 'may-tinh-bang',
        categoryLabel: 'Máy tính bảng',
        brand: 'apple',
        brandLabel: 'Apple',
        series: 'iPad',
        variants: ['Gen 10 WiFi 64GB', 'Mini 128GB', 'Air 11 inch 128GB', 'Air 13 inch 128GB', 'Pro 11 inch 256GB', 'Pro 13 inch 256GB'],
        priceRange: { min: 8990000, max: 36990000 },
        imageKey: 'apple-ipad',
        imageUrls: [
            'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1589739900266-43b2843f4c12?auto=format&fit=crop&w=900&q=80',
        ],
        descriptionTemplate: 'Máy tính bảng phục vụ học tập, giải trí và ghi chú với màn hình chất lượng cao và hệ sinh thái mạnh.',
    },
    {
        category: 'may-tinh-bang',
        categoryLabel: 'Máy tính bảng',
        brand: 'samsung',
        brandLabel: 'Samsung',
        series: 'Galaxy Tab',
        variants: ['A9 WiFi', 'A9+ 5G', 'S9 FE', 'S9 FE+', 'S9 5G', 'S9 Ultra 5G'],
        priceRange: { min: 3590000, max: 26990000 },
        imageKey: 'samsung-tablet',
        imageUrls: [
            'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=900&q=80',
        ],
        descriptionTemplate: 'Tablet Android có màn hình lớn, loa ngoài tốt và phù hợp cho giải trí, học online hoặc làm việc nhẹ.',
    },
    {
        category: 'may-tinh-bang',
        categoryLabel: 'Máy tính bảng',
        brand: 'xiaomi',
        brandLabel: 'Xiaomi',
        series: 'Xiaomi Pad',
        variants: ['Redmi Pad SE', 'Pad 6 128GB', 'Pad 6 256GB', 'Pad 6S Pro 256GB', 'Redmi Pad Pro WiFi', 'Redmi Pad Pro 5G'],
        priceRange: { min: 4190000, max: 15990000 },
        imageKey: 'xiaomi-tablet',
        imageUrls: [
            'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=900&q=80',
        ],
        descriptionTemplate: 'Máy tính bảng có mức giá cạnh tranh, pin lâu và trải nghiệm xem nội dung tốt trong phân khúc.',
    },
    {
        category: 'may-tinh-bang',
        categoryLabel: 'Máy tính bảng',
        brand: 'lenovo',
        brandLabel: 'Lenovo',
        series: 'Tab',
        variants: ['M10 Gen 3', 'Tab P11', 'Tab P12', 'Legion Y700', 'Idea Tab Pro', 'Tab Plus'],
        priceRange: { min: 3190000, max: 13990000 },
        imageKey: 'lenovo-tablet',
        imageUrls: [
            'https://images.unsplash.com/photo-1589739900266-43b2843f4c12?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=900&q=80',
        ],
        descriptionTemplate: 'Tablet linh hoạt cho gia đình, học tập và giải trí, có loa tốt và thiết kế thực dụng.',
    },
    {
        category: 'dong-ho-thong-minh',
        categoryLabel: 'Đồng hồ thông minh',
        brand: 'apple',
        brandLabel: 'Apple',
        series: 'Apple Watch',
        variants: ['SE 40mm', 'SE 44mm', 'Series 9 41mm', 'Series 9 45mm', 'Ultra 2 49mm', 'Nike Sport 45mm'],
        priceRange: { min: 5790000, max: 21990000 },
        imageKey: 'apple-watch',
        imageUrls: [
            'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=80',
        ],
        descriptionTemplate: 'Đồng hồ thông minh theo dõi sức khỏe, hỗ trợ thông báo và đồng bộ tốt với hệ sinh thái di động.',
    },
    {
        category: 'dong-ho-thong-minh',
        categoryLabel: 'Đồng hồ thông minh',
        brand: 'samsung',
        brandLabel: 'Samsung',
        series: 'Galaxy Watch',
        variants: ['FE 40mm', '6 40mm', '6 44mm', '6 Classic 47mm', 'Watch Ultra', 'Fit3'],
        priceRange: { min: 1490000, max: 11990000 },
        imageKey: 'samsung-watch',
        imageUrls: [
            'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
        ],
        descriptionTemplate: 'Thiết bị đeo thông minh có giao diện dễ dùng, hỗ trợ tập luyện và theo dõi giấc ngủ hằng ngày.',
    },
    {
        category: 'dong-ho-thong-minh',
        categoryLabel: 'Đồng hồ thông minh',
        brand: 'xiaomi',
        brandLabel: 'Xiaomi',
        series: 'Xiaomi Watch',
        variants: ['Redmi Watch 4', 'Watch S3', 'Band 9 Pro', 'Watch 2', 'Watch 2 Pro', 'Smart Band 8 Pro'],
        priceRange: { min: 890000, max: 5490000 },
        imageKey: 'xiaomi-watch',
        imageUrls: [
            'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
        ],
        descriptionTemplate: 'Đồng hồ thông minh giá tốt với các tính năng đo nhịp tim, SpO2 và thời lượng pin dài.',
    },
    {
        category: 'dong-ho-thong-minh',
        categoryLabel: 'Đồng hồ thông minh',
        brand: 'huawei',
        brandLabel: 'Huawei',
        series: 'Huawei Watch',
        variants: ['Fit 3', 'GT 4 41mm', 'GT 4 46mm', 'Watch 4', 'Band 9', 'Watch D2'],
        priceRange: { min: 990000, max: 9990000 },
        imageKey: 'huawei-watch',
        imageUrls: [
            'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
        ],
        descriptionTemplate: 'Đồng hồ thông minh nổi bật ở thiết kế, pin bền và các tính năng theo dõi luyện tập chuyên sâu.',
    },
    {
        category: 'phu-kien',
        categoryLabel: 'Phụ kiện',
        brand: 'logitech',
        brandLabel: 'Logitech',
        series: 'Logitech',
        variants: ['MX Master 3S', 'M650 Silent', 'Pebble 2 Combo', 'K380 Multi-Device', 'G304 Lightspeed', 'C920e Webcam'],
        priceRange: { min: 490000, max: 2990000 },
        imageKey: 'logitech-accessory',
        imageUrls: [
            'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80',
        ],
        descriptionTemplate: 'Phụ kiện công nghệ phục vụ làm việc và học tập với độ hoàn thiện tốt, kết nối ổn định và dễ sử dụng.',
    },
    {
        category: 'phu-kien',
        categoryLabel: 'Phụ kiện',
        brand: 'jbl',
        brandLabel: 'JBL',
        series: 'JBL',
        variants: ['Go 4', 'Clip 5', 'Flip 6', 'Tune 520BT', 'Live Beam 3', 'Charge 5'],
        priceRange: { min: 790000, max: 3990000 },
        imageKey: 'jbl-accessory',
        imageUrls: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
        ],
        descriptionTemplate: 'Phụ kiện âm thanh có chất âm sôi động, độ bền tốt và phù hợp cho nhu cầu di chuyển thường xuyên.',
    },
    {
        category: 'phu-kien',
        categoryLabel: 'Phụ kiện',
        brand: 'sony',
        brandLabel: 'Sony',
        series: 'Sony',
        variants: ['WH-CH520', 'WF-C700N', 'WH-1000XM5', 'SRS-XB100', 'Inzone H5', 'ECM-S1 Mic'],
        priceRange: { min: 990000, max: 8990000 },
        imageKey: 'sony-accessory',
        imageUrls: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
        ],
        descriptionTemplate: 'Phụ kiện âm thanh và nội dung số hướng đến trải nghiệm nghe rõ, đeo thoải mái và kết nối ổn định.',
    },
    {
        category: 'phu-kien',
        categoryLabel: 'Phụ kiện',
        brand: 'anker',
        brandLabel: 'Anker',
        series: 'Anker',
        variants: ['PowerCore 10000', 'PowerCore 20000', 'Nano 30W', 'Prime 67W', 'USB-C Hub 7-in-1', 'Soundcore Liberty 4 NC'],
        priceRange: { min: 390000, max: 3290000 },
        imageKey: 'anker-accessory',
        imageUrls: [
            'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1609592806596-b43da7f2d215?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1616578273577-5d54596f2f9e?auto=format&fit=crop&w=900&q=80',
        ],
        descriptionTemplate: 'Phụ kiện sạc và kết nối tiện dụng, phù hợp cho người dùng cần độ ổn định và tính linh hoạt cao.',
    },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const calculatePrice = (definition: CatalogDefinition, index: number) => {
    const { min, max } = definition.priceRange;
    const steps = 6;
    const base = min + ((max - min) / steps) * index;
    const adjustment = ((index % 3) - 1) * Math.min(450000, Math.round(min * 0.04));
    const rounded = Math.round((base + adjustment) / 10000) * 10000;

    return clamp(rounded, min, max);
};

const calculateOriginalPrice = (price: number, index: number) => {
    const premium = Math.max(150000, Math.round(price * (0.06 + (index % 4) * 0.025) / 10000) * 10000);
    return price + premium;
};

const calculateStock = (globalIndex: number, variantIndex: number) => {
    if (globalIndex % 11 === 0 || variantIndex === 5) {
        return 0;
    }

    return ((globalIndex * 19) + (variantIndex * 23) + 17) % 201;
};

const createDescription = (definition: CatalogDefinition, variant: string, stock: number, price: number) => {
    const availability =
        stock > 0 ? `Số lượng tồn kho hiện tại còn ${stock} sản phẩm.` : 'Tạm hết hàng, phù hợp để bổ sung trước cho đợt mở bán tiếp theo.';

    return `${definition.descriptionTemplate} Phiên bản ${variant} có mức giá ${price.toLocaleString('vi-VN')}đ. ${availability}`;
};

const buildSeedCatalog = (count = DEFAULT_SEED_PRODUCT_COUNT): SeedProductPayload[] => {
    const seededAt = new Date('2026-06-28T00:00:00.000Z');
    const products: SeedProductPayload[] = [];
    const baseCountPerDefinition = Math.floor(count / CATALOG.length);
    const remainder = count % CATALOG.length;
    let globalIndex = 0;

    CATALOG.forEach((definition, catalogIndex) => {
        const definitionCount = baseCountPerDefinition + (catalogIndex < remainder ? 1 : 0);

        definition.variants.slice(0, definitionCount).forEach((variant, variantIndex) => {
            const name = `${definition.brandLabel} ${definition.series} ${variant}`;
            const price = calculatePrice(definition, variantIndex);
            const stock = calculateStock(globalIndex, variantIndex);
            const createdAt = new Date(seededAt.getTime() - globalIndex * DAY_IN_MS);
            const imageIndex = variantIndex % definition.imageUrls.length;

            products.push({
                name,
                description: createDescription(definition, variant, stock, price),
                category: definition.category,
                brand: definition.brand,
                price,
                originalPrice: calculateOriginalPrice(price, variantIndex),
                stock,
                image: definition.imageUrls[imageIndex],
                status: stock > 0 ? 'available' : 'unavailable',
                createdAt,
                updatedAt: createdAt,
            });

            globalIndex += 1;
        });
    });

    return products;
};

export const generateProductSeedData = (count = DEFAULT_SEED_PRODUCT_COUNT) => {
    return buildSeedCatalog(count);
};

export const ensureProductSeedData = async (minimumCount = DEFAULT_SEED_PRODUCT_COUNT) => {
    const currentCount = await ProductRepository.countProducts();

    if (currentCount >= minimumCount) {
        return currentCount;
    }

    const productsToInsert = generateProductSeedData(minimumCount);

    await Product.deleteMany({});
    await ProductRepository.insertMany(productsToInsert);

    return productsToInsert.length;
};

export const reseedProducts = async (count = DEFAULT_SEED_PRODUCT_COUNT) => {
    await Product.deleteMany({});
    const productsToInsert = generateProductSeedData(count);
    await ProductRepository.insertMany(productsToInsert);
    return productsToInsert.length;
};
