import { Breadcrumb, Image } from "antd";
import { FC } from "react";
import images from "../assets";
import { Link } from "react-router-dom";

const DoctorProfile: FC = () => {
    return <div className="w-[1200px] mx-auto">
        <Breadcrumb
            items={[
                {
                    title: <Link to="/">Trang chủ</Link>,
                },
                {
                    title: 'Bác sĩ',
                },
            ]}
            className="my-6 text-[17px]"
        />

        <div className="bg-white p-8 rounded-lg flex flex-col gap-y-12">
            <div className="flex items-center gap-x-8">
                <Image width={200} preview={false} className="rounded-full" src={images.doctor} />
                <div className="flex flex-col gap-y-4">
                    <div>
                        <p className="text-2xl font-bold">Bác sĩ chuyên khoa 2 Lê Thị Minh Hồng</p>
                        <div className="flex items-center gap-x-2">
                            <div className="text-primary font-semibold flex items-center">
                                <img width={20} src={images.tick} />
                                <span>Bác sĩ</span>
                            </div> |
                            <span><b>24</b> năm kinh nghiệm</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-y-1 items-start">
                        <div className="flex gap-x-3 items-center">
                            <span>Chuyên khoa</span>
                            <div>
                                <span className="text-primary font-semibold">Nhi khoa</span>
                            </div>
                        </div>
                        <div className="flex gap-x-3 items-center">
                            <span>Chức vụ</span>
                            <span className="font-semibold">Phó Giám Đốc Bệnh Viện Nhi Đồng 2</span>
                        </div>
                        <div className="flex gap-x-3 items-center">
                            <span>Nơi công tác</span>
                            <span className="font-semibold">Bệnh viện Nhi Đồng 2</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-start">
                <section className="flex flex-col items-start text-left">
                    <span className="text-xl font-semibold my-3 block">Giới thiệu</span>
                    <div>
                        <p>Bác sĩ Chuyên khoa II Lê Thị Minh Hồng hiện đang là Phó Giám đốc Bệnh viện Nhi Đồng 2. Bác sĩ trực tiếp khám bệnh theo yêu cầu chất lượng cao tại Bệnh Viện Nhi Đồng 2 và phòng khám Nhi khoa (250 Nguyễn Xí, Phường 13, Bình Thạnh, TP.HCM).</p>
                        <b>Các dịch vụ của phòng khám Nhi khoa Bác sĩ Lê Thị Minh Hồng:</b>
                        <ul>
                            <li>Khám và điều trị các bệnh lý Nhi khoa: tiêu hóa, hô hấp, thận, nhiễm, dị ứng, tai mũi họng, sơ sinh,…</li>
                            <li>Khám và điều trị các bệnh lý Nhi khoa: tiêu hóa, hô hấp, thận, nhiễm, dị ứng, tai mũi họng, sơ sinh,…</li>
                            <li>Khám và điều trị các bệnh lý Nhi khoa: tiêu hóa, hô hấp, thận, nhiễm, dị ứng, tai mũi họng, sơ sinh,…</li>
                            <li>Khám và điều trị các bệnh lý Nhi khoa: tiêu hóa, hô hấp, thận, nhiễm, dị ứng, tai mũi họng, sơ sinh,…</li>
                            <li>Khám và điều trị các bệnh lý Nhi khoa: tiêu hóa, hô hấp, thận, nhiễm, dị ứng, tai mũi họng, sơ sinh,…</li>
                            <li>Khám và điều trị các bệnh lý Nhi khoa: tiêu hóa, hô hấp, thận, nhiễm, dị ứng, tai mũi họng, sơ sinh,…</li>
                        </ul>
                    </div>
                </section>
                <section className="flex flex-col items-start text-left">
                    <span className="text-xl font-semibold my-3 block">Qúa trình đào tạo</span>
                    <div>
                        <ul>
                            <li>Tốt nghiệp Đại học Y khoa Phạm Ngọc Thạch (TTĐT & BDCBYT).</li>
                            <li>2001: Tốt nghiệp Chuyên Khoa 1 tại Đại học Y Dược TP.HCM.</li>
                            <li>Tốt nghiệp Chuyên Khoa 2 tại Đại học Y Khoa Phạm Ngọc Thạch.</li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    </div>
};

export default DoctorProfile;
