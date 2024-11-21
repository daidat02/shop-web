import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Avatar, Badge, Flex } from 'antd';
import { MessageOutlined, UserOutlined, SendOutlined, CloseOutlined, CameraOutlined, PaperClipOutlined } from '@ant-design/icons';
import './MiniChat.css';
import useSocket from '../../services/webSocket';
import { getMessages } from '../../api/API_Message';
import { createAxiosInstance } from '../../createInstance';
import { getCustomers } from '../../api/API_User';

const FixedChatButton = () => {
    const socket = useSocket();
    const account = useSelector((state) => state.auth?.account);
    const accessToken = account?.accessToken;
    const user = account?.user;
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    const dispatch = useDispatch();
    let axiosIWT = createAxiosInstance(account, dispatch);

    
    const messagesEndRef = useRef(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    // Fetch users and initialize selected user
    useEffect(() => {
        const fetchApi = async () => {
            try {
                const usersData = await getCustomers(accessToken, axiosIWT); // Lọc chỉ người dùng
                setUsers(usersData?.data);
                setSelectedUser(usersData?.data[0] || null);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };
        fetchApi();
    }, [accessToken]);

    // Fetch messages when selected user changes
    useEffect(() => {
        const fetchMessages = async () => {
            if (!user || !selectedUser) return;
            try {
                const messageData = await getMessages(user?._id, selectedUser?._id);
                setMessages(messageData?.data || []);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        };
        fetchMessages();
    }, [selectedUser, user?._id]);

    // Handle new incoming messages from socket
    useEffect(() => {
        if (!socket) return;

        socket.on('receiveMessage', (data) => {
            console.log('Received message:', data);
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [socket]);

    const sendMessage = () => {
        console.log(selectedUser?.user_name)
        if (currentMessage.trim() === '') return;
        if (!selectedUser) {
            console.error('No user selected to send the message');
            return;
        }
        socket.emit('sendMessage', { 
            message: currentMessage, 
            receiverId: selectedUser._id
        });
        setCurrentMessage('');
    };

    useEffect(() => {
        if (messages.length === 0) return;
        scrollToBottom();
    }, [messages]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="fixed-chat-container">
            {!isModalVisible ? (
                <Button 
                    type="primary" 
                    shape="circle" 
                    icon={<MessageOutlined />} 
                    onClick={toggleModal}
                    className="fixed-chat-button"
                />
            ) : (
                <div className="chat-modal">
                    <div className="chat-header">
                        <div className="user-avatar-wrapper">
                            <Avatar icon={<UserOutlined />} className="user-avatar" />
                            <Badge status="success" className="user-status-badge" />
                        </div>
                        <div className="user-status">
                            <span className="user-status-name">Support</span>
                            <span className="status-active">Đang Hoạt Động</span>
                        </div>
                        <Button 
                            type="text" 
                            icon={<CloseOutlined />} 
                            onClick={toggleModal}
                            className="close-button"
                        />
                    </div>
                    
                    <div className="chat-messages">
                        {messages?.map((msg, index) => {
                            const isOwnMessage = msg.senderId === user?._id;
                            
                            return (
                                <div 
                                    key={index}
                                    className={`message-wrapper ${isOwnMessage ? 'own-message' : ''}`}
                                >
                                   <div style={{display:'flex', flexDirection:'column'}}>

                                    {!isOwnMessage && (
                                        <div className="message-sender">{msg.senderName}</div>
                                    )}

                                    <div className={`message-bubble ${isOwnMessage ? 'own' : 'other'}`}>
                                            <div className="message-content">{msg.message}</div>
                                            
                                        </div>
                                        <div className={`message-time ${isOwnMessage ? 'time-own' : 'time-other'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </div>
                                   </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef}/>
                    </div>
                    
                    <div className="chat-footer">
                        <div className="chat-input-container">
                            <Input
                                value={currentMessage}
                                onChange={(e) => setCurrentMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Nhập Tin Nhắn..."
                                className="chat-input"
                            />
                            <CameraOutlined className="chat-input-icon" />
                            <PaperClipOutlined className="chat-input-icon" />            
                        </div>

                        <div 
                            onClick={sendMessage}
                            className="send-button"
                        >
                            <SendOutlined className="rotate-icon" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FixedChatButton;