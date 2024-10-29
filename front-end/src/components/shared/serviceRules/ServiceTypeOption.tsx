import { FC, useEffect, useState } from "react";
import { ServiceTypeResource } from "../../../resources";
import cn from "../../../app/components";

type ServiceTypeOptionProps = {
    serviceTypes: ServiceTypeResource[];
    onChange?: (value: number, serviceType: ServiceTypeResource) => void;
    onReset: () => void;
    isShowBody: boolean;
    value: number;
    order: number;
}

const ServiceTypeOption: FC<ServiceTypeOptionProps> = ({
    serviceTypes,
    onChange,
    onReset,
    isShowBody,
    value,
    order
}) => {
    const [checkServiceType, setCheckServiceType] = useState<number>(value)
    const [showBody, setShowBody] = useState(isShowBody)

    const handleCheckServiceType = (serviceType: ServiceTypeResource) => {
        setCheckServiceType(serviceType.id)
        onChange?.(serviceType.id, serviceType)
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
        setCheckServiceType(value)
    }, [value])

    return <div className="flex flex-col gap-y-4 bg-white p-4 rounded-lg shadow">
        <button disabled={showBody} onClick={handleShowBody} className="flex items-center gap-x-4">
            <span className="w-6 h-6 bg-primary text-white rounded-full block">{order}</span>
            <span className="text-primary font-semibold">Dịch vụ</span>
        </button>
        {showBody && <div className="flex flex-col gap-y-4">
            {serviceTypes.map(serviceType => <button onClick={() => handleCheckServiceType(serviceType)} key={serviceType.id} className={cn('p-4 rounded-md border-[1px] border-gray-100 text-left hover:border-primary', checkServiceType === serviceType.id && 'border-primary border-[1px]')}>
                <span className="text-[17px] font-semibold">{serviceType.name}</span>
            </button>)}
        </div>}
    </div>
};

export default ServiceTypeOption;
