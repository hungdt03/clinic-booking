import { DoctorEmployeeResource, DoctorOwnerResource } from "../resources";
import { BaseResponse, DataResponse } from "../resources/type-response";
import axiosConfig from '../configuration/axiosConfig'
import { DoctorRequest } from "../components/modals/CreateDoctorOwnerModal";
import { DoctorEmployeeRequest } from "../components/modals/CreateDoctorEmployeeModal";
import { SearchDoctorParams } from "../pages/SearchByDoctor";
import { EducationRequest } from "../pages/shared/introduction/EducationForm";
import { AwardsAndResearchesRequest } from "../pages/shared/introduction/AwardForm";
import { WorkExperienceRequest } from "../pages/shared/introduction/WorkExperienceForm";
import { IntroductionRequest } from "../pages/shared/introduction/IntroducationForm";

class DoctorService {
    private static instance: DoctorService;

    private constructor() { }

    public static getInstance(): DoctorService {
        if (!DoctorService.instance) {
            DoctorService.instance = new DoctorService();
        }

        return DoctorService.instance;
    }

    getAllDoctorOwners() : Promise<DataResponse<DoctorOwnerResource[]>> {
        return axiosConfig.get('/api/Doctor/owner');
    }

    searchDoctorOwners(params: SearchDoctorParams) : Promise<DataResponse<DoctorOwnerResource[]>> {
        const queryParams = new URLSearchParams({
            query: params.q,
            speciality: params.speciality
        });
        return axiosConfig.get('/api/Doctor/owner/search?' + queryParams.toString());
    }

    getDoctorOwnerById(doctorId: string) : Promise<DataResponse<DoctorOwnerResource>> {
        return axiosConfig.get('/api/Doctor/owner/' + doctorId)
    }

    getDoctorOwnerDetails() : Promise<DataResponse<DoctorOwnerResource>> {
        return axiosConfig.get('/api/Doctor/owner/details')
    }

    getAllDoctorEmployees() : Promise<DataResponse<DoctorEmployeeResource[]>> {
        return axiosConfig.get('/api/Doctor/employee');
    }

    getAllDoctorEmployeesByBrandId(brandId: number) : Promise<DataResponse<DoctorEmployeeResource[]>> {
        return axiosConfig.get('/api/Doctor/employee/' + brandId);
    }


    getAllDoctorEmployeesByClinicId(clinicId: string) : Promise<DataResponse<DoctorEmployeeResource[]>> {
        return axiosConfig.get('/api/Doctor/clinic/' + clinicId);
    }

    createDoctorOwner(payload: DoctorRequest) : Promise<BaseResponse> {
        return axiosConfig.post('/api/Doctor/owner', payload)
    }

    createDoctorEmployee(payload: DoctorEmployeeRequest) : Promise<BaseResponse> {
        return axiosConfig.post('/api/Doctor/employee', payload)
    }

    updateBasicInformation(payload: FormData) : Promise<BaseResponse> {
        return axiosConfig.put('/api/Doctor/owner/update-basic', payload)
    }

    updateEducation(payload: EducationRequest) : Promise<BaseResponse> {
        return axiosConfig.put('/api/Doctor/owner/update-education', payload)
    }

    updateAwardAndResearches(payload: AwardsAndResearchesRequest) : Promise<BaseResponse> {
        return axiosConfig.put('/api/Doctor/owner/update-award', payload)
    }

    updateWorkExperiences(payload: WorkExperienceRequest) : Promise<BaseResponse> {
        return axiosConfig.put('/api/Doctor/owner/update-experience', payload)
    }

    updateIntroduction(payload: IntroductionRequest) : Promise<BaseResponse> {
        return axiosConfig.put('/api/Doctor/owner/update-introduction', payload)
    }
}

export default DoctorService.getInstance();