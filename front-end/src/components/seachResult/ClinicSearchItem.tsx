import { Button, Image } from "antd";
import { FC } from "react";
import { Link } from "react-router-dom";
import images from "../../assets";
import { ClinicResource } from "../../resources";

type ClinicSearchItemProps = {
    clinic: ClinicResource
}

const ClinicSearchItem: FC<ClinicSearchItemProps> = ({
    clinic
}) => {
    return <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between lg:items-center px-6">
        <div className="flex items-start gap-x-4">
            <Image
                preview={false}
                src={clinic.thumbnailUrl ?? images.clinic}
                width={100}
                height={100}
                className="object-cover"
            />

            <div className="flex flex-col gap-y-2 items-start">
                <Link to={`/clinic/${clinic.id}`} className="text-lg font-medium" >{clinic.name}</Link>
                <div className="flex items-center gap-x-3">
                    {clinic.specializations.map(spec => <span key={spec.id} className="bg-gray-100 px-3 py-1 rounded-3xl font-medium text-sm">{spec.name}</span>)}
                </div>
                <p className="text-sm">{clinic.address ?? "UNKNOWN"}</p>
            </div>
        </div>

        <div className="flex justify-end">
            <Button type="primary" className="text-[15px] px-8">
                <Link to={`/booking/clinic/${clinic.id}`}>Đặt khám</Link>
            </Button>
        </div>
    </div>
};

export default ClinicSearchItem;
