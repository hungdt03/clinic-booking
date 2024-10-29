import { FC, useEffect, useState } from "react";
import AppointmentRow from "../../components/shared/AppointmentRow";
import { Button, Empty, Image, Pagination, Popconfirm, message } from "antd";
import images from "../../assets";
import { AppointmentResource } from "../../resources";
import appointmentService from "../../services/appointment-service";
import dayjs from "dayjs";
import { Pagination as PaginationResource } from "../../resources/type-response";
import { QueryParams, initialValues } from "../../utils/pagination";
import { getBookingStatus } from "../../utils/status";

const AppointmentSchedule: FC = () => {
    const [queryParams, setQueryParams] = useState<QueryParams>(initialValues);
    const [pagination, setPagination] = useState<PaginationResource>()
    const [appointments, setAppointments] = useState<AppointmentResource[]>([])
    const [appointment, setAppointment] = useState<AppointmentResource | null>(null);

    const fetchAppointments = async (query: QueryParams) => {
        const response = await appointmentService.getAllAppointmentsByLoggedInUser(query);
        if (response.success) {
            const data = response.data;
            setPagination(response.pagination)

            if (data.length > 0) {
                setAppointment(data[0])
            }
            setAppointments(data)
        }
    }

    useEffect(() => {
        fetchAppointments(queryParams)
    }, [])

    const handleSelectAppointment = (value: AppointmentResource) => {
        setAppointment(value)
    }

    const cancelAppointment = async (appointmentId: number) => {
        const response = await appointmentService.cancelAppointment(appointmentId);
        if (response.success) {
            message.success(response.message)
            fetchAppointments(queryParams)
        } else {
            message.error(response.message)
        }
    }


    return <div className="flex flex-col items-start gap-y-6">
        <span className="text-xl font-medium">Lịch khám</span>

        <div className="grid grid-cols-12 gap-4 w-full">
            <div className="col-span-5 border-r-[1px] border-gray-100 w-full pl-2 pr-4">
                <input placeholder="Mã giao dịch, tên dịch vụ, bệnh nhân" className="px-3 py-2 rounded-md w-full bg-white border-[1px] border-gray-200 outline-none" />

                <div className="flex flex-col gap-4 py-2">

                    {appointments.map(app => <AppointmentRow onClick={handleSelectAppointment} selected={appointment?.id == app.id} key={app.id} appointment={app} />)}
                    {appointments.length == 0 ? <Empty description='Bạn chưa có lịch khám nào' /> :
                        <Pagination
                            pageSize={pagination?.size}
                            current={pagination?.page}
                            showLessItems
                            onChange={(value) => {
                                const updatedQueryParams = {
                                    ...queryParams,
                                    page: value
                                }
                                setQueryParams(updatedQueryParams)

                                fetchAppointments(updatedQueryParams)
                            }}
                            total={pagination?.totalItems}
                        />}
                </div>
            </div>
            <div className="col-span-7">
                {appointment ? <div className="px-4 flex flex-col gap-y-8">
                    <div className="flex justify-between items-center">
                        <span className="text-green-600 font-semibold">STT: {appointment.numberOrder}</span>
                        {getBookingStatus(appointment.status)}
                        {appointment.status === 'SUCCESS' && <Popconfirm title='Hủy lịch khám bệnh' description='Bạn có chắc là muốn hủy lịch khám không' onConfirm={() => cancelAppointment(appointment.id)}>
                            <Button danger>Hủy</Button>
                        </Popconfirm>}
                    </div>
                    <div className="flex items-center gap-x-4">
                        <Image width={70} height={70} preview={false} className="rounded-md object-cover" src={appointment.clinic ? appointment.clinic.thumbnailUrl : appointment.doctor.user.thumbnail ?? images.doctor} />
                        <span className="font-medium text-lg">{appointment.clinic ? appointment.clinic.name : appointment.doctor?.user?.fullName}</span>
                    </div>

                    <div className="flex flex-col gap-y-2 items-start text-[15px]">
                        <span className="font-medium">Thông tin đặt khám</span>
                        <div className="flex justify-between items-center w-full">
                            <span>Mã phiếu khám</span>
                            <span>{appointment.id}</span>
                        </div>
                        {appointment.clinic && <>
                            {appointment.doctor && <div className="flex justify-between items-center w-full">
                                <span>Bác sĩ dự kiến</span>
                                <span>{appointment.doctor.user.fullName}</span>
                            </div>}
                            {appointment.serviceType && <div className="flex justify-between items-center w-full">
                                <span>Dịch vụ</span>
                                <span>{appointment.serviceType.name}</span>
                            </div>}
                            {appointment.service && <div className="flex justify-between items-center w-full">
                                <span>{appointment.serviceType?.subName}</span>
                                <span>{appointment.service?.name}</span>
                            </div>}
                        </>}
                        <div className="flex justify-between items-center w-full">
                            <span>Ngày khám</span>
                            <span>{dayjs(appointment.appointmentDate, 'date').format('DD/MM/YYYY')}</span>
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <span>Khung giờ</span>
                            <span>{dayjs(appointment.shift.startTime, 'HH:mm:ss').format('HH:mm')} - {dayjs(appointment.shift.endTime, 'HH:mm:ss').format('HH:mm')}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-y-2 items-start text-[15px]">
                        <span className="font-medium">Thông tin bệnh nhân</span>
                        <div className="flex justify-between items-center w-full">
                            <span>Mã bệnh nhân</span>
                            <span className="text-primary">{appointment.profile.id}</span>
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <span>Họ và tên</span>
                            <span className="font-medium">{appointment.profile.name}</span>
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <span>Năm sinh</span>
                            <span className="font-medium">{dayjs(appointment.profile.dateOfBirth, 'date').format('DD/MM/YYYY')}</span>
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <span>Số điện thoại</span>
                            <span className="font-medium">{appointment.profile.phoneNumber ?? <i className="font-normal">Chưa cập nhật</i>}</span>
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <span>Giới tính</span>
                            <span className="font-medium">{appointment.profile.gender ?? <i className="font-normal">Chưa cập nhật</i>}</span>
                        </div>
                        <div className="flex justify-between items-start w-full">
                            <span className="whitespace-nowrap">Địa chỉ</span>
                            <span className="font-medium text-right">{appointment.profile.address ?? <i className="font-normal">Chưa cập nhật</i>}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-y-2 items-start">
                        <span className="font-medium">Kết quả</span>
                        <div className="w-full">
                            <Empty description='Đang chờ kết quả cập nhật' />
                        </div>
                    </div>
                </div> :
                    <Empty description='Không có dữ liệu' />
                }
            </div>
        </div>
    </div>
};

export default AppointmentSchedule;
