import { SignInRequest } from "../components/shared/SignInComponent";
import { AuthResponse } from "../resources";
import { BaseResponse, DataResponse } from "../resources/type-response";
import axiosConfig from '../configuration/axiosConfig'
import { SignUpRequest } from "../pages/authentication/SignUp";

class AuthService {
    private static instance: AuthService;

    private constructor() {}

    public static getInstance() : AuthService {
        if (!AuthService.instance)
            AuthService.instance = new AuthService();
        return AuthService.instance;
    }

    signInAdministrator(payload: SignInRequest) : Promise<DataResponse<AuthResponse>> {
        return axiosConfig.post('/api/Auth/administrator', payload)
    }

    signInManager(payload: SignInRequest) : Promise<DataResponse<AuthResponse>> {
        return axiosConfig.post('/api/Auth/manager', payload)
    }

    signInDoctor(payload: SignInRequest) : Promise<DataResponse<AuthResponse>> {
        return axiosConfig.post('/api/Auth/doctor', payload)
    }

    signInPatient(payload: SignInRequest) : Promise<DataResponse<AuthResponse>> {
        return axiosConfig.post('/api/Auth/patient', payload)
    }

    signUp(payload: SignUpRequest) : Promise<BaseResponse> {
        return axiosConfig.post('/api/Auth/sign-up', payload)
    }

    changePassword(password: string) : Promise<DataResponse<AuthResponse>> {
        return axiosConfig.post('/api/Auth/change-password', {
            password
        })
    }
}

export default AuthService.getInstance();