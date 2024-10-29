import { FC } from "react";
import { DayShiftResource } from "../../resources";
import dayjs from "dayjs";
import cn from "../../app/components";


type DateBookingProps = {
    day: DayShiftResource;
    onClick: (day: DayShiftResource) => void;
    checked: boolean;
}

const DateBooking: FC<DateBookingProps> = ({
    day,
    onClick,
    checked
}) => {
    return <button disabled={day.shifts.length === 0} onClick={() => onClick(day)} className={cn("flex flex-col items-center flex-shrink-0 text-sm px-5 py-2 rounded-md", day.shifts.length > 0 ? 'hover:bg-blue-50 hover:text-primary cursor-pointer' : 'cursor-not-allowed' , checked && 'text-primary bg-blue-50')}>
        <span className="font-semibold">
            {`${dayjs(day.day).format('ddd')}, ${dayjs(day.day).format('DD-MM')}`}
        </span>
        {
            day.shifts.length > 0 
            ? <span className="text-green-500">{day.shifts.length} khung giờ</span>
            : <span className="text-red-500">Đã đầy lịch</span>
        }
    </button>
};

export default DateBooking;
