import { FC, useEffect, useState } from "react";
import { Divider, Flex, Input, Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
const { Title } = Typography
import ChatUserItem from "../chat/ChatUserItem";
import groupService from "../../services/group-service";
import { GroupResource } from "../../app/signalr";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";

const ContactSidebar: FC = () => {
    const [userContacts, setUserContacts] = useState<GroupResource[]>([])
    const { user } = useSelector(selectAuth)

    const fetchUserContacts = async () => {
        const response = await groupService.getAllGroupsPatient();
        if(response.success) {
            setUserContacts(response.data);
        }
    }

    useEffect(() => {
        fetchUserContacts();
    }, [])

    return <div className="col-span-4 h-full shadow">
        <div className="z-10 bg-white p-4">
            <Title level={4} className="text-left">Liên hệ hỗ trợ</Title>
            <Input placeholder="Nhập từ khóa tìm kiếm" prefix={<SearchOutlined />} />
        </div>
        <Divider className="m-0" />
        <Flex className="bg-white h-[85%] overflow-y-auto scrollbar-w-2 scrollbar-h-4 custom-scrollbar p-4" vertical gap={12}>
            {userContacts.map(contact => <ChatUserItem url={`/contact/${user?.id == contact.firstUser.id ? contact.lastUser.id : contact.firstUser.id}`} recipient={user?.id == contact.firstUser.id ? contact.lastUser : contact.firstUser} key={contact.groupName} contact={contact} />)}
        </Flex>
    </div>
};

export default ContactSidebar;
