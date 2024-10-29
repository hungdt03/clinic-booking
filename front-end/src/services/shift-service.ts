import { ShiftRequest } from "../components/modals/CreateShiftModal";
import { BaseResponse, DataResponse } from "../resources/type-response";
import axiosConfig from '../configuration/axiosConfig'
import { DayShiftResource, ShiftResource, UnavailableDateResource } from "../resources";
import { QueryAvailableDateParams, QueryAvailableShiftParams } from "../pages/booking/ClinicBookingPage";

class ShiftService {
    private static instance: ShiftService;

    private constructor() {}

    public static getInstance() : ShiftService {
        if(!ShiftService.instance) {
            ShiftService.instance = new ShiftService()
        }

        return ShiftService.instance;
    }

    createShift(payload: ShiftRequest) : Promise<BaseResponse> {
        return axiosConfig.post('/api/Shift', payload)
    }

    getAllShifts() : Promise<DataResponse<ShiftResource[]>> {
        return axiosConfig.get('/api/Shift')
    }


    getAllEmptyDaysByClinicAndMonth(params: QueryAvailableDateParams) : Promise<DataResponse<Date[]>> {
        const queryParams = new URLSearchParams(params as any).toString(); 
        return axiosConfig.get(`/api/Shift/clinic/${params.clinicId}/empty-date?${queryParams}`)
    }

    getAllFullDaysByClinicAndMonth(params: QueryAvailableDateParams) : Promise<DataResponse<UnavailableDateResource[]>> {
        const queryParams = new URLSearchParams(params as any).toString(); 
        return axiosConfig.get(`/api/Shift/clinic/${params.clinicId}/full-date?${queryParams}`)
    }

    getAllEmptyDaysByDoctorId(doctorId: string) : Promise<DataResponse<DayShiftResource[]>> {
        return axiosConfig.get(`/api/Shift/doctor/${doctorId}/empty-date`)
    }


    getAllEmptyShiftsByClinicAndDate(params: QueryAvailableShiftParams) : Promise<DataResponse<ShiftResource[]>> {
        const queryParams = new URLSearchParams(params as any).toString(); 
        return axiosConfig.get(`/api/Shift/clinic/${params.clinicId}/empty-shift-by-date?${queryParams}`)
    }

    
}

export default ShiftService.getInstance()