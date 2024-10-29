import { Button, Divider, Form, FormProps, Input, message } from "antd";
import { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth-service";

export interface SignUpRequest {
    username?: string;
    password?: string;
    email?: string;
    remember?: string;
    fullName?: string;
};

interface SignUpRequestForm extends SignUpRequest {
    confirmPassword?: string;
}

const SignUp: FC = () => {
    const [form] = Form.useForm<SignUpRequestForm>();
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const onSubmit: FormProps<SignUpRequestForm>['onFinish'] = async (values) => {
        setLoading(true)
        const response = await authService.signUp(values);
        setLoading(false)
        if(response.success) {
            message.success(response.message)
            form.resetFields()
            navigate('/auth/sign-in-patient');
        } else {
            message.error(response.message)
        }
    };

    return <div className="bg-white py-8 px-6 rounded-lg shadow">
        <p className="mb-6 text-2xl font-bold">ĐĂNG KÍ TÀI KHOẢN</p>
        <Form
            name="basic"
            className="text-left"
            onFinish={onSubmit}
            form={form}
            layout="vertical"
        >
             <Form.Item<SignUpRequestForm>
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
            >
                <Input size="large" placeholder="Họ và tên" />
            </Form.Item>

            <Form.Item<SignUpRequestForm>
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Vui lòng nhập username!' }]}
            >
                <Input size="large" placeholder="Username" />
            </Form.Item>

            <Form.Item<SignUpRequestForm>
                label="Địa chỉ email"
                name="email"
                rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: "email", message: 'Email không hợp lệ!' },
                ]}
            >
                <Input size="large" placeholder="Địa chỉ email" />
            </Form.Item>

           
            <Form.Item<SignUpRequestForm>
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
                <Input.Password size="large" />
            </Form.Item>

            <Form.Item<SignUpRequestForm>
                label="Nhập lại mật khẩu"
                name="confirmPassword"
                rules={[
                    {
                        validator: (_, value) =>
                            form.getFieldValue('password') === value ? Promise.resolve() : Promise.reject('Mật khẩu không khớp')

                    }
                ]}
            >
                <Input.Password size="large" />
            </Form.Item>

            <Form.Item>
                <Button loading={loading} disabled={loading} type="primary" size="large" className="w-full" htmlType="submit">
                    Đăng nhập
                </Button>
            </Form.Item>
        </Form>
        <Divider />
        <div className="flex gap-x-2 text-[15px] justify-center">
            <p>Chưa có tài khoản</p>
            <Link className="text-primary" to='/auth/sign-up'>Đăng kí ngay</Link>
        </div>
    </div>
};

export default SignUp;
