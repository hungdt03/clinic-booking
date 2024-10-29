import { FC } from "react";
import { PlusOutlined } from '@ant-design/icons'
import { Button } from "antd";

type CreateShiftButtonProps = {
    onClick: React.MouseEventHandler<HTMLElement> | undefined
}

const CreateShiftButton: FC<CreateShiftButtonProps> = ({
    onClick
}) => {
    return <div className="flex items-center justify-center px-4 py-5 rounded-xl border-[3px] border-primary w-[230px] h-[105px]">
       <Button onClick={onClick} type="primary" shape="circle" size="large" icon={<PlusOutlined />}></Button>
    </div>
};

export default CreateShiftButton;
