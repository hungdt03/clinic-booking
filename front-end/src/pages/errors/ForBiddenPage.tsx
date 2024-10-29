import { FC } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layouts/Header";
import Footer from "../../components/shared/Footer";
import { Button } from "antd";

const ForbbidenPage: FC = () => {
    return <div className="flex flex-col h-screen justify-between">
        <Header />
        <div className="flex justify-center items-center flex-col gap-y-4">
            <span className="text-[180px] font-bold">403</span>
            <div className="flex flex-col gap-y-3">
                <span className="text-3xl font-bold">Bạn không có quyền truy cập vào tài nguyên này</span>
                <p className="text-lg">Vui lòng đăng nhập để tiếp tục truy cập.</p>

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

export default ForbbidenPage;
