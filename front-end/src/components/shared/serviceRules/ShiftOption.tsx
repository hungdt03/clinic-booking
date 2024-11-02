import { Divider } from "antd";
import { FC, useEffect, useState } from "react";
import images from "../../../assets";
import Shift from "../Shift";
import { ShiftResource } from "../../../resources";

type ShiftOptionProps = {
    shifts: ShiftResource[];
    value: number;
    onChange: (value: number, shift: ShiftResource) => void;
    isShowBody: boolean;
    onReset: () => void;
    order: number;
}

const ShiftOption: FC<ShiftOptionProps> = ({
    shifts,
    value,
    onChange,
    isShowBody,
    onReset,
    order
}) => {

    const [checkShift, setCheckShift] = useState<number>(value)
    const [showBody, setShowBody] = useState<boolean>(isShowBody)
    
    const handleShowBody = () => {
        setShowBody(true)
        onReset()
    }

    useEffect(() => {
        setCheckShift(value)
    }, [value])

    useEffect(() => {
        setShowBody(isShowBody)
    }, [isShowBody])

    const handleCheckShift = (shift: ShiftResource) => {
        onChange(shift.id, shift)
        setCheckShift(shift.id)
    }

    return <div className="flex flex-col gap-y-4 bg-white p-4 rounded-lg shadow">
        <button disabled={showBody} onClick={handleShowBody} className="flex items-center gap-x-4">
            <span className="w-6 h-6 bg-primary text-white rounded-full block">{order}</span>
            <span className="text-primary font-semibold">Giờ khám</span>
        </button>
       {showBody && <div>
            <Divider orientation="left" plain>
                <div className="flex items-center gap-x-1">
                    <img src={images.morning} />
                    <p className="font-semibold text-[15px]">Buổi sáng</p>
                </div>
            </Divider>
            <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
                {shifts.filter(s => s.type === "MORNING").map(shift => <Shift  onClick={() => handleCheckShift(shift)} checked={checkShift === shift.id} key={shift.id} shift={shift} />)}

            </div>
            <Divider orientation="left" plain>
                <div className="flex items-center gap-x-1">
                    <img src={images.afternoon} />
                    <p className="font-semibold text-[15px]">Buổi chiều</p>
                </div>
            </Divider>
            <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
                {shifts.filter(s => s.type === "AFTERNOON").map(shift => <Shift onClick={() => handleCheckShift(shift)} checked={checkShift === shift.id} key={shift.id} shift={shift} />)}
            </div>
        </div>}
    </div>
};

export default ShiftOption;
