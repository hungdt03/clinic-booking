import { Button, Form, FormProps, Input, message } from "antd";
import { FC, useState } from "react";
import { PlusOutlined, CloseOutlined } from '@ant-design/icons'
import doctorService from "../../../services/doctor-service";
import { DoctorOwnerResource } from "../../../resources";


export type AwardsAndResearchesType = {
    year: string;
    content: string;
}

export type AwardsAndResearchesRequest = {
    awardsAndResearches: AwardsAndResearchesType[];
}

type AwardFormProps = {
    doctor: DoctorOwnerResource;
    onRefresh: () => void
}

const AwardForm: FC<AwardFormProps> = ({
    doctor,
    onRefresh
}) => {
    const [awardForm] = Form.useForm<AwardsAndResearchesRequest>();
    const [awardsAndResearches, setAwardsAndResearches] = useState<AwardsAndResearchesType[]>([...doctor.awardsAndResearches])
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(true)

    const onFinish: FormProps<AwardsAndResearchesRequest>['onFinish'] = async (values) => {
        setLoading(true)
        const response = await doctorService.updateAwardAndResearches(values);
        setLoading(false)
        if (response.success) {
            message.success(response.message)
            // awardForm.resetFields()
            onRefresh()
        } else {
            message.error(response.message)
        }
    };

    const handleCreateNewFormAwardsAndResearches = () => {
        const updatedAwards = [...awardsAndResearches, {
            year: '',
            content: '',
        }]
        setAwardsAndResearches(updatedAwards)
        awardForm.setFieldValue('awardsAndResearches', updatedAwards)
    }

    const handleRemoveAwardsAndResearchesItem = (index: number) => {
        const updatedAwards = awardsAndResearches.filter((_, i) => i !== index)
        setAwardsAndResearches(updatedAwards);
        setAwardsAndResearches(updatedAwards)
        if(disabled) setDisabled(false)
    }

    return <Form
        form={awardForm}
        name="basic"
        onFinish={onFinish}
        initialValues={{
            awardsAndResearches: [...doctor.awardsAndResearches]
        }}
        onValuesChange={() => setDisabled(false)}
        layout="vertical"
        className="flex flex-col gap-y-3"
        autoComplete="off"
    >
        <div className="flex flex-col items-start gap-y-2">
            <span className="text-[17px] font-semibold">Giải thưởng & Các công trình nghiên cứu</span>
            <div className="flex flex-col items-start w-full">
                {(awardsAndResearches).map((_, index) => (
                    <div className="w-full flex items-center gap-x-4" key={'award' + index}>
                        <div className="flex-1 grid grid-cols-3 gap-x-6 gap-y-1">
                            <Form.Item<AwardsAndResearchesRequest>
                                label='Thời gian'
                                name={['awardsAndResearches', index, 'year']}
                            >
                                <Input size="large" placeholder="Thời gian ..." />
                            </Form.Item>

                            <Form.Item<AwardsAndResearchesRequest>
                                label='Nội dung'
                                name={['awardsAndResearches', index, 'content']}
                            >
                                <Input size="large" placeholder="Nội dung ..." />
                            </Form.Item>
                        </div>

                        <button type='button' onClick={() => handleRemoveAwardsAndResearchesItem(index)} className="w-6 h-6 rounded-full bg-gray-500 text-white">
                            <CloseOutlined />
                        </button>
                    </div>
                ))}
                <Button className="px-8 text-[15px]" onClick={handleCreateNewFormAwardsAndResearches} type='dashed' shape="default" size='middle' icon={<PlusOutlined />}>Thêm</Button>
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

export default AwardForm;
