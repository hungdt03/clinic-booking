import { FC, useEffect, useState } from "react";
import ManagementSidebar from "../components/layouts/ManagementSidebar";
import ManagementHeader from "../components/layouts/ManagementHeader";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../features/slices/auth-slice";

const NAVIGATE_ROUTE = '/admin/change-password'

const ManagementLayout: FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useSelector(selectAuth)

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    useEffect(() => {
        console.log(user)
        if (!user?.isPasswordChanged && location.pathname.includes('/admin') && location.pathname !== NAVIGATE_ROUTE) {
            navigate(NAVIGATE_ROUTE);
        }
    }, [])

    return <div className="flex">
        <ManagementSidebar
            collapsed={collapsed}
        />
        <div className="flex flex-col w-full h-screen">
            <ManagementHeader
                collapsed={collapsed}
                toggleCollapsed={toggleCollapsed}
            />

            <div className="h-full overflow-y-auto p-4">
                <div className="bg-white p-4 h-full">
                    <Outlet />
                </div>
            </div>
        </div>
    </div>
};

export default ManagementLayout;
