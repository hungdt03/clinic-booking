import { FC, ReactNode, useEffect, useState } from "react";
import NotificationContext from "./notification-context";
import { onMessage } from "firebase/messaging";
import { NotificationResource, NotificationType } from "../../../resources";
import { initializeFCM, messaging } from "../../notification/firebase";

type NotificationProviderProps = {
    children: ReactNode
}

const NotificationProvider: FC<NotificationProviderProps> = ({
    children
}) => {
    const [notification, setNotification] = useState<NotificationResource | null>(null)
    const [count, setCount] = useState(0)
    useEffect(() => {
        (async () => {
            // request notification permission and register the service worker
            await initializeFCM().then(() => {
                // event handler for incoming messages
                onMessage(messaging, (notification) => {
                    console.log('===============NOTIFICATION HERE=====================')
                    const notificationData = notification.data as { [key: string]: string };
                    const newNotification: NotificationResource = {
                        id: parseInt(notificationData.id),
                        title: notificationData.title,
                        content: notificationData.content,
                        referenceId: parseInt(notificationData.referenceId),
                        recipient: JSON.parse(notificationData.recipient),
                        createdAt: new Date(notificationData.createdAt),
                        haveRead: notificationData.haveRead === 'true',
                        notificationType: notificationData.notificationType as NotificationType
                    };
                    setNotification(newNotification)
                    setCount(prev => prev + 1)
                });
            });
        })();

    }, []);

    return (
        <NotificationContext.Provider value={{ notification, count }}>
            {children}
        </NotificationContext.Provider>
    );
}

export default NotificationProvider;
