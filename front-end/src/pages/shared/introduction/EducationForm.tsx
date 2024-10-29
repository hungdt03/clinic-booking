import { Button, Form, FormProps, Input, message } from "antd";
import { FC, useState } from "react";
import { PlusOutlined, CloseOutlined } from '@ant-design/icons'
import doctorService from "../../../services/doctor-service";
import { DoctorOwnerResource } from "../../../resources";

export type EducationType = {
    id?: number;
    fromYear: string;
    toYear: string;
    studyPlace: string;
}


export type EducationRequest = {
    educations: EducationType[];
}

type EducationFormProps = {
    doctor: DoctorOwnerResource;
    onRefresh: () => void
}

const EducationForm: FC<EducationFormProps> = ({
    doctor,
    onRefresh
}) => {
    const [formEducation] = Form.useForm<EducationRequest>();
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [educationList, setEducationList] = useState<EducationType[]>([...doctor.educations]);

    const onFinish: FormProps<EducationRequest>['onFinish'] = async (values) => {
        setLoading(true)
        const response = await doctorService.updateEducation(values);
        setLoading(false)
        if(response.success) {
            message.success(response.message)
            // formEducation.resetFields()
            onRefresh()
        } else {
            message.error(response.message)
        }
    };

    const handleCreateNewFormEducation = () => {
        const updatedEducations = [...educationList, {
            fromYear: '',
            toYear: '',
            studyPlace: ''
        }]

        formEducation.setFieldValue('educations', updatedEducations)
        setEducationList(updatedEducations)
    }

    const handleRemoveEducationItem = (index: number) => {
        const updatedEducation = educationList.filter((_, i) => i !== index);
        formEducation.setFieldValue('educations', updatedEducation);
        setEducationList(updatedEducation)
        if(disabled) setDisabled(false)
    };


    return <Form
        form={formEducation}
        name="basic"
        onFinish={onFinish}
        initialValues={{
            educations: [...doctor.educations]
        }}
        onValuesChange={() => setDisabled(false)}
        layout="vertical"
        className="flex flex-col gap-y-3"
        autoComplete="off"
    >
        <div className="flex flex-col items-start gap-y-2">
            <span className="text-[17px] font-semibold">Quá trình đào tạo</span>
            <div className="flex flex-col items-start w-full">
                {educationList.map((_, index) =>
                    <div className="w-full flex items-center gap-x-4" key={'edu' + index}>
                        <div className="flex-1 grid grid-cols-3 gap-x-6 gap-y-1" >
                            <Form.Item<EducationRequest>
                                label='Thời gian bắt đầu'
                                name={['educations', index, 'fromYear']}
                            >
                                <Input size="large" placeholder="Thời gian bắt đầu ..." />
                            </Form.Item>

                            <Form.Item<EducationRequest>
                                label='Thời gian kết thúc'
                                name={['educations', index, 'toYear']}
                            >
                                <Input size="large" placeholder="Thời gian kết thúc ..." />
                            </Form.Item>

                            <Form.Item<EducationRequest>
                                label='Nơi đào tạo'
                                name={['educations', index, 'studyPlace']}
                            >
                                <Input size="large" placeholder="Nơi đào tạo ..." />
                            </Form.Item>
                        </div>

                        <button type='button' onClick={() => handleRemoveEducationItem(index)} className="w-6 h-6 rounded-full bg-gray-500 text-white">
                            <CloseOutlined />
                        </button>
                    </div>
                )}
                <Button className="px-8 text-[15px]" onClick={handleCreateNewFormEducation} type='dashed' shape="default" size='middle' icon={<PlusOutlined />}>Thêm</Button>
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

export default EducationForm;
