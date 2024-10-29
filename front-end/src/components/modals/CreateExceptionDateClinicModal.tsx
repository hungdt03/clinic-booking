import { Button, DatePicker, Form, FormProps, Select, message } from "antd";
import { FC, useEffect, useState } from "react";
import Loading from "../shared/Loading";
import { ExceptionDateEnum, ExceptionDateType, exceptionDateData } from "../../enums/ExceptionDateType";
import TextArea from "antd/es/input/TextArea";
import { ShiftResource } from "../../resources";
import shiftService from "../../services/shift-service";
import dayjs from "dayjs";
import { weekDaysData } from "../../resources/week-day";
import settingService from "../../services/setting-service";

export interface ExceptionDateRequest {
    fromDate: Date | string;
    toDate: Date | string;
    reason: string;
    isRepeatAnnually: boolean;
    isFullDay: boolean;
    type: ExceptionDateType;
    weekDayIds: number[];
    unavailableShiftIds: number[];
}

type CreateExceptionDateModalProps = {
    onSuccess: () => void
}

const CreateExceptionDateClinicModal: FC<CreateExceptionDateModalProps> = ({
    onSuccess
}) => {

    const [form] = Form.useForm<ExceptionDateRequest>();
    const [loading, setLoading] = useState(false)

    const [exceptionType, setExceptionType] = useState<ExceptionDateEnum | undefined>();
    const [shifts, setShifts] = useState<ShiftResource[]>([])

    const handleTypeChange = (value: ExceptionDateEnum) => {
        setExceptionType(value);
        form.setFieldValue('type', value)
    };

    const fetchShifts = async () => {
        const response = await shiftService.getAllShifts();
        if (response.success) {
            setShifts(response.data)
        }
    }

    useEffect(() => {
        fetchShifts();
    }, [])

    const onFinish: FormProps<ExceptionDateRequest>['onFinish'] = async (values) => {
        const payload : ExceptionDateRequest = {
            ...values,
            fromDate: dayjs(values.fromDate).format('YYYY-MM-DD'),
            toDate: dayjs(values.toDate).format('YYYY-MM-DD'),
        }

        setLoading(true)
        const response = await settingService.createExceptionDateForClinic(payload);
        setLoading(false);
        console.log(response)
        if(response.success) {
            message.success(response.message);
            form.resetFields();
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
            <Form.Item<ExceptionDateRequest>
                label='Chọn loại ngày nghỉ'
                name='type'
                rules={[{ required: true, message: 'Chưa chọn loại ngày nghỉ!' }]}
            >
                <Select onChange={handleTypeChange} placeholder='Chọn loại ngày nghỉ' >
                    {exceptionDateData.map((item) => (
                        <Select.Option key={item.value} value={item.value}>
                            {item.title}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            {exceptionType === ExceptionDateEnum.ONE_DAY || exceptionType === ExceptionDateEnum.SOME_SHIFTS && (<div className="flex items-center gap-x-6">
                <Form.Item<ExceptionDateRequest>
                    label='Ngày nghỉ'
                    name='toDate'
                    className="flex-1"
                    rules={[{ required: true, message: 'Chưa chọn ngày nghỉ!' }]}
                >
                    <DatePicker onChange={(date) => form.setFieldValue('fromDate', date)} className="w-full" />
                </Form.Item>
                <Form.Item<ExceptionDateRequest>
                    label='Ngày nghỉ'
                    name='fromDate'
                    className="flex-1"
                    hidden
                    rules={[{ required: true, message: 'Chưa chọn ngày nghỉ!' }]}
                >
                    <DatePicker className="w-full" />
                </Form.Item>

            </div>
            )}

            {exceptionType === ExceptionDateEnum.MORE_THAN_ONE_DAY && (<div className="flex items-center gap-x-6">
                <Form.Item<ExceptionDateRequest>
                    label='Ngày bắt đầu'
                    name='fromDate'
                    className="flex-1"
                    rules={[{ required: true, message: 'Ngày bắt đầu không được để trống!' }]}
                >
                    <DatePicker className="w-full"  />
                </Form.Item>

                <Form.Item<ExceptionDateRequest>
                    label='Ngày kết thúc'
                    className="flex-1"
                    name='toDate'
                    rules={[{ required: true, message: 'Ngày kết thúc không được để trống!' }]}
                >
                    <DatePicker className="w-full" />
                </Form.Item>
            </div>
            )}

            {exceptionType === ExceptionDateEnum.SOME_SHIFTS && (
                <Form.Item<ExceptionDateRequest>
                    label='Các ca vắng'
                    name='unavailableShiftIds'
                    rules={[{ required: true, message: 'Chưa chọn ca vắng!' }]}
                >
                    <Select mode="multiple" placeholder="Chọn ca vắng">
                        {shifts.map((shift) => (
                            <Select.Option key={shift.id} value={shift.id}>
                                {dayjs(shift.startTime, 'HH:mm:ss').format('HH:mm')} - {dayjs(shift.endTime, 'HH:mm:ss').format('HH:mm')}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            )}

            {exceptionType === ExceptionDateEnum.REPEAT_BY_WEEK && (
                <Form.Item<ExceptionDateRequest>
                    label='Các ngày vắng trong tuần'
                    name='weekDayIds'
                    rules={[{ required: true, message: 'Chưa chọn ngày vắng trong tuần!' }]}
                >
                    <Select mode="multiple" placeholder="Chọn các ngày vắng trong tuần">
                        {weekDaysData.map((weekDay) => (
                            <Select.Option key={weekDay.id} value={weekDay.id}>
                                {weekDay.title}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            )}


            <Form.Item<ExceptionDateRequest>
                label='Lí do'
                name='reason'
                rules={[{ required: true, message: 'Vui lòng nhập lí do nghỉ!' }]}
            >
                <TextArea rows={4} />
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

export default CreateExceptionDateClinicModal;
