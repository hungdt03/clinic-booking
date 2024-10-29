import { Button, Menu, MenuProps } from "antd";
import { DashboardOutlined, LogoutOutlined, AppstoreOutlined, SettingOutlined, MedicineBoxOutlined, MessageOutlined, UserOutlined, FieldTimeOutlined, BranchesOutlined, FolderOutlined, FileGifOutlined } from '@ant-design/icons'
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../shared/Logo";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";


type MenuItem = Required<MenuProps>['items'][number];

const colorStyle = (collapsed: boolean) => ({
    color: collapsed ? 'black' : ''
});

// Menu items for ADMIN role
const getAdminMenuItems = (collapsed: boolean): MenuItem[] => [
    {
        key: 'sub2',
        label: <Link to='/admin/clinics'>Phòng khám</Link>,
        icon: <AppstoreOutlined />,
    },
    {
        key: 'sub4',
        label: 'Tài khoản',
        icon: <UserOutlined />,
        children: [
            { key: '6', label: <Link to='/admin/managers'>Người quản lí</Link>, style: colorStyle(collapsed) },
            { key: '7', label: <Link to='/admin/doctors'>Bác sĩ</Link>, style: colorStyle(collapsed) },
        ],
    },
    {
        key: 'sub6',
        label: <Link to='/admin/speciality'>Chuyên khoa</Link>,
        icon: <MedicineBoxOutlined />,
    },
   
];

// Menu items for MANAGER role
const getManagerMenuItems = (collapsed: boolean): MenuItem[] => [
    {
        key: 'sub1',
        label: <Link to='/manager'>Giới thiệu</Link>,
        icon: <DashboardOutlined />,
    },
    {
        key: 'sub2',
        label: <Link to='/manager/appointments'>Lịch hẹn</Link>,
        icon: <AppstoreOutlined />,
    },
    {
        key: 'sub3',
        label: <Link to='/manager/doctors'>Bác sĩ</Link>,
        icon: <UserOutlined />,
    },
    {
        key: 'sub4',
        label: <Link to='/manager/shifts'>Khung giờ</Link>,
        icon: <FieldTimeOutlined />,
    },
    {
        key: 'sub5',
        label: <Link to='/manager/service-types'>Loại dịch vụ</Link>,
        icon: <FolderOutlined />,
    },
    {
        key: 'sub6',
        label: <Link to='/manager/services'>Dịch vụ</Link>,
        icon: <FileGifOutlined />,
    },
    {
        key: 'sub7',
        label: <Link to='/manager/brands'>Chi nhánh</Link>,
        icon: <BranchesOutlined />,
    },
    {
        key: 'sub8',
        label: 'Cài đặt',
        icon: <SettingOutlined />,
        children: [
            { key: '9', label: <Link to='/manager/dayoff'>Ngày nghỉ</Link>, style: colorStyle(collapsed) },
            { key: '11', label: <Link to='/manager/note'>Ghi chú</Link>, style: colorStyle(collapsed) },
        ],
    },
    {
        key: 'sub9',
        label: <Link to='/manager/speciality-examinates'>Chuyên khám</Link>,
        icon: <MedicineBoxOutlined />,
    },
    {
        key: 'sub10',
        label: <Link to='/manager/contact'>Liên hệ</Link>,
        icon: <MessageOutlined />,
    },
];

// Menu items for DOCTOR_OWNER role
const getDoctorOwnerMenuItems = (collapsed: boolean): MenuItem[] => [
    {
        key: 'sub2',
        label: <Link to='/d-owner'>Giới thiệu</Link>,
        icon: <DashboardOutlined />,
    },
    {
        key: 'sub3',
        label: <Link to='/d-owner/appointments'>Lịch hẹn</Link>,
        icon: <AppstoreOutlined />,
    },
    {
        key: 'sub4',
        label: <Link to='/d-owner/shifts'>Khung giờ</Link>,
        icon: <FieldTimeOutlined />,
    },
    {
        key: 'sub5',
        label: <Link to='/d-owner/speciality'>Chuyên khoa</Link>,
        icon: <MedicineBoxOutlined />,
    },
    {
        key: 'sub6',
        label: <Link to='/d-owner/speciality-examinates'>Chuyên khám</Link>,
        icon: <MedicineBoxOutlined />,
    },
    {
        key: 'sub7',
        label: 'Cài đặt',
        icon: <SettingOutlined />,
        children: [
            { key: '9', label: <Link to='/d-owner/dayoff'>Ngày nghỉ</Link>, style: colorStyle(collapsed) },
            { key: '11', label: <Link to='/d-owner/note'>Ghi chú</Link>, style: colorStyle(collapsed) },
        ],
    },
    {
        key: 'sub8',
        label: <Link to='/d-owner/contact'>Liên hệ</Link>,
        icon: <MessageOutlined />,
    },
];

// Menu items for DOCTOR_EMPLOYEE role
const getDoctorEmployeeMenuItems = (): MenuItem[] => [
    {
        key: 'sub2',
        label: <Link to='/d-employee/appointments'>Lịch hẹn</Link>,
        icon: <AppstoreOutlined />,
    },
    {
        key: 'sub3',
        label: <Link to='/d-employee/speciality'>Chuyên khoa</Link>,
        icon: <MedicineBoxOutlined />,
    },
    {
        key: 'sub5',
        label: <Link to='/d-employee/speciality-examinates'>Chuyên khám</Link>,
        icon: <MedicineBoxOutlined />,
    },
    {
        key: 'sub6',
        label: <Link to='/d-employee/shifts'>Khung giờ</Link>,
        icon: <FieldTimeOutlined />,
    },
    {
        key: 'sub7',
        label: <Link to='/d-employee/contact'>Liên hệ</Link>,
        icon: <MessageOutlined />,
    },
];

// Function to return the appropriate menu items based on the role
const getMenuItemsByRole = (collapsed: boolean, role: string): MenuItem[] => {
    switch (role) {
        case 'ADMIN':
            return getAdminMenuItems(collapsed);
        case 'MANAGER':
            return getManagerMenuItems(collapsed);
        case 'DOCTOR_OWNER':
            return getDoctorOwnerMenuItems(collapsed);
        case 'DOCTOR_EMPLOYEE':
            return getDoctorEmployeeMenuItems();
        default:
            return [];
    }
};


type ManagementSidebarProps = {
    collapsed: boolean;
}

const ManagementSidebar: FC<ManagementSidebarProps> = ({
    collapsed
}) => {
    const [current, setCurrent] = useState('1');
    const { user } = useSelector(selectAuth)

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    return <div style={{ width: collapsed ? 80 : 260 }} className="overflow-x-hidden flex flex-col justify-between h-screen overflow-y-auto custom-scrollbar scrollbar-h-4 bg-sky-500 transition-all duration-300 ease-in-out">
        <div className="flex flex-col items-center gap-y-8">
            <div className="font-bold flex items-center justify-center py-6 px-2">
                <Logo />
            </div>
            {user?.isPasswordChanged && <Menu
                onClick={onClick}
                style={{ border: 0, color: 'white !important' }}
                defaultOpenKeys={['sub1']}
                selectedKeys={[current]}
                mode="inline"
                items={getMenuItemsByRole(collapsed, user.role)}
                inlineCollapsed={collapsed}
                className="text-[15px] text-left bg-sky-500"
            />}

        </div>
        <div className="p-4">
            <Button className="w-full">
                {collapsed ? <LogoutOutlined /> : 'Đăng xuất'}
            </Button>
        </div>
    </div>;
};

export default ManagementSidebar;
