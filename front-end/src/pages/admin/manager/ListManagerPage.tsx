import { Button, Modal, Popconfirm, Space, Table, TableProps } from "antd";
import { FC, useEffect, useState } from "react";
import useModal from "../../../hooks/useModal";
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import TableHeader from "../../../components/shared/TableHeader";
import { ManagerResource } from "../../../resources";
import { Link } from "react-router-dom";
import managerService from "../../../services/manager-service";
import CreateManagerModal from "../../../components/modals/CreateManagerModal";


const ListManagerManagementPage: FC = () => {
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal()
    const [managers, setManagers] = useState<ManagerResource[]>([])

    const fetchManagers = async () => {
        const response = await managerService.getAllManagers();
        console.log(response)
        if(response.success) {
            setManagers(response.data)
        }
    }

    useEffect(() => {
        fetchManagers()
    }, [])

    const columns: TableProps<ManagerResource>['columns'] = [
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (_, record) => {
                return record.user.fullName
            }
        },
        {
            title: 'Địa chỉ email',
            dataIndex: 'email',
            key: 'email',
            render: (_, record) => {
                return record.user.email
            }
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            render: (_, record) => {
                return record.user.userName
            }
        },
        {
            title: 'Phòng khám',
            dataIndex: 'clinicId',
            key: 'clinicId',
            render: (_, record) => {
                return record.clinic.name
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm     
                        title="Xóa phòng khám bác sĩ"
                        description="Bạn có chắc là muốn xóa phòng khám bác sĩ?"
                        onConfirm={() => console.log('xóa')}
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
        fetchManagers()
        handleOk()
    }

    return <div className="w-full">
        <Table title={() => <TableHeader
                showModal={showModal}
                title="DANH SÁCH NGƯỜI QUẢN LÍ"
                isShowBtn
            />} 
            dataSource={managers} 
            columns={columns}
            rowKey="user"
        />

        <Modal
            open={isModalOpen}
            onOk={handleOk}
            title={<p className="text-center font-bold text-xl">THÊM QUẢN LÍ MỚI</p>}
            onCancel={handleCancel}
            footer={[]}
        >
            <CreateManagerModal
                onSuccess={handleSuccess}
            />
        </Modal>

    </div>
};

export default ListManagerManagementPage;
