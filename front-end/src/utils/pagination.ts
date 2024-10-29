
export type QueryParams = {
    page?: number;
    size?: number;
    searchString?: string;
}


export const initialValues: QueryParams = {
    page: 1,
    size: 8,
    searchString: ''
}
