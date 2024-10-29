import { Button, Form, FormProps, Input, InputNumber, Select } from "antd";
import { FC, useEffect, useState } from "react";
import { message } from 'antd';
import Loading from "../shared/Loading";
import serviceService from "../../services/service-service";
import { ServiceTypeResource } from "../../resources";
import serviceTypeService from "../../services/service-type-service";

export interface ServiceRequest {
    name: string;
    fee: number;
    serviceTypeId: number;
}

type CreateServiceModalProps = {
    onSuccess: () => void
}

const CreateServiceModal: FC<CreateServiceModalProps> = ({
    onSuccess
}) => {

    const [form] = Form.useForm<ServiceRequest>();
    const [serviceTypes, setServiceTypes] = useState<ServiceTypeResource[]>([])
    const [isShowFee, setIsShowFee] = useState(true)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchServiceTypes = async () => {
            const response = await serviceTypeService.getAllServiceTypes();
            if (response.success) {
                setServiceTypes(response.data)
            }
        }

        fetchServiceTypes()
    }, [])

    const onFinish: FormProps<ServiceRequest>['onFinish'] = async (values) => {
        setLoading(true)
        const response = await serviceService.createService(values);
        setLoading(false)

        if (response.success) {
            message.success(response.message)
            form.resetFields()
            onSuccess()
        } else {
            message.success(response.message)
        }

    };

    const handleServiceTypeChange = (value: number) => {
        const findServiceType = serviceTypes.find(s => s.id === value)

        if(findServiceType) {
            setIsShowFee(findServiceType.isIncludeFee)
            form.setFieldValue('serviceTypeId', value)
        }
    }

    return <div className="px-4 pt-4 max-h-[500px] overflow-y-auto custom-scrollbar scrollbar-w-2">
        {loading && <Loading />}
        <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            layout="vertical"
            autoComplete="off"
        >
            <Form.Item<ServiceRequest>
                label='Loại dịch vụ'
                name='serviceTypeId'
                rules={[{ required: true, message: 'Loại dịch vụ không được để trống!' }]}
            >
                <Select onChange={handleServiceTypeChange} defaultValue={0} size="large">
                    <Select.Option value={0} key={0}>
                        Chọn loại dịch vụ
                    </Select.Option>
                    {serviceTypes.map(serviceType => <Select.Option value={serviceType.id} key={serviceType.id}>
                        {serviceType.name}
                    </Select.Option>)}
                </Select>
            </Form.Item>
            <Form.Item<ServiceRequest>
                label='Tên dịch vụ'
                name='name'
                rules={[{ required: true, message: 'Tên dịch vụ không được để trống!' }]}
            >
                <Input size="large" placeholder="Tên dịch vụ ..." />
            </Form.Item>
            {isShowFee && <Form.Item<ServiceRequest>
                label="Chi phí"
            >
                <InputNumber size="large" min={1} defaultValue={1} />
            </Form.Item>}


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

export default CreateServiceModal;
