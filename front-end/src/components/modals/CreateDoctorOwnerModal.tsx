import { Button, Form, FormProps, Input } from "antd";
import { FC, useState } from "react";
import { message } from 'antd';
import Loading from "../shared/Loading";
import doctorService from "../../services/doctor-service";

export interface DoctorRequest  {
    fullName: string;
    email: string;
}

interface DoctorRequestForm extends DoctorRequest {
    confirmPassword: string;
}

type CreateDoctorOwnerProps = {
    onSuccess: () => void
}

const CreateDoctorOwner: FC<CreateDoctorOwnerProps> = ({
    onSuccess
}) => {

    const [form] = Form.useForm<DoctorRequestForm>();
    const [loading, setLoading] = useState(false)

    const onFinish: FormProps<DoctorRequestForm>['onFinish'] = async (values) => {

        setLoading(true)
        const response = await doctorService.createDoctorOwner(values);
        setLoading(false)

        if (response.success) {
            message.success(response.message)
            form.resetFields()
            onSuccess()
        } else {
            message.error(response.message)
        }

    };

    return <div className="px-4 pt-4 max-h-[500px] overflow-y-auto custom-scrollbar scrollbar-w-2">
        {loading && <Loading />}
        <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            layout="vertical"
            autoComplete="off"
        >
            <Form.Item<DoctorRequestForm>
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: 'Họ và tên không được để trống!' }]}
            >
                <Input size="large" placeholder="Họ và tên ..." />
            </Form.Item>

         
            <Form.Item<DoctorRequestForm>
                label="Email"
                name="email"
                rules={[
                    { required: true, message: 'Email không được để trống!' },
                    { type: 'email', message: 'Email không đúng định dạng' }
                ]}
            >
                <Input size="large" placeholder="Email ..." />
            </Form.Item>

            <div className="flex justify-end">
                <Form.Item>
                    <Button className="mt-4" type="primary" htmlType="submit">
                        Lưu lại
                    </Button>
                </Form.Item>
            </div>
        </Form>
    </div>
};

export default CreateDoctorOwner;
