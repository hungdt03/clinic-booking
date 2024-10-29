import { BaseResponse, DataResponse } from "../resources/type-response";
import axiosConfig from '../configuration/axiosConfig'
import { ExceptionDateResource, NoteResource } from "../resources";
import { ExceptionDateRequest } from "../components/modals/CreateExceptionDateClinicModal";
import { NoteRequest } from "../pages/shared/note/NotePage";

class SettingService {
    private static instance: SettingService;
    private constructor() {}

    public static getInstance() : SettingService {
        if(!SettingService.instance) {
            SettingService.instance = new SettingService()
        }

        return SettingService.instance;
    }

    createExceptionDateForClinic(payload: ExceptionDateRequest) : Promise<BaseResponse> {
        return axiosConfig.post('/api/Setting/exception-date-clinic', payload)
    }

    createExceptionDateForDoctor(payload: ExceptionDateRequest) : Promise<BaseResponse> {
        return axiosConfig.post('/api/Setting/exception-date-doctor', payload)
    }

    getAllExceptionDatesByClinic() : Promise<DataResponse<ExceptionDateResource[]>> {
        return axiosConfig.get('/api/Setting/exception-date-clinic');
    }

    removeExceptionDateClinicById(id: number | string) : Promise<BaseResponse> {
        return axiosConfig.delete('/api/Setting/exception-date-clinic/' + id)
    }
    removeExceptionDateDoctorById(id: number | string) : Promise<BaseResponse> {
        return axiosConfig.delete('/api/Setting/exception-date-doctor/' + id)
    }

    getAllExceptionDatesByDoctor() : Promise<DataResponse<ExceptionDateResource[]>> {
        return axiosConfig.get('/api/Setting/exception-date-doctor');
    }

    saveNoteDoctor(payload: NoteRequest) : Promise<BaseResponse> {
        return axiosConfig.post('/api/Setting/save-note-doctor', payload);
    }

    saveNoteClinic(payload: NoteRequest) : Promise<BaseResponse> {
        return axiosConfig.post('/api/Setting/save-note-clinic', payload);
    }

    getNoteDoctor() : Promise<DataResponse<NoteResource>> {
        return axiosConfig.get('/api/Setting/note-doctor')
    }

    getNoteDoctorById(doctorId: string) : Promise<DataResponse<NoteResource>> {
        return axiosConfig.get('/api/Setting/note-doctor/' + doctorId) 
    }

    getNoteClinic() : Promise<DataResponse<NoteResource>> {
        return axiosConfig.get('/api/Setting/note-clinic')
    }

    getNoteClinicById(clinicId: string) : Promise<DataResponse<NoteResource>> {
        return axiosConfig.get('/api/Setting/note-clinic/' + clinicId) 
    }

}

export default SettingService.getInstance();