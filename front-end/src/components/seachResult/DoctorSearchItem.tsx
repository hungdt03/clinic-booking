import { Button, Image } from "antd";
import { FC } from "react";
import images from "../../assets";
import { Link } from "react-router-dom";
import { DoctorOwnerResource } from "../../resources";

type DoctorSearchItemProps = {
    doctor: DoctorOwnerResource
}

const DoctorSearchItem: FC<DoctorSearchItemProps> = ({
    doctor
}) => {
    return <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between lg:items-center px-6">
        <div className="flex items-start gap-x-4">
            <Image
                preview={false}
                src={doctor.user.thumbnail ?? images.doctor}
                className="rounded-full"
                width={100}
            />

            <div className="flex flex-col gap-y-2 items-start">
                <Link to={`/doctor/${doctor.user.id}`} className="text-lg font-medium" >Bác sĩ {doctor.user.fullName}</Link>
                <div className="flex items-center gap-x-3">
                    {doctor.specializations.map(spec => <span key={spec.id} className="bg-gray-100 px-3 py-1 rounded-3xl font-medium text-sm">{spec.name}</span>)}
                </div>
                <p className="text-sm">{doctor.details.address ?? 'UNKNOWN'}</p>
            </div>
        </div>


        <div className="flex justify-end">
            <Button type="primary" className="text-[15px] px-8">
                <Link to={`/booking/doctor/${doctor.user.id}`}>Đặt khám</Link>
            </Button>
        </div>
    </div>
};

export default DoctorSearchItem;
