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
        <Image width={80} height={80} preview={false} className="rounded-lg object-cover" src={clinic.thumbnailUrl ?? images.clinic} />
        <div className="flex flex-col items-start">
            <Link to={`/clinic/${clinic.id}`} className="text-[15px] lg:text-lg font-semibold flex justify-start flex-wrap gap-x-2 items-center">
                <span >{clinic.name}</span>
                <span className="px-1 py-[2px] rounded-md bg-primary text-white text-xs">NHIỀU CHI NHÁNH</span>
            </Link>
            <p className="text-[14px] lg:text-[16px] lg:font-medium text-gray-500">{clinic.address ?? 'UNKNOWN'}</p>
        </div>
    </div>
};

export default ClinicRow;
