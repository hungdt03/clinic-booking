import { FC } from "react";
import Header from "../components/layouts/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/shared/Footer";
import AccountSidebar from "../components/layouts/AccountSidebar";

const AccountLayout: FC = () => {
    return <div className="flex flex-col bg-slate-50">
        <Header />
        <div className="w-full max-w-screen-xl mx-auto grid grid-cols-12 gap-4 py-5 lg:py-10 px-4">
            <div className="col-span-12 lg:col-span-3">
                <AccountSidebar />
            </div>
            <div className="col-span-12 lg:col-span-9 bg-white p-4 rounded-lg shadow">
                <Outlet />
            </div>
        </div>
        <Footer />
    </div>
};

export default AccountLayout;
