import { FC } from "react";
import Header from "../components/layouts/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/shared/Footer";
import AccountSidebar from "../components/layouts/AccountSidebar";

const AccountLayout: FC = () => {
    return <div className="flex flex-col bg-slate-50">
        <Header />
        <div className="w-[1200px] mx-auto grid grid-cols-12 gap-4 py-10">
            <div className="col-span-3">
                <AccountSidebar />
            </div>
            <div className="col-span-9 bg-white p-4 rounded-lg shadow">
                <Outlet />
            </div>
        </div>
        <Footer />
    </div>
};

export default AccountLayout;
