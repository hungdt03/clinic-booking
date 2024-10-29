import { FC } from "react";
import { NotificationResource } from "../../resources";
import { Image, Popover } from "antd";
import { MoreOutlined } from '@ant-design/icons'
import images from "../../assets";
import { formatTimeTypeAgo } from "../../utils/format";
import { Link } from "react-router-dom";

type NotificationOptionsProps = {
    notification: NotificationResource;
    onUpdated: React.MouseEventHandler<HTMLButtonElement> | undefined
    onDelete: React.MouseEventHandler<HTMLButtonElement> | undefined
}

const NotificationOptions: FC<NotificationOptionsProps> = ({
    notification,
    onUpdated,
    onDelete
}) => {
    return <div className="flex flex-col items-start w-full gap-y-2">
        <button onClick={onUpdated} className="px-2 py-1 rounded-md hover:bg-sky-100 w-full text-left">
            {notification.haveRead ? 'Đánh dấu là chưa đọc' : 'Đánh dấu là đã đọc'}
        </button>
        <button onClick={onDelete} className="px-2 py-1 rounded-md hover:bg-sky-100 w-full text-left">Xóa thông báo</button>
    </div>
}

type NotificationProps = {
    notification: NotificationResource;
    onUpdated: () => void;
    onDelete: () => void;
}

const Notification: FC<NotificationProps> = ({
    notification,
    onUpdated,
    onDelete
}) => {
    return <div className="flex justify-between hover:bg-sky-50 p-2 rounded-xl">
        <Link to={`/admin/appointment/${notification.referenceId}`} className="hover:text-black cursor-pointer flex gap-x-2 items-center justify-between">
            <div className="w-[50px]">
                <Image preview={false} className="object-cover rounded-full" src={notification.recipient.thumbnail ?? images.doctor} />
            </div>
            <div className="flex flex-col gap-y-1 flex-1">
                <p>{notification.content}</p>
                <p className={`text-sm ${notification.haveRead ? 'text-gray-500' : 'text-primary font-semibold'}`}>{formatTimeTypeAgo(new Date(notification.createdAt))}</p>
            </div>
        </Link>

        <Popover trigger='click' content={<NotificationOptions onDelete={onDelete} onUpdated={onUpdated} notification={notification} />}>
            <button className="rotate-90">
                <MoreOutlined />
            </button>
        </Popover>
    </div>
};

export default Notification;
