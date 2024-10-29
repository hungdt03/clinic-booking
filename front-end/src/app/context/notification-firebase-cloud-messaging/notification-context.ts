import { createContext } from "react";
import { NotificationResource } from "../../../resources";

type NotificationContextType = {
    notification: NotificationResource | null;
    count: number
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export default NotificationContext;