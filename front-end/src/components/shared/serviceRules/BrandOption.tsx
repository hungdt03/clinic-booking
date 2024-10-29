import { FC, useEffect, useState } from "react";
import ClinicBrand from "../ClinicBrand";
import { BrandResource } from "../../../resources";

type BrandProps = {
    brands: BrandResource[];
    onChange?: (value: number, brand: BrandResource) => void;
    isShowBody: boolean;
    onReset: () => void;
    value: number;
    order: number;
}

const BrandOption: FC<BrandProps> = ({
    brands,
    onChange,
    isShowBody,
    onReset,
    value,
    order
}) => {
    const [checkBrand, setCheckBrand] = useState<number>(value)
    const [showBody, setShowBody] = useState(isShowBody)

    const handleCheckBrand = (brand: BrandResource) => {
        setCheckBrand(brand.id)
        onChange?.(brand.id, brand)
    }

    const handleShowBody = () => {
        if (!isShowBody) {
            setShowBody(true)
            onReset()
        }
    }

    useEffect(() => {
        setShowBody(isShowBody)
    }, [isShowBody])

    useEffect(() => {
        setCheckBrand(value)
    }, [value])

    return <div className="flex flex-col gap-y-4 bg-white p-4 rounded-lg shadow">
        <button disabled={showBody} onClick={handleShowBody} className="flex items-center gap-x-4">
            <span className="w-6 h-6 bg-primary text-white rounded-full block">{order}</span>
            <span className="text-primary font-semibold">Cơ sở</span>
        </button>
        {showBody && <div className="flex flex-col gap-y-4">
            {brands.map(brand => <ClinicBrand checked={brand.id === checkBrand} onClick={() => handleCheckBrand(brand)} key={brand.id} brand={brand} />)}
        </div>}

    </div>
};

export default BrandOption;
