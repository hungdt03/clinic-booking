import { BaseResponse, DataResponse } from "../resources/type-response";
import axiosConfig from '../configuration/axiosConfig'
import { ManagerResource } from "../resources";
import { ManagerRequest } from "../components/modals/CreateManagerModal";

class ManagerService {
    private static instance: ManagerService;

    private constructor() {}

    public static getInstance() : ManagerService {
        if(!ManagerService.instance) {
            ManagerService.instance = new ManagerService()
        }

        return ManagerService.instance;
    }

    createManager(payload: ManagerRequest) : Promise<BaseResponse> {
        return axiosConfig.post('/api/Manager', payload);
    }

    getAllManagers() : Promise<DataResponse<ManagerResource[]>> {
        return axiosConfig.get('/api/Manager')
    }
}

export default ManagerService.getInstance();