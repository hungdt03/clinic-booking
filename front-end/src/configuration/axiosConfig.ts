import axios, { AxiosError } from "axios";
import { getAccessToken, getRefreshToken } from "../utils/auth";

const instance = axios.create({
    baseURL: 'http://localhost:5175'
});

declare module 'axios' {
    interface AxiosRequestConfig {
        _retry?: boolean
    }
}

instance.interceptors.request.use(function (config) {

    let token = getAccessToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, function (error) {
    return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
    return response.data;
}, async function (error: AxiosError) {
    const originalRequest = error.config

    if (!originalRequest) {
        return Promise.reject(error)
    }

    if (error.response?.status === 401 || error.response?.status === 403 && !originalRequest?._retry) {
        originalRequest._retry = true

        try {
            const rs = await instance.post("/api/Auth/refresh-token", {
                refreshToken: getRefreshToken(),
                accessToken: getAccessToken()
            });

            const response = rs as any;

            if (response.success) {
                localStorage.setItem('accessToken', response.data.accessToken)
                localStorage.setItem('refreshToken', response.data.refreshToken)

                originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
                return instance(originalRequest);
            } else {
                clearAuthLocal()
            }
        } catch (error) {
            console.log('Lỗi trong axios', error)
            clearAuthLocal()
        }

        return Promise.reject(error);
    }

    return error.response?.data;
});

const clearAuthLocal = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
}


export default instance