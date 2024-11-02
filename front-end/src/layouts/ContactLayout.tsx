import { FC } from "react";
import ContactSidebar from "../components/layouts/ContactSidebar";
import Header from "../components/layouts/Header";
import { Outlet, useParams } from "react-router-dom";


const ContactLayout: FC = () => {
    const { recipientId } = useParams();

    return <div className="flex flex-col bg-slate-50 h-screen">
        <Header />
        <div className="w-full max-w-screen-xl mx-auto h-[92%] grid grid-cols-12 gap-4 py-0 lg:py-6">
            <div className={`col-span-12 lg:col-span-4 h-full shadow rounded-lg overflow-y-hidden ${recipientId && 'hidden lg:block'}`}>
                <ContactSidebar />
            </div>
            <div className={`col-span-12 lg:col-span-8 bg-white p-4 h-full overflow-y-hidden rounded-lg shadow ${!recipientId && 'hidden lg:block'}`}>
                <Outlet />
            </div>
        </div>
    </div>
};

export default ContactLayout;
