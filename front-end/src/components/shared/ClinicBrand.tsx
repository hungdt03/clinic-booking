import { FC } from "react";
import { BrandResource } from "../../resources";
import cn from "../../app/components";

type ClinicBrandProps = {
    brand: BrandResource;
    onClick:  React.MouseEventHandler<HTMLButtonElement>,
    checked: boolean
}

const ClinicBrand: FC<ClinicBrandProps> = ({
    brand,
    onClick,
    checked
}) => {
    return <button onClick={onClick} className={cn('border-[1px] border-gray-200 rounded-md text-left p-4 hover:border-[1px] hover:border-primary', checked && 'border-primary border-[1px]')}>
        <span className="font-medium">{brand.name}</span>
        <p className="text-[15px]">{brand.address}</p>
    </button>
};

export default ClinicBrand;
