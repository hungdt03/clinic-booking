import { Button } from "antd";
import { FC } from "react";
import { PlusOutlined } from '@ant-design/icons'
import RoleAccept from "./CheckRole";

type TableHeaderProps = {
    showModal?: () => void;
    title: string;
    roles?: string[];
    isShowBtn: boolean
}

const TableHeader: FC<TableHeaderProps> = ({
    showModal,
    title,
    roles = ["ADMIN", "DOCTOR", "DOCTOR_OWNER", "MANAGER"],
    isShowBtn = false
}) => {
    return <div className="flex justify-between items-center">
        <span className="font-bold text-lg text-primary">{title}</span>
        <RoleAccept roles={roles}>
            {isShowBtn && <Button onClick={showModal} type="primary" icon={<PlusOutlined />}>Thêm mới</Button>}
        </RoleAccept>
    </div>
};

export default TableHeader;
