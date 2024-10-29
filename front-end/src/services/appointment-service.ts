import { BaseResponse, DataResponse, PaginationResponse } from "../resources/type-response";
import axiosConfig from '../configuration/axiosConfig'
import { AppointmentResource } from "../resources";
import { QueryParams } from "../utils/pagination";

class AppointmentService {
    private static instance: AppointmentService;

    private constructor() {}

    public static getInstance() : AppointmentService {
        if(!AppointmentService.instance) {
            AppointmentService.instance = new AppointmentService();
        }

        return AppointmentService.instance;
    }

    createAppointment(payload: FormData) : Promise<BaseResponse> {
        return axiosConfig.post('/api/Appointment/clinic', payload)
    }

    createAppointmentWithDoctor(payload: FormData) : Promise<BaseResponse> {
        return axiosConfig.post('/api/Appointment/doctor', payload)
    }

    cancelAppointment(appointmentId: number, reason?: string) : Promise<BaseResponse> {
        return axiosConfig.put('/api/Appointment/cancel/' + appointmentId, {
            reason
        });
    }

    finishAppointment(appointmentId: number) : Promise<BaseResponse> {
        return axiosConfig.put('/api/Appointment/finish/' + appointmentId);
    }

    getAppointmentById(id: number | string | undefined) : Promise<DataResponse<AppointmentResource>> {
        return axiosConfig.get('/api/Appointment/' + id)
    }

    getAllAppointmentsByLoggedInUser(queryParams?: QueryParams) : Promise<PaginationResponse<AppointmentResource[]>> {
        const queryString = new URLSearchParams(queryParams as any).toString();
        return axiosConfig.get('/api/Appointment/patient?' + queryString)
    }

    getAllAppointmentsByLoggedInDoctorOwner(queryParams?: QueryParams) : Promise<PaginationResponse<AppointmentResource[]>> {
        const queryString = new URLSearchParams(queryParams as any).toString();
        return axiosConfig.get('/api/Appointment/doctor-owner?' + queryString)
    }

    getAllAppointmentsByLoggedInDoctorEmployee(queryParams?: QueryParams) : Promise<PaginationResponse<AppointmentResource[]>> {
        const queryString = new URLSearchParams(queryParams as any).toString();
        return axiosConfig.get('/api/Appointment/doctor-employee?' + queryString)
    }

    getAllAppointmentsByLoggedInClinic(queryParams?: QueryParams) : Promise<PaginationResponse<AppointmentResource[]>> {
        const queryString = new URLSearchParams(queryParams as any).toString();
        return axiosConfig.get('/api/Appointment/clinic?' + queryString)
    }
}

export default AppointmentService.getInstance()