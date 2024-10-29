import { GroupResource } from '../app/signalr';
import axiosConfig from '../configuration/axiosConfig'
import { DataResponse } from '../resources/type-response';

class GroupService {
    private static instance: GroupService;

    private constructor() {}

    public static getInstance() : GroupService {
        if(!GroupService.instance) {
            GroupService.instance = new GroupService()
        }

        return GroupService.instance
    }

    getAllGroupsPatient() : Promise<DataResponse<GroupResource[]>> {
        return axiosConfig.get('/api/Group/patient')
    }

    getAllGroupsByLoggedInUser() : Promise<DataResponse<GroupResource[]>> {
        return axiosConfig.get('/api/Group/logged-in-user')
    }

}

export default GroupService.getInstance()