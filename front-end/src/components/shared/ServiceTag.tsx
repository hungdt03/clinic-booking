import { FC } from "react";
import { Link } from "react-router-dom";
import { CheckCircleOutlined } from '@ant-design/icons'
import { SpecialityResource } from "../../resources";

type ServiceTagProps = {
    speciality: SpecialityResource;
    prefixUrl: string;
}

const ServiceTag: FC<ServiceTagProps> = ({
    speciality,
    prefixUrl
}) => {
    return <Link to={`${prefixUrl}/search?speciality=${speciality.name}`} className="flex gap-x-2 items-center px-3 py-1 bg-slate-100 rounded-3xl hover:bg-primary hover:text-white transition-all duration-300 ease-in-out">
        <CheckCircleOutlined />
        {speciality.name}
    </Link>
};

export default ServiceTag;
