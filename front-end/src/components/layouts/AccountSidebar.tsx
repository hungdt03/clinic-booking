import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import cn from "../../app/components";

const AccountSidebar: FC = () => {
    const location = useLocation();
    console.log(location.pathname)

    return <div className="flex flex-col gap-3 bg-white p-2 rounded-lg shadow">
        <Link to='/account/appointment' className={cn("px-4 py-2 rounded-lg hover:bg-gray-100 text-left text-[15px]", { 'bg-gray-100': location.pathname.includes('/appointment') })}>
            Lịch khám
        </Link>
        <Link to='/account/payment-history' className={cn("px-4 py-2 rounded-lg hover:bg-gray-100 text-left text-[15px]", { 'bg-gray-100': location.pathname.includes('/payment-history') })}>
            Lịch sử thanh toán
        </Link>
        <Link to='/account/profile' className={cn("px-4 py-2 rounded-lg hover:bg-gray-100 text-left text-[15px]", { 'bg-gray-100': location.pathname.includes('/profile') })}>
            Hồ sơ khám bệnh
        </Link>
    </div>
};

export default AccountSidebar;
