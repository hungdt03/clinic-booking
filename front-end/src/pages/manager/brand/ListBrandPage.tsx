import { Button, Modal, Popconfirm, Space, Table, TableProps } from "antd";
import { FC, useEffect, useState } from "react";
import useModal from "../../../hooks/useModal";
import { DeleteOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons'
import TableHeader from "../../../components/shared/TableHeader";
import {  BrandResource } from "../../../resources";
import { Link } from "react-router-dom";
import brandService from "../../../services/brand-service";
import CreateBrandModal from "../../../components/modals/CreateBrandModal";
import UpdateBrandModal from "../../../components/modals/UpdateBrandModal";


const ListBrandPage: FC = () => {
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal()
    const { isModalOpen: isModalOpenEdit, handleCancel:handleCancelEdit, handleOk: handleOkEdit, showModal:showModalEdit } = useModal()
    const [brands, setBrands] = useState<BrandResource[]>([])
    const [brand, setBrand] = useState<BrandResource>()

    const fetchBrands = async () => {
        const response = await brandService.getAllBrands();
        if(response.success) {
            setBrands(response.data)
        }
    }

    useEffect(() => {
        fetchBrands()
    }, [])

    const columns: TableProps<BrandResource>['columns'] = [
        {
            title: 'Tên chi nhánh',
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
                    <Button onClick={() => {
                        setBrand(record)
                        showModalEdit()
                    }} icon={<EditOutlined />} type="primary" size="small">Sửa</Button>
                    <Popconfirm     
                        title="Xóa chi nhánh"
                        description="Bạn có chắc là muốn xóa chi nhánh?"
                        onConfirm={() => console.log('xóa')}
                        okText="Chắc chắn"
                        cancelText="Hủy bỏ"
                    >
                        <Button icon={<DeleteOutlined />} danger type="primary" size="small">Xóa</Button>
                    </Popconfirm>
                    <Link to={`/admin/product/${record.id}`}><Button icon={<EyeOutlined />} type="default" size="small">Chi tiết</Button></Link>
                </Space>
            ),
        },
       
    ];

    const handleSuccess = () => {
        fetchBrands()
        handleOk()
        handleOkEdit()
    }


    return <div className="w-full">
        <Table title={() => <TableHeader
                showModal={showModal}
                isShowBtn
                title="DANH SÁCH CHI NHÁNH / CƠ SỞ KHÁM BỆNH"
            />} 
            dataSource={brands} 
            columns={columns}
            rowKey="id"
        />

        <Modal
            open={isModalOpen}
            onOk={handleOk}
            title={<p className="text-center font-bold text-xl">THÊM CHI NHÁNH MỚI</p>}
            onCancel={handleCancel}
            footer={[]}
        >
            <CreateBrandModal
                onSuccess={handleSuccess}
            />
        </Modal>

        <Modal
            open={isModalOpenEdit}
            onOk={handleOkEdit}
            title={<p className="text-center font-bold text-xl">CẬP NHẬT THÔNG TIN CHI NHÁNH</p>}
            onCancel={handleCancelEdit}
            footer={[]}
        >
            <UpdateBrandModal
                brand={brand!}
                onSuccess={handleSuccess}
            />
        </Modal>

    </div>
};

export default ListBrandPage;
