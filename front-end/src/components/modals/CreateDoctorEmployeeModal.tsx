import { Button, Form, FormProps, Input, Select } from "antd";
import { FC, useEffect, useState } from "react";
import { message } from 'antd';
import Loading from "../shared/Loading";
import doctorService from "../../services/doctor-service";
import { BrandResource } from "../../resources";
import brandService from "../../services/brand-service";

export interface DoctorEmployeeRequest {
    fullName: string;
    email: string;
    brandId: number;
}

interface DoctorEmployeeRequestForm extends DoctorEmployeeRequest {
    confirmPassword: string;
}

type CreateDoctorEmployeeModalProps = {
    onSuccess: () => void
}

const CreateDoctorEmployeeModal: FC<CreateDoctorEmployeeModalProps> = ({
    onSuccess
}) => {

    const [form] = Form.useForm<DoctorEmployeeRequestForm>();
    const [loading, setLoading] = useState(false)
    const [brands, setBrands] = useState<BrandResource[]>([])

    const fetchBrands = async () => {
        const response = await brandService.getAllBrands();
        if (response.success) {
            setBrands(response.data)
        }
    }

    useEffect(() => {
        fetchBrands()
    }, [])

    const onFinish: FormProps<DoctorEmployeeRequestForm>['onFinish'] = async (values) => {

        setLoading(true)
        const response = await doctorService.createDoctorEmployee(values);
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
            {brands.length > 1 && <Form.Item<DoctorEmployeeRequestForm>
                label="Chi nhánh làm việc"
                name="brandId"
            >
                <Select size="large" defaultValue={0}>
                    <Select.Option value={0}>Chọn chi nhánh làm việc</Select.Option>
                    {brands.map(brand => <Select.Option key={brand.id} value={brand.id}>
                        {brand.name}
                    </Select.Option>)}
                </Select>
            </Form.Item>}

            <Form.Item<DoctorEmployeeRequestForm>
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: 'Họ và tên không được để trống!' }]}
            >
                <Input size="large" placeholder="Họ và tên ..." />
            </Form.Item>


            <Form.Item<DoctorEmployeeRequestForm>
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

export default CreateDoctorEmployeeModal;
