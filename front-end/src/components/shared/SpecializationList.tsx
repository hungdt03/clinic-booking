import { FC, useEffect, useState } from "react";
import BookSpecializationAppointment from "./BookSpecializationAppointment";
import { Button, Empty } from "antd";
import { SpecialityResource } from "../../resources";
import specialityService from "../../services/speciality-service";

type SpecializationListProps = {
    onClick: (value: SpecialityResource) => void;
    isTab?: boolean
}

const SpecializationList: FC<SpecializationListProps> = ({
    onClick,
    isTab=false
}) => {
    const [specialities, setSpecialities] = useState<SpecialityResource[]>([])

    useEffect(() => {
        const fetchSpecialities = async () => {
            const response = await specialityService.getAllSpecialities();
            if (response.success) {
                setSpecialities(response.data)
            }
        }

        fetchSpecialities();
    }, [])

    if (specialities.length === 0 && isTab) {
        return <Empty description="Chưa có chuyên khoa nào" />;
    }

    return specialities.length > 0 && <div className="flex flex-col items-start gap-y-8">
        <div className="flex justify-between items-center w-full">
            <div className="flex flex-col items-start">
                <p className="text-xl font-bold">Đặt lịch theo Chuyên khoa</p>
                <p className="text-[15px]">Danh sách bác sĩ, phòng khám theo chuyên khoa.</p>
            </div>
            <Button shape="round" type="primary">Xem thêm</Button>
        </div>
        <div className="grid grid-cols-6 gap-6">
            {specialities.map(speciality => <BookSpecializationAppointment onClick={() => onClick(speciality)} key={speciality.id} speciality={speciality} />)}
        </div>
    </div>
};

export default SpecializationList;
