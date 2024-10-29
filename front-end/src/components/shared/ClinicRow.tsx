import { Image } from "antd";
import { FC } from "react";
import images from "../../assets";
import { Link } from "react-router-dom";
import { ClinicResource } from "../../resources";

type ClinicRowProps = {
    clinic: ClinicResource
}

const ClinicRow: FC<ClinicRowProps> = ({
    clinic
}) => {
    return <div className="flex items-start gap-x-4">
        <Image width={90} preview={false} className="rounded-lg" src={clinic.thumbnailUrl ?? images.clinic} />
        <div className="flex flex-col items-start">
            <Link to={`/clinic/${clinic.id}`} className="text-lg font-semibold" >
                <span>{clinic.name}</span>
                <span className="ml-2 mb-2 px-1 py-[2px] rounded-md bg-primary text-white text-xs">NHIỀU CHI NHÁNH</span>
            </Link>
            <p className="text-[16px] font-medium text-gray-500">{clinic.address ?? 'UNKNOWN'}</p>
        </div>
    </div>
};

export default ClinicRow;
