import { Button, Empty, Image } from "antd";
import { FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import doctorService from "../services/doctor-service";
import { DoctorOwnerResource } from "../resources";
import images from "../assets";
import ServiceTag from "../components/shared/ServiceTag";

const DoctorDetail: FC = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState<DoctorOwnerResource | null>(null)

    useEffect(() => {
        const fetchDoctor = async () => {
            const response = await doctorService.getDoctorOwnerById(id!);

            if (response.success) {
                setDoctor(response.data)
            }
        }

        fetchDoctor();
    }, [id])
    return <div className="w-full max-w-screen-lg mx-auto mt-8 px-4 md:px-6">
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-3 items-center bg-white rounded-md shadow-sm p-4">
                    <Image className='rounded-full bg-gray-400' preview={false} width='200px' height='200px' src={doctor?.user.thumbnail ?? images.doctor} />
                    <span className="font-bold text-xl">Bác sĩ {doctor?.user.fullName}</span>
                    <div className="flex items-center gap-x-3">
                        <div className="flex items-center gap-x-1">
                            <img alt="tick" className="w-5 h-5" src="https://youmed.vn/dat-kham/assets/images/verified.svg" />
                            <span className="font-semibold text-primary text-lg">Bác sĩ</span>
                        </div>
                        |
                        <p>
                            <b>{doctor?.details.experienceYears}</b> năm kinh nghiệm
                        </p>
                    </div>
                    <Button type="primary" className="mt-3 hidden lg:block" shape="round" size="large">
                        <Link to={`/booking/doctor/${doctor?.user.id}`}>
                            Đặt khám ngay
                        </Link>
                    </Button>
                </div>

                <div className="fixed left-0 right-0 bottom-0 p-4 bg-white shadow lg:hidden">
                     <Button type="primary" className="mt-3 w-full" size="large">
                        <Link to={`/booking/doctor/${doctor?.user.id}`}>
                            Đặt khám ngay
                        </Link>
                    </Button>
                </div>

                {((doctor?.educations?.length ?? 0) > 0 || (doctor?.workExperiences?.length ?? 0) > 0) && <div className="flex flex-col items-start gap-y-3 bg-white rounded-md shadow-sm p-4">
                    {!!doctor?.educations?.length && <div className="flex flex-col gap-y-1 items-start">
                        <span className="font-semibold">Học vấn</span>
                        <div className="py-2 flex flex-col items-start gap-2">
                            {doctor?.educations.map(education => <span key={education.id} className="text-left">{education.fromYear} - {education.toYear}: {education.studyPlace}</span>)}
                        </div>
                    </div>}
                    {!!doctor?.workExperiences?.length && <div className="flex flex-col gap-y-1 items-start">
                        <span className="font-semibold">Kinh nghiệm</span>
                        <div className="py-2 flex flex-col items-start gap-2">
                            {doctor?.workExperiences.map(experience => <span key={experience.id} className="text-left">{experience.fromYear} - {experience.toYear}: {experience.workPlace}</span>)}
                        </div>
                    </div>}

                </div>}

            </div>
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-y-6 bg-white rounded-md shadow-sm p-4">
                <div className="flex flex-col items-start gap-y-4 mb-4">
                    <span className="text-lg font-semibold">Giới thiệu</span>
                    {doctor?.details.introductionHtml ? <p className="text-left prose w-full" dangerouslySetInnerHTML={{ __html: doctor?.details.introductionHtml ?? '' }}>
                    </p> : <div className="w-full flex justify-center">
                        <Empty description='Chưa có thông tin giới thiệu nào' />
                    </div>}

                </div>

                <div className="flex flex-col items-start gap-y-4">
                    {!!doctor?.awardsAndResearches?.length && <div className="flex flex-col gap-y-1 items-start">
                        <span className="text-lg font-semibold">Giải thưởng & Các công trình nghiên cứu</span>
                        <div className="py-2 flex flex-col items-start gap-2">
                            {doctor?.awardsAndResearches.map(award => <span key={award.id} className="text-left">Năm {award.year}: {award.content}</span>)}
                        </div>
                    </div>}
                    {!!doctor?.specializations?.length && <div className="flex flex-col gap-y-1 items-start">
                        <span className="text-lg font-semibold">Chuyên khoa</span>
                        <div className="py-2 flex items-center gap-2 flex-wrap">
                            {doctor?.specializations.map(spec => <ServiceTag prefixUrl="/booking/doctor" key={spec.id} speciality={spec} />)}
                        </div>
                    </div>}

                </div>

            </div>
        </div>

    </div>
};

export default DoctorDetail;
