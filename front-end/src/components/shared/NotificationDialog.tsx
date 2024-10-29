import { FC } from "react";
import { NotificationResource } from "../../resources";
import { MoreOutlined } from '@ant-design/icons'
import { Empty, Popover } from "antd";
import Notification from "./Notification";

type NotificationHeaderProps = {
    onUpdated: React.MouseEventHandler<HTMLButtonElement> | undefined
}

const NotificationHeader: FC<NotificationHeaderProps> = ({
    onUpdated
}) => {
    return <div className="flex flex-col items-start w-full gap-y-2">
        <button onClick={onUpdated} className="px-2 py-1 rounded-md hover:bg-sky-100 w-full text-left">Đánh dấu tất cả đã đọc</button>
    </div>
}

type NotificationDialogProps = {
    notifications: NotificationResource[];
    onUpdated: (notification: NotificationResource) => void;
    onDelete: (notification: NotificationResource) => void;
    onAllHaveRead: () => void
}

const NotificationDialog: FC<NotificationDialogProps> = ({
    notifications,
    onUpdated,
    onAllHaveRead,
    onDelete
}) => {

    return <div className="flex flex-col gap-y-2 w-[450px] py-2 px-2 rounded-lg max-h-[500px] overflow-y-auto custom-scrollbar scrollbar-h-4">
        <div className="flex items-center justify-between">
            <span className="text-xl font-semibold">Thông báo của bạn</span>
            <Popover trigger='click' content={<NotificationHeader onUpdated={onAllHaveRead} />}>
                <button className="rotate-90">
                    <MoreOutlined />
                </button>
            </Popover>
        </div>
        {notifications.length === 0 && <Empty description='Chưa có thông báo nào' />}
        {notifications.map(notification => <Notification
            key={notification.id}
            notification={notification}
            onDelete={() => onDelete(notification)}
            onUpdated={() => onUpdated(notification)}
        />
        )}

    </div>
};

export default NotificationDialog;
