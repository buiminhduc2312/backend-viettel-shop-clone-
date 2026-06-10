import { Model, PopulateOptions } from 'mongoose';

export interface IPaginationQuery {
    page?: number;
    limit?: number;
    sort?: string;
}

export interface IPaginationResponse {
    totalResult: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
}

export interface IPaginationOptions {
    page?: number;
    limit?: number;
    sort?: string;
    select?: string;
    populate?: PopulateOptions | PopulateOptions[];
}

export interface IPaginationResult<T> {
    result: T[];
    pagination: IPaginationResponse;
}

export interface PaginationModel<T> extends Model<T> {
    paginate(query: object, options: IPaginationOptions): Promise<IPaginationResult<T>>;
}
