import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Giao diện mặc định của Quill

const RichTextEditor = () => {
  const [editorContent, setEditorContent] = useState('');

  const handleEditorChange = (content) => {
    setEditorContent(content); // Cập nhật nội dung editor
  };

  const handleSubmit = () => {
    console.log('Content:', editorContent); // In ra nội dung khi gửi
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      
      {/* React-Quill Editor */}
      <ReactQuill
        value={editorContent}
        onChange={handleEditorChange}
        theme="snow" // Chủ đề của Quill (có thể dùng 'bubble' hoặc 'snow')
        placeholder="Nhập nội dung của bạn..."
        style={{ height: '160px' ,background:'#fff', marginBottom:'70px '}} // Tùy chỉnh chiều cao của editor
      />
      
      {/* Xem trước nội dung */}
      {/* <div className="bg-gray-100 p-4 mt-4 rounded-lg">
        <div
          className="preview-content"
          dangerouslySetInnerHTML={{ __html: editorContent }} // Hiển thị nội dung dạng HTML
        />
      </div> */}

      {/* Nút gửi */}
      {/* <button
        onClick={handleSubmit}
        className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Gửi
      </button> */}
    </div>
  );
};

export default RichTextEditor;
