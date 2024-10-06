import axios from "axios";
import { message } from 'antd';
import { axiosConfig } from "../configs/axios.config";

// Hàm upload hình ảnh
export const uploadImages = async (file) => {
  const formData = new FormData();
  formData.append('images', file); // Thêm file vào FormData

  try {
    // Gửi request đến API upload
    const response = await axiosConfig.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Đặt header cho multipart
      },
    });

    // Nếu upload thành công, trả về URL hình ảnh
    return response.data.uploadedImages.map(img => img.url); // Giả định rằng API trả về một mảng hình ảnh đã upload
  } catch (error) {
    console.error(error);
    message.error('Upload ảnh thất bại'); // Hiển thị thông báo lỗi
    throw error; // Ném lỗi ra ngoài để xử lý ở nơi khác nếu cần
  }
};
