import { Button, Popconfirm, Space, Table, TableProps, message } from "antd";
import { FC, useEffect, useState } from "react";
import { DeleteOutlined, EyeOutlined, CheckOutlined } from '@ant-design/icons'
import TableHeader from "../../../components/shared/TableHeader";
import {  AppointmentResource, ProfileResource } from "../../../resources";
import { Link } from "react-router-dom";
import appointmentService from "../../../services/appointment-service";
import dayjs from "dayjs";
import { Pagination as PaginationResource } from "../../../resources/type-response";
import { CancelBox } from "../../manager/appointment/ListAppointmentClinic";
import { QueryParams, initialValues } from "../../../utils/pagination";
import { getBookingStatus } from "../../../utils/status";


const ListAppointmentDoctorEmployee: FC = () => {
    const [queryParams, setQueryParams] = useState<QueryParams>(initialValues);
    const [pagination, setPagination] = useState<PaginationResource>()
    const [appointments, setAppointments] = useState<AppointmentResource[]>([])
    const [cancelReason, setCancelReason] = useState<string>('')
    const [error, setError] = useState('')

    const fetchAppointments = async (query: QueryParams) => {
        const response = await appointmentService.getAllAppointmentsByLoggedInDoctorEmployee(query);
        if(response.success) {
            setAppointments(response.data)
            setPagination(response.pagination)
        }
    }

    useEffect(() => {
        fetchAppointments(queryParams)
    }, [])


    
    const handleConfirmCancel = async (id: number) => {
        if(!cancelReason) {
            setError('Vui lòng nhập lí do hủy lịch');
            return Promise.reject();
        } else {
            const response = await appointmentService.cancelAppointment(id, cancelReason);
            if(response.success) {
                fetchAppointments(queryParams);
                setCancelReason('')
                message.success(response.message)
            } else {
                message.error(response.message)
            }
        }
    }

    const handleConfirmFinish = async (id: number) => {
        const response = await appointmentService.finishAppointment(id);
        if(response.success) {
            fetchAppointments(queryParams);
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    }

    const columns: TableProps<AppointmentResource>['columns'] = [
        {
            title: 'STT',
            dataIndex: 'numberOrder',
            key: 'numberOrder',
        },
        {
            title: 'Bệnh nhân',
            dataIndex: 'profile',
            key: 'profile',
            render: (value : ProfileResource) => {
                return value.name
            }
        },
        {
            title: 'Ngày khám',
            dataIndex: 'appointmentDate',
            key: 'appointmentDate',
            render: (value) => {
                return dayjs(value).format('DD/MM/YYYY')
            }
        },
        {
            title: 'Giờ khám',
            dataIndex: 'shift',
            key: 'shift',
            render: (value) => {
                return <span>{dayjs(value.startTime, 'HH:mm:ss').format('HH:mm')} - {dayjs(value.endTime, 'HH:mm:ss').format('HH:mm')}</span>
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (value) =>  {
                return getBookingStatus(value)
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            key: 'createdDate',
            render: (value) => {
                return dayjs(value).format('DD/MM/YYYY')
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {record.status === "SUCCESS" && <Popconfirm     
                        title="Lí do hủy lịch"
                        description={<CancelBox error={error} onChange={value => setCancelReason(value)} />}
                        onConfirm={() => handleConfirmCancel(record.id)}
                        okText="Chắc chắn"
                        cancelText="Hủy bỏ"
                    >
                        <Button icon={<DeleteOutlined />} danger type="primary" size="small">Hủy lịch</Button>
                    </Popconfirm>}
                    {record.status === "SUCCESS" && <Popconfirm     
                        title="Hoàn tất lịch hẹn"
                        description='Bạn có chắc là hoàn tất lịch hẹn'
                        onConfirm={() => handleConfirmFinish(record.id)}
                        okText="Chắc chắn"
                        cancelText="Hủy bỏ"
                    >
                        <Button icon={<CheckOutlined />} type="primary" size="small">Hoàn tất</Button>
                    </Popconfirm>}
                    <Link to={`/admin/appointment/clinic/${record.id}`}><Button icon={<EyeOutlined />} type="default" size="small">Chi tiết</Button></Link>
                </Space>
            ),
        },
       
    ];

    return <div className="w-full">
        <Table title={() => <TableHeader
                title="DANH SÁCH LỊCH ĐẶT KHÁM"
                isShowBtn={false}
            />} 
            dataSource={appointments} 
            columns={columns}
            rowKey="id"
            pagination={{
                pageSize: queryParams.size,
                current: queryParams.page,
                onChange: (value) => {
                    const updateParams: QueryParams = {
                        ...queryParams,
                        page: value
                    }
                    setQueryParams(updateParams)
                    fetchAppointments(updateParams)
                },
                align: 'end',
                showLessItems: true,
                total: pagination?.totalItems
            }}
        />
    </div>
};

export default ListAppointmentDoctorEmployee;
