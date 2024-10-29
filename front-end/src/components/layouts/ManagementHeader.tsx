import { FC, useEffect, useState } from "react";
import { MenuUnfoldOutlined, MenuFoldOutlined, BellOutlined, MailOutlined, DownOutlined, SmileOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Popconfirm, Popover, message,  notification as notificationAnt } from "antd";
import images from "../../assets";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { selectAuth, signOut } from "../../features/slices/auth-slice";
import { NotificationResource } from "../../resources";
import { useNotification } from "../../hooks/useNotification";
import notificationService from "../../services/notification-service";
import NotificationDialog from "../shared/NotificationDialog";

type ManagementHeaderProps = {
    collapsed: boolean;
    toggleCollapsed: () => void
}

const ManageAccountDiaglog: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate()

    const handleLogout = () => {
        dispatch(signOut())
        navigate('/auth/sign-in-patient')
    }

    return <div className="flex flex-col gap-y-2 text-[15px]">
        <Link to='/'>Trang người dùng</Link>
        <Popconfirm
            description='Bạn có chắc là muốn đăng xuất'
            title='Đăng xuất'
            onConfirm={handleLogout}
        >
            <Button>Đăng xuất</Button>
        </Popconfirm>
    </div>
}

const ManagementHeader: FC<ManagementHeaderProps> = ({
    collapsed,
    toggleCollapsed
}) => {

    const { user, isAuthenticated } = useSelector(selectAuth)

    const [notifications, setNotifications] = useState<NotificationResource[]>([])
    const [messageNotifications, setMessageNotifications] = useState<NotificationResource[]>([])
    const [api, contextHolder] = notificationAnt.useNotification();
    const { notification, count } = useNotification();

    const openNotification = (title?: string, content?: string) => {
        api.open({
            message: title,
            description: content,
            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
            placement: "bottomLeft"
        });
    };

    useEffect(() => {
        if (notification) {
            openNotification(notification?.title, notification?.content)
            if(notification.notificationType === 'message') {
                setMessageNotifications(prev => [notification, ...prev])
            } else
                setNotifications(prev => [notification, ...prev])
        }
    }, [notification])

    const fetchNotifications = async () => {
        const response = await notificationService.getAllNotifications();
        if (response.success) {
            setNotifications(response.data)
        }
    }

    const fetchMessageNotifications = async () => {
        const response = await notificationService.getAllMessageNotifications();
        if (response.success) {
            setMessageNotifications(response.data)
        }
    }

    useEffect(() => {
        if(isAuthenticated) {
            fetchNotifications()
            fetchMessageNotifications()
        }
    }, [])

    const updateNotification = async (notification: NotificationResource) => {
        const response = await notificationService.updateNotification(notification.id);
        if (response.success) {
            message.success(response.message)
            fetchNotifications()
        } else {
            message.error(response.message)
        }
    }

    const updateAllNotificationsHaveRead = async () => {
        const response = await notificationService.updateAllNotificationsHaveRead();
        if (response.success) {
            message.success(response.message)
            fetchNotifications()
        } else {
            message.error(response.message)
        }
    }

    const deleteNotification = async (notification: NotificationResource) => {
        const response = await notificationService.deleteNotification(notification.id);
        if (response.success) {
            message.success(response.message)
            fetchNotifications()
        } else {
            message.error(response.message)
        }
    }


    return <div className="h-[70px] shadow bg-slate-100 w-full flex justify-between items-center px-4">
        <button className="text-primary font-bold text-xl hover:bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center" onClick={toggleCollapsed}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>

        <div className="flex gap-x-4 items-center">
            <Button shape="round" type="primary">
                <Link to='/'>Trang người dùng</Link>
            </Button>
            <div className="flex items-center">
                <Badge count={notifications.filter(n => !n.haveRead).length}>
                    <Popover trigger='click' placement="topRight" content={<NotificationDialog onAllHaveRead={updateAllNotificationsHaveRead} onUpdated={updateNotification} onDelete={deleteNotification} notifications={notifications} />}>
                        <BellOutlined className="p-3 rounded-full hover:bg-gray-200" />
                    </Popover>
                </Badge>
                <Badge count={messageNotifications.filter(n => !n.haveRead).length}>
                    <Popover trigger='click' placement="topRight" content={<NotificationDialog onAllHaveRead={updateAllNotificationsHaveRead} onUpdated={updateNotification} onDelete={deleteNotification} notifications={messageNotifications} />}>
                        <MailOutlined className="p-3 rounded-full hover:bg-gray-200" />
                    </Popover>
                </Badge>

            </div>
            |
            <Popover trigger='click' content={<ManageAccountDiaglog />} placement="bottomRight">
                <div className="flex items-center gap-x-8 cursor-pointer">
                    <div className="flex items-center gap-x-2">
                        <Avatar src={images.doctor} />
                        <div className="flex flex-col items-start">
                            <span className="font-semibold text-sm">{user?.fullName}</span>
                            <span className="text-xs font-semibold text-primary">{user?.role}</span>
                        </div>
                    </div>
                    <DownOutlined className="text-xs mb-3" />
                </div>
            </Popover>
        </div>
        {contextHolder}
    </div>
};

export default ManagementHeader;
