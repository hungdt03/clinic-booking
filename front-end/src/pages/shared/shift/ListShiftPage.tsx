import { FC, useEffect, useState } from "react";
import ShiftItem from "../../../components/shared/ShiftItem";
import CreateShiftButton from "../../../components/shared/CreateShiftButton";
import useModal from "../../../hooks/useModal";
import { Modal } from "antd";
import CreateShiftModal from "../../../components/modals/CreateShiftModal";
import { ShiftResource } from "../../../resources";
import shiftService from "../../../services/shift-service";
import RoleAccept from "../../../components/shared/CheckRole";

const ListShiftPage: FC = () => {
    const { handleCancel, handleOk, isModalOpen, showModal } = useModal()
    const [shifts, setShifts] = useState<ShiftResource[]>([])

    const fetchShifts = async () => {
        const response = await shiftService.getAllShifts();
        if (response.success) {
            setShifts(response.data)
        }
    }

    useEffect(() => {
        fetchShifts()
    }, [])

    const handleSuccess = () => {
        fetchShifts()
        handleOk();
    }

    return <div className="flex flex-col gap-y-6 items-start">
        <span className="font-bold text-lg text-primary">DANH SÁCH CA KHÁM</span>
        <div className="flex items-center gap-6 flex-wrap">
            {shifts.map(shift => <ShiftItem key={shift.id} shift={shift} />)}

            <RoleAccept roles={['DOCTOR_OWNER', 'MANAGER']}>
                <CreateShiftButton
                    onClick={showModal}
                />
            </RoleAccept>
        </div>

        <Modal
            open={isModalOpen}
            onOk={handleOk}
            title={<p className="text-center font-bold text-xl">THÊM KHUNG GIỜ MỚI</p>}
            onCancel={handleCancel}
            footer={[]}
        >
            <CreateShiftModal
                onSuccess={handleSuccess}
            />
        </Modal>
    </div>
};

export default ListShiftPage;
