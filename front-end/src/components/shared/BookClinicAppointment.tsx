import { Image } from "antd";
import { FC } from "react";
import images from "../../assets";
import { Link } from "react-router-dom";
import { ClinicResource } from "../../resources";

type BookClinicAppointmentProps = {
    clinic: ClinicResource
}

const BookClinicAppointment: FC<BookClinicAppointmentProps> = ({
    clinic
}) => {
    return <div className="p-4 rounded-lg border-[1px] border-gray-200">
        <Image width={100} height={100} preview={false} className="object-cover border-[1px] border-gray-200 rounded-md" src={clinic.thumbnailUrl ?? images.clinic} />
        <div className="flex flex-col gap-y-1 items-start">
            <Link to={`/clinic/${clinic.id}`} className="text-[16px] font-semibold line-clamp-1 text-left">{clinic.name}</Link>
            <p className="text-sm text-left">{clinic.address}</p>
        </div>
    </div>
};

export default BookClinicAppointment;
