import { FC, useEffect } from "react";
import { Outlet } from "react-router-dom";
import ContactAdminSidebar from "./ContactAdminSidebar";
import groupService from "../../../services/group-service";

const ContactAdminPage: FC = () => {
    const fetchUserContacts = async () => {
        const response = await groupService.getAllGroupsByLoggedInUser();
        if(response.success) {
            if(response.data.length > 0) {
                console.log(response.data[0])
            }
        }
    }

    useEffect(() => {
        fetchUserContacts();
    }, [])

    return <div className="h-full grid grid-cols-12 gap-4">
        <div className="col-span-4 h-full overflow-y-hidden">
            <ContactAdminSidebar />
        </div>
        <div className="col-span-8 bg-white p-4 h-full overflow-y-hidden rounded-lg shadow">
            <Outlet />
        </div>
    </div>
};

export default ContactAdminPage;
