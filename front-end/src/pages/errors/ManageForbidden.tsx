import { Button } from "antd";
import { FC } from "react";
import { Link } from "react-router-dom";

const ManageForbidden: FC = () => {
    return <div className="flex justify-center items-center flex-col gap-y-4 h-full p-24">
        <span className="text-[180px] font-bold">403</span>
        <div className="flex flex-col gap-y-3">
            <span className="text-3xl font-bold">Bạn không có quyền truy cập vào tài nguyên này</span>
            <p className="text-[15px]">Vui lòng đăng nhập bằng tài khoản phù hợp để tiếp tục truy cập.</p>

            <div>
                <Button type="primary" shape="round">
                    <Link to='/admin'>
                        Về trang chủ
                    </Link>
                </Button>
            </div>

        </div>
    </div>
};

export default ManageForbidden;
