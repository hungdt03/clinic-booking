import { FC, useEffect, useState } from "react";
import ProfilePatient from "../ProfilePatientCollapse";
import { ProfileResource } from "../../../resources";

type PatientProfileOptionProps = {
    profiles: ProfileResource[];
    value: string;
    onChange: (value: string, profile: ProfileResource) => void;
    onReset: () => void;
    isShowBody: boolean;
    order: number;
}

const PatientProfileOption: FC<PatientProfileOptionProps> = ({
    profiles,
    onChange,
    isShowBody,
    onReset,
    value,
    order
}) => {

    const [checkProfile, setCheckProfile] = useState<string>(value)
    const [showBody, setShowBody] = useState<boolean>(isShowBody)

    const handleShowBody = () => {
        if (!showBody) {
            setShowBody(true)
            onReset()
        }
    }

    useEffect(() => {
        setShowBody(isShowBody)
    }, [isShowBody])

    useEffect(() => {
        setCheckProfile(value)
    }, [value])

    return <div className="flex flex-col gap-y-4 bg-white p-4 rounded-lg shadow">
        <button disabled={showBody} onClick={handleShowBody} className="flex items-center gap-x-4">
            <span className="w-6 h-6 bg-primary text-white rounded-full block">{order}</span>
            <span className="text-primary font-semibold">Hồ sơ bệnh nhân</span>
        </button>
        {showBody &&
            <div className="flex flex-col gap-3">
                {profiles.map(profile => <ProfilePatient onChange={() => onChange(profile.id, profile)} checked={profile.id == checkProfile} key={profile.id} profile={profile} />)}
            </div>
        }
    </div>
};

export default PatientProfileOption;
