import { Tag } from "antd"

const getBookingStatus = (status: string) => {
    if(status === 'CANCEL') return <Tag color="red">Đã hủy</Tag>;
    if(status === 'SUCCESS') return <Tag color="green">Đã đặt</Tag>;
    if(status === 'EXPIRE') return <Tag color="warning">Quá hạn</Tag>;
    if(status === 'FINISH') return <Tag color="blue">Đã hoàn tất</Tag>;
    return <Tag color="cyan">Unkown</Tag>;
}

export { getBookingStatus }