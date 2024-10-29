import { Button, Image, Modal, Popconfirm, Space, Table, TableProps, message } from "antd";
import { FC, useEffect, useState } from "react";
import useModal from "../../../hooks/useModal";
import { DeleteOutlined } from '@ant-design/icons'
import TableHeader from "../../../components/shared/TableHeader";
import { SpecialityResource } from "../../../resources";
import specialityService from "../../../services/speciality-service";
import CreateSpeciality from "../../../components/modals/CreateSpecialityModal";
import RoleAccept from "../../../components/shared/CheckRole";


const ListSpeciality: FC = () => {
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal()
    const [specialities, setSpecialities] = useState<SpecialityResource[]>([])

    const fetchSpecialities = async () => {
        const response = await specialityService.getAllSpecialities();

        if (response.success) {
            setSpecialities(response.data)
        }
    }

    useEffect(() => {
        fetchSpecialities()
    }, [])

    const handleDeleteSpeciality = async (id: number) => {
        const response = await specialityService.deleteSpecialization(id);
        if (response.success) {
            message.success(response.message)
            fetchSpecialities()
        } else {
            message.error(response.message)
        }
    }

    const columns: TableProps<SpecialityResource>['columns'] = [
        {
            title: 'Hình ảnh',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            render: (value) => {
                return <Image preview={false} width={70} height={70} className="rounded-lg object-cover" src={value} />
            }
        },
        {
            title: 'Tên chuyên khoa',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (value) => {
                return <p className="line-clamp-2">{value}</p>
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (record: SpecialityResource) => (
                <Space size="middle">
                    <RoleAccept roles={['ADMIN']}>
                        <Popconfirm
                            title="Xóa chuyên khoa"
                            description="Bạn có chắc là muốn xóa chuyên khoa?"
                            onConfirm={() => handleDeleteSpeciality(record.id)}
                            okText="Chắc chắn"
                            cancelText="Hủy bỏ"
                        >
                            <Button icon={<DeleteOutlined />} danger type="primary" size="small">Xóa</Button>
                        </Popconfirm>
                    </RoleAccept>
                </Space>
            ),
        },

    ];

    const handleSuccess = () => {
        fetchSpecialities()
        handleOk()
    }

    return <div className="w-full">
        <Table title={() => <TableHeader
            showModal={showModal}
            isShowBtn
            title="DANH SÁCH CHUYÊN KHOA"
        />} dataSource={specialities} columns={columns} rowKey='id' />

        <Modal
            open={isModalOpen}
            onOk={handleOk}
            title={<p className="text-center font-bold text-xl">THÊM CHUYÊN KHOA MỚI</p>}
            onCancel={handleCancel}
            footer={[]}
        >
            <CreateSpeciality
                onSuccess={handleSuccess}
            />
        </Modal>

    </div>
};

export default ListSpeciality;
