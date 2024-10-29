import { Button, Form, FormProps, Input, Select, message } from "antd";
import { FC, useEffect, useState } from "react";
import Loading from "../shared/Loading";
import managerService from "../../services/manager-service";
import { ClinicResource } from "../../resources";
import clinicService from "../../services/clinic-service";

export interface ManagerRequest {
    fullName: string;
    email: string;
    clinicId: string;
}

interface ManagerRequestForm extends ManagerRequest {
    confirmPassword: string;
}

type CreateManagerModalProps = {
    onSuccess: () => void
}

const CreateManagerModal: FC<CreateManagerModalProps> = ({
    onSuccess
}) => {

    const [form] = Form.useForm<ManagerRequestForm>();
    const [loading, setLoading] = useState(false)
    const [clinics, setClinics] = useState<ClinicResource[]>([])

    useEffect(() => {
        const fetchClinics = async () => {
            const response = await clinicService.getAllClinics();
            if (response.success) {
                setClinics(response.data)
            }
        }

        fetchClinics();
    }, [])

    const onFinish: FormProps<ManagerRequestForm>['onFinish'] = async (values) => {

        setLoading(true)
        const response = await managerService.createManager(values);
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
            <Form.Item<ManagerRequestForm>
                label='Phòng khám'
                name='clinicId'
                rules={[
                    { 
                    required: true, message: 'Chưa chọn phòng khám!', 
                      validator: (_, value) => value && value !== 0 ? Promise.resolve() : Promise.reject('Chưa chọn phòng khám!') 
                    },
                ]}
            >
                <Select
                    size="large"
                    defaultValue={0}
                >
                    <Select.Option value={0}>Chọn phòng khám</Select.Option>
                    {clinics.map(clinic => <Select.Option key={clinic.id} value={clinic.id}>
                        {clinic.name}
                    </Select.Option>)}
                </Select>
            </Form.Item>
            <Form.Item<ManagerRequestForm>
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: 'Họ và tên không được để trống!' }]}
            >
                <Input size="large" placeholder="Họ và tên ..." />
            </Form.Item>

            <Form.Item<ManagerRequestForm>
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

export default CreateManagerModal;
