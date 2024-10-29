import { ProfileResource } from "../resources";
import { BaseResponse, DataResponse } from "../resources/type-response";
import axiosConfig from '../configuration/axiosConfig'
import { EditProfileRequest, ProfileRequest } from "../pages/account/Profile";

class PatientService {
    private static instance: PatientService;

    private constructor() {}

    public static getInstance() : PatientService {
        if(!PatientService.instance) {
            PatientService.instance = new PatientService()
        }

        return PatientService.instance
    }

    getAllProfiles() : Promise<DataResponse<ProfileResource[]>> {
        return axiosConfig.get('/api/Patient/profile')
    }

    createProfile(payload: ProfileRequest) : Promise<BaseResponse> {
        return axiosConfig.post('/api/Patient/profile', payload)
    }

    updateProfile(id: string, payload: ProfileRequest) : Promise<BaseResponse> {
        return axiosConfig.put('/api/Patient/profile/' + id, payload)
    }
}

export default PatientService.getInstance()