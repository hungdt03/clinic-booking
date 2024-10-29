import { BaseResponse, DataResponse } from "../resources/type-response";
import axiosConfig from '../configuration/axiosConfig'
import { SpecialityResource } from "../resources";
import { SpecialityExaminateRequest } from "../components/modals/CreateSpecialityExaminateModal";

class SpecialityService {
    private static instance: SpecialityService;

    private constructor() {}

    public static getInstance () : SpecialityService {
        if(!SpecialityService.instance) {
            SpecialityService.instance = new SpecialityService();
        }

        return SpecialityService.instance;
    }

    createSpeciality(payload: FormData) : Promise<BaseResponse> {
        return axiosConfig.post('/api/Specialization', payload);
    }

    addSpecialityForClinic(payload: SpecialityExaminateRequest) : Promise<BaseResponse> {
        return axiosConfig.post('/api/Specialization/add-for-clinic', payload);
    }

    addSpecialityForDoctor(payload: SpecialityExaminateRequest) : Promise<BaseResponse> {
        return axiosConfig.post('/api/Specialization/add-for-doctor', payload);
    }

    deleteForClinic(id: number) : Promise<BaseResponse> {
        return axiosConfig.delete('/api/Specialization/clinic/' + id);
    }

    deleteForDoctor(id: number) : Promise<BaseResponse> {
        return axiosConfig.delete('/api/Specialization/doctor/' + id);
    }

    getAllSpecialities() : Promise<DataResponse<SpecialityResource[]>> {
        return axiosConfig.get('/api/Specialization');
    }

    getAllSpecialitiesByLoggedInDoctor() : Promise<DataResponse<SpecialityResource[]>> {
        return axiosConfig.get('/api/Specialization/doctor');
    }

    getAllSpecialitiesByDoctorId(doctorId: string) : Promise<DataResponse<SpecialityResource[]>> {
        return axiosConfig.get('/api/Specialization/doctor/' + doctorId);
    }

    getAllSpecialitiesByLoggedInClinic() : Promise<DataResponse<SpecialityResource[]>> {
        return axiosConfig.get('/api/Specialization/clinic');
    }

    getAllSpecialitiesByClinicId(clinicId: string) : Promise<DataResponse<SpecialityResource[]>> {
        return axiosConfig.get('/api/Specialization/clinic/' + clinicId);
    }

    deleteSpecialization(id: number) : Promise<BaseResponse> {
        return axiosConfig.delete('/api/Specialization/' + id)
    }
}

export default SpecialityService.getInstance()