import { Avatar, Divider } from "antd";
import { FC } from "react";
import images from "../../assets";
import { MessageResource } from "../../app/signalr";
import cn from "../../app/components";
import { Link } from "react-router-dom";

type MessageProps = {
    isMe?: boolean;
    message: MessageResource;
}

const getMessage = (message: MessageResource, isMe: boolean) => {
    switch (message.messageType) {
        case 'NORMAL':
            return <div className={cn('text-left max-w-[60%] break-words px-2 py-1 rounded-xl text-sm', isMe ? 'bg-sky-600 text-white' : 'bg-gray-200')}>
                {message.content}
            </div>

        case 'WARNING':
            return <div className='text-left max-w-[60%] break-words px-2 py-1 rounded-xl text-sm bg-orange-50 border-[1px] border-orange-400'>
                {message.content}
            </div>

        case 'NOTIFICATION':
            return <div className='text-left max-w-[60%] break-words rounded-xl text-sm bg-white text-black border-[1px] border-gray-300'>
                <p className="px-2 py-3">{message.content}</p>
                <Divider className="my-0" />
                <div className="flex justify-center py-[6px]">
                    <Link className="text-primary font-medium text-[13px]" to={`/appointment/`}>XEM PHIẾU KHÁM</Link>
                </div>
            </div>
    }
}

const Message: FC<MessageProps> = ({
    isMe = false,
    message,
}) => {
    return <div className={`flex gap-x-2 ${isMe && 'justify-end'} ${!isMe && 'items-end'}`}>
        {!isMe && <Avatar
            src={message.recipient.thumbnail ?? images.doctor}
        />}

        {getMessage(message, isMe)}
    </div>
};

export default Message;
