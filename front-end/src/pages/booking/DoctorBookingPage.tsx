import { Alert, Button, Divider, Empty, Image, Input, Steps, UploadFile, message } from "antd";
import { FC, useEffect, useState } from "react";
import images from "../../assets";
import { DayShiftResource, DoctorOwnerResource, NoteResource, ProfileResource, ShiftResource } from "../../resources";
import shiftService from "../../services/shift-service";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import doctorService from "../../services/doctor-service";
import patientService from "../../services/patient-service";
import PatientProfileOption from "../../components/shared/serviceRules/PatientProfileOption";
import appointmentService from "../../services/appointment-service";
import DateBookingOption from "../../components/shared/doctor-booking/DateBookingOption";
import UploadMultipleFile from "../../components/upload/UploadMultipleFile";
import settingService from "../../services/setting-service";


type AppointmentDoctorObject = {
    doctor?: DoctorOwnerResource;
    profile?: ProfileResource;
    appointmentDate?: Date;
    shift?: ShiftResource;
    fileAttaches: UploadFile[];
    note: string
}

type EditHistoryType = {
    key: string;
    value: AppointmentDoctorObject;
    title: string;
}

const initialValues: AppointmentDoctorObject = {
    doctor: undefined,
    profile: undefined,
    appointmentDate: undefined,
    shift: undefined,
    fileAttaches: [],
    note: ''
}

const DoctorBookingPage: FC = () => {
    const { id } = useParams()
    const [emptyDates, setEmptyDates] = useState<DayShiftResource[]>([])
    const [firstDate, setFirstDate] = useState<DayShiftResource | null>(null)
    const [doctor, setDoctor] = useState<DoctorOwnerResource | undefined>(undefined)
    const [profiles, setProfiles] = useState<ProfileResource[]>([])
    const [loading, setLoading] = useState(false)
    const [isShowDate, setIsShowDate] = useState(true)
    const [note, setNote] = useState<NoteResource | null>(null)

    const [appointmentRequest, setAppointmentRequest] = useState<AppointmentDoctorObject>({
        ...initialValues,
    })

    const [history, setHistory] = useState<EditHistoryType[]>([])

    const fetchDoctocOwner = async () => {
        const response = await doctorService.getDoctorOwnerById(id!);
        if (response.success) {
            setDoctor(response.data)
        }
    }

    const fetchNoteDoctor = async () => {
        if (id) {
            const response = await settingService.getNoteDoctorById(id);
            if (response.success) {
                setNote(response.data)
            }
        }

    }

    const fetchEmptyDays = async () => {
        const response = await shiftService.getAllEmptyDaysByDoctorId(id!);
        if (response.success) {
            const data = response.data;

            if (data.length > 0) {
                const findEmptyDate = data.find(item => item.shifts.length > 0)
                setFirstDate(findEmptyDate ?? null)
            }

            setEmptyDates(data)
        }
    }

    const fetchProfiles = async () => {
        const response = await patientService.getAllProfiles();
        if (response.success) {
            setProfiles(response.data)
        }
    }

    useEffect(() => {
        fetchNoteDoctor()
        fetchEmptyDays()
        fetchDoctocOwner();
        fetchProfiles()
    }, [])

    useEffect(() => {
        setAppointmentRequest({
            ...appointmentRequest,
            doctor: doctor
        })
    }, [doctor])

    const handleChange = (name: string, title: string, value: any) => {
        const index = history.findIndex(h => h.key === name);

        const updatedAppointment = {
            ...(
                name === 'appointmentDate'
                    ? initialValues
                    : appointmentRequest
            ),
            [name]: value
        };

        if (index !== -1) {
            setHistory(prev => {
                const updatedHistory = [...prev];
                updatedHistory[index].value = updatedAppointment
                updatedHistory[index].title = title
                return prev;
            })

        } else {
            setHistory(prev => [...prev, {
                key: name,
                value: updatedAppointment,
                title
            }])
        }

        setAppointmentRequest({
            ...updatedAppointment
        })
    }

    const handleRollbackPrevState = (name: string) => {
        setAppointmentRequest({
            ...initialValues,
            ...getPrevObjectInfo(name)
        })
    }

    const getPrevObjectInfo = (name: string): AppointmentDoctorObject => {
        const index = history.findIndex(h => h.key === name);
        const prevInfo = index == 0
            ? { ...history[1].value }
            : { ...history[index].value } as AppointmentDoctorObject;

        if (index >= 0 && index < history.length - 1) {
            setHistory(prevHistory => prevHistory.slice(0, (index == 0 ? 1 : index) + 1));
        }

        return prevInfo;

    };



    const handleCreateAppointment = async () => {
        const formData = new FormData();
        formData.append('doctorId', id!);
        formData.append('profileId', appointmentRequest.profile?.id!);
        formData.append('shiftId', appointmentRequest.shift?.id.toString()!);
        formData.append('appointmentDate', dayjs(appointmentRequest.appointmentDate).format('YYYY-MM-DD'));

        if (appointmentRequest.note) {
            formData.append('note', appointmentRequest.note);
        }

        appointmentRequest.fileAttaches.forEach(file => {
            if (file.originFileObj) {
                formData.append('fileAttaches', file.originFileObj, file.name);
            }
        });

        setLoading(true)
        const response = await appointmentService.createAppointmentWithDoctor(formData);
        setLoading(false)

        if (response.success) {
            message.success(response.message)

            setAppointmentRequest({
                ...initialValues,
            })
            setIsShowDate(true)
            fetchEmptyDays()
        } else {
            message.error(response.message)
        }
    }

    return <div className="w-[1200px] mx-auto mt-12">
        <div className="flex flex-col gap-8">
            <Steps
                className="text-green-500 px-14"
                size="small"
                current={1}
                items={history.map(item => ({
                    title: item.title,
                    status: 'process'
                }))}
            />


            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-7 flex flex-col gap-4">
                    <Alert className="text-center" message={note?.content} banner />
                    {(firstDate) ? <DateBookingOption
                        value={firstDate}
                        dates={emptyDates}
                        shiftValue={appointmentRequest.shift?.id ?? 0}
                        isShowBody={isShowDate}
                        onDateChange={(value) => {
                            handleChange('appointmentDate', 'Ngày khám', value.day)
                            setFirstDate(value)
                        }}
                        onShiftChange={(value) => {
                            handleChange('shift', 'Ca khám', value);
                            setIsShowDate(false)
                        }}
                        onReset={() => {
                            handleRollbackPrevState('appointmentDate')
                            setIsShowDate(true)
                        }}
                    />
                        : <Empty description='Hiện tại chưa thể đặt khám. Qúy khách vui lòng quay lại sau' />
                    }

                    {!isShowDate
                        &&
                        <>
                            <PatientProfileOption
                                profiles={profiles}
                                isShowBody={!appointmentRequest.profile?.id}
                                order={2}
                                onChange={(_, object) => handleChange('profile', 'Bệnh nhân', object)}
                                onReset={() => { }}
                                value={appointmentRequest.profile?.id!}
                            />

                            <div className="flex flex-col gap-y-4 bg-white p-4 rounded-lg shadow">
                                <div className="flex flex-col gap-y-3 items-start">
                                    <span className="font-medium">Thông tin bổ sung (không bắt buộc)</span>
                                    <div className="flex flex-col gap-y-1 items-start w-full">
                                        <span className="text-[15px]">Ghi chú</span>
                                        <Input.TextArea
                                            rows={4}
                                            className="w-full"
                                            value={appointmentRequest.note}
                                            cols={6}
                                            onChange={(e) => handleChange('note', 'Lưu ý', e.target.value)}
                                            placeholder="Triệu chứng, thuốc đang dùng, tiền sử, ..."
                                        />
                                    </div>

                                    <div className="flex flex-col gap-y-1 items-start w-full">
                                        <label className="text-[15px]">{`Tệp đính kèm (${appointmentRequest.fileAttaches?.length}/3)`}</label>
                                        <UploadMultipleFile
                                            onChange={(fileList) => setAppointmentRequest({
                                                ...appointmentRequest,
                                                fileAttaches: fileList
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </div>
                <div className="col-span-5">
                    <div className="bg-white py-4 rounded-xl shadow">
                        <span className="font-semibold text-left block px-4">Thông tin đặt khám</span>
                        <Divider className="mt-3" />
                        <div className="flex items-center gap-x-3 px-4">
                            <Image
                                preview={false}
                                width={60}
                                height={60}
                                className="rounded-full"
                                src={doctor?.user.thumbnail ?? images.doctor}
                            />

                            <div className="flex flex-col gap-y-1 items-start">
                                <span className="text-[16px] font-semibold">{doctor?.user.fullName}</span>
                                <p className="text-sm text-gray-400">{doctor?.details.address ?? 'Địa chỉ: UNKNOWN'}</p>
                            </div>
                        </div>
                        <Divider />
                        <div className="flex flex-col gap-y-3 text-[16px] px-4 pb-4">
                            {!!firstDate && <div className="flex items-center justify-between">
                                <span>Ngày khám</span>
                                <span className="font-medium">{dayjs(firstDate.day).format('DD/MM/YYYY')}</span>
                            </div>}
                            {!!appointmentRequest.shift && <div className="flex items-center justify-between">
                                <span>Khung giờ</span>
                                <span className="font-medium">{dayjs(appointmentRequest.shift.startTime, "HH:mm:ss").format('HH:mm')} - {dayjs(appointmentRequest.shift.endTime, "HH:mm:ss").format('HH:mm')}</span>
                            </div>}

                            {!!appointmentRequest.profile && <div className="flex items-center justify-between">
                                <span>Bệnh nhân</span>
                                <span className="font-medium">{appointmentRequest.profile.name}</span>
                            </div>}
                        </div>
                        <div className="px-4">
                            <Button loading={loading} disabled={!appointmentRequest.profile} onClick={handleCreateAppointment} className="w-full text-[17px] font-semibold" type="primary" size="large" shape="default">Xác nhận đặt khám</Button>
                        </div>
                    </div>
                    <p className="text-sm my-2 text-gray-500 text-left">Bằng cách nhấn nút xác nhận, bạn đã đồng ý với các điều khoản và điều kiện đặt khám</p>
                </div>
            </div>
        </div>
    </div>
};

export default DoctorBookingPage;
