import {  DataResponse } from "../resources/type-response";
import axiosConfig from '../configuration/axiosConfig'
import { AuthResponse } from "../resources";

class TokenService {
    private static instance: TokenService;

    private constructor() {}

    public static getInstance() : TokenService {
        if(!TokenService.instance) {
            TokenService.instance = new TokenService()
        }

        return TokenService.instance
    }

    authenticateTokenLogin(email: string, activationToken: string) : Promise<DataResponse<AuthResponse>> {
        return axiosConfig.get('/api/token/user-login?email=' + email + "&activationToken=" + encodeURIComponent(activationToken))
    }
   
}


export default TokenService.getInstance()