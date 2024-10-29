import { Button, Form, FormProps, Input, message } from "antd";
import { FC, useEffect } from "react";
import authService from "../../services/auth-service";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { selectAuth, signIn } from "../../features/slices/auth-slice";
import { useNavigate } from "react-router-dom";

type ChangePasswordRequest = {
    password: string;
    confirmPassword: string;
};

const ChangePassword: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector(selectAuth)
    const navigate = useNavigate()

    const onFinish: FormProps<ChangePasswordRequest>['onFinish'] = async (values) => {
        const response = await authService.changePassword(values.password);
        if (response.success) {
            dispatch(signIn(response.data));
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    };

    useEffect(() => {
        if (user?.isPasswordChanged) {
            switch (user.role) {
                case 'DOCTOR_OWNER':
                    navigate('/d-owner');
                    return;
                case 'DOCTOR_EMPLOYEE':
                    navigate('/d-employee');
                    return;
                case 'MANAGER':
                    navigate('/manager');
                    return;
            }
        }
    }, [user])

    return <div className="flex flex-col gap-y-8 items-center justify-center py-8">
        <div className="p-4 rounded-md bg-orange-50 border-orange-600 border-[1px] text-orange-600">
            XIN CHÀO {user?.fullName}, BẠN CẦN THAY ĐỔI MẬT KHẨU ĐỂ TRUY CẬP TRANG QUẢN LÍ
        </div>
        <div className="p-6 border-[1px] border-gray-100 rounded-lg bg-white min-w-[500px]">
            <p className="font-bold text-xl my-4 text-primary">THAY ĐỔI MẬT KHẨU</p>
            <Form
                name="basic"
                onFinish={onFinish}
                layout="vertical"
                className="text-left"
            >
                <Form.Item<ChangePasswordRequest>
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password size="large" placeholder="Nhập mật khẩu" />
                </Form.Item>

                <Form.Item<ChangePasswordRequest>
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    rules={[{ required: true, message: 'Vui lòng nhập xác nhận mật khẩu!' }]}
                >
                    <Input.Password size="large" placeholder="Nhập lại mật khẩu" />
                </Form.Item>

                <Form.Item >
                    <Button size="large" className="w-full mt-2" type="primary" htmlType="submit">
                        Lưu lại
                    </Button>
                </Form.Item>
            </Form>
        </div>
    </div>
};

export default ChangePassword;
