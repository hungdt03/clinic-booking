import { FC, useEffect, useState } from "react";
import useModal from "../../../hooks/useModal";
import { ExceptionDateResource } from "../../../resources";
import settingService from "../../../services/setting-service";
import { Button, Modal, Popconfirm, Space, Table, TableProps, message } from "antd";
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import TableHeader from "../../../components/shared/TableHeader";
import { ExceptionDateEnum } from "../../../enums/ExceptionDateType";
import CreateExceptionDateDoctorModal from "../../../components/modals/CreateExceptionDateDoctorModal";

const ExceptionDateDoctorManage: FC = () => {
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal()
    const [exceptionDates, setExceptionDates] = useState<ExceptionDateResource[]>([])

    const fetchExceptionDates = async () => {
        const response = await settingService.getAllExceptionDatesByDoctor();
        if(response.success) {
            setExceptionDates(response.data)
        }
    }

    useEffect(() => {
        fetchExceptionDates()
    }, [])

    const confirmRemove = async (id: number | string) => {
        const response = await settingService.removeExceptionDateDoctorById(id);

        if(response.success) {
            message.success(response.message)
            fetchExceptionDates()
        } else {
            message.error(response.message)
        }
    }

    const columns: TableProps<ExceptionDateResource>['columns'] = [
        {
            title: 'Thời gian',
            dataIndex: 'time',
            key: 'time',
            render: (value, record: ExceptionDateResource) => {
                if(record.type === ExceptionDateEnum.MORE_THAN_ONE_DAY) {
                    return `${dayjs(record.fromDate).format('DD/MM/YYYY')} - ${dayjs(record.toDate).format('DD/MM/YYYY')}`
                } else if(record.type === ExceptionDateEnum.ONE_DAY) {
                    return dayjs(record.fromDate).format('DD/MM/YYYY')
                } else {
                    return '####'
                }
            }
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Lí do',
            dataIndex: 'reason',
            key: 'reason',
        },
        {
            title: 'Lặp lại',
            dataIndex: 'repeat',
            key: 'repeat',
            render: (value) => value ? 'Có' :'Không'
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm     
                        title="Xóa ngày nghỉ"
                        description="Bạn có chắc là muốn xóa ngày nghỉ?"
                        onConfirm={() => confirmRemove(record.id)}
                        okText="Chắc chắn"
                        cancelText="Hủy bỏ"
                    >
                        <Button icon={<DeleteOutlined />} danger type="primary" size="small">Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
       
    ];

    const handleSuccess = () => {
        fetchExceptionDates()
        handleOk()
    }

    return <div className="w-full">
        <Table title={() => <TableHeader
                showModal={showModal}
                title="DANH SÁCH CÁC NGÀY NGHỈ"
                isShowBtn={true}
            />} 
            dataSource={exceptionDates} 
            columns={columns}
            rowKey="id"
        />

        <Modal
            open={isModalOpen}
            onOk={handleOk}
            title={<p className="text-center font-bold text-xl">THÊM NGÀY NGHỈ MỚI</p>}
            onCancel={handleCancel}
            footer={[]}
        >
           <CreateExceptionDateDoctorModal
                onSuccess={handleSuccess}
           />
        </Modal>

    </div>
};

export default ExceptionDateDoctorManage;
