import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Button, Card, Avatar, Badge } from 'antd';
import { SendOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import useSocket from '../../services/webSocket';
import './ChatApp.css';
import { getCustomers } from '../../api/API_User';
import { getMessages } from '../../api/API_Message';
import getAxiosInstance, { createAxiosInstance } from '../../createInstance';

const ChatApp = () => {
    const socket = useSocket();
    const account = useSelector((state) => state.auth?.account);
    const accessToken = account?.accessToken;
    const user = account?.user;
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    
    const messagesEndRef = useRef(null);
    const dispatch = useDispatch();
    let axiosIWT = createAxiosInstance(account, dispatch);
    
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

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setUsers((prevUsers) =>
            prevUsers.map((u) =>
                u._id === user._id ? { ...u, unreadCount: 0 } : u
            )
        );
    };

    return (
        <div className="chat-container">
            <div className="user-list-card">
                <div className="user-list-header">
                    <h2>Chat</h2>
                    <Input
                        prefix={<SearchOutlined style={{ color: '#8a94ad' }} />}
                        placeholder="Tìm Kiếm"
                        size="middle"
                        style={{ padding: '6px 10px' }}
                    />
                </div>

                <div className="user-list">
                    {users?.map((u) => (
                        <div
                            key={u?._id}
                            className={`user-item ${selectedUser?._id === u._id ? 'selected' : ''}`}
                            onClick={() => handleUserSelect(u)}
                        >
                            <div className="user-avatar-wrapper">
                                <Avatar
                                    icon={<UserOutlined />}
                                    className="user-avatar"
                                />
                                <Badge
                                    status={u.status === 'online' ? 'success' : 'default'}
                                    className="user-status-badge"
                                />
                            </div>
                            <div className="user-info">
                                <div className="user-name-wrapper">
                                    <span className="user-name">{u.user_name}</span>
                                    {u.unreadCount > 0 && (
                                        <Badge count={u?.unreadCount} />
                                    )}
                                </div>
                                <span className="user-last-message">{u?.lastMessage}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Card
                className="chat-card"
                title={
                    <div className="chat-header">
                        <div className="user-avatar-wrapper">
                            <Avatar
                                icon={<UserOutlined />}
                                className="user-avatar"
                            />
                        </div>

                        <div className="user-status">
                            <span className="user-status-name">
                                {selectedUser && `${selectedUser.user_name}`}
                            </span>
                            <span className="status-active">
                                Đang Hoạt Động
                            </span>
                        </div>
                    </div>
                }
            >
                <div className="messages-container">
                    {messages?.map((msg, index) => {
                        const isOwnMessage = msg.senderId === user?._id;

                        return (
                            <div
                                key={index}
                                className={`message-wrapper ${isOwnMessage ? 'own-message' : ''}`}
                            >
                                {!isOwnMessage && (
                                    <Avatar icon={<UserOutlined />} className="message-avatar" />
                                )}
                                <div className={`message-bubble ${isOwnMessage ? 'own' : 'other'}`}>
                                    {!isOwnMessage && (
                                        <div className="message-sender">{msg.senderName}</div>
                                    )}
                                    <div className="message-content">{msg.message}</div>
                                    <div className="message-time">
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
                <div className="input-container">
                    <Input
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="message-input"
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={sendMessage}
                        className="send-button"
                    >
                        Send
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ChatApp;
