import { UserResource } from "../resources";
import {  DataResponse } from "../resources/type-response";
import axiosConfig from '../configuration/axiosConfig'

class UserService {
    private static instance: UserService;

    private constructor() {}

    public static getInstance() : UserService {
        if(!UserService.instance) {
            UserService.instance = new UserService()
        }

        return UserService.instance
    }

    getUserById(userId: string) : Promise<DataResponse<UserResource>> {
        return axiosConfig.get('/api/User/' + userId)
    }
   
    getProfile() : Promise<DataResponse<UserResource>> {
        return axiosConfig.get('/api/User')
    }
}


export default UserService.getInstance()