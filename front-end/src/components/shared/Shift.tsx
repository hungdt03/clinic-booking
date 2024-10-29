import { FC } from "react";
import { ShiftResource } from "../../resources";
import cn from "../../app/components";
import dayjs from "dayjs";

type ShiftProps = {
    shift: ShiftResource;
    checked: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement> | undefined
}

const Shift: FC<ShiftProps> = ({
    shift,
    checked,
    onClick
}) => {

    return <button onClick={onClick} className={cn('py-2 px-1 rounded-md border-[1px] border-gray-200 text-[15px] font-medium hover:bg-primary hover:text-white transition-all duration-150 ease-in-out cursor-pointer', checked && 'border-primary bg-primary text-white border-[1px]')}>
        {dayjs(shift.startTime, 'HH:mm:ss').format('HH:mm')}-{dayjs(shift.endTime, 'HH:mm:ss').format('HH:mm')}
    </button>
};

export default Shift;
