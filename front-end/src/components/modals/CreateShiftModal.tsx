import { Button, Form, FormProps, TimePicker, message } from "antd";
import { FC, useState } from "react";
import Loading from "../shared/Loading";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import shiftService from "../../services/shift-service";

dayjs.extend(customParseFormat);

export interface ShiftRequest {
    startTime: string;
    endTime: string;
}

type CreateShiftModalProps = {
    onSuccess: () => void
}

const CreateShiftModal: FC<CreateShiftModalProps> = ({
    onSuccess
}) => {

    const [form] = Form.useForm<ShiftRequest>();
    const [loading, setLoading] = useState(false)

    const onFinish: FormProps<ShiftRequest>['onFinish'] = async (values) => {
        const formattedValues: ShiftRequest = {
            ...values,
            startTime: dayjs(values.startTime).format('HH:mm'),
            endTime: dayjs(values.endTime).format('HH:mm') 
        };

        setLoading(true)
        const response = await shiftService.createShift(formattedValues);
        setLoading(false)
        if(response.success) {
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
            <Form.Item<ShiftRequest>
                label='Thời gian bắt đầu'
                name='startTime'
                rules={[{ required: true, message: 'Chưa chọn thời gian bắt đầu!' }]}
            >
                <TimePicker format="HH:mm" className="w-full" size="large" defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
            </Form.Item>
            <Form.Item<ShiftRequest>
                label="Thời gian kết thúc"
                name="endTime"
                rules={[
                    { required: true, message: 'Chưa chọn thời gian kết thúc!' }, 
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            const startTime = getFieldValue('startTime');
                            if (!value || !startTime || dayjs(value).isAfter(dayjs(startTime))) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Thời gian kết thúc phải lớn hơn thời gian bắt đầu!'));
                        }
                })]}
            >
                <TimePicker format="HH:mm" className="w-full" size="large" defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
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

export default CreateShiftModal;
