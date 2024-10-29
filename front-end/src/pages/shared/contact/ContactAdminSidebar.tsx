import { FC, useEffect, useState } from "react";
import { Divider, Flex, Input, Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
const { Title } = Typography
import { GroupResource } from "../../../app/signalr";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../features/slices/auth-slice";
import ChatUserItem from "../../../components/chat/ChatUserItem";
import groupService from "../../../services/group-service";

const ContactAdminSidebar: FC = () => {
    const [userContacts, setUserContacts] = useState<GroupResource[]>([])
    const { user } = useSelector(selectAuth)

    const fetchUserContacts = async () => {
        const response = await groupService.getAllGroupsByLoggedInUser();
        if(response.success) {
            setUserContacts(response.data)
        }
    }

    useEffect(() => {
        fetchUserContacts();
    }, [])

    return <div className="col-span-4 h-full">
        <div className="z-10 bg-slate-100 p-4">
            <Title level={4} className="text-left">Liên hệ hỗ trợ</Title>
            <Input placeholder="Nhập từ khóa tìm kiếm" prefix={<SearchOutlined />} />
        </div>
        <Divider className="m-0" />
        <Flex className="bg-slate-50 h-[85%] overflow-y-auto scrollbar-w-2 scrollbar-h-4 custom-scrollbar p-4" vertical gap={12}>
            {userContacts.map(contact => <ChatUserItem url={`/${user?.role === 'MANAGER' ? 'manager' : 'd-owner'}/contact/${user?.id == contact.firstUser.id ? contact.lastUser.id : contact.firstUser.id}`} recipient={user?.id == contact.firstUser.id ? contact.lastUser : contact.firstUser} key={contact.groupName} contact={contact} />)}
        </Flex>
    </div>
};

export default ContactAdminSidebar;
