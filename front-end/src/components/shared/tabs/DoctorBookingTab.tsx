import { FC } from "react";
import DoctorList from "../DoctorList";
import SpecializationList from "../SpecializationList";
import { useNavigate } from "react-router-dom";

const DoctorBookingTab: FC = () => {
    const navigate = useNavigate()
    return <div className="flex flex-col gap-y-12 w-full">
        <DoctorList />
        <SpecializationList
            isTab
            onClick={spec => navigate(`/booking/doctor/search?speciality=${spec.name}`)}
        />
    </div>
};

export default DoctorBookingTab;
