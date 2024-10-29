import { Divider, Image } from "antd";
import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { DoctorOwnerResource } from "../../resources";
import images from "../../assets";
import { Link } from "react-router-dom";

type BookDoctorAppointmentProps = {
    doctor: DoctorOwnerResource
}

const BookDoctorAppointment: FC<BookDoctorAppointmentProps> = ({
    doctor
}) => {
    return <Link to={`/doctor/${doctor.user.id}`} className="block rounded-xl border-[1px] border-gray-200 height-[240px]">
        <div className="p-4">
            <Image width={90} height={90} className="object-cover rounded-full" preview={false} src={doctor.user.thumbnail ?? images.doctor} />
            <div className="flex flex-col gap-y-1 py-2">
                <p className="text-[17px] font-semibold">PGS.TS.BS {doctor.user.fullName}</p>
                <p className="text-[15px]">Nhi khoa</p>
                <p className="text-[15px]">Bệnh viện Nhi Đồng 2</p>
            </div>
        </div>
        <Divider className="my-0" />
        <div className="py-2 px-4 flex items-center justify-between text-[15px]">
            <button>Đặt lịch khám</button>
            <FontAwesomeIcon className="text-[12px]" icon={faChevronRight} />
        </div>
    </Link>
};

export default BookDoctorAppointment;
