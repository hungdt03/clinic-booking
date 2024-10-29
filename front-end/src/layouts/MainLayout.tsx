import { FC } from "react";
import Header from "../components/layouts/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/shared/Footer";

const MainLayout: FC = () => {
    return <div className="flex flex-col">
        <Header />
        <div className="bg-slate-50 pb-10">
            <Outlet />
        </div>
        <Footer />
    </div>
};

export default MainLayout;
