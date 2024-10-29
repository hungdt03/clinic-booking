import { MessageResource } from '../app/signalr';
import axiosConfig from '../configuration/axiosConfig'
import { DataResponse } from '../resources/type-response';

class MessageService {
    private static instance: MessageService;

    private constructor() {}

    public static getInstance() : MessageService {
        if(!MessageService.instance) {
            MessageService.instance = new MessageService()
        }

        return MessageService.instance
    }

    getAllMessages(recipientId: string) : Promise<DataResponse<MessageResource[]>> {
        return axiosConfig.get('/api/Message/' + recipientId)
    }

}

export default MessageService.getInstance()