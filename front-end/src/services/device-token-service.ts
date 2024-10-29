import axiosConfig from '../configuration/axiosConfig';

class DeviceTokenService {
    private static instance: DeviceTokenService;

    private constructor() {}

    public static getInstance(): DeviceTokenService {
        if (!DeviceTokenService.instance)
            DeviceTokenService.instance = new DeviceTokenService();
        return DeviceTokenService.instance;
    }


    saveToken(deviceToken: string) : Promise<void> {
        return axiosConfig.post("/api/DeviceToken", { deviceToken });
    }
}
export default DeviceTokenService.getInstance()