import { FC } from "react";
import ContactSidebar from "../components/layouts/ContactSidebar";
import Header from "../components/layouts/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/shared/Footer";


const ContactLayout: FC = () => {
    return <div className="flex flex-col bg-slate-50 h-screen">
        <Header />
        <div className="w-[1200px] mx-auto h-[90%] grid grid-cols-12 gap-4 py-10">
            <div className="col-span-4 h-full overflow-y-hidden">
                <ContactSidebar />
            </div>
            <div className="col-span-8 bg-white p-4 h-full overflow-y-hidden rounded-lg shadow">
                <Outlet />
            </div>
        </div>
        <Footer />
    </div>
};

export default ContactLayout;
