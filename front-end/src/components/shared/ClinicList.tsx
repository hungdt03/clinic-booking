import { Button } from "antd";
import { FC, useEffect, useState } from "react";
import Slider from "./SlideSlick";
import BookClinicAppointment from "./BookClinicAppointment";
import { ClinicResource } from "../../resources";
import clinicService from "../../services/clinic-service";
import { Link } from "react-router-dom";

const ClinicList: FC = () => {
    const [clinics, setClinics] = useState<ClinicResource[]>([])

    useEffect(() => {
        const fetchClinics = async () => {
            const response = await clinicService.getAllClinics();
            if (response.success) {
                setClinics(response.data)
            }
        }

        fetchClinics();
    }, [])
    return <div className="flex flex-col items-start gap-y-8">
        <div className="flex justify-between items-center w-full">
            <div className="flex flex-col items-start">
                <p className="text-xl font-bold">Đặt khám phòng khám</p>
                <p className="text-[15px] hidden lg:block">Đa dạng phòng khám với nhiều chuyên khoa khác nhau như Sản - Nhi, Tai Mũi họng, Da Liễu, Tiêu Hoá...</p>
            </div>
            <Button shape="round" type="primary">
                <Link to='/booking/clinic'>Xem thêm</Link>
            </Button>
        </div>
        <Slider>
            {clinics.map(clinic => <BookClinicAppointment key={clinic.id} clinic={clinic} />)}
        </Slider>
    </div>
};

export default ClinicList;
