import { FC, useEffect, useState } from "react";
import MyButton from "./MyButton";
import { Link } from "react-router-dom";
import { UserOutlined, LogoutOutlined, SmileOutlined } from '@ant-design/icons'
import { Badge, Button, Popconfirm, Popover, message, notification as notificationAnt } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, signOut } from "../../features/slices/auth-slice";
import { AppDispatch } from "../../app/store";
import NotificationDialog from "./NotificationDialog";
import { NotificationResource } from "../../resources";
import { useNotification } from "../../hooks/useNotification";
import notificationService from "../../services/notification-service";

const BookingOptionDialog: FC = () => {
    return <div className="flex flex-col gap-y-2">
        <Link to='/booking/doctor' className="hover:text-black flex flex-col px-3 py-2 rounded-md hover:bg-gray-100">
            <span className="text-[15px] font-semibold">Đặt khám bác sĩ</span>
            <p className="text-[15px]">Đặt lịch khám không chờ đợi</p>
        </Link>
        <Link to='/booking/clinic' className="hover:text-black flex flex-col px-3 py-2 rounded-md hover:bg-gray-100">
            <span className="text-[15px] font-semibold">Đặt khám phòng khám</span>
            <p className="text-[15px]">Đa dạng chuyên khoa và dịch vụ</p>
        </Link>
    </div>
}

const Navbar: FC = () => {
    const [notifications, setNotifications] = useState<NotificationResource[]>([])
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, user } = useSelector(selectAuth)
    const [api, contextHolder] = notificationAnt.useNotification();
    const { notification, count } = useNotification();
    const [routeLink, setRouteLink] = useState('');

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
            if (notification.notificationType === 'message') {
                // setMessageNotifications(prev => [notification, ...prev])
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

    const handleLogout = () => {
        dispatch(signOut())
    }

    useEffect(() => {
        if (isAuthenticated) {
            switch (user?.role) {
                case 'MANAGER':
                    setRouteLink('/manager');
                    break;
                case 'DOCTOR_OWNER':
                    setRouteLink('/d-owner');
                    break;
                case 'DOCTOR_EMPLOYEE':
                    setRouteLink('/d-employee');
                    break;
                case 'ADMIN':
                    setRouteLink('/admin')
            }
            fetchNotifications()
        }

    }, [isAuthenticated])

    return <div className="flex items-center gap-x-4">
        {contextHolder}
        <div className="items-center gap-x-4 text-[16px] md:flex hidden">
            <Popover content={<BookingOptionDialog />} placement="bottomRight">
                <button className="px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer font-semibold hover:text-primary">Đặt khám</button>
            </Popover>
            {isAuthenticated && <>
                <Badge count={notifications.filter(n => !n.haveRead).length}>
                    <Popover trigger='click' placement="topRight" content={<NotificationDialog onAllHaveRead={updateAllNotificationsHaveRead} onUpdated={updateNotification} onDelete={deleteNotification} notifications={notifications} />}>
                        <Link to='#' className="px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer font-semibold hover:text-primary">Thông báo</Link>
                    </Popover>
                </Badge>

                <Link to='/contact' className="px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer font-semibold hover:text-primary">Liên hệ</Link>
            </>}
        </div>
        {!isAuthenticated && <Popover trigger='click' content={
            <div className="flex flex-col gap-y-2">
                <Link className="py-2 px-3 rounded-md hover:bg-gray-100" to='/auth/sign-in-doctor'>Youmed Doctor</Link>
                <Link className="py-2 px-3 rounded-md hover:bg-gray-100" to='/auth/sign-in-clinic'>Youmed Phòng khám</Link>
                <Link className="py-2 px-3 rounded-md hover:bg-gray-100" to='/auth/sign-in-admin'>Youmed Quản trị viên</Link>
            </div>
        } placement="topRight">
            <span className="px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer hover:text-primary">Dành cho nhân viên y tế</span>
        </Popover>}
        {isAuthenticated
            ?
            <Popover placement="bottomRight" content={<div className="flex flex-col gap-y-2 items-start">
                {routeLink && <Link className="hover:text-black w-full hover:bg-gray-100 px-2 py-1 rounded-md" to={routeLink}>Trang quản lí</Link>}
                {user?.role === 'PATIENT' && <>
                    <Link className="hover:text-black w-full hover:bg-gray-100 px-2 py-1 rounded-md" to='/account/appointment'>Lịch khám</Link>
                    <Link className="hover:text-black w-full hover:bg-gray-100 px-2 py-1 rounded-md" to='/account/payment-history'>Lịch sử thanh toán</Link>
                    <Link className="hover:text-black w-full hover:bg-gray-100 px-2 py-1 rounded-md" to='/account/profile'>Hồ sơ</Link>
                </>}
                <Popconfirm placement="bottomRight" onConfirm={handleLogout} title='Đăng xuất' description='Bạn có chắc là muốn đăng xuất tài khoản không' cancelText='Hủy bỏ' okText='Chắc chắn'>
                    <Button icon={<LogoutOutlined />}>Đăng xuất</Button>
                </Popconfirm>
            </div>}>
                <div className="flex items-center gap-x-2 text-primary font-semibold cursor-pointer">
                    <UserOutlined />
                    <span>{user?.fullName}</span>
                </div>
            </Popover>
            :
            <MyButton className="text-[15px]">
                <Link to='/auth/sign-in-patient'>Đăng nhập</Link>
            </MyButton>
        }

    </div>
};

export default Navbar;
