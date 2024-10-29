import { Button, Form, FormProps, Input } from "antd";
import { FC, useState } from "react";
import { message } from 'antd';
import Loading from "../shared/Loading";
import brandService from "../../services/brand-service";

export interface BrandRequest {
    name: string;
    address: string;
}

type CreateBrandModalProps = {
    onSuccess: () => void
}

const CreateBrandModal: FC<CreateBrandModalProps> = ({
    onSuccess
}) => {

    const [form] = Form.useForm<BrandRequest>();
    const [loading, setLoading] = useState(false)

    const onFinish: FormProps<BrandRequest>['onFinish'] = async (values) => {

        setLoading(true)
        const response = await brandService.createBrand(values);
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
            <Form.Item<BrandRequest>
                label='Tên chi nhánh'
                name='name'
                rules={[{ required: true, message: 'Tên chi nhánh không được để trống!' }]}
            >
               <Input size="large" placeholder="Tên chi nhánh ..." />
            </Form.Item>
            <Form.Item<BrandRequest>
                label="Địa chỉ"
                name="address"
                rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}
            >
                <Input size="large" placeholder="Địa chỉ ..." />
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

export default CreateBrandModal;
