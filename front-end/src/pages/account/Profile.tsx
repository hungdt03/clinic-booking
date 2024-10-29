import { FC, useEffect, useState } from "react";
import ProfilePatient from "../../components/shared/ProfilePatient";
import { Alert, Button, DatePicker, Divider, Form, FormProps, Input, Radio, Select, message } from "antd";
import images from "../../assets";
import { ProfileResource } from "../../resources";
import patientService from "../../services/patient-service";
import dayjs, { Dayjs } from "dayjs";
import { ethnicGroupsVietnam } from "../../data/ethnicgroup-vietnam";

type OtherInfoProfileProps = {
    selectProfile: ProfileResource;
    onClick: React.MouseEventHandler<HTMLElement> | undefined
}

const OtherInfoProfile: FC<OtherInfoProfileProps> = ({
    selectProfile,
    onClick
}) => {
    return <div className="flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
            <div className="relative">
                <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 font-bold text-white text-[18px]">DA</span>
                <img alt="Ảnh minh họa" src={images.patientAvatar} width={62} height={62} />
            </div>

            <div className="flex flex-col items-start">
                <span className="font-bold text-[16px]">{selectProfile?.name}</span>
                <span className="text-gray-600 text-sm">Mã BN: {selectProfile?.id}</span>
            </div>
        </div>

        <Alert className="text-left" message="Hoàn thiện thông tin để đặt khám và quản lý hồ sơ y tế tốt hơn." banner />

        <div className="flex flex-col gap-y-2 items-start text-[15px]">
            <span className="font-medium text-[17px]">Thông tin bổ sung</span>
            <div className="flex justify-between items-center w-full">
                <span>Họ và tên</span>
                <span className="font-medium">{selectProfile?.name}</span>
            </div>
            <div className="flex justify-between items-center w-full">
                <span>Ngày sinh</span>
                <span className="font-medium">{dayjs(selectProfile?.dateOfBirth).format('DD/MM/YYYY') ?? '--'}</span>
            </div>
            <div className="flex justify-between items-center w-full">
                <span>Số điện thoại</span>
                <span className="font-medium">{selectProfile?.phoneNumber ?? '--'}</span>
            </div>
            <div className="flex justify-between items-center w-full">
                <span>Giới tính</span>
                <span className="font-medium">{selectProfile?.gender ?? '--'}</span>
            </div>
            <div className="flex justify-between items-start w-full">
                <span className="whitespace-nowrap">Địa chỉ</span>
                <span className="font-medium text-right">{selectProfile?.address ?? '--'}</span>
            </div>
        </div>

        <div className="flex flex-col gap-y-2 items-start text-[15px]">
            <span className="font-medium text-[17px]">Thông tin bổ sung</span>
            <div className="flex justify-between items-center w-full">
                <span>Số CMND/CCCD</span>
                <span className="font-medium">{selectProfile?.identityCard ?? '--'}</span>
            </div>
            <div className="flex justify-between items-center w-full">
                <span>Dân tộc</span>
                <span className="font-medium">{selectProfile?.ethnicGroup ?? '--'}</span>
            </div>
            <div className="flex justify-between items-center w-full">
                <span>Nghề nghiệp</span>
                <span className="font-medium">{selectProfile?.major}</span>
            </div>
            <div className="flex justify-between items-center w-full">
                <span>Email</span>
                <span className="font-medium">{selectProfile?.email}</span>
            </div>
            <div className="flex justify-between items-center w-full">
                <span>Mối quan hệ</span>
                <span className="font-medium">{selectProfile?.relationship}</span>
            </div>
        </div>
        <div className="flex justify-end gap-x-3 items-center w-full">
            <span className="text-red-600">Xóa hồ sơ</span>
            <Button onClick={onClick} size="large" type="primary">Thay đổi thông tin</Button>
        </div>
    </div>
}

export interface ProfileRequest {
    name: string;
    phoneNumber: string;
    identityCard: string;
    dateOfBirth: Dayjs;
    gender: string;
    address: string;
    major: string;
    email: string;
    relationship: string;
    ethnicGroup: string;

}

export interface EditProfileRequest extends ProfileRequest {
    profileId: string;
}

type FormCreateProfileProps = {
    onSubmit: (values: ProfileRequest) => Promise<boolean>;
    profile: ProfileResource | null;
    isEdit: boolean;
}

const FormCreateProfile: FC<FormCreateProfileProps> = ({
    onSubmit,
    profile,
    isEdit
}) => {
    const [form] = Form.useForm<ProfileRequest>()

    const onFinish: FormProps<ProfileRequest>['onFinish'] = async (values) => {
        const isSuccess = await onSubmit(values);
        if (isSuccess) {
            form.resetFields()
        }
     
    };

    return <Form
        form={form}
        name="basic"
        onFinish={onFinish}
        initialValues={isEdit ? {
            name: profile?.name,
            phoneNumber: profile?.phoneNumber,
            identityCard: profile?.identityCard,
            dateOfBirth: dayjs(profile?.dateOfBirth),
            gender: profile?.gender,
            address: profile?.address,
            major: profile?.major,
            email: profile?.email,
            ethnicGroup: profile?.ethnicGroup,
            relationship: profile?.relationship
        } : {
            relationship: 'Khác',
            gender: 'Nam'
        }}
        layout="vertical"
        autoComplete="off"
    >
        <Form.Item<ProfileRequest>
            label='Họ và tên'
            name='name'
            rules={[{ required: true, message: 'Họ và tên không được để trống!' }]}
        >
            <Input size="large" placeholder="Họ và tên ..." />
        </Form.Item>
        <Form.Item<ProfileRequest>
            label='Số điện thoại'
            name='phoneNumber'
            rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
        >
            <Input size="large" placeholder="Số điện thoại ..." />
        </Form.Item>

        <Form.Item<ProfileRequest>
            label='Ngày sinh'
            name='dateOfBirth'
            rules={[{ required: true, message: 'Ngày sinh không được để trống!' }]}
        >
            <DatePicker size="large" className="w-full" placeholder="Chọn ngày sinh" />
        </Form.Item>
        <Form.Item<ProfileRequest>
            label='Giới tính'
            className="flex justify-start"
            name='gender'
            rules={[{ required: true, message: 'Giới tính không được để trống!' }]}
        >
            <Radio.Group>
                <Radio value={'Nam'}>Nam</Radio>
                <Radio value={'Nữ'}>Nữ</Radio>
            </Radio.Group>
        </Form.Item>

        <Form.Item<ProfileRequest>
            label="Địa chỉ"
            name="address"
        >
            <Input size="large" placeholder="Địa chỉ" />
        </Form.Item>


        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <Form.Item<ProfileRequest>
                label="Số CCCD"
                name="identityCard"
            >
                <Input size="large" placeholder="Số CCCD" />
            </Form.Item>

            <Form.Item<ProfileRequest>
                label="Dân tộc"
                name="ethnicGroup"
            >
                <Select
                    showSearch
                    placeholder="Chọn dân tộc"
                    options={ethnicGroupsVietnam.map(item => ({
                        value: item,
                        key: item
                    }))}
                    size="large"
                />
            </Form.Item>
        </div>

        <Form.Item<ProfileRequest>
            label="Nghề nghiệp"
            name="major"
        >
            <Input size="large" placeholder="Nghề nghiệp" />
        </Form.Item>

        <Form.Item<ProfileRequest>
            label="Email"
            name="email"
        >
            <Input size="large" placeholder="Email" />
        </Form.Item>

        <Form.Item<ProfileRequest>
            label='Mối quan hệ'
            className="flex justify-start"
            name='relationship'
        >
            <Radio.Group className="grid grid-cols-3 gap-x-6 gap-y-4 w-full" >
                <div className="py-2 px-8 rounded-md border-[1px] border-gray-200">
                    <Radio value={'Cha'}>Cha</Radio>
                </div>
                <div className="py-2 px-8 rounded-md border-[1px] border-gray-200">
                    <Radio value={'Mẹ'}>Mẹ</Radio>
                </div>
                <div className="py-2 px-8 rounded-md border-[1px] border-gray-200">
                    <Radio value={'Con'}>Con</Radio>
                </div>
                <div className="py-2 px-8 rounded-md border-[1px] border-gray-200">
                    <Radio value={'Chồng'}>Chồng</Radio>
                </div>
                <div className="py-2 px-8 rounded-md border-[1px] border-gray-200">
                    <Radio value={'Vợ'}>Vợ</Radio>
                </div>
                <div className="py-2 px-8 rounded-md border-[1px] border-gray-200">
                    <Radio value={'Khác'}>Khác</Radio>
                </div>

            </Radio.Group>
        </Form.Item>


        <div className="flex justify-end">
            <Form.Item>
                <Button className="mt-4" type="primary" htmlType="submit">
                    Lưu lại
                </Button>
            </Form.Item>
        </div>
    </Form>
}

const Profile: FC = () => {
    const [profiles, setProfiles] = useState<ProfileResource[]>([])
    const [selectProfile, setSelectProfile] = useState<ProfileResource | null>(null)
    const [isShowForm, setIsShowForm] = useState<boolean>(false)
    const [isEditProfile, setIsEditProfile] = useState<boolean>(false)

    const fetchProfiles = async () => {
        const response = await patientService.getAllProfiles();
        if (response.success) {
            const data = response.data;

            if (data.length > 0) {
                setSelectProfile(data[0])
            }
            setProfiles(data)
        }
    }

    useEffect(() => {
        fetchProfiles();
    }, [])

    const handleSubmit = async (values: ProfileRequest): Promise<boolean> => {
        if (isEditProfile && selectProfile) {
            const response = await patientService.updateProfile(selectProfile.id, values);
            if (response.success) {
                message.success(response.message);
                setIsEditProfile(false)
                fetchProfiles();
                return true;
            } else {
                message.error(response.message);
                return false;
            }
        } else if (!isEditProfile) {
            const response = await patientService.createProfile(values);
            if (response.success) {
                message.success(response.message);
                fetchProfiles();
                return true;
            } else {
                message.error(response.message);
                return false;
            }
        }

        return false;
    }

    return <div className="flex flex-col items-start gap-y-6">
        <span className="text-xl font-medium">Hồ sơ </span>
        <div className="grid grid-cols-12 gap-4 w-full">
            <div className="col-span-5 border-r-[0.5px] border-gray-100 w-full p-2">
                <input placeholder="Mã giao dịch, tên dịch vụ, bệnh nhân" className="px-3 py-2 rounded-md w-full bg-white border-[1px] border-gray-200 outline-none" />
                <div className="flex flex-col gap-2 py-2">
                    {profiles.map(profile => <ProfilePatient checked={profile.id == selectProfile?.id} onClick={() => {
                        setIsShowForm(false)
                        setSelectProfile(profile)
                    }} key={profile.id} profile={profile} />)}
                </div>
                <Divider className="mt-0" />
                <button onClick={() => {
                    setIsEditProfile(false)
                    setIsShowForm(true)
                }} className="py-3 px-4 rounded-md bg-blue-100 text-primary font-medium text-sm w-full hover:bg-primary hover:text-white">Thêm hồ sơ</button>
            </div>
            <div className="col-span-7 px-4">
                {!isShowForm ? selectProfile && <OtherInfoProfile onClick={() => {
                    setIsEditProfile(true)
                    setIsShowForm(true)
                }} selectProfile={selectProfile} />
                    : <div>
                        <div className="flex flex-col items-start">
                            <span className="font-semibold text-lg">{isEditProfile ? 'Điều chỉnh thông tin' : 'Thêm hồ sơ mới'}</span>
                            <Divider className="my-3" />
                        </div>
                        <FormCreateProfile
                            profile={selectProfile}
                            isEdit={isEditProfile}
                            onSubmit={handleSubmit}
                        />
                    </div>
                }
            </div>
        </div>
    </div>
};

export default Profile;
