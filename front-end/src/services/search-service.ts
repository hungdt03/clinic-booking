import { SearchResource, ServiceResource } from "../resources";
import { BaseResponse, DataResponse } from "../resources/type-response";
import axiosConfig from '../configuration/axiosConfig'
import { SearchParams } from "../pages/SearchPage";

class SearchService {
    private static instance: SearchService;

    private constructor() {}

    public static getInstance() : SearchService {
        if(!SearchService.instance) {
            SearchService.instance = new SearchService()
        }

        return SearchService.instance
    }

    searchData(params: SearchParams) : Promise<DataResponse<SearchResource[]>> {
        const queryParam = new URLSearchParams({
            query: params.query,
            type: params.type,
            speciality: params.speciality
        });
        return axiosConfig.get('/api/Search?' + queryParam.toString())
    }
   
}


export default SearchService.getInstance()