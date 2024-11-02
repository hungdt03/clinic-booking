import { FC } from "react";

const Footer: FC = () => {
    return <div className="bg-gray-100 py-6">
        <div className="w-full max-w-screen-lg text-center mx-auto px-4 lg:px-0">
            <p className="text-sm">Các thông tin trên YouMed chỉ dành cho mục đích tham khảo, tra cứu và không thay thế cho việc chẩn đoán hoặc điều trị y khoa.
                Cần tuyệt đối tuân theo hướng dẫn của Bác sĩ và Nhân viên y tế.
                Copyright © 2018 - 2024 Công ty TNHH YouMed Việt Nam.
            </p>
        </div>
    </div>
};

export default Footer;
