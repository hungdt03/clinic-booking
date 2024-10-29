import {  BaseResponse, DataResponse } from "../resources/type-response";
import axiosConfig from '../configuration/axiosConfig'
import { NotificationResource } from "../resources";

class NotificationService {
    private static instance: NotificationService;

    private constructor() {}

    public static getInstance() : NotificationService {
        if(!NotificationService.instance) {
            NotificationService.instance = new NotificationService()
        }

        return NotificationService.instance
    }

    getAllNotifications() : Promise<DataResponse<NotificationResource[]>> {
        return axiosConfig.get('/api/Notification')
    }

    getAllMessageNotifications() : Promise<DataResponse<NotificationResource[]>> {
        return axiosConfig.get('/api/Notification/message')
    }

    updateNotification(notificationId: number) : Promise<BaseResponse> {
        return axiosConfig.put('/api/Notification/' + notificationId);
    }

    updateAllNotificationsHaveRead() : Promise<BaseResponse> {
        return axiosConfig.put('/api/Notification/update-all-read');
    }

    deleteNotification(notificationId: number) : Promise<BaseResponse> {
        return axiosConfig.delete('/api/Notification/' + notificationId);
    }
   
}


export default NotificationService.getInstance()