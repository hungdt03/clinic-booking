import { Breadcrumb, Button, Carousel, Divider, Image, Tooltip } from "antd";
import { FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import images from "../assets";
import ServiceTag from "../components/shared/ServiceTag";
import clinicService from "../services/clinic-service";
import { ClinicResource } from "../resources";

const contentStyle: React.CSSProperties = {
    height: '450px',
    lineHeight: '450px',
};


const ClinicDetail: FC = () => {
    const { id } = useParams()
    const [clinic, setClinic] = useState<ClinicResource | null>(null);

    useEffect(() => {
        const fetchClinicById = async () => {
            const response = await clinicService.getClinicById(id!);
            if (response.success) {
                setClinic(response.data)
            }
        }

        fetchClinicById();
    }, [id])
    return <div className="w-full max-w-screen-lg mx-auto px-4 md:px-0">
        <Breadcrumb
            items={[
                {
                    title: <Link to="/">Trang chủ</Link>,
                },
                {
                    title: 'Phòng khám',
                },
            ]}
            className="my-6 text-[16px]"
        />

        <div className="flex flex-col gap-y-8">
            <div className="h-[30%] block lg:hidden">
                <Carousel autoplay>
                    {clinic?.images.map(image => <div className="rounded-xl overflow-hidden" key={image}>
                        <img width={'100%'} height={'100%'} className="object-cover rounded-xl overflow-hidden" style={contentStyle} src={image} alt="Slide" />
                    </div>)}
                </Carousel>
            </div>
            <div className="flex items-start justify-center lg:justify-between">
                <div className="flex flex-col lg:flex-row items-center gap-x-6 justify-start">
                    <Image preview={false} width={120} height={120} className="rounded-full object-cover" src={clinic?.thumbnailUrl ?? images.clinic} />
                    <div className="flex flex-col items-start gap-y-4">
                        <span className="text-2xl font-bold">{clinic?.name}</span>
                        <Link to='#' className="hidden lg:flex py-1 px-2 border-[2px] border-gray-200 rounded-3xl items-center gap-x-1">
                            <img alt="Địa chỉ" src={images.address} width={18} />
                            <Tooltip title={clinic?.address}>
                                <span className="text-[16px]">Địa chỉ</span>
                            </Tooltip>
                        </Link>
                    </div>
                </div>
                <Button shape="round" className="hidden">
                    Yêu thích
                </Button>
            </div>
            <Link to='#' className="flex lg:hidden py-1 px-2 border-[2px] border-gray-200 rounded-3xl items-center gap-x-1">
                <img alt="Địa chỉ" src={images.address} width={18} />
                <Tooltip title={clinic?.address}>
                    <span className="text-[16px]">Địa chỉ</span>
                </Tooltip>
            </Link>
            <div>
                <Divider className="my-2" />
                <div className="flex items-center gap-x-4">
                    <button className="font-semibold hover:bg-slate-100 rounded-xl px-3 py-2">Thông tin</button>
                    <a href="#service" className="font-semibold hover:bg-slate-100 rounded-xl px-3 py-2">Dịch vụ</a>
                </div>
                <Divider className="my-2" />
            </div>

            <div className="hidden lg:block">
                <Carousel autoplay>
                    {clinic?.images.map(image => <div className="rounded-xl overflow-hidden" key={image}>
                        <img width={'100%'} height={'100%'} className="object-cover rounded-xl overflow-hidden" style={contentStyle} src={image} alt="Slide" />
                    </div>)}
                </Carousel>
            </div>
            <div className="justify-end hidden lg:flex">
                <Button className="px-32 text-[16px]" size="large" type="primary" >
                    <Link to={`/booking/clinic/${clinic?.id}`}>
                        Đặt khám ngay
                    </Link>
                </Button>
            </div>
            <div className="lg:hidden fixed left-0 bottom-0 right-0 bg-white shadow p-4">
                <Button className="text-[16px] w-full" size="large" type="primary" >
                    <Link to={`/booking/clinic/${clinic?.id}`}>
                        Đặt khám ngay
                    </Link>
                </Button>
            </div>
            {!!clinic?.introductionHtml && <div className="flex flex-col items-start gap-y-4">
                <span className="text-xl font-bold">Giới thiệu</span>
                <p className="text-left prose w-full" dangerouslySetInnerHTML={{ __html: clinic?.introductionHtml! }}>
                </p>
            </div>}

            {(clinic?.specializations.length ?? 0) > 0 && <div className="flex flex-col items-start gap-y-4">
                <span id="service" className="text-xl font-bold">Dịch vụ</span>
                <div className="grid grid-cols-2 gap-4">
                    {clinic?.specializations.map(spec => <ServiceTag prefixUrl="/booking/clinic" key={spec.id} speciality={spec} />)}
                </div>
            </div>}

        </div>
    </div>
};

export default ClinicDetail;
