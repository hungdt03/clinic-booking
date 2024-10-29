import { ServiceResource } from "../resources";
import { BaseResponse, DataResponse } from "../resources/type-response";
import axiosConfig from '../configuration/axiosConfig'
import { ServiceRequest } from "../components/modals/CreateServiceModal";

class ServiceService {
    private static instance: ServiceService;

    private constructor() {}

    public static getInstance() : ServiceService {
        if(!ServiceService.instance) {
            ServiceService.instance = new ServiceService()
        }

        return ServiceService.instance
    }

    getAllServices() : Promise<DataResponse<ServiceResource[]>> {
        return axiosConfig.get('/api/Service')
    }

    getAllServicesByServiceTypeId(serviceTypeId: number) : Promise<DataResponse<ServiceResource[]>> {
        return axiosConfig.get('/api/Service/' + serviceTypeId)
    }

    createService(payload: ServiceRequest) : Promise<BaseResponse> {
        return axiosConfig.post('/api/Service', payload)
    }
}


export default ServiceService.getInstance()