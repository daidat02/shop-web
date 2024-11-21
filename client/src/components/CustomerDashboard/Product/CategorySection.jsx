import React, { useRef,useState } from 'react';
import {LeftOutlined,RightOutlined}  from '@ant-design/icons';
import ProductCard  from './ProductCard'

const CategorySection = ({ title, products, type, layout }) => {
    const ITEMS_PER_CLICK = 8; // Số sản phẩm hiển thị thêm mỗi lần nhấn
    const INITIAL_HEIGHT = 800; // Chiều cao ban đầu cho 2 hàng sản phẩm
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_CLICK);
    const [height, setHeight] = useState(800);
    const scrollRef = useRef(null);

    const scrollLeft = () => {
        scrollRef.current.scrollBy({ left: -256, behavior: 'smooth' });
    };
    
    const scrollRight = () => {
        scrollRef.current.scrollBy({ left: 256, behavior: 'smooth' });
    };

    // Sử dụng visibleCount để lấy sản phẩm hiển thị dựa trên số lượng đã nhấn "Xem Thêm"
    const displayedProducts = layout === 'vertical' ? products?.slice(0, visibleCount) : products;

    const handleShowMore = () => {
        setVisibleCount(prevCount => prevCount + ITEMS_PER_CLICK); // Tăng số lượng sản phẩm hiển thị
        setHeight(prevHeight => prevHeight + INITIAL_HEIGHT); // Tăng chiều cao thêm 600px mỗi lần nhấn
    };

    return (
        <div className={`category-section ${type ? `category-${type}` : ''} ${layout === 'horizontal' ? 'horizontal' : 'vertical'}`}>
            <div className='category-title-container'> 
                <h2 className="category-title">{title}</h2>
                <span className='view-all'>Xem tất cả <RightOutlined /></span>
            </div>
            <div className='category-content'>
                {layout === 'horizontal' && (
                    <button className="scroll-button left" onClick={scrollLeft}><LeftOutlined /></button>
                )}
                <div className="products-grid" ref={scrollRef} style={{ maxHeight: height, overflowY: 'hidden' }}>
                    {displayedProducts?.map(product => (
                        <ProductCard key={product._id} product={product}/>
                    ))}
                </div>
                {layout === 'horizontal' && (
                    <button className="scroll-button right" onClick={scrollRight}><RightOutlined /></button>
                )}
                {layout === 'vertical' && visibleCount < products?.length && (
                    <div className="show-more" onClick={handleShowMore}>
                        <span>Xem Thêm</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategorySection
