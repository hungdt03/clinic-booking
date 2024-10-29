import { Button, Modal, Popconfirm, Space, Table, TableProps } from "antd";
import { FC, useEffect, useState } from "react";
import useModal from "../../../hooks/useModal";
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import TableHeader from "../../../components/shared/TableHeader";
import { ServiceResource } from "../../../resources";
import { Link } from "react-router-dom";
import serviceService from "../../../services/service-service";
import CreateServiceModal from "../../../components/modals/CreateServiceModal";


const ListServicePage: FC = () => {
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal()
    const [services, setServices] = useState<ServiceResource[]>([])

    const fetchServices = async () => {
        const response = await serviceService.getAllServices();
        if(response.success) {
            setServices(response.data)
        }
    }

    useEffect(() => {
        fetchServices()
    }, [])

    const columns: TableProps<ServiceResource>['columns'] = [
        {
            title: 'Tên dịch vụ',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Chi phí',
            dataIndex: 'fee',
            key: 'fee',
            render: (value) => value === 0 ? 'Xác định khi khám' : value
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm     
                        title="Xóa dịch vụ"
                        description="Bạn có chắc là muốn xóa dịch vụ?"
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
        fetchServices()
        handleOk()
    }

    return <div className="w-full">
        <Table title={() => <TableHeader
                showModal={showModal}
                isShowBtn
                title="DANH SÁCH DỊCH VỤ"
            />} 
            dataSource={services} 
            columns={columns}
            rowKey="id"
        />

        <Modal
            open={isModalOpen}
            onOk={handleOk}
            title={<p className="text-center font-bold text-xl">THÊM DỊCH VỤ MỚI</p>}
            onCancel={handleCancel}
            footer={[]}
        >
            <CreateServiceModal
                onSuccess={handleSuccess}
            />
        </Modal>

    </div>
};

export default ListServicePage;
