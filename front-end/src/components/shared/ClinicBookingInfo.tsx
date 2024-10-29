import { FC, useEffect, useState } from "react";
import { AppointmentObject } from "../../pages/booking/ClinicBookingPage";
import { Button, Divider, Image } from "antd";
import images from "../../assets";
import dayjs from "dayjs";
import { ClinicResource } from "../../resources";
import clinicService from "../../services/clinic-service";

type ClinicBookingInfoProps = {
    appointmentObject: AppointmentObject;
    clinicId: string | undefined;
    loading: boolean;
    onClick: React.MouseEventHandler<HTMLElement> | undefined
}

const ClinicBookingInfo: FC<ClinicBookingInfoProps> = ({
    appointmentObject,
    loading,
    onClick,
    clinicId
}) => {
    const [clinic, setClinic] = useState<ClinicResource | null>(null);

    const fetchClinic = async (clinicID: string) => {
        const response = await clinicService.getClinicById(clinicID);
        if (response.success) {
            setClinic(response.data)
        }

    }

    useEffect(() => {
        if (clinicId) {
            fetchClinic(clinicId)
        }
    }, [clinicId])
    return <div className="bg-white py-4 rounded-xl shadow">
        <span className="font-semibold text-left block px-4">Thông tin đặt khám</span>
        <Divider className="mt-3" />
        <div className="flex items-center gap-x-3 px-4">
            <Image
                preview={false}
                width={60}
                height={60}
                className="rounded-full object-cover"
                src={clinic?.thumbnailUrl ?? images.doctor}
            />

            <div className="flex flex-col gap-y-1 items-start">
                <span className="text-[16px] font-semibold">{clinic?.name}</span>
                <p className="text-left text-sm text-gray-400">{clinic?.address}</p>
            </div>
        </div>
        <Divider />
        <div className="flex flex-col gap-y-3 text-[16px] px-4 pb-4">
            {appointmentObject.brand && <div className="flex items-center justify-between">
                <span>Chi nhánh</span>
                <span className="font-medium">{appointmentObject.brand.name}</span>
            </div>}
            {appointmentObject.serviceType && <div className="flex items-center justify-between">
                <span>Dịch vụ</span>
                <span className="font-medium">{appointmentObject.serviceType.name}</span>
            </div>}
            {appointmentObject.service && <div className="flex items-center justify-between">
                <span>{appointmentObject.serviceType?.subName}</span>
                <span className="font-medium">{appointmentObject.service.name}</span>
            </div>}
            {appointmentObject.doctor && <div className="flex items-center justify-between">
                <span>Bác sĩ</span>
                <span className="font-medium">{appointmentObject.doctor.user.fullName}</span>
            </div>}
            {appointmentObject.appointmentDate && <div className="flex items-center justify-between">
                <span>Ngày khám</span>
                <span className="font-medium">{appointmentObject.appointmentDate.toString()}</span>
            </div>}
            {appointmentObject.shift && <div className="flex items-center justify-between">
                <span>Khung giờ</span>
                <span className="font-medium">{dayjs(appointmentObject.shift.startTime, "HH:mm:ss").format('HH:mm')} - {dayjs(appointmentObject.shift.endTime, "HH:mm:ss").format('HH:mm')}</span>
            </div>}
            {appointmentObject.profile && <div className="flex items-center justify-between">
                <span>Bệnh nhân</span>
                <span className="font-medium">{appointmentObject.profile.name}</span>
            </div>}
        </div>
        <div className="px-4">
            <Button loading={loading} onClick={onClick} disabled={!appointmentObject.profile || loading} className="w-full text-[17px] font-semibold" type="primary" size="large" shape="default">Xác nhận đặt khám</Button>
        </div>
    </div>
};

export default ClinicBookingInfo;
