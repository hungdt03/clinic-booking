import { FC } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layouts/Header";
import Footer from "../../components/shared/Footer";
import { Button } from "antd";

const NotFoundPage: FC = () => {
    return <div className="flex flex-col h-screen justify-between">
        <Header />
        <div className="flex justify-center items-center flex-col gap-y-4">
            <span className="text-[180px] font-bold">404</span>
            <div className="flex flex-col gap-y-3">
                <span className="text-3xl font-bold">Không tìm thấy nội dung</span>
                <p className="text-lg">Nội dung bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>

                <div>
                    <Button type="primary" shape="round">
                        <Link to='/'>
                            Về trang chủ
                        </Link>
                    </Button>
                </div>

            </div>
        </div>
        <Footer />
    </div>
};

export default NotFoundPage;
