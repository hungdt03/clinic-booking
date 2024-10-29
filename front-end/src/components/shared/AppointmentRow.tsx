import { FC } from "react";
import { AppointmentResource } from "../../resources";
import dayjs from "dayjs";
import cn from "../../app/components";
import { getBookingStatus } from "../../utils/status";

type AppointmentRowProps = {
    appointment: AppointmentResource;
    selected: boolean;
    onClick: (appointment: AppointmentResource) => void
}

const AppointmentRow: FC<AppointmentRowProps> = ({
    appointment,
    onClick,
    selected
}) => {
    return <button onClick={() => onClick(appointment)} className={cn('flex items-center justify-between py-2 hover:bg-slate-50 px-3 rounded-md cursor-pointer', selected && 'bg-slate-50')}>
        <div className="flex flex-col gap-y-1 items-start">
            <span className="text-[16px] font-semibold">{!!appointment.clinic ? appointment.clinic.name : 'BS' + appointment.doctor?.user?.fullName}</span>
            <div className="text-[15px] flex items-center gap-x-3">
                <span>{dayjs(appointment.shift.startTime, '"HH:mm:ss"').format('HH:mm')} - {dayjs(appointment.shift.endTime, '"HH:mm:ss"').format('HH:mm')}</span>
                <span>({dayjs(appointment.appointmentDate, 'date').format('DD-MM-YYYY')})</span>
            </div>
            <span className="text-[15px]">{appointment.profile.name}</span>
            {getBookingStatus(appointment.status)}
        </div>
        <div>
            <div className="flex flex-col p-4 border-[1px] border-gray-100 rounded-md">
                <span className="text-sm">STT</span>
                <span className="text-xl font-medium">{appointment.numberOrder ?? "UNKNOWN"}</span>
            </div>
        </div>
    </button>
};

export default AppointmentRow;
