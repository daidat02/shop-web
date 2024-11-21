import jwt from 'jsonwebtoken';
import DB_Connection from '../model/DBConnection.js';
import { userSockets } from '../webSocket/socketStore.js';
import Message from '../model/MessageSchema.js';
const authenticateToken = async (socket, next) => {
    const token = socket.handshake.query.token;

    if (!token) {
        return next(new Error('Token is required'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
        
        // Kiểm tra token hết hạn
        const currentTime = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại tính bằng giây
        if (decoded.exp && decoded.exp < currentTime) {
            return next(new Error('Token has expired'));
        }

        // Tìm kiếm người dùng
        const user = await DB_Connection.User.findById(decoded.id);
        if (!user) {
            return next(new Error('User not found'));
        }

        // Gán thông tin user vào socket
        socket.user = user;
        next();
    } catch (error) {
        next(new Error('Invalid token'));
    }
};


const sendMessage = async (socket, data) => {
    try {
        const { message, receiverId } = data;
        const sender = socket.user;

        // Validate input
        if (!message || !sender) {
            throw new Error('Missing required fields');
        }
        
        console.log(`${sender?.user_name} (${sender?.role}): đã gửi tin nhắn`);

        // Tạo đối tượng tin nhắn
        const messageData = {
            senderId: sender._id,
            senderName: sender.user_name,
            message: message,
            timestamp: new Date(),
            role: sender.role,
        };

        // Nếu là admin, gửi đến người nhận cụ thể
        if (sender.role === 'admin' || sender.role === 'customer') {
            if (!receiverId) {
                throw new Error('Admin must specify a receiver');
            }

            messageData.receiverId = receiverId;

            // Lưu tin nhắn vào database
            const newMessage = new Message(messageData);
            await newMessage.save();

            // Gửi tin nhắn đến sender
            socket.emit('receiveMessage', {
                ...messageData,
                isSender: true,
            });

            // Gửi tin nhắn đến người nhận nếu họ đang online
            const receiverSocket = userSockets.get(receiverId);
            if (receiverSocket?.connected) {
                receiverSocket.emit('receiveMessage', {
                    ...messageData,
                    isSender: false,
                });
                console.log('Đã gửi tin nhắn đến:', receiverId);
            } else {
                console.log(`Receiver ${receiverId} socket is not connected`);
            }
        } 
        // Nếu là customer, gửi đến tất cả admin
        // else if (sender.role === 'customer') {
        //     messageData.receiverId = 'allAdmins'; // Dùng ID đặc biệt để lưu trong database

        //     // Lưu tin nhắn vào database
        //     const newMessage = new Message(messageData);
        //     await newMessage.save();

        //     // Gửi tin nhắn đến tất cả admin đang kết nối
        //     userSockets.forEach((receiverSocket, receiverUserId) => {
        //         if (receiverSocket.user?.role === 'admin' && receiverSocket.connected) {
        //             receiverSocket.emit('receiveMessage', {
        //                 ...messageData,
        //                 isSender: false,
        //             });
        //             console.log(`Đã gửi tin nhắn đến admin: ${receiverUserId}`);
        //         }
        //     });

        //     // Gửi tin nhắn đến chính customer
        //     socket.emit('receiveMessage', {
        //         ...messageData,
        //         isSender: true,
        //     });
        // } 
        else {
            throw new Error('Role not supported');
        }

        return true;
    } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('messageError', { error: error.message });
        return false;
    }
};



const getMessages = async (req, res) => {
    try {
        const { userId, otherUserId } = req.query;
        const user = await DB_Connection.User.findOne({_id:userId})
        const otherUser = await DB_Connection.User.findOne({_id:otherUserId});

        if (!user || !otherUser) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }
        
        // Get messages between two users
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId }
            ]
        })
        .sort({ timestamp: 1 })
        .populate('senderId')
        .populate('receiverId');
        // Format messages for frontend
        const formattedMessages = messages.map(msg => ({
            id: msg._id,
            message: msg.message,
            timestamp: msg.timestamp,
            senderId: msg.senderId._id,
            senderName: msg.senderId.user_name,
            senderRole: msg.senderId.role,
            receiverId: msg.receiverId._id,
            receiverName: msg.receiverId.user_name,
            receiverRole: msg.receiverId.role
        }));

        res.status(200).json({
            success:true ,
            message:'Lấy tin nhắn thành công',
            data:formattedMessages
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Error fetching messages' });
    }
};

const updateUsers = async (socket,data,io)=>{
    try {
        const users = await DB_Connection.User.find();
        
    } catch (error) {
        
    }
}
export { sendMessage, authenticateToken, getMessages };