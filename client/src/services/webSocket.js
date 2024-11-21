import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const useSocket = () => {
  const account = useSelector((state) => state.auth?.account);
  const token = account?.accessToken;

  const [socket, setSocket] = useState(null); // Sử dụng state để quản lý socket

  // Tạo socket khi token thay đổi
  useEffect(() => {
    if (!token) return;

    const socketInstance = io("http://localhost:3000", {
      query: { token },
    });
    
    // Lắng nghe sự kiện khi kết nối thành công
    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket server:", socketInstance.id);
      socketInstance.emit("clientConnected", { message: "Client has connected" });
    });

    // Xử lý sự kiện ngắt kết nối
    socketInstance.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    // Cập nhật socket vào state
    setSocket(socketInstance);

    // Ngắt kết nối khi component unmount hoặc token thay đổi
    return () => {
      socketInstance.disconnect();
      setSocket(null); // Đảm bảo socket được dọn dẹp
    };
  }, [token]); // Chạy lại khi token thay đổi

  return socket;
};

export default useSocket;
