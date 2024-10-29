import { Button, Form, FormProps, Image, Input, UploadFile } from "antd";
import { FC, useState } from "react";
import { InboxOutlined } from '@ant-design/icons';
import type { GetProp, UploadProps } from 'antd';
import { message, Upload } from 'antd';
import { getBase64 } from "../../utils/file";
import Loading from "../shared/Loading";
import specialityService from "../../services/speciality-service";

const { Dragger } = Upload;
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export type SpecialityRequest = {
    name: string;
    description: string;
    thumbnail: UploadFile
}

type CreateSpecialityProps = {
    onSuccess: () => void
}

const CreateSpeciality: FC<CreateSpecialityProps> = ({
    onSuccess
}) => {

    const [form] = Form.useForm<SpecialityRequest>();
    const [preview, setPreview] = useState('')
    const [loading, setLoading] = useState(false)

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        onChange: async (info) => {
            const previewUrl = await getBase64(info.fileList[0].originFileObj as FileType)
            setPreview(previewUrl)
            form.setFieldValue('thumbnail',info.fileList[0]);
        },
        showUploadList: false,
        maxCount: 1,
        beforeUpload: (_) => false
    };

    const onFinish: FormProps<SpecialityRequest>['onFinish'] = async (values) => {
        const formData = new FormData();
        formData.append('name', values.name)
        formData.append('description', values.description)

        if (values.thumbnail.originFileObj) {
            formData.append('thumbnail', values.thumbnail.originFileObj, values.thumbnail.name);
        }

        setLoading(true)
        const response = await specialityService.createSpeciality(formData);
        setLoading(false)

        if(response.success) {
            message.success(response.message)
            form.resetFields()
            setPreview('')
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
            <Form.Item<SpecialityRequest>
                label="Tên chuyên khoa"
                name="name"
                rules={[{ required: true, message: 'Tên chuyên khoa không được để trống!' }]}
            >
                <Input size="large" placeholder="Tên chuyên khoa ..." />
            </Form.Item>

            <Form.Item<SpecialityRequest>
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: 'Mô tả không được để trống!' }]}
            >
                <Input.TextArea size="large" placeholder="Mô tả ..." />
            </Form.Item>

            <Form.Item<SpecialityRequest>
                label="Ảnh đại diện"
                name="thumbnail"
            >
                <div className="relative w-full h-[200px]">
                    {preview && <Image width='100%' height='100%' preview={false} className="object-cover rounded-lg absolute inset-0 z-10" src={preview} />}
                    <div className={`absolute inset-0 z-50 ${preview && 'hover:!text-white'}`}>
                        <Dragger className={`${preview && 'hover:!text-white'}`} {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className='text-black text-[16px]'>Ấn hoặc kéo/thả ảnh vào khu vực này</p>
                            <p className='text-gray-400'>
                                Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                                banned files.
                            </p>
                        </Dragger>
                    </div>
                </div>

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

export default CreateSpeciality;
