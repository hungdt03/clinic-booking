import { Image } from "antd";
import { FC, useEffect, useState } from "react";
import images from "../../../assets";
import { DoctorEmployeeResource } from "../../../resources";
import cn from "../../../app/components";

type DoctorOptionProps = {
    doctors: DoctorEmployeeResource[];
    value: string;
    onChange?: (value: string, doctor: DoctorEmployeeResource) => void,
    onReset: () => void;
    isShowBody: boolean;
    order: number;
}

const DoctorOption: FC<DoctorOptionProps> = ({
    doctors,
    value,
    onChange,
    onReset,
    isShowBody,
    order
}) => {
    const [checkDoctor, setCheckDoctor] = useState<string>(value)

    const [showBody, setShowBody] = useState(isShowBody)

    const handleCheckDoctor = (doctor: DoctorEmployeeResource) => {
        setCheckDoctor(doctor.user.id)
        onChange?.(doctor.user.id, doctor)
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
        setCheckDoctor(value)
    }, [value])

    return <div className="flex flex-col gap-y-4 bg-white p-4 rounded-lg shadow">
        <button disabled={showBody} onClick={handleShowBody} className="flex items-center gap-x-4">
            <span className="w-6 h-6 bg-primary text-white rounded-full block">{order}</span>
            <span className="text-primary font-semibold">Bác sĩ</span>
        </button>
        {showBody && <div className="flex flex-col gap-y-4">
            {doctors.map(doctor => <button onClick={() => handleCheckDoctor(doctor)} key={doctor.user.id} className={cn('p-4 rounded-md border-[1px] border-gray-100 flex items-center gap-x-4 hover:border-primary hover:border-[1px]', doctor.user.id == checkDoctor && 'border-[1px] border-primary')}>
                <Image preview={false} width={50} className="rounded-full" src={doctor.user.thumbnail ?? images.doctor} />
                <span className="text-[17px] font-semibold">{doctor.user.fullName}</span>
            </button>)}

        </div>}
    </div>
};

export default DoctorOption;
