// components/LoadingOverlay.js
import React from 'react';
import { Spin } from 'antd';
import './loading.css';

const LoadingOverlay = ({ isLoading }) => {
    if (!isLoading) return null;
    
    return (
        <div className="loading-overlay">
           <div className='loading-spin'>
             <Spin size="large" />
           </div>
        </div>
    );
};

export default LoadingOverlay;
