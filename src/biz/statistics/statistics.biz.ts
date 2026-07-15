import { StatisticsRepository } from '../../repositories/statistics.repository';

export class StatisticsBiz {
    public static getOverview() {
        return StatisticsRepository.getOverview();
    }

    public static getTopRatedProducts() {
        return StatisticsRepository.getTopRatedProducts();
    }

    public static getTopWishlistProducts() {
        return StatisticsRepository.getTopWishlistProducts();
    }
}
