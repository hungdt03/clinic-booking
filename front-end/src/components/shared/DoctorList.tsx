import { Button, Empty } from "antd";
import { FC, useEffect, useState } from "react";
import BookDoctorAppointment from "./BookDoctorAppointment";
import Slider from "./SlideSlick";
import { DoctorOwnerResource } from "../../resources";
import doctorService from "../../services/doctor-service";
import { Link } from "react-router-dom";

type DoctorListProps = {
    isTab?: boolean
}

const DoctorList: FC<DoctorListProps> = ({
    isTab=true
}) => {
    const [doctors, setDoctors] = useState<DoctorOwnerResource[]>([])

    useEffect(() => {
        const fetchDoctors = async () => {
            const response = await doctorService.getAllDoctorOwners();
            setDoctors(response.data)
        }

        fetchDoctors()
    }, [])

    if (doctors.length === 0 && isTab) {
        return <Empty description="Chưa có phòng khám bác sĩ nào" />;
    }

    return doctors.length > 0 && <div className="flex flex-col items-start gap-y-8">
        <div className="flex justify-between items-center w-full">
            <div className="flex flex-col items-start">
                <p className="text-xl font-bold">Đặt khám bác sĩ</p>
                <p className="text-[15px]">Phiếu khám kèm số thứ tự và thời gian của bạn được xác nhận.</p>
            </div>
            <Button shape="round" type="primary">
                <Link to='/booking/doctor'>Xem thêm</Link>
            </Button>
        </div>
        <Slider>
            {doctors.map(doctor => <BookDoctorAppointment key={doctor.user.id} doctor={doctor} />)}
        </Slider>
    </div>
};

export default DoctorList;
