import { FC, useEffect, useRef, useState } from "react";
import { Avatar, Button, Input, Space, Tooltip } from "antd";
import { MoreOutlined, SendOutlined } from '@ant-design/icons'
import Message from "../../components/chat/Message";
import images from "../../assets";
import { MessageRequest, MessageResource } from "../../app/signalr";
import messageService from "../../services/message-service";
import { useParams } from "react-router-dom";
import Connector from '../../app/signalr/signalr-connection'
import { UserResource } from "../../resources";
import userService from "../../services/user-service";
import { formatTimeTypeAgo } from "../../utils/format";

const ContactPage: FC = () => {
    const { recipientId } = useParams()
    const [recipient, setRecipient] = useState<UserResource | null>(null)
    const [messages, setMessages] = useState<MessageResource[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { sendMessage, events } = Connector();

    const [message, setMessage] = useState<MessageRequest>({
        content: '',
        recipientId: recipientId!
    });

    const fetchMessages = async (id: string) => {
        const response = await messageService.getAllMessages(id);
        if (response.success) {
            setMessages(response.data)
        }
    }

    const fetchRecipient = async (id: string) => {
        const response = await userService.getUserById(id);
        if (response.success) {
            setRecipient(response.data)
        }
    }

    useEffect(() => {
        if (recipientId) {
            fetchRecipient(recipientId)
            fetchMessages(recipientId)
        }
    }, [recipientId])

    useEffect(() => {
        if (messagesEndRef.current)
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages])

    useEffect(() => {
        events((message) => setMessages(prev => [...prev, message]));
    }, []);

    const handleSendMessage = () => {
        sendMessage(message)
        setMessage({
            ...message,
            content: ''
        })
    }

    return <div className="flex flex-col h-full relative border-[1px] border-gray-100">
        <div className="flex items-center justify-between bg-white border-[1px] border-gray-200 p-2">
            <div className="flex items-center gap-x-2 hover:bg-gray-100 p-2 rounded-md">
                <div className="relative">
                    <Avatar
                        src={images.doctor}
                        size='large'
                    />
                    {recipient?.isOnline && <span className="absolute bottom-0 right-0 w-[10px] h-[10px] rounded-full border-2 border-white bg-green-500"></span>}
                </div>

                <div className="flex flex-col items-start">
                    <b>{recipient?.fullName}</b>
                    <p className="text-[13px] text-left">
                        {recipient?.isOnline ? 'Đang hoạt động' : `Hoạt động ${formatTimeTypeAgo(new Date(recipient?.recentOnlineTime!))}`}
                    </p>

                </div>
            </div>
            <Space wrap>
                <Tooltip title="Thông tin về cuộc trò chuyện">
                    <Button
                        type="text"
                        shape="circle"
                        icon={<MoreOutlined />}
                    ></Button>
                </Tooltip>
            </Space>
        </div>
        <div className="flex flex-col gap-y-3 px-2 py-4 h-full overflow-y-auto scrollbar-w-2 mb-16 scrollbar-h-4 custom-scrollbar">
            {messages.map(message => <Message key={message.id} isMe={message.recipient.id == recipientId} message={message} />)}
            <div ref={messagesEndRef}></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 border-[1px] border-gray-200 bg-white p-2 flex items-center gap-x-2">
            <Input
                placeholder="Soạn tin nhắn..."
                showCount
                size="large"
                value={message.content}
                onChange={(e) => setMessage({
                    ...message,
                    content: e.target.value
                })}
            />
            <Tooltip title="Nhấn enter để gửi">
                <Button
                    icon={<SendOutlined />}
                    type="text"
                    size="large"
                    shape="circle"
                    disabled={!message.content}
                    onClick={handleSendMessage}
                >
                </Button>
            </Tooltip>
        </div>
    </div>
};

export default ContactPage;
