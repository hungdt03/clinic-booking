import { Button, DatePicker, Form, FormProps, Input, InputNumber, UploadFile, message } from "antd";
import { FC, useEffect, useState } from "react";
import UploadSingleFile from "../../../components/upload/UploadSingleFile";
import UploadMultipleFile from "../../../components/upload/UploadMultipleFile";
import { DoctorOwnerResource } from "../../../resources";
import dayjs, { Dayjs } from "dayjs";
import doctorService from "../../../services/doctor-service";


export type BasicInformationRequest = {
    name: string;
    phoneNumber: string;
    dateOfBirth: Dayjs;
    academicTitle: string;
    degree: string;
    currentWorkPlace: string;
    position: string;
    experienceYears: number;
    address: string;
    thumbnail: UploadFile[];
    images: UploadFile[];
    removeImages: string[];
    isRemoveThumbnail: boolean;
}

function createFormData(request: BasicInformationRequest): FormData {
    const formData = new FormData();

    // Append string and date fields
    formData.append('name', request.name);
    formData.append('phoneNumber', request.phoneNumber);
    formData.append('dateOfBirth', request.dateOfBirth.add(1, 'day').toISOString());
    formData.append('academicTitle', request.academicTitle);
    formData.append('degree', request.degree);
    formData.append('currentWorkPlace', request.currentWorkPlace);
    formData.append('position', request.position);
    formData.append('experienceYears', request.experienceYears.toString());
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

type BasicInformationFormProps = {
    doctor: DoctorOwnerResource;
    onRefresh: () => void
}

const BasicInformationForm: FC<BasicInformationFormProps> = ({
    doctor,
    onRefresh
}) => {
    const [form] = Form.useForm<BasicInformationRequest>();
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(true)

    const onFinish: FormProps<BasicInformationRequest>['onFinish'] = async (values) => {
        values = {
            ...values,
            removeImages: form.getFieldValue('removeImages'),
            isRemoveThumbnail: form.getFieldValue('isRemoveThumbnail'),
        }

        const formData = createFormData(values);
        setLoading(true)
        const response = await doctorService.updateBasicInformation(formData);
        setLoading(false)
        if (response.success) {
            message.success(response.message);
            onRefresh()
            form.resetFields()
            form.setFieldValue('removeImages', [])
        } else {
            message.error(response.message)
        }
    };

    useEffect(() => {
        form.setFieldsValue({
            name: doctor.user.fullName,
            address: doctor.details.address,
            academicTitle: doctor.details.academicTitle,
            degree: doctor.details.degree,
            currentWorkPlace: doctor.details.currentWorkPlace,
            position: doctor.details.position,
            experienceYears: doctor.details.experienceYears,
            phoneNumber: doctor.user.phoneNumber,
            dateOfBirth: dayjs(doctor.user.dateOfBirth),
            removeImages: [],
            isRemoveThumbnail: false,
        })
    }, [doctor])

    return <Form
        form={form}
        name="basic"
        onFinish={onFinish}
        initialValues={{
            name: doctor.user.fullName,
            address: doctor.details.address,
            academicTitle: doctor.details.academicTitle,
            degree: doctor.details.degree,
            currentWorkPlace: doctor.details.currentWorkPlace,
            position: doctor.details.position,
            experienceYears: doctor.details.experienceYears,
            phoneNumber: doctor.user.phoneNumber,
            dateOfBirth: dayjs(doctor.user.dateOfBirth),
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
            <div className="grid grid-cols-3 gap-x-8 gap-y-1 w-full">
                <div className="col-span-1">
                    <Form.Item<BasicInformationRequest>
                        label='Ảnh đại diện'
                        name='thumbnail'
                    >
                        <UploadSingleFile
                            valueUrl={doctor.user.thumbnail}
                            onChange={(fileList: UploadFile[]) => {
                                form.setFieldsValue({
                                    'thumbnail': fileList,
                                    'isRemoveThumbnail': true
                                })
                            }}
                        />

                    </Form.Item>


                    <Form.Item<BasicInformationRequest>
                        label='Các ảnh khác'
                        name='images'
                    >
                        <UploadMultipleFile
                            onRemoveFileUrl={(url: string | undefined) => {
                                const currentRemoveImages = form.getFieldValue('removeImages') || [];
                                form.setFieldValue('removeImages', [...currentRemoveImages, url]);
                            }}
                            valueUrls={doctor.images}
                            onChange={(fileList: UploadFile[]) => form.setFieldValue('images', fileList)}
                        />
                    </Form.Item>
                </div>
                <div className="col-span-2 grid grid-cols-3 gap-x-8">
                    <Form.Item<BasicInformationRequest>
                        label='Họ và tên'
                        style={{
                            margin: 0
                        }}
                        name='name'
                        rules={[{ required: true, message: 'Họ và tên không được để trống!' }]}
                    >
                        <Input size="large" placeholder="Họ và tên ..." />
                    </Form.Item>
                    <Form.Item<BasicInformationRequest>
                        label="Số điện thoại"
                        name="phoneNumber"
                        style={{
                            margin: 0
                        }}
                        rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                    >
                        <Input size="large" placeholder="Số điện thoại ..." />
                    </Form.Item>

                    <Form.Item<BasicInformationRequest>
                        label="Địa chỉ"
                        name="address"
                        style={{
                            margin: 0
                        }}
                        rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}
                    >
                        <Input size="large" placeholder="Địa chỉ ..." />
                    </Form.Item>

                    <Form.Item<BasicInformationRequest>
                        label="Ngày sinh"
                        name="dateOfBirth"
                        style={{
                            margin: 0
                        }}
                    >
                        <DatePicker size="large" className="w-full" />
                    </Form.Item>
                    <Form.Item<BasicInformationRequest>
                        label="Học vị"
                        name="academicTitle"
                        style={{
                            margin: 0
                        }}
                    >
                        <Input size="large" placeholder="Học vị ..." />
                    </Form.Item>
                    <Form.Item<BasicInformationRequest>
                        label="Bằng cấp"
                        name="degree"
                        style={{
                            margin: 0
                        }}
                    >
                        <Input size="large" placeholder="Bằng cấp ..." />
                    </Form.Item>
                    <Form.Item<BasicInformationRequest>
                        label="Nơi công tác"
                        name="currentWorkPlace"
                        style={{
                            margin: 0
                        }}
                    >
                        <Input size="large" placeholder="Nơi công tác ..." />
                    </Form.Item>
                    <Form.Item<BasicInformationRequest>
                        label="Chức vụ"
                        name="position"
                        style={{
                            margin: 0
                        }}
                    >
                        <Input size="large" placeholder="Chức vụ ..." />
                    </Form.Item>
                    <Form.Item<BasicInformationRequest>
                        label="Số năm kinh nghiệm"
                        name="experienceYears"
                    >
                        <InputNumber size="large" className="w-full" placeholder="Số năm kinh nghiệm" min={1} max={100} defaultValue={3} />
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

export default BasicInformationForm;
