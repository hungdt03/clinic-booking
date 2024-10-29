import { ClinicResource, UserResource } from "../../resources";

export type MessageRequest = {
    recipientId: string;
    content: string;
}

export type MessageResource = {
    id: number;
    content: string;
    sender: UserResource;
    recipient: UserResource;
    sentAt: Date;
    isVisibleToRecipient: boolean;
    isVisibleToSender: boolean;
    haveRead: boolean;
    messageType: MesssageType;
}

export type GroupResource = {
    groupName: string;
    message: MessageResource;
    totalUnReadMessages: number;
    availableTo: Date;
    isAvailable: boolean;
    clinicId?: string | null;
    clinic?: ClinicResource | null;
    firstUser: UserResource;
    lastUser: UserResource;
}


export type MesssageType = 'NORMAL' | 'NOTIFICATION' | 'WARNING'