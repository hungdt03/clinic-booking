import { Button, Form, FormProps, Select } from "antd";
import { FC, useEffect, useState } from "react";
import { SpecialityResource } from "../../resources";
import specialityService from "../../services/speciality-service";

export interface SpecialityExaminateRequest {
    specializationIds: number[];
}


type CreateSpecialtiyExaminateModalProps = {
    onSubmit: (values: SpecialityExaminateRequest) => Promise<boolean>
}

const CreateSpecialityExaminateModal: FC<CreateSpecialtiyExaminateModalProps> = ({
    onSubmit
}) => {

    const [form] = Form.useForm<SpecialityExaminateRequest>();
    const [specialities, setSpecialities] = useState<SpecialityResource[]>([])

    useEffect(() => {
        const fetchSpecialities = async () => {
            const response = await specialityService.getAllSpecialities();
            if (response.success) {
                setSpecialities(response.data)
            }
        }

        fetchSpecialities();
    }, [])

    const onFinish: FormProps<SpecialityExaminateRequest>['onFinish'] = async (values) => {
        const isSuccess = await onSubmit(values)
        if(isSuccess) form.resetFields()
    };

    return <div className="px-4 pt-4 max-h-[500px] overflow-y-auto custom-scrollbar scrollbar-w-2">
        <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            layout="vertical"
            autoComplete="off"
        >
            <Form.Item<SpecialityExaminateRequest>
                label='Chuyên khoa'
                name='specializationIds'
                rules={[
                    {
                        required: true, message: 'Chưa chọn chuyên khoa!',
                    },
                ]}
            >
                <Select
                    placeholder='Chọn chuyên khoa'
                    size="large"
                    mode="multiple"
                >
                    {specialities.map(speciality => <Select.Option key={speciality.id} value={speciality.id}>
                        {speciality.name}
                    </Select.Option>)}
                </Select>
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

export default CreateSpecialityExaminateModal;
