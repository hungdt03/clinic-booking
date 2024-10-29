import { Button, Modal, Popconfirm, Space, Table, TableProps } from "antd";
import { FC, useEffect, useState } from "react";
import useModal from "../../../hooks/useModal";
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import TableHeader from "../../../components/shared/TableHeader";
import { ServiceTypeResource } from "../../../resources";
import { Link } from "react-router-dom";
import serviceTypeService from "../../../services/service-type-service";
import CreateServiceTypeModal from "../../../components/modals/CreateServiceTypeModal";


const ListServiceTypePage: FC = () => {
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal()
    const [serviceTypes, setServiceTypes] = useState<ServiceTypeResource[]>([])

    const fetchServiceTypes = async () => {
        const response = await serviceTypeService.getAllServiceTypes();
        if(response.success) {
            setServiceTypes(response.data)
        }
    }

    useEffect(() => {
        fetchServiceTypes()
    }, [])

    const columns: TableProps<ServiceTypeResource>['columns'] = [
        {
            title: 'Tên loại dịch vụ',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Tên phụ',
            dataIndex: 'subName',
            key: 'subName',
        },
        {
            title: 'Loại',
            dataIndex: 'isIncludeFee',
            key: 'isIncludeFee',
            render: (value) => value ? 'Hiển thị chi phí' : 'Không hiển thị chi phí'
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm     
                        title="Xóa loại dịch vụ"
                        description="Bạn có chắc là muốn xóa loại dịch vụ?"
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
        fetchServiceTypes()
        handleOk()
    }

    return <div className="w-full">
        <Table title={() => <TableHeader
                showModal={showModal}
                isShowBtn
                title="DANH SÁCH LOẠI DỊCH VỤ"
            />} 
            dataSource={serviceTypes} 
            columns={columns}
            rowKey="id"
        />

        <Modal
            open={isModalOpen}
            onOk={handleOk}
            title={<p className="text-center font-bold text-xl">THÊM LOẠI DỊCH VỤ MỚI</p>}
            onCancel={handleCancel}
            footer={[]}
        >
            <CreateServiceTypeModal
                onSuccess={handleSuccess}
            />
        </Modal>

    </div>
};

export default ListServiceTypePage;
