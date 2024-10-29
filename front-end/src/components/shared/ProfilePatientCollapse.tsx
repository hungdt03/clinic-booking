import { Badge, Collapse, Divider } from "antd";
import { FC } from "react";
import images from "../../assets";
import { DownOutlined } from '@ant-design/icons'
import { ProfileResource } from "../../resources";
import cn from "../../app/components";

type ProfilePatientCollapseProps = {
    profile: ProfileResource;
    checked: boolean;
    onChange: () => void
}

const ProfilePatientCollapse: FC<ProfilePatientCollapseProps> = ({
    profile,
    onChange,
    checked
}) => {
    return <Collapse
        expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
        expandIconPosition="end"
        className={cn('bg-white border-[1px] hover:border-primary', checked && 'border-primary')}
        items={[{
            key: '1',
            label: <div onClick={(e) => {
                e.stopPropagation()
                onChange()
            }} className={cn("flex items-center gap-x-5")}>
                <Badge count={'Tôi'}>
                    <div className="relative">
                        <img className="absolute top-2/3 -translate-y-2/3 left-1/2 -translate-x-1/2" src={images.patientAvatar} width={35} height={35} />
                        <img src={images.bulkFolder} width={60} height={60} />
                    </div>
                </Badge>
                <div className="flex flex-col items-start gap-y-1">
                    <span className="font-medium text-[16px]">{profile.name}</span>
                    <span>{profile.dateOfBirth.toString()}</span>
                </div>
            </div>,
            children: <div className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-2">
                    <div className="flex justify-between items-center">
                        <span>Mã bệnh nhân</span>
                        <span className="font-medium">{profile.id}</span>
                    </div>
                    <Divider className="my-0" />
                    <div className="flex justify-between items-center">
                        <span>Họ và tên</span>
                        <span className="font-medium">{profile.name}</span>
                    </div>
                    <Divider className="my-0" />
                    <div className="flex justify-between items-center">
                        <span>Giới tính</span>
                        <span className="font-medium">{profile.gender}</span>
                    </div>
                    <Divider className="my-0" />
                    <div className="flex justify-between items-center">
                        <span>Ngày sinh</span>
                        <span className="font-medium">{profile.dateOfBirth.toString()}</span>
                    </div>
                    <Divider className="my-0" />
                    <div className="flex justify-between items-center">
                        <span>Số điện thoại</span>
                        <span className="font-medium">{profile.phoneNumber}</span>
                    </div>
                </div>
                <div className="flex justify-start">
                    <button className="px-4 py-3 bg-blue-50 text-primary rounded-lg font-medium">Điều chỉnh</button>
                </div>
            </div>
        }]}
    />

};

export default ProfilePatientCollapse;
