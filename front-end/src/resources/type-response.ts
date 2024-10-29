export interface BaseResponse {
    statusCode: number;
    message: string;
    success: boolean;
}

export interface DataResponse<T> extends BaseResponse {
    data: T
}

export interface PaginationResponse<T> extends BaseResponse {
    data: T;
    pagination: Pagination
}

export type Pagination = {
    totalItems: number;
    totalPages: number;
    page: number;
    size: number;
}
