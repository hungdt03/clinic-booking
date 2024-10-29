import { Alert, Input, Steps, UploadFile, message } from "antd";
import { FC, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import BrandOption from "../../components/shared/serviceRules/BrandOption";
import DoctorOption from "../../components/shared/serviceRules/DoctorOption";
import DateOption from "../../components/shared/serviceRules/DateOption";
import ShiftOption from "../../components/shared/serviceRules/ShiftOption";
import PatientProfileOption from "../../components/shared/serviceRules/PatientProfileOption";
import { BookingProcessResource, BrandResource, ClinicResource, DoctorEmployeeResource, NoteResource, ProfileResource, ServiceResource, ServiceTypeResource, ShiftResource, UnavailableDateResource, UserResource } from "../../resources";
import brandService from "../../services/brand-service";
import { useParams } from "react-router-dom";
import serviceTypeService from "../../services/service-type-service";
import ServiceTypeOption from "../../components/shared/serviceRules/ServiceTypeOption";
import doctorService from "../../services/doctor-service";
import shiftService from "../../services/shift-service";
import patientService from "../../services/patient-service";
import serviceService from "../../services/service-service";
import ServiceOption from "../../components/shared/serviceRules/ServiceOption";
import appointmentService from "../../services/appointment-service";
import 'dayjs/locale/vi';
import ClinicBookingInfo from "../../components/shared/ClinicBookingInfo";
import UploadMultipleFile from "../../components/upload/UploadMultipleFile";
import settingService from "../../services/setting-service";
import processService from "../../services/process-service";
dayjs.locale('vi');
const today = new Date()

export type AppointmentObject = {
    clinic?: ClinicResource;
    brand?: BrandResource;
    serviceType?: ServiceTypeResource;
    service?: ServiceResource;
    doctor?: DoctorEmployeeResource;
    profile?: ProfileResource;
    appointmentDate?: Date;
    shift?: ShiftResource;
    fileAttaches?: UploadFile[];
    note?: string
}


const appointmentObjectInit: AppointmentObject = {
    clinic: undefined,
    brand: undefined,
    service: undefined,
    doctor: undefined,
    profile: undefined,
    appointmentDate: undefined,
    shift: undefined,
    fileAttaches: [],
    note: ''
}

type EditHistoryObjectType = {
    key: string;
    title: string;
    value: AppointmentObject
}

export type QueryAvailableDateParams = {
    clinicId: string,
    brandId: number,
    doctorId: string,
    month: number,
    year: number;
}

export type QueryAvailableShiftParams = {
    clinicId: string,
    brandId: number,
    doctorId: string,
    date: string
}

const createFormDataFromAppointment = (appointmentObject: AppointmentObject, clinicId: string) => {
    const formData = new FormData();
    formData.append('clinicId', clinicId);
    if(appointmentObject.brand) {
        formData.append('brandId', appointmentObject.brand.id.toString());
    }
    
    if(appointmentObject.service) {
        formData.append('serviceId', appointmentObject.service.id.toString());
    }

    if(appointmentObject.doctor) {
        formData.append('doctorId', appointmentObject.doctor.user.id);
    }
    
    formData.append('profileId', appointmentObject.profile?.id!);
    formData.append('shiftId', appointmentObject.shift?.id.toString()!);
    formData.append('appointmentDate', dayjs(appointmentObject.appointmentDate).format('YYYY-MM-DD'));

    if (appointmentObject.note) {
        formData.append('note', appointmentObject.note);
    }

    appointmentObject?.fileAttaches?.forEach((file: any) => {
        if (file.originFileObj) {
            formData.append('fileAttaches', file.originFileObj, file.name);
        }
    });

    return formData;
};

const ClinicBookingPage: FC = () => {
    const { id } = useParams()
    const [loading, setLoading] = useState(false)

    const [processes, setProcesses] = useState<BookingProcessResource[]>([])

    const [appointmentObject, setAppointmentObject] = useState<AppointmentObject>(appointmentObjectInit)
    const [historyObject, setHistoryObject] = useState<EditHistoryObjectType[]>([])
    const [copyObject, setCopyObject] = useState<AppointmentObject>(appointmentObjectInit)

    const [brands, setBrands] = useState<BrandResource[]>([])
    const [serviceTypes, setServiceTypes] = useState<ServiceTypeResource[]>([])
    const [doctors, setDoctors] = useState<DoctorEmployeeResource[]>([])
    const [profiles, setProfiles] = useState<ProfileResource[]>([])
    const [services, setServices] = useState<ServiceResource[]>([])

    const [note, setNote] = useState<NoteResource | null>(null)

    const [fullDates, setFullDates] = useState<UnavailableDateResource[]>([])
    const [shifts, setShifts] = useState<ShiftResource[]>([])

    const fetchNote = async () => {
        if(id) {
            const response = await settingService.getNoteClinicById(id);
            if(response.success) {
                setNote(response.data)
            }
        }
        
    }

    const fetchProcesses = async () => {
        if(id) {
            const response = await processService.getProcessByClinicId(id)
            if(response.success) {
                const dataProcess = response.data;
                setProcesses(dataProcess)

                if(dataProcess.some(s => s.name==='SERVICE')) {
                    fetchServiceTypes()
                }
            }
        }
    }

    const fetchBrands = async () => {
        const response = await brandService.getAllBrandsByClinicId(id!);
        if (response.success) {
            const dataBrands = response.data
            setBrands(dataBrands);

            if(dataBrands.length === 1) {
                fecthAvailableDatesFirst(dataBrands[0].id)
                fetchDoctorsByBrandId(dataBrands[0].id)
                setAppointmentObject({
                    ...appointmentObject,
                    brand: dataBrands[0]
                })
            }
        }
    }

    const fetchDoctorsByBrandId = async (brandId: number) : Promise<DoctorEmployeeResource[]> => {
        const response = await doctorService.getAllDoctorEmployeesByBrandId(brandId);
        if (response.success) {
            setDoctors(response.data)
        }

        return response.data ?? []
    }

    const fetchServiceTypes = async () => {
        const response = await serviceTypeService.getAllServiceTypesByClinicId(id!);
        if (response.success) {
            setServiceTypes(response.data)
        }
    }

    const fecthAvailableDates = async (params: QueryAvailableDateParams) => {
        const response = await shiftService.getAllFullDaysByClinicAndMonth(params);
        if (response.success) {
            setFullDates(response.data)
        }
    }

    const fetchAvailableShifts = async (params: QueryAvailableShiftParams) => {
        const response = await shiftService.getAllEmptyShiftsByClinicAndDate(params);
        if (response.success) {
            setShifts(response.data)
        }
    }

    const fetchProfiles = async () => {
        const response = await patientService.getAllProfiles();
        if (response.success) {
            setProfiles(response.data)
        }
    }

    const fetchServices = async (serviceTypeId: number) => {
        const response = await serviceService.getAllServicesByServiceTypeId(serviceTypeId);
        if (response.success) {
            setServices(response.data)
        }
    }
 

    const fecthAvailableDatesFirst = async (brandId: number) => {
        const queryParam: QueryAvailableDateParams = {
            clinicId: id!,
            brandId: brandId,
            doctorId: '',
            month: today.getMonth() + 1,
            year: today.getFullYear()
        }

        fecthAvailableDates(queryParam)
    }

    useEffect(() => {
        fetchProcesses();
        fetchNote()
        fetchProfiles();
    }, [])

    const handleAppointmentChange = (name: string, title: string, value: any) => {
        const index = historyObject.findIndex(h => h.key === name);

        const updatedAppointmentObject = ({
            ...appointmentObject,
            [name]: value
        })

        if (index !== -1) {
            setHistoryObject(prev => {
                const updatedHistory = [...prev];
                updatedHistory[index].value = updatedAppointmentObject
                updatedHistory[index].title = title
                return prev;
            })
        } else {
            setHistoryObject(prev => [...prev, {
                key: name,
                title,
                value: updatedAppointmentObject
            }])
        }

        setAppointmentObject(updatedAppointmentObject)
    }

    const handleRollbackPrevState = (name: string) => {
        setAppointmentObject({
            ...appointmentObjectInit,
            ...getPrevObjectInfo(name)
        })

        if(name === 'DATE') {
            const queryParam: QueryAvailableDateParams = {
                clinicId: id!,
                brandId: appointmentObject.brand?.id ?? 0,
                doctorId: appointmentObject.doctor?.user.id ?? '',
                month: today.getMonth() + 1,
                year: today.getFullYear()
            }
    
            fecthAvailableDates(queryParam)
        }
        
    }

    const getPrevObjectInfo = (name: string): AppointmentObject => {
        const index = historyObject.findIndex(h => h.key === name);
        const prevInfo = index > 0
            ? { ...historyObject[index - 1].value }
            : { ...appointmentObjectInit } as AppointmentObject;

        setCopyObject({
            ...historyObject[index].value
        })

        if (index >= 0 && index < historyObject.length - 1) {
            setHistoryObject(prevHistory => prevHistory.slice(0, index + 1));
        }

        return prevInfo;
    };

    const handleMonthChange = (day: Dayjs) => {
        const queryParam: QueryAvailableDateParams = {
            clinicId: id!,
            brandId: appointmentObject.brand?.id ?? 0,
            doctorId: appointmentObject.doctor?.user.id ?? '',
            month: day.month() + 1,
            year: day.year()
        }

        fecthAvailableDates(queryParam)
    }


    const handleCreateAppointment = async () => {
        const formData = createFormDataFromAppointment(appointmentObject, id!);

        setLoading(true);
        const response = await appointmentService.createAppointment(formData);
        setLoading(false);

        if (response.success) {
            message.success(response.message);
            setAppointmentObject({
                ...appointmentObjectInit,
                clinic: appointmentObject.clinic,
            });
            
            setHistoryObject([])
        } else {
            message.error(response.message);
        }
    }

    const isShowDateOption = () => {
        return !!appointmentObject.doctor
        || (!!appointmentObject.brand  && !processes.some(s => s.name==="SERVICE" || s.name === "DOCTOR"))
        || (!!appointmentObject.service && !processes.some(s => s.name === "DOCTOR"))
        || !processes.some(s => s.name === 'BRAND' || s.name === 'SERVICE' || s.name === 'DOCTOR')
        || (!appointmentObject.doctor && doctors.length === 0 && (!!appointmentObject.service || (appointmentObject.brand && !processes.some(s => s.name==="SERVICE"))))
      
    }

    const isShowDoctorOption = () => {
        return (!!appointmentObject.brand && processes.some(s => s.name==="BRAND") && !processes.some(s => s.name==="SERVICE") && doctors.length > 0)
        || (!!appointmentObject.service && processes.some(s => s.name === "DOCTOR") && doctors.length > 0) 
    }

    const isShowServiceOption = () => {
        return !!appointmentObject.brand && processes.some(s => s.name==="BRAND") && processes.some(s => s.name === "SERVICE")
    }

    const getOrderNumber = (step: string) => {
        const findStep = processes.find(s => s.name === step);
        const serviceStep = processes.find(s => s.name === "SERVICE");

        if(serviceStep && findStep && findStep.orderNumber > serviceStep.orderNumber) {
            return findStep.orderNumber + 1;
        }

        return findStep?.orderNumber ?? 0;
    }

    useEffect(() => {
        if(historyObject.length === 0) fetchBrands()
    }, [historyObject])
 
    return <div className="w-[1200px] mx-auto mt-12">
        <div className="flex flex-col gap-8">
            <Steps
                className="text-green-500 px-14"
                size="small"
                current={historyObject.length}
                items={historyObject.map(history => ({
                    title: history.title,
                    status: "process"
                }))}
            />

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-7 flex flex-col gap-4">
                    {note && <Alert className="text-left" message={note?.content} banner />}
                    {processes.some(s => s.name === "BRAND") && <BrandOption
                        isShowBody={!appointmentObject.brand?.id}
                        onReset={() => handleRollbackPrevState('brand')}
                        value={appointmentObject.brand?.id ?? copyObject.brand?.id!}
                        brands={brands}
                        order={getOrderNumber('BRAND')}
                        onChange={async (_, object) => {
                            handleAppointmentChange('brand', 'Chi nhánh', object)
                            const doctorData = await fetchDoctorsByBrandId(object.id);

                            if(!processes.some(s => s.name === 'SERVICE') || doctorData.length === 0) {
                                const queryParam: QueryAvailableDateParams = {
                                    clinicId: id!,
                                    brandId: object.id,
                                    doctorId: '',
                                    month: today.getMonth() + 1,
                                    year: today.getFullYear()
                                }

                                fecthAvailableDates(queryParam)
                            }
                        }}
                    />}

                    {isShowServiceOption() &&
                        <ServiceTypeOption
                            serviceTypes={serviceTypes}
                            onReset={() => handleRollbackPrevState('serviceType')}
                            value={appointmentObject.serviceType?.id ?? copyObject.serviceType?.id!}
                            isShowBody={!appointmentObject.serviceType?.id}
                            order={getOrderNumber('SERVICE')}
                            onChange={(_, object) => {
                                handleAppointmentChange('serviceType', 'Dịch vụ', object)
                                fetchServices(object.id)

                                if(!processes.some(s => s.name === 'DOCTOR')) {
                                    const queryParam: QueryAvailableDateParams = {
                                        clinicId: id!,
                                        brandId: appointmentObject.brand?.id ?? 0,
                                        doctorId: '',
                                        month: today.getMonth() + 1,
                                        year: today.getFullYear()
                                    }
                                    fecthAvailableDates(queryParam)
                                }
                            }}
                        />
                    }

                    {(!!appointmentObject.serviceType && services.length > 0) &&
                        <ServiceOption
                            services={services}
                            onReset={() => handleRollbackPrevState('service')}
                            value={appointmentObject.service?.id ?? copyObject.service?.id!}
                            isShowBody={!appointmentObject.service?.id}
                            order={getOrderNumber('SERVICE') + 1}
                            subName={appointmentObject.serviceType.subName}
                            onChange={(_, object) => {
                                handleAppointmentChange('service', appointmentObject.serviceType?.subName!, object)                      
                            }}
                        />
                    }

                    {isShowDoctorOption() &&
                        <DoctorOption
                            doctors={doctors}
                            onReset={() => handleRollbackPrevState('doctor')}
                            value={appointmentObject.doctor?.user.id ?? copyObject.doctor?.user.id!}
                            isShowBody={!appointmentObject.doctor?.user.id}
                            order={getOrderNumber('DOCTOR')}
                            onChange={(_, object) => {
                                handleAppointmentChange('doctor', 'Bác sĩ', object)
                                const queryParam: QueryAvailableDateParams = {
                                    clinicId: id!,
                                    brandId: appointmentObject.brand?.id ?? 0,
                                    doctorId: object.user.id,
                                    month: today.getMonth() + 1,
                                    year: today.getFullYear()
                                }

                                fecthAvailableDates(queryParam)
                            }}
                        />
                    }

                    {isShowDateOption() &&
                        <DateOption
                            onReset={() => handleRollbackPrevState('appointmentDate')}
                            isShowBody={!appointmentObject.appointmentDate}
                            value={dayjs(appointmentObject.appointmentDate ?? copyObject.appointmentDate)}
                            dates={fullDates}
                            onMonthChange={handleMonthChange}
                            order={getOrderNumber('DATE')}
                            onChange={(value) => {
                                handleAppointmentChange('appointmentDate', 'Ngày khám', value.format('YYYY-MM-DD'))
                                const queryParam: QueryAvailableShiftParams = {
                                    clinicId: id!,
                                    brandId: appointmentObject.brand?.id ?? 0,
                                    doctorId: appointmentObject.doctor?.user.id ?? '',
                                    date: value.format('YYYY-MM-DD')
                                }
                                fetchAvailableShifts(queryParam)
                            }}
                        />
                    }

                    {!!appointmentObject.appointmentDate
                        &&
                        <ShiftOption
                            shifts={shifts}
                            isShowBody={!appointmentObject.shift?.id}
                            value={appointmentObject.shift?.id ?? copyObject.shift?.id!}
                            order={getOrderNumber('SHIFT')}
                            onChange={(_, object) => handleAppointmentChange('shift', 'Giờ khám', object)}
                            onReset={() => handleRollbackPrevState('shift')}
                        />
                    }
                    {!!appointmentObject.shift
                        &&
                        <>
                            <PatientProfileOption
                                profiles={profiles}
                                isShowBody={!appointmentObject.profile?.id}
                                order={getOrderNumber('PROFILE')}
                                onChange={(_, object) => handleAppointmentChange('profile', 'Bệnh nhân', object)}
                                onReset={() => handleRollbackPrevState('profile')}
                                value={appointmentObject.profile?.id ?? copyObject.profile?.id!}
                            />

                            <div className="flex flex-col gap-y-4 bg-white p-4 rounded-lg shadow">
                                <div className="flex flex-col gap-y-3 items-start">
                                    <span className="font-medium">Thông tin bổ sung (không bắt buộc)</span>
                                    <div className="flex flex-col gap-y-1 items-start w-full">
                                        <span className="text-[15px]">Ghi chú</span>
                                        <Input.TextArea
                                            rows={4}
                                            className="w-full"
                                            value={appointmentObject.note}
                                            cols={6}
                                            onChange={(e) => handleAppointmentChange('note', 'Ghi chú', e.target.value)}
                                            placeholder="Triệu chứng, thuốc đang dùng, tiền sử, ..."
                                        />
                                    </div>

                                    <div className="flex flex-col gap-y-1 items-start w-full">
                                        <label className="text-[15px]">{`Tệp đính kèm (${appointmentObject.fileAttaches?.length ?? 0}/3)`}</label>
                                        <UploadMultipleFile
                                            onChange={(fileList: UploadFile[]) => setAppointmentObject({
                                                ...appointmentObject,
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
                    <ClinicBookingInfo
                        clinicId={id}
                        loading={loading}
                        onClick={handleCreateAppointment}
                        appointmentObject={appointmentObject}
                    />
                    <p className="text-sm my-2 text-gray-500 text-left">Bằng cách nhấn nút xác nhận, bạn đã đồng ý với các điều khoản và điều kiện đặt khám</p>
                </div>
            </div>
        </div>
    </div>
};

export default ClinicBookingPage;
