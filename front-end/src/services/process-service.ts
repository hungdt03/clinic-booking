import axiosConfig from '../configuration/axiosConfig'
import { BookingProcessResource } from '../resources';
import { DataResponse } from '../resources/type-response';

class ProcessService {
    private static instance: ProcessService;

    private constructor() { }

    public static getInstance(): ProcessService {
        if (!ProcessService.instance) {
            ProcessService.instance = new ProcessService();
        }

        return ProcessService.instance;
    }

    getProcessByClinicId(clinicId: string) : Promise<DataResponse<BookingProcessResource[]>> {
        return axiosConfig.get('/api/Process/' + clinicId)
    }
}


export default ProcessService.getInstance()