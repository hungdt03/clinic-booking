import { ServiceTypeResource } from "../resources";
import { BaseResponse, DataResponse } from "../resources/type-response";
import axiosConfig from '../configuration/axiosConfig'
import { ServiceTypeRequest } from "../components/modals/CreateServiceTypeModal";

class ServiceTypeService {
    private static instance: ServiceTypeService;

    private constructor() {}

    public static getInstance() : ServiceTypeService {
        if(!ServiceTypeService.instance) {
            ServiceTypeService.instance = new ServiceTypeService()
        }

        return ServiceTypeService.instance
    }

    getAllServiceTypes () : Promise<DataResponse<ServiceTypeResource[]>> {
        return axiosConfig.get('/api/ServiceType')
    }

    getAllServiceTypesByClinicId (clinicId: string) : Promise<DataResponse<ServiceTypeResource[]>> {
        return axiosConfig.get('/api/ServiceType/' + clinicId)
    }

    createServiceType(payload: ServiceTypeRequest) : Promise<BaseResponse> {
        return axiosConfig.post('/api/ServiceType', payload)
    }
}


export default ServiceTypeService.getInstance()