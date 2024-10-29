import { useContext } from "react";
import NotificationContext from "../app/context/notification-firebase-cloud-messaging/notification-context";

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};