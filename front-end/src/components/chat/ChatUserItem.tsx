import { Avatar } from "antd";
import { FC } from "react";
import images from "../../assets";
import { GroupResource } from "../../app/signalr";
import { UserResource } from "../../resources";
import { Link } from "react-router-dom";
import { formatTimeTypeAgo } from "../../utils/format";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";

type ChatUserItemProps = {
    contact: GroupResource;
    recipient?: UserResource;
    url: string;
}

const getNameUser = (recipient: UserResource | undefined, contact: GroupResource, currentUser: UserResource | undefined) => {
    if(contact.clinic && currentUser?.role !== 'MANAGER') {
        return contact.clinic.name;
    }

    return recipient?.fullName
}

const ChatUserItem: FC<ChatUserItemProps> = ({
    contact,
    recipient,
    url
}) => {
    const { user } = useSelector(selectAuth)

    return <Link to={url} className="cursor-pointer flex items-center gap-x-3 hover:bg-gray-100 hover:text-black p-2 rounded-md ">

        <div className="relative">
            <Avatar
                src={recipient?.thumbnail ?? images.doctor}
                size='large'
            />
            {recipient?.isOnline && <span className="absolute bottom-0 right-1 w-[12px] h-[12px] rounded-full border-2 border-white bg-green-500"></span>}
        </div>

        <div className="flex flex-col items-start flex-1">
            <b>{getNameUser(recipient, contact, user)}</b>
            <div className="flex items-center justify-between text-[14px] gap-x-2">
                <p className="w-32 truncate text-left text-gray-500">{contact.message.content}</p>
                <span className="text-sky-600 text-sm">{formatTimeTypeAgo(new Date(contact.message.sentAt))}</span>
            </div>

        </div>
    </Link>
};

export default ChatUserItem;
