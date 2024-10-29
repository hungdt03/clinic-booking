import { Button, Form, FormProps, Input } from "antd";
import { FC } from "react";

export type SignInRequest = {
    username: string;
    password: string;
};

type SignInComponentProps = {
    onSubmit: (values: SignInRequest) => void
}

const SignInComponent: FC<SignInComponentProps> = ({
    onSubmit
}) => {
    const handleSubmit: FormProps<SignInRequest>['onFinish'] = (values) => {
        onSubmit(values)
    };

    return  <Form
            name="basic"
            className="text-left flex flex-col gap-y-2"
            onFinish={handleSubmit}
            layout="vertical"
        >
            <Form.Item<SignInRequest>
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Vui lòng nhập username!' }]}
            >
                <Input placeholder="Nhập username..." size="large" />
            </Form.Item>

            <Form.Item<SignInRequest>
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
                <Input.Password placeholder="Nhập mật khẩu..." size="large" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" size="large" className="w-full" htmlType="submit">
                    Đăng nhập
                </Button>
            </Form.Item>
        </Form>
        
};

export default SignInComponent;
