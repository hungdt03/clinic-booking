import { Image } from "antd";
import { FC } from "react";
import images from "../../assets";
import { SpecialityResource } from "../../resources";

type BookSpecializationAppointmentProps = {
    speciality: SpecialityResource;
    onClick: React.MouseEventHandler<HTMLButtonElement> | undefined
}

const BookSpecializationAppointment: FC<BookSpecializationAppointmentProps> = ({
    speciality,
    onClick
}) => {
    return <button onClick={onClick} className="p-4 rounded-lg hover:shadow">
        <Image width='40%' preview={false} src={speciality.thumbnail ?? images.specialization} />
        <p className="text-[15px]">{speciality.name}</p>
    </button>
};

export default BookSpecializationAppointment;
