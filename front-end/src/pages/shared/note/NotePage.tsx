import { FC, useEffect, useState } from "react";
import { Button, Form, FormProps, Input, message } from 'antd';
import settingService from "../../../services/setting-service";
import { NoteResource } from "../../../resources";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../features/slices/auth-slice";

const { TextArea } = Input;

export type NoteRequest = {
    note: string;
}

const NotePage: FC = () => {
    const [note, setNote] = useState<NoteResource | null>(null);
    const [form] = Form.useForm<NoteRequest>()
    const { user } = useSelector(selectAuth)

    const fetchNoteDoctor = async () => {
        const response = await settingService.getNoteDoctor();
        if (response.success) {
            setNote(response.data)
            form.setFieldValue('note', response.data.content)
        }
    }

    const fetchNoteClinic = async () => {
        const response = await settingService.getNoteClinic();
        if (response.success) {
            setNote(response.data)
            form.setFieldValue('note', response.data.content)
        }
    }

    const saveNoteDoctor = async (payload: NoteRequest) => {
        const response = await settingService.saveNoteDoctor(payload);
        if (response.success) {
            message.success(response.message);
            fetchNoteDoctor()
        } else {
            message.error(response.message)
        }
    }

    const saveNoteClinic = async (payload: NoteRequest) => {
        const response = await settingService.saveNoteClinic(payload);
        if (response.success) {
            message.success(response.message);
            fetchNoteClinic()
        } else {
            message.error(response.message)
        }
    }


    const onFinish: FormProps<NoteRequest>['onFinish'] = (values) => {
        if (user?.role === 'DOCTOR_OWNER') {
            saveNoteDoctor(values)
        } else if (user?.role === 'MANAGER') {
            saveNoteClinic(values)
        }
    };

    useEffect(() => {
        if (user?.role === 'DOCTOR_OWNER') {
            fetchNoteDoctor()
        } else if (user?.role === 'MANAGER') {
            fetchNoteClinic()
        }
    }, [])

    return <div className="flex flex-col items-start gap-y-3 w-full">
        <span className="font-semibold text-lg">GHI CHÚ CHO ĐẶT LỊCH KHÁM BỆNH</span>
        <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            initialValues={{
                note: note?.content
            }}
            className="w-full"
        >
            <Form.Item<NoteRequest>
                label="Ghi chú"
                name="note"
                rules={[{ required: true, message: 'Vui lòng nhập ghi chú!' }]}
            >
                <TextArea rows={4} />
            </Form.Item>

            <Form.Item className="flex justify-start">
                <Button type="primary" htmlType="submit">
                    Lưu lại
                </Button>
            </Form.Item>
        </Form>
    </div>
};

export default NotePage;
