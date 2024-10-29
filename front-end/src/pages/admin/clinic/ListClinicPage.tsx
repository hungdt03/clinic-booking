import { Button, Image, Modal, Popconfirm, Space, Table, TableProps } from "antd";
import { FC, useEffect, useState } from "react";
import useModal from "../../../hooks/useModal";
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import CreateClinicModal from "../../../components/modals/CreateClinicModal";
import TableHeader from "../../../components/shared/TableHeader";
import { ClinicResource } from "../../../resources";
import clinicService from "../../../services/clinic-service";
import { Link } from "react-router-dom";
import RoleAccept from "../../../components/shared/CheckRole";


const ListClinicPage: FC = () => {
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal()
    const [clinics, setClinics] = useState<ClinicResource[]>([])

    const fetchClinics = async () => {
        const response = await clinicService.getAllClinics();

        if (response.success) {
            setClinics(response.data)
        }
    }

    useEffect(() => {
        fetchClinics()
    }, [])

    const columns: TableProps<ClinicResource>['columns'] = [
        {
            title: 'Hình ảnh',
            dataIndex: 'thumbnailUrl',
            key: 'thumbnailUrl',
            render: (value) => {
                return <Image width={100} height={60} className="rounded-md object-cover" src={value} />
            }
        },
        {
            title: 'Tên phòng khám',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <RoleAccept roles={["ADMIN"]}>
                        <Popconfirm
                            title="Xóa phòng khám"
                            description="Bạn có chắc là muốn xóa phòng khám?"
                            onConfirm={() => console.log('xóa')}
                            okText="Chắc chắn"
                            cancelText="Hủy bỏ"
                        >
                            <Button icon={<DeleteOutlined />} danger type="primary" size="small">Xóa</Button>
                        </Popconfirm>
                    </RoleAccept>
                    <Link to={`/admin/product/${record.id}`}><Button icon={<EyeOutlined />} type="default" size="small">Chi tiết</Button></Link>
                </Space>
            ),
        },

    ];

    const handleSuccess = () => {
        fetchClinics()
        handleOk()
    }

    return <div className="w-full">
        <Table title={() => <TableHeader
            showModal={showModal}
            roles={["ADMIN"]}
            title="DANH SÁCH PHÒNG KHÁM"
            isShowBtn={true}
        />} dataSource={clinics} columns={columns} />

        <Modal
            open={isModalOpen}
            onOk={handleOk}
            title={<p className="text-center font-bold text-xl">THÊM PHÒNG KHÁM MỚI</p>}
            onCancel={handleCancel}
            footer={[]}
        >
            <CreateClinicModal
                onSuccess={handleSuccess}
            />
        </Modal>

    </div>
};

export default ListClinicPage;
