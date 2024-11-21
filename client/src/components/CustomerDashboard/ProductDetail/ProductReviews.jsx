import React, { useState } from 'react';
import { Rate, Avatar, Comment, Pagination } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './productReview.css';

const ProductReviews = ({ product }) => {
    const [currentPage, setCurrentPage] = useState(1);
    
    // Mock review data - in a real app, this would come from an API
    const reviews = [
        {
            id: 1,
            user: 'Nguyễn Văn A',
            rating: 5,
            date: '20/11/2024',
            comment: 'Sản phẩm rất tốt, đúng như mô tả. Giao hàng nhanh, đóng gói cẩn thận.',
            images: [
                '/review-image-1.jpg',
                '/review-image-2.jpg'
            ]
        },
        {
            id: 2,
            user: 'Trần Thị B',
            rating: 4,
            date: '15/11/2024',
            comment: 'Chất lượng ổn, giá thành phù hợp. Sẽ ủng hộ shop.',
            images: [
                '/review-image-3.jpg'
            ]
        },
        // Add more mock reviews
    ];

    const reviewsPerPage = 5;
    const paginatedReviews = reviews.slice(
        (currentPage - 1) * reviewsPerPage, 
        currentPage * reviewsPerPage
    );

    return (
        <div className="product-reviews-container">
            <div className="reviews-header">
                <h2>Đánh Giá Sản Phẩm</h2>
                <div className="overall-rating">
                    <div className="rating-summary">
                        <div className="average-rating">
                            <span className="rating-number">4.7</span>
                            <Rate 
                                disabled 
                                defaultValue={5} 
                                style={{color: '#ffc107', fontSize: '20px'}} 
                            />
                        </div>
                        <div className="rating-details">
                            <div className="total-reviews">653 đánh giá</div>
                            <div className="rating-breakdown">
                                <div className="rating-bar">
                                    <span>5 sao</span>
                                    <div className="bar">
                                        <div 
                                            className="bar-fill" 
                                            style={{width: '85%', backgroundColor: '#ffc107'}}
                                        ></div>
                                    </div>
                                    <span>85%</span>
                                </div>
                                <div className="rating-bar">
                                    <span>4 sao</span>
                                    <div className="bar">
                                        <div 
                                            className="bar-fill" 
                                            style={{width: '12%', backgroundColor: '#ffc107'}}
                                        ></div>
                                    </div>
                                    <span>12%</span>
                                </div>
                                {/* Add more rating bars as needed */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="reviews-list">
                {paginatedReviews.map(review => (
                    <div key={review.id} className="review-item">
                        <div className="review-header">
                            <Avatar 
                                icon={<UserOutlined />} 
                                className="review-avatar" 
                            />
                            <div className="review-meta">
                                <div className="review-user">{review.user}</div>
                                <div className="review-date">{review.date}</div>
                            </div>
                            <Rate 
                                disabled 
                                defaultValue={review.rating} 
                                style={{color: '#ffc107'}} 
                            />
                        </div>
                        <div className="review-body">
                            <p>{review.comment}</p>
                            {review.images && (
                                <div className="review-images">
                                    {review.images.map((img, index) => (
                                        <img 
                                            key={index} 
                                            src={img} 
                                            alt={`Review image ${index + 1}`} 
                                            className="review-thumbnail"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="reviews-pagination">
                <Pagination 
                    current={currentPage}
                    total={reviews.length}
                    pageSize={reviewsPerPage}
                    onChange={(page) => setCurrentPage(page)}
                />
                <div>
                </div>
            </div>
        </div>
    );
};

export default ProductReviews;