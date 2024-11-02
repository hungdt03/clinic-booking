import { FC, useState } from "react";
import MainSearch from "../components/shared/MainSearch";
import DoctorList from "../components/shared/DoctorList";
import ClinicList from "../components/shared/ClinicList";
import SpecializationList from "../components/shared/SpecializationList";
import { useNavigate } from "react-router-dom";

const HomePage: FC = () => {
    const navigate = useNavigate()
    const [value, setValue] = useState<string>('')

    return <div className="flex flex-col">
        <MainSearch
            value={value}
            onChange={val => setValue(val)}
            onSubmit={() => navigate(`/search?q=${value}&type=all`)}
        />
        <div className="flex flex-col gap-y-16 py-8 w-full max-w-screen-xl mx-auto px-6 md:px-8 lg:px-6">
            <section className="flex flex-col gap-y-3">
                <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">Đặt lịch khám trực tuyến</p>
                <p className="text-gray-500 text-[17px]">Tìm Bác sĩ chính xác - Đặt lịch khám dễ dàng</p>
            </section>
            <DoctorList isTab={false} />
            <ClinicList />
            <SpecializationList
                onClick={spec => navigate(`/search?speciality=${spec.name}`)}
            /> 
        </div>
    </div>
};

export default HomePage;
