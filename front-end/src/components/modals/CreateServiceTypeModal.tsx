import { Button, Form, FormProps, Input, Radio } from "antd";
import { FC, useState } from "react";
import { message } from 'antd';
import Loading from "../shared/Loading";
import serviceTypeService from "../../services/service-type-service";

export interface ServiceTypeRequest {
    name: string;
    subName: string;
    isIncludeFee: boolean;
}

type CreateServiceTypeModalProps = {
    onSuccess: () => void
}

const CreateServiceTypeModal: FC<CreateServiceTypeModalProps> = ({
    onSuccess
}) => {

    const [form] = Form.useForm<ServiceTypeRequest>();
    const [loading, setLoading] = useState(false)

    const onFinish: FormProps<ServiceTypeRequest>['onFinish'] = async (values) => {

        setLoading(true)
        const response = await serviceTypeService.createServiceType(values);
        setLoading(false)

        if (response.success) {
            message.success(response.message)
            form.resetFields()
            onSuccess()
        } else {
            message.success(response.message)
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
            <Form.Item<ServiceTypeRequest>
                label='Tên loại dịch vụ'
                name='name'
                rules={[{ required: true, message: 'Tên loại dịch vụ không được để trống!' }]}
            >
                <Input size="large" placeholder="Tên loại dịch vụ ..." />
            </Form.Item>
            <Form.Item<ServiceTypeRequest>
                label="Tên phụ"
                name="subName"
                rules={[{ required: true, message: 'Tên phụ không được để trống!' }]}
            >
                <Input size="large" placeholder="Tên phụ ..." />
            </Form.Item>

            <Form.Item<ServiceTypeRequest>
                label="Loại"
                name="isIncludeFee"
                rules={[{ required: true, message: 'Vui lòng chọn loại hiển thị!' }]}
            >
                <Radio.Group value={false}>
                    <Radio value={true}>Có hiển thị chi phí</Radio>
                    <Radio value={false}>Không hiển thị chi phí</Radio>
                </Radio.Group>
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

export default CreateServiceTypeModal;
