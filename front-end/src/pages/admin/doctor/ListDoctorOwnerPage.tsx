import { Button, Modal, Popconfirm, Space, Table, TableProps } from "antd";
import { FC, useEffect, useState } from "react";
import useModal from "../../../hooks/useModal";
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import TableHeader from "../../../components/shared/TableHeader";
import {  DoctorOwnerResource } from "../../../resources";
import { Link } from "react-router-dom";
import doctorService from "../../../services/doctor-service";
import CreateDoctorOwner from "../../../components/modals/CreateDoctorOwnerModal";


const ListDoctorOwnerPage: FC = () => {
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal()
    const [doctorOwners, setDoctorOwners] = useState<DoctorOwnerResource[]>([])

    const fetchDoctorOwners = async () => {
        const response = await doctorService.getAllDoctorOwners();
        console.log(response)
        if(response.success) {
            setDoctorOwners(response.data)
        }
    }

    useEffect(() => {
        fetchDoctorOwners()
    }, [])

    const columns: TableProps<DoctorOwnerResource>['columns'] = [
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
        fetchDoctorOwners()
        handleOk()
    }

    return <div className="w-full">
        <Table title={() => <TableHeader
                showModal={showModal}
                title="DANH SÁCH PHÒNG KHÁM BÁC SĨ"
                isShowBtn={true}
                roles={['ADMIN']}
            />} 
            dataSource={doctorOwners} 
            columns={columns}
            rowKey="user"
        />

        <Modal
            open={isModalOpen}
            onOk={handleOk}
            title={<p className="text-center font-bold text-xl">THÊM BÁC SĨ MỚI</p>}
            onCancel={handleCancel}
            footer={[]}
        >
            <CreateDoctorOwner
                onSuccess={handleSuccess}
            />
        </Modal>

    </div>
};

export default ListDoctorOwnerPage;
