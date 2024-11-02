import { FC, useState } from "react";
import MainSearch from "../../components/shared/MainSearch";
import images from "../../assets";
import ClinicBookingTab from "../../components/shared/tabs/ClinicBookingTab";
import DoctorBookingTab from "../../components/shared/tabs/DoctorBookingTab";
import { Link, useLocation, useNavigate } from "react-router-dom";
import cn from "../../app/components";

const BookingPage: FC = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const [searchValue, setSearchValue] = useState<string>('')

    const handleSearchNavigate = () => {
        if(location.pathname.includes('/booking/doctor')) {
            navigate('/booking/doctor/search?q=' + searchValue)
        } else if(location.pathname.includes('/booking/clinic')) {
            navigate('/booking/clinic/search?q=' + searchValue)
        }
    }

    return <div className="flex flex-col">
        <MainSearch
            value={searchValue}
            onSubmit={handleSearchNavigate}
            onChange={value => setSearchValue(value)}
        />
        <div className="flex flex-col items-center gap-y-8 lg:gap-y-16 py-8 w-full max-w-screen-lg mx-auto px-4">
            <div className="flex items-center w-full">
                <Link to='/booking/doctor' className={cn('flex-1 flex justify-center items-center gap-x-1 text-[15px] lg:text-[17px] border-b-[2px] py-3 hover:border-primary', location.pathname.includes('/booking/doctor') ? 'border-primary text-primary' : ' border-blue-200')}>
                    <img alt="Bác sĩ" className="w-6 h-6" src={images.medicalOutline} />
                    <span>Đặt khám bác sĩ</span>
                </Link>
                <Link to='/booking/clinic' className={cn('flex-1 flex justify-center items-center gap-x-1 text-[15px] lg:text-[17px] border-b-[2px] py-3 hover:border-primary', location.pathname.includes('/booking/clinic') ? 'border-primary text-primary' : ' border-blue-200')}>
                    <img alt="Phòng khám" className="w-6 h-6" src={images.medicalOutline} />
                    <span>Đặt khám phòng khám</span>
                </Link>
            </div>
            {location.pathname.includes('/booking/doctor') && <DoctorBookingTab />}
            {location.pathname.includes('/booking/clinic') && <ClinicBookingTab />}
        </div>
    </div>
};

export default BookingPage;
