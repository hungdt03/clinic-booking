import React, { FC, useEffect, useState } from "react";
import ClinicRow from "../ClinicRow";
import { Divider } from "antd";
import { ClinicResource } from "../../../resources";
import clinicService from "../../../services/clinic-service";

const ClinicBookingTab: FC = () => {
    const [clinics, setClinics] = useState<ClinicResource[]>([])

    const fetchClinics = async () => {
        const response = await clinicService.getAllClinics();
        setClinics(response.data);
    }

    useEffect(() => {
        fetchClinics();
    }, [])

    return <div className="flex flex-col gap-y-10 max-w-screen-md w-full px-4">
        <div className="flex flex-col gap-y-1 items-start">
            <span className="text-lg lg:text-2xl font-semibold">Đa dạng phòng khám</span>
            <p className="text-left text-[15px] lg:text-[17px] lg:font-medium text-gray-600">Đặt khám dễ dàng và tiện lợi hơn với các phòng khám cùng nhiều chuyên khoa</p>
        </div>
        <div className="flex flex-col gap-y-6">
            {clinics.map(clinic => <React.Fragment key={clinic.id}>
                <ClinicRow clinic={clinic} />
                <Divider className="my-1" />
            </React.Fragment>)}
        </div>
    </div>
};

export default ClinicBookingTab;
