import { Button, Modal, Popconfirm, Space, Table, TableProps } from "antd";
import { FC, useEffect, useState } from "react";
import useModal from "../../../hooks/useModal";
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import TableHeader from "../../../components/shared/TableHeader";
import {  DoctorEmployeeResource } from "../../../resources";
import { Link } from "react-router-dom";
import doctorService from "../../../services/doctor-service";
import CreateDoctorEmployeeModal from "../../../components/modals/CreateDoctorEmployeeModal";


const ListDoctorEmployeePage: FC = () => {
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal()
    const [doctorEmployees, setDoctorEmployees] = useState<DoctorEmployeeResource[]>([])

    const fetchDoctorEmployees = async () => {
        const response = await doctorService.getAllDoctorEmployees();
        console.log(response)
        if(response.success) {
            setDoctorEmployees(response.data)
        }
    }

    useEffect(() => {
        fetchDoctorEmployees()
            
    }, [])

    const columns: TableProps<DoctorEmployeeResource>['columns'] = [
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (_, record) => {
                return record.user.fullName
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
                        title="Xóa pbác sĩ"
                        description="Bạn có chắc là muốn xóa pbác sĩ?"
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
        fetchDoctorEmployees()
        handleOk()
    }

    return <div className="w-full">
        <Table title={() => <TableHeader
                showModal={showModal}
                isShowBtn={true}
                title="DANH SÁCH BÁC SĨ"
            />} 
            dataSource={doctorEmployees} 
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
            <CreateDoctorEmployeeModal
                onSuccess={handleSuccess}
            />
        </Modal>

    </div>
};

export default ListDoctorEmployeePage;
