import { FC } from "react";
import images from "../../assets";
import { Badge } from "antd";
import { ProfileResource } from "../../resources";
import dayjs from "dayjs";
import cn from "../../app/components";

type ProfilePatientProps = {
    profile: ProfileResource;
    checked: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement> | undefined
}

const ProfilePatient: FC<ProfilePatientProps> = ({
    profile,
    checked,
    onClick
}) => {
    return <button onClick={onClick} className={cn("flex items-center gap-x-5 hover:bg-slate-100 rounded-lg py-4 px-2", checked && 'bg-slate-100')}>
        <Badge color={profile.isPrimary ? 'red' : 'cyan'} count={profile.isPrimary ? 'Tôi' : 'Khác'} size="small">
            <div className="relative">
                <img alt="Ảnh minh họa" className="absolute top-2/3 -translate-y-2/3 left-1/2 -translate-x-1/2" src={images.patientAvatar} width={35} height={35} />
                <img alt="Ảnh minh họa" src={images.bulkFolder} width={60} height={60} />
            </div>
        </Badge>
        <div className="flex flex-col items-start">
            <span className="font-medium text-[16px]">{profile.name}</span>
            <span className="text-sm text-gray-500">{dayjs(profile.dateOfBirth).format('DD/MM/YYYY')}</span>
        </div>
    </button>
};

export default ProfilePatient;
