import { Server } from 'socket.io';
import { authenticateToken, sendMessage } from '../controllers/socketController.js';
import { userSockets } from './socketStore.js';



const configureWebSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3001", // Client chạy trên port 3001
            methods: ["GET", "POST"],
            credentials: true
        },
    });

    io.use(authenticateToken); // Xác thực token khi kết nối

    io.on('connection', (socket) => {
        const userId = socket.user?._id.toString();
        userSockets.set(userId, socket);

        console.log('User connected:', socket.user?.user_name);
        console.log('Số người dùng online:', userSockets.size);
         // Khi người dùng kết nối lại, đăng ký lại socket của họ
             socket.on('register', (userId) => {
            userSockets.set(userId, socket); // Lưu socket vào Map theo userId
            console.log(`User ${userId} registered with socket ID: ${socket.id}`);
            console.log('Số người dùng online:', userSockets.size);
        });

        // Lắng nghe sự kiện từ client
        socket.on('orderStatusChange', (data) => {
            console.log('Order status changed:', data);
            // Phát sự kiện tới tất cả client
            io.emit('orderUpdate', data);
        }); 
        
        // Nhận tin nhắn từ client
        socket.on('sendMessage', async (data) => {
            sendMessage(socket, data);
        });

        // Khi người dùng ngắt kết nối, xóa socket khỏi Map
        socket.on('disconnect', () => {
            userSockets.forEach((s, userId) => {
                if (s.id === socket.id) {
                    userSockets.delete(userId);
                    console.log(`User ${userId} disconnected`);
                }
            });
        });
    });

    return io;
};

export default configureWebSocket;
