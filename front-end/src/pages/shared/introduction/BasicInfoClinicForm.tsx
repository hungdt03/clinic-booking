import { Button, Form, FormProps, Input, UploadFile, message } from "antd";
import { FC, useEffect, useState } from "react";
import { ClinicResource } from "../../../resources";
import UploadSingleFile from "../../../components/upload/UploadSingleFile";
import UploadMultipleFile from "../../../components/upload/UploadMultipleFile";
import clinicService from "../../../services/clinic-service";

const { TextArea } = Input;

export type BasicInfoClinicRequest = {
    name: string;
    address: string;
    thumbnail: UploadFile[];
    images: UploadFile[];
    removeImages: string[];
    isRemoveThumbnail: boolean;
}

function createFormData(request: BasicInfoClinicRequest): FormData {
    const formData = new FormData();

    // Append string and date fields
    formData.append('name', request.name);
    formData.append('address', request.address);
    formData.append('isRemoveThumbnail', String(request.isRemoveThumbnail));

    if (request.thumbnail && request.thumbnail.length > 0) {
        request.thumbnail.filter(t => t.name).forEach(file => {
            if (file.originFileObj) {
                formData.append('thumbnail', file.originFileObj, file.name);
            }
        });
    }

    if (request.removeImages && request.removeImages.length > 0) {
        request.removeImages.forEach(img => {
            formData.append('removeImages', img);
        });
    }

    if (request.images && request.images.length > 0) {
        request.images.filter(t => t.name).forEach((image) => {
            if (image.originFileObj) {
                formData.append(`images`, image.originFileObj, image.name);
            }
        });
    }

    return formData;
}

type BasicInfoClinicFormProps = {
    clinic: ClinicResource;
    onRefresh: () => void
}

const BasicInfoClinicForm: FC<BasicInfoClinicFormProps> = ({
    clinic,
    onRefresh
}) => {
    const [form] = Form.useForm<BasicInfoClinicRequest>();
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(true)

    const onFinish: FormProps<BasicInfoClinicRequest>['onFinish'] = async (values) => {
        console.log(values)
        values = {
            ...values,
            removeImages: form.getFieldValue('removeImages'),
            isRemoveThumbnail: form.getFieldValue('isRemoveThumbnail'),
        }

        const formData = createFormData(values);

        setLoading(true)
        const response = await clinicService.updateBasicInformation(formData);
        setLoading(false)

        if(response.success) {
            message.success(response.message)
            form.resetFields();
            form.setFieldValue('removeImages', [])
            onRefresh()
        } else {
            message.error(response.message)
        }

    };

    useEffect(() => {
        form.setFieldsValue({
            name: clinic.name,
            address: clinic.address,
            removeImages: [],
            isRemoveThumbnail: false,
        })
    }, [clinic])

    return <Form
        form={form}
        name="basic"
        onFinish={onFinish}
        initialValues={{
            name: clinic.name,
            address: clinic.address,
            removeImages: [],
            isRemoveThumbnail: false,
        }}
        onValuesChange={() => setDisabled(false)}
        layout="vertical"
        className="flex flex-col gap-y-3"
        autoComplete="off"
    >
        <div className="flex flex-col items-start gap-y-2">
            <span className="text-[17px] font-semibold">Thông tin cơ bản</span>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 w-full">
                <div className="col-span-1">
                    <Form.Item<BasicInfoClinicRequest>
                        label='Ảnh đại diện'
                        name='thumbnail'
                    >
                        <div className="w-full flex justify-center">
                            <UploadSingleFile
                                valueUrl={clinic.thumbnailUrl}
                                onChange={(fileList: UploadFile[]) => {
                                    form.setFieldsValue({
                                        'thumbnail': fileList,
                                        'isRemoveThumbnail': true
                                    })
                                }}
                            />
                        </div>

                    </Form.Item>


                    <Form.Item<BasicInfoClinicRequest>
                        label='Các ảnh khác'
                        name='images'
                    >
                        <UploadMultipleFile
                            onRemoveFileUrl={(url: string | undefined) => {
                                const currentRemoveImages = form.getFieldValue('removeImages') || [];
                                form.setFieldValue('removeImages', [...currentRemoveImages, url]);
                            }}
                            valueUrls={clinic.images}
                            onChange={(fileList: UploadFile[]) => form.setFieldValue('images', fileList)}
                        />
                    </Form.Item>
                </div>
                <div className="col-span-1 flex flex-col gap-y-4">
                    <Form.Item<BasicInfoClinicRequest>
                        label='Tên phòng khám'
                        style={{
                            margin: 0
                        }}
                        name='name'
                        rules={[{ required: true, message: 'Tên phòng khám không được để trống!' }]}
                    >
                        <Input size="large" placeholder="Tên phòng khám ..." />
                    </Form.Item>

                    <Form.Item<BasicInfoClinicRequest>
                        label="Địa chỉ"
                        name="address"
                        style={{
                            margin: 0
                        }}
                        rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}
                    >
                        <TextArea rows={4} placeholder="Địa chỉ..." />
                    </Form.Item>


                </div>
            </div>
            <div className="flex w-full justify-end">
                <Form.Item>
                    <Button loading={loading} disabled={disabled || loading} className="mt-4" type="primary" htmlType="submit">
                        Lưu lại
                    </Button>
                </Form.Item>
            </div>
        </div>
    </Form>
};

export default BasicInfoClinicForm;
