import { Calendar, Tooltip } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { FC, ReactNode, useState } from "react";
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { PickerLocale } from "antd/es/date-picker/generatePicker";
import { UnavailableDateResource } from "../../resources";

const today = dayjs()

const locale: PickerLocale | undefined = {
    "lang": {
        "locale": "vi",
        "placeholder": "Select date",
        "rangePlaceholder": ["Start date", "End date"],
        "today": "Today",
        "now": "Now",
        "backToToday": "Back to today",
        "ok": "OK",
        "clear": "Clear",
        "month": "Month",
        "year": "Year",
        "timeSelect": "Select time",
        "dateSelect": "Select date",
        "monthSelect": "Choose a month",
        "yearSelect": "Choose a year",
        "decadeSelect": "Choose a decade",
        "yearFormat": "YYYY",
        "dateFormat": "M/D/YYYY",
        "dayFormat": "D",
        "dateTimeFormat": "M/D/YYYY HH:mm:ss",
        "monthFormat": "MMMM",
        "monthBeforeYear": true,
        "previousMonth": "Previous month (PageUp)",
        "nextMonth": "Next month (PageDown)",
        "previousYear": "Last year (Control + left)",
        "nextYear": "Next year (Control + right)",
        "previousDecade": "Last decade",
        "nextDecade": "Next decade",
        "previousCentury": "Last century",
        "nextCentury": "Next century",
        "shortWeekDays": ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"],
        "shortMonths": [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ]
    },
    "timePickerLocale": {
        "placeholder": "Select time"
    },
    "dateFormat": "YYYY-MM-DD",
    "dateTimeFormat": "YYYY-MM-DD HH:mm:ss",
    "weekFormat": "YYYY-wo",
    "monthFormat": "YYYY-MM"
}

const baseClasses = "block w-full p-[16px] h-[56px] text-center font-medium border-[0.5px] border-gray-100";

const getCellDate = (
    date: Dayjs,
    currentMonth: Dayjs,
    selectDate: Dayjs,
    fullDates: UnavailableDateResource[],
    onSelectDate: (day: Dayjs) => void
): ReactNode => {

    const isToday = date.isSame(today, "day");
    const isCurrentDate = date.isSame(selectDate, "day");
    const isBeforeTodayInCurrentMonth = date.isBefore(today, "day");
    const disabledDate = fullDates.find(item => date.isSame(dayjs(item.day), 'day'));

    if (date.month() === currentMonth.month()) {
        if (isToday) {
            return (
                <button disabled className={`${baseClasses} cursor-not-allowed bg-primary bg-opacity-25 text-primary`}>
                    {date.get("date")}
                </button>
            );
        }

        if (disabledDate) {
            if (!disabledDate.isExceptionDate)
                return (
                    <Tooltip title={disabledDate.title}>
                        <button disabled className={`${baseClasses} cursor-not-allowed text-white bg-red-400`}>
                            {date.get("date")}
                        </button>
                    </Tooltip>
                );

            return (
                <Tooltip title={disabledDate.title}>
                    <button disabled className={`${baseClasses} cursor-not-allowed text-gray-300 bg-white`}>
                        {date.get("date")}
                    </button>
                </Tooltip>
            );
        }

        if (isCurrentDate) {
            return (
                <button className={`${baseClasses} bg-primary text-white`}>
                    {date.get("date")}
                </button>
            );
        }

        // Disable các ngày đã qua trong tháng hiện tại
        if (isBeforeTodayInCurrentMonth) {
            return (
                <button disabled className={`${baseClasses} cursor-not-allowed text-gray-300 bg-white`}>
                    {date.get("date")}
                </button>
            );
        }

        return (
            <button onClick={() => onSelectDate(date)} className={`${baseClasses} bg-white hover:bg-primary hover:text-white transition-all duration-200 ease-in-out`}>
                {date.get("date")}
            </button>
        );
    }

    // Nếu ngày không thuộc tháng hiện tại, disable nó
    return (
        <button disabled className={`${baseClasses} cursor-not-allowed bg-slate-50`}>
        </button>
    );
};


type CalendarBookingProps = {
    dates: UnavailableDateResource[];
    onChange: (value: Dayjs) => void;
    onMonthChange: (value: Dayjs) => void;
    value: Dayjs;
}

const CalendarBooking: FC<CalendarBookingProps> = ({
    dates,
    onChange,
    onMonthChange,
    value
}) => {

    const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());

    const handlePrevMonth = () => {
        const updateCurrentDate = currentDate.subtract(1, 'month')
        onMonthChange(updateCurrentDate);
        setCurrentDate(updateCurrentDate);
    };

    const handleNextMonth = () => {
        const updateCurrentDate = currentDate.add(1, 'month')
        onMonthChange(updateCurrentDate);
        setCurrentDate(updateCurrentDate);
    };

    const onSelectDate = (date: Dayjs) => {
        onChange(date)
    }

    return <div className="flex flex-col gap-y-3">
        <div className="flex justify-between items-center font-medium text-[16px]">
            <span>Tháng {dayjs(currentDate).format('MM YYYY')}</span>
            <div className="flex items-center gap-x-3">
                {currentDate.isAfter(today, 'month') && (
                    <button
                        onClick={handlePrevMonth}
                        className="hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center">
                        <LeftOutlined size={10} />
                    </button>
                )}

                <button
                    onClick={handleNextMonth}
                    className="hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center">
                    <RightOutlined size={10} />
                </button>
            </div>
        </div>

        <Calendar
            mode="month"
            headerRender={() => ''}
            value={currentDate}
            className="text-[12px] lg:text-[15px] border-[1px] border-gray-200"
            locale={locale}
            fullCellRender={
                (date: dayjs.Dayjs) => getCellDate(date, currentDate, value, dates, onSelectDate)
            }
        />

        <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-x-2">
                <span className="w-2 h-2 rounded-full bg-black"></span>
                <span className="text-xs">Ngày có thể đặt</span>
            </div>
            <div className="flex items-center gap-x-2">
                <span className="w-2 h-2 rounded-full bg-primary bg-opacity-30"></span>
                <span className="text-xs">Ngày hiện tại</span>
            </div>
            <div className="flex items-center gap-x-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="text-xs">Ngày đang chọn</span>
            </div>
            <div className="flex items-center gap-x-2">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                <span className="text-xs">Ngày đã đầy lịch</span>
            </div>
        </div>
    </div>


};

export default CalendarBooking;
