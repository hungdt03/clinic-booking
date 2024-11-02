import { FC, useEffect, useState } from "react";
import { DayShiftResource, ShiftResource } from "../../../resources";
import DateBooking from "../DateBooking";
import dayjs from "dayjs";
import { Divider } from "antd";
import images from "../../../assets";
import Shift from "../Shift";

type DateBookingOptionProps = {
    dates: DayShiftResource[];
    value: DayShiftResource;
    shiftValue: number;
    onDateChange: (day: DayShiftResource) => void;
    onShiftChange: (day: ShiftResource) => void;
    isShowBody: boolean;
    onReset: () => void
}

const DateBookingOption: FC<DateBookingOptionProps> = ({
    dates,
    value,
    onDateChange,
    isShowBody,
    onShiftChange,
    onReset,
    shiftValue
}) => {
    const [showBody, setShowBody] = useState(isShowBody)

    const handleShowBody = () => {
        if (!showBody) {
            setShowBody(true);
            onReset()
        }
    }

    useEffect(() => {
        setShowBody(isShowBody)
    }, [isShowBody])


    return <div className="flex flex-col gap-y-4 bg-white p-4 rounded-lg shadow">
        <button onClick={handleShowBody} className="flex items-center gap-x-4">
            <span className="w-6 h-6 bg-primary text-white rounded-full block">1</span>
            <span className="text-primary font-semibold">Ngày và giờ khám</span>
        </button>
        {isShowBody && <div>
            <div className="flex gap-x-2 py-3 items-center overflow-x-auto custom-scrollbar scrollbar-h-2">
                {dates.map(emptyDay =>
                    <DateBooking
                        checked={dayjs(value.day).isSame(dayjs(emptyDay.day), 'date')}
                        onClick={(day) => onDateChange(day)}
                        key={new Date(emptyDay.day).getTime()}
                        day={emptyDay}
                    />
                )}
            </div>
            {
                value && value.shifts.some(s => s.type === "MORNING") && <>
                    <Divider orientation="left" plain>
                        <div className="flex items-center gap-x-1">
                            <img alt="Buổi sáng" src={images.morning} />
                            <p className="font-semibold text-[15px]">Buổi sáng</p>
                        </div>
                    </Divider>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {value.shifts.filter(shift => shift.type === "MORNING").map(shift => <Shift checked={shiftValue == shift.id} onClick={() => onShiftChange(shift)} key={shift.id} shift={shift} />)}
                    </div>
                </>
            }

            {(value && value.shifts.some(s => s.type === "AFTERNOON")) && <>
                <Divider orientation="left" plain>
                    <div className="flex items-center gap-x-1">
                        <img alt="Buổi tối" src={images.afternoon} />
                        <p className="font-semibold text-[15px]">Buổi chiều</p>
                    </div>
                </Divider>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {value.shifts.filter(shift => shift.type === "AFTERNOON").map(shift => <Shift checked={shiftValue == shift.id} onClick={() => onShiftChange(shift)} key={shift.id} shift={shift} />)}
                </div>
            </>
            }
        </div>}

    </div>
};

export default DateBookingOption;
