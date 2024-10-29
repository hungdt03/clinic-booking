import { FC, useEffect, useState } from "react";
import { ServiceResource } from "../../../resources";
import cn from "../../../app/components";

type ServiceOptionProps = {
    subName: string;
    services: ServiceResource[];
    value: number;
    order: number;
    isShowBody: boolean;
    onChange: (value: number, service: ServiceResource) => void
    onReset: () => void
}

const ServiceOption: FC<ServiceOptionProps> = ({
    subName,
    value,
    services,
    onChange,
    onReset,
    isShowBody,
    order
}) => {
    const [checkService, setCheckService] = useState<number>(value)
    const [showBody, setShowBody] = useState<boolean>(isShowBody)

    const handleShowBody = () => {
        if (!showBody) {
            setShowBody(true)
            onReset()
        }
    }

    useEffect(() => {
        setShowBody(isShowBody)
    }, [isShowBody])

    useEffect(() => {
        setCheckService(value)
    }, [value])

    return <div className="flex flex-col gap-y-4 bg-white p-4 rounded-lg shadow">
        <button disabled={showBody} onClick={handleShowBody} className="flex items-center gap-x-4">
            <span className="w-6 h-6 bg-primary text-white rounded-full block">{order}</span>
            <span className="text-primary font-semibold">{subName}</span>
        </button>
        {isShowBody && <div className="flex flex-col gap-y-4">
            {services.map(service => <button onClick={() => onChange(service.id, service)} key={service.id} className={cn('p-4 rounded-md border-[1px] border-gray-100 text-left flex justify-between items-center hover:border-primary', checkService && 'border-primary')}>
                <span className="text-[17px] font-semibold">{service.name}</span>
                {service.fee > 0 && <span className="text-green-500 font-medium">{service.fee} đ</span>}

            </button>)}

        </div>}
    </div>
};

export default ServiceOption;
