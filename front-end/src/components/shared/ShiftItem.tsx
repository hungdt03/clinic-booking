import { FC } from "react";
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import images from "../../assets";
import { Popover } from "antd";
import { ShiftResource } from "../../resources";
import dayjs from "dayjs";

type ShiftItemProps = {
    shift: ShiftResource
}

const ShiftItem: FC<ShiftItemProps> = ({
    shift
}) => {
    return <div className="w-[230px] h-[105px] relative flex items-center gap-x-8 px-4 py-5 rounded-xl border-[3px] border-primary">
        <img alt="Khung giờ khám" width={60} height={60} className="object-cover rounded-lg" src={images.shift} />
        <div className="flex flex-col text-[15px]">
            <p className="font-semibold">{shift.type}</p>
            <div className="flex items-center gap-x-1">
                <span>{dayjs(shift.startTime, "HH:mm:ss").format('HH:mm')}</span> - <span>{dayjs(shift.endTime, "HH:mm:ss").format('HH:mm')}</span>
            </div>
        </div>
        <div>

        </div>

        <Popover trigger='click' content={<div className="flex flex-col items-start gap-y-2">
            <button className="px-2 py-1 rounded-md hover:bg-gray-100 w-full flex gap-x-2 items-center"><EditOutlined /> Chỉnh sửa</button>
            <button className="px-2 py-1 rounded-md hover:bg-gray-100 w-full flex gap-x-2 items-center"><DeleteOutlined /> Xóa</button>
        </div>}>
            <button className="absolute top-0 pt-1 right-2 flex items-center justify-center">
                <MoreOutlined className="rotate-90 p-2 rounded-full hover:bg-gray-100" />
            </button>
        </Popover>

    </div>
};

export default ShiftItem;
