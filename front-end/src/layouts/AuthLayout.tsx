import { FC } from "react";
import Header from "../components/layouts/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/shared/Footer";
import images from "../assets";

const AuthLayout: FC = () => {

    return <div className="flex flex-col bg-slate-50">
        <Header />
        <div className="grid grid-cols-12 pt-32 py-20 px-6 w-[1200px] mx-auto">
            <div className="col-span-7">
                <img width={500} height={500} src={images.auth} />
            </div>
            <div className="col-span-5">
                <Outlet />
            </div>
        </div>
        <Footer />
    </div>
};

export default AuthLayout;
