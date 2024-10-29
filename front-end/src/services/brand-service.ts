import { BrandRequest } from '../components/modals/CreateBrandModal';
import axiosConfig from '../configuration/axiosConfig'
import { BrandResource } from '../resources';
import { BaseResponse, DataResponse } from '../resources/type-response';

class BrandService {
    private static instance: BrandService;

    private constructor() {}

    public static getInstance() : BrandService {
        if(!BrandService.instance) {
            BrandService.instance = new BrandService()
        }

        return BrandService.instance
    }

    getAllBrands() : Promise<DataResponse<BrandResource[]>> {
        return axiosConfig.get('/api/Brand')
    }

    getAllBrandsByClinicId(clinicId: string) : Promise<DataResponse<BrandResource[]>> {
        return axiosConfig.get('/api/Brand/' + clinicId)
    }

    createBrand(payload: BrandRequest) : Promise<BaseResponse> {
        return axiosConfig.post('/api/Brand', payload)
    }

    updateBrand(id:number, payload: BrandRequest) : Promise<BaseResponse> {
        return axiosConfig.put('/api/Brand/' + id, payload)
    }

}

export default BrandService.getInstance()