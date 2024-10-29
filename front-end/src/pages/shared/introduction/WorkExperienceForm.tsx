import { FC, useState } from "react";
import { PlusOutlined, CloseOutlined } from '@ant-design/icons'
import { Button, Form, FormProps, Input, message } from "antd";
import doctorService from "../../../services/doctor-service";
import { DoctorOwnerResource } from "../../../resources";

export type WorkExperienceType = {
    id?: number;
    fromYear: string;
    toYear: string;
    workPlace: string;
}

export type WorkExperienceRequest = {
    workExperiences: WorkExperienceType[];
}

type WorkExperienceFormProps = {
    doctor: DoctorOwnerResource;
    onRefresh: () => void
}

const WorkExperienceForm: FC<WorkExperienceFormProps> = ({
    doctor,
    onRefresh
}) => {
    const [loading, setLoading] = useState(false)
    const [experienceForm] = Form.useForm<WorkExperienceRequest>();
    const [workExperiences, setWorkExperiences] = useState<WorkExperienceType[]>([...doctor.workExperiences]);
    const [disabled, setDisabled] = useState(true)

    const onFinish: FormProps<WorkExperienceRequest>['onFinish'] = async (values) => {
        setLoading(true)
        const response = await doctorService.updateWorkExperiences(values);
        setLoading(false)
        if(response.success) {
            message.success(response.message)
            // experienceForm.resetFields()
            onRefresh()
        } else {
            message.error(response.message)
        }
    };


    const handleCreateNewFormWorkExperience = () => {
        const updatedExperiences = [...workExperiences, { fromYear: '', toYear: '', workPlace: '' }];
        setWorkExperiences(updatedExperiences);
        experienceForm.setFieldsValue({ workExperiences: updatedExperiences });
    }

    const handleRemoveWorkExperienceItem = (index: number) => {
        const currentExperience = (experienceForm.getFieldValue('workExperiences') ?? []) as WorkExperienceType[];
        const updateExperience = currentExperience.filter((_, i) => i !== index);
        experienceForm.setFieldsValue({
            workExperiences: updateExperience
        });
        setWorkExperiences(updateExperience);
        if(disabled) setDisabled(false);
    };


    return <Form
        form={experienceForm}
        name="basic"
        onFinish={onFinish}
        onValuesChange={() => setDisabled(false)}
        initialValues={{
            workExperiences: [...doctor.workExperiences]
        }}
        layout="vertical"
        className="flex flex-col gap-y-3"
        autoComplete="off"
    >
        <div className="flex flex-col items-start gap-y-2">
            <span className="text-[17px] font-semibold">Kinh nghiệm</span>
            <div className="flex flex-col items-start w-full">
                {workExperiences.map((_, index) => (
                    <div className="w-full flex items-center gap-x-4" key={'work' + index}>
                        <div className="flex-1 grid grid-cols-3 gap-x-6 gap-y-1">
                            <Form.Item<WorkExperienceRequest>
                                label='Thời gian bắt đầu'
                                name={['workExperiences', index, 'fromYear']} // Đặt theo mảng
                            >
                                <Input size="large" placeholder="Thời gian bắt đầu ..." />
                            </Form.Item>

                            <Form.Item<WorkExperienceRequest>
                                label='Thời gian kết thúc'
                                name={['workExperiences', index, 'toYear']} // Đặt theo mảng
                            >
                                <Input size="large" placeholder="Thời gian kết thúc ..." />
                            </Form.Item>

                            <Form.Item<WorkExperienceRequest>
                                label='Nơi làm việc'
                                name={['workExperiences', index, 'workPlace']} // Đặt theo mảng
                            >
                                <Input size="large" placeholder="Nơi làm việc ..." />
                            </Form.Item>
                        </div>

                        <button type='button' onClick={() => handleRemoveWorkExperienceItem(index)} className="w-6 h-6 rounded-full bg-gray-500 text-white">
                            <CloseOutlined />
                        </button>
                    </div>
                ))}
                <Button className="px-8 text-[15px]" onClick={handleCreateNewFormWorkExperience} type='dashed' shape="default" size='middle' icon={<PlusOutlined />}>Thêm</Button>
            </div>
            <div className="flex w-full justify-end">
                <Form.Item>
                    <Button disabled={disabled || loading} loading={loading} className="mt-4" type="primary" htmlType="submit">
                        Lưu lại
                    </Button>
                </Form.Item>
            </div>
        </div>
    </Form>
};

export default WorkExperienceForm;
