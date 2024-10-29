import { BaseResponse, DataResponse } from "../resources/type-response";
import axiosConfig from '../configuration/axiosConfig'
import { ClinicResource } from "../resources";
import { SearchClinicParams } from "../pages/SearchByClinic";
import { IntroductionRequest } from "../pages/shared/introduction/IntroducationForm";

class ClinicService {
    private static instance: ClinicService;

    private constructor() {}

    public static getInstance(): ClinicService {
        if (!ClinicService.instance)
            ClinicService.instance = new ClinicService();
        return ClinicService.instance;
    }

    createClinic(payload: FormData) : Promise<BaseResponse> {
        return axiosConfig.post('/api/Clinic', payload)
    }

    getAllClinics() : Promise<DataResponse<ClinicResource[]>> {
        return axiosConfig.get('/api/Clinic')
    }

    getClinicById(clinicId: string) : Promise<DataResponse<ClinicResource>> {
        return axiosConfig.get('/api/Clinic/' + clinicId)
    }

    getClinicDetails() : Promise<DataResponse<ClinicResource>> {
        return axiosConfig.get('/api/Clinic/details')
    }

    searchClinics(query: SearchClinicParams) : Promise<DataResponse<ClinicResource[]>> {
        const queryParams = new URLSearchParams({
            query: query.q,
            speciality: query.speciality
        });
        return axiosConfig.get('/api/Clinic/search?' + queryParams.toString())
    }

    updateIntroduction(payload: IntroductionRequest) : Promise<BaseResponse> {
        return axiosConfig.put('/api/Clinic/update-introduction', payload);
    }

    updateBasicInformation(formData: FormData) : Promise<BaseResponse> {
        return axiosConfig.put('/api/Clinic/update-basic-info', formData);
    }
}

export default ClinicService.getInstance()