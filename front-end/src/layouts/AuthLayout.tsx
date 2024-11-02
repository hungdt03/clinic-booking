import { FC } from "react";
import Header from "../components/layouts/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/shared/Footer";
import images from "../assets";

const AuthLayout: FC = () => {

    return <div className="flex flex-col bg-slate-50">
        <Header />
        <div className="grid grid-cols-12 pt-12 lg:pt-32 py-20 px-6 w-full max-w-screen-xl mx-auto">
            <div className="col-span-12 lg:col-span-7 flex items-center justify-center">
                <img width={400} height={400} src={images.auth} />
            </div>
            <div className="col-span-12 lg:col-span-5 mt-6 lg:mt-0">
                <Outlet />
            </div>
        </div>
        <Footer />
    </div>
};

export default AuthLayout;
