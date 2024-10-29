import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import appointmentService from "../../services/appointment-service";
import { AppointmentResource } from "../../resources";
import dayjs from "dayjs";
import { Empty, Image } from "antd";
import images from "../../assets";
import Loading from "../../components/shared/Loading";

const AppointmentDetails: FC = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false)
    const [appointment, setAppointment] = useState<AppointmentResource | null>(null);

    const fetchAppointment = async () => {
        setLoading(true)
        const respponse = await appointmentService.getAppointmentById(id);
        setLoading(false)
        console.log(respponse)
        if (respponse.success) {
            setAppointment(respponse.data)
        }
    }

    useEffect(() => {
        fetchAppointment()
    }, [id])

    return appointment && <>
        {loading && <Loading />}
        <div className="p-3 bg-white rounded-lg space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
                <div className="text-green-600 font-semibold text-lg flex items-center gap-x-2">
                    <span>STT: </span>
                    <div className="w-8 h-8 flex items-center justify-center bg-green-600 text-white font-semibold rounded-full">{appointment?.numberOrder}</div>
                </div>
                <span className={`font-semibold text-sm ${appointment?.status === 'Đã xác nhận' ? 'text-green-500' : 'text-gray-500'}`}>
                    {appointment?.status}
                </span>
            </div>

            <div className="flex items-center gap-x-4">
                <Image width={90} preview={false} className="rounded-md" src={appointment?.doctor?.user?.thumbnail ?? images.doctor} />
                <div className="flex flex-col items-start">
                    <span className="font-semibold text-lg text-gray-900">{appointment?.doctor?.user?.fullName}</span>
                    <div className="flex items-center gap-x-3">
                        <div className="flex items-center gap-x-1">
                            <img alt="tick" className="w-5 h-5" src="https://youmed.vn/dat-kham/assets/images/verified.svg" />
                            <span className="font-semibold text-primary text-lg">Bác sĩ</span>
                        </div>
                        |
                        <p>
                            <b>{appointment?.doctor?.details?.experienceYears}</b> năm kinh nghiệm
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-start gap-y-3">
                    <span className="font-semibold text-lg text-gray-700">Thông tin đặt khám</span>
                    <div className="flex flex-col gap-y-2 w-full">
                        <div className="flex justify-between items-center">
                            <span className="text-[15px] text-gray-600">Mã phiếu khám</span>
                            <span className="text-[15px] font-semibold">{appointment?.id}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[15px] text-gray-600">Ngày khám</span>
                            <span className="text-[15px] font-semibold">{dayjs(appointment?.appointmentDate).format('DD/MM/YYYY')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[15px] text-gray-600">Khung giờ</span>
                            <span className="text-[15px] font-semibold">{dayjs(appointment.shift.startTime, 'HH:mm:ss').format('HH:mm')} - {dayjs(appointment.shift.endTime, 'HH:mm:ss').format('HH:mm')}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-start gap-y-3">
                    <span className="font-semibold text-lg text-gray-700">Thông tin bệnh nhân</span>
                    <div className="flex flex-col gap-y-2 w-full">
                        <div className="flex justify-between items-center">
                            <span className="text-[15px] text-gray-600">Mã bệnh nhân</span>
                            <span className="text-[15px] font-semibold text-primary">{appointment?.profile.id}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[15px] text-gray-600">Họ và tên</span>
                            <span className="text-[15px] font-semibold">{appointment?.profile.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[15px] text-gray-600">Năm sinh</span>
                            <span className="text-[15px] font-semibold">{dayjs(appointment?.profile.dateOfBirth).format('DD/MM/YYYY')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[15px] text-gray-600">Số điện thoại</span>
                            <span className="text-[15px] font-semibold">
                                {appointment?.profile.phoneNumber ?? <i className="font-normal">Chưa cập nhật</i>}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[15px] text-gray-600">Giới tính</span>
                            <span className="text-[15px] font-semibold">
                                {appointment?.profile.gender ?? <i className="font-normal">Chưa cập nhật</i>}
                            </span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-[15px] text-gray-600">Địa chỉ</span>
                            <span className="text-[15px] font-semibold text-right">{appointment?.profile.address ?? <i className="font-normal">Chưa cập nhật</i>}</span>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-start gap-y-3">
                    <span className="font-semibold text-lg text-gray-700">Thông tin bổ sung</span>
                    <div className="flex flex-col gap-y-2 w-full">
                        <p className="text-[15px]">{appointment.note ?? 'Không có ghi chú nào'}</p>
                    </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-start gap-y-3">
                    <span className="font-semibold text-lg text-gray-700">Tệp đính kèm</span>
                    <Image.PreviewGroup>
                        <div className="grid grid-cols-4 gap-4">
                            {appointment.fileAttaches.map(fileUrl => <Image className="rounded-md" width={100} key={fileUrl} src={fileUrl} />)}
                        </div>
                    </Image.PreviewGroup>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <span className="font-semibold text-lg text-gray-700">Kết quả</span>
                <div className="mt-2">
                    <Empty description="Đang chờ kết quả cập nhật" />
                </div>
            </div>
        </div>
    </>

};

export default AppointmentDetails;
