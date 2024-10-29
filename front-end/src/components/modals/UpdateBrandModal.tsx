import { Button, Form, FormProps, Input, message } from "antd";
import { FC, useEffect, useState } from "react";
import Loading from "../shared/Loading";
import brandService from "../../services/brand-service";
import { BrandRequest } from "./CreateBrandModal";
import { BrandResource } from "../../resources";

type UpdateBrandModalProps = {
    onSuccess: () => void;
    brand: BrandResource
}

const UpdateBrandModal: FC<UpdateBrandModalProps> = ({
    onSuccess,
    brand
}) => {

    const [form] = Form.useForm<BrandRequest>();
    const [loading, setLoading] = useState(false)

    const onFinish: FormProps<BrandRequest>['onFinish'] = async (values) => {

        setLoading(true)
        const response = await brandService.updateBrand(brand.id, values);
        setLoading(false)

        if (response.success) {
            message.success(response.message)
            form.resetFields()
            onSuccess()
        } else {
            message.error(response.message)
        }

    };

    useEffect(() => {
        if (brand) {
            form.setFieldsValue({
                name: brand.name,
                address: brand.address
            });
        }
    }, [brand]);

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

export default UpdateBrandModal;
