import { FC, useEffect, useState } from "react";
import CalendarBooking from "../CalendarBooking";
import { Dayjs } from "dayjs";
import { UnavailableDateResource } from "../../../resources";

type DateOptionProps = {
    dates: UnavailableDateResource[];
    onChange: (value: Dayjs) => void;
    onMonthChange: (value: Dayjs) => void;
    isShowBody: boolean;
    value: Dayjs;
    onReset: () => void;
    order: number;
}

const DateOption: FC<DateOptionProps> = ({
    dates,
    onChange,
    onMonthChange,
    isShowBody,
    value,
    onReset,
    order
}) => {
    const [checkDate, setCheckDate] = useState<Dayjs>(value);
    const [showBody, setShowBody] = useState<boolean>(isShowBody);

    const handleShowBody = () => {
        setShowBody(true)
        onReset()
    }

    useEffect(() => {
        setCheckDate(value)
    }, [value])

    useEffect(() => {
        setShowBody(isShowBody)
    }, [isShowBody])


    return <div className="flex flex-col gap-y-4 bg-white p-4 rounded-lg shadow">
        <button disabled={showBody} onClick={handleShowBody} className="flex items-center gap-x-4">
            <span className="w-6 h-6 bg-primary text-white rounded-full block">{order}</span>
            <span className="text-primary font-semibold">Ngày khám</span>
        </button>
        {showBody && (
            <CalendarBooking value={checkDate} onMonthChange={onMonthChange} onChange={onChange} dates={dates} />
        )}
    </div>
};

export default DateOption;
