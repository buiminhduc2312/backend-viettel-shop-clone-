import { Schema } from 'mongoose';
import { IPaginationOptions, IPaginationResult } from './pagination.type';

export default function mongoosePagination<T>(schema: Schema<T>) {
    schema.statics.paginate = async function paginate(query: object, options: IPaginationOptions): Promise<IPaginationResult<T>> {
        const limit = options.limit && Number(options.limit) > 0 ? Math.min(Number(options.limit), 1000) : 30;
        const page = options.page && Number(options.page) > 0 ? Number(options.page) : 1;
        const skip = (page - 1) * limit;

        let sort = '';
        if (options.sort) {
            const sortingCriteria: string[] = [];
            options.sort.split(',').forEach((sortOption) => {
                const [key, order] = sortOption.split(':');
                sortingCriteria.push((order === 'desc' ? '-' : '') + key);
            });
            sort = sortingCriteria.join(' ');
        } else {
            sort = '-_id';
        }

        const countPromise = this.countDocuments(query).exec();
        const docsPromise = this.find(query).sort(sort).skip(skip).limit(limit).select(options.select).populate(options.populate).exec();

        const [totalDocs, docs] = await Promise.all([countPromise, docsPromise]);

        const totalPages = Math.ceil(totalDocs / limit);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;

        return {
            result: docs,
            pagination: {
                totalResult: totalDocs,
                limit,
                totalPages,
                page,
                pagingCounter: (page - 1) * limit + 1,
                hasPrevPage,
                hasNextPage,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
            },
        };
    };
}
