import React, { useEffect, useState } from 'react';
import { Rate, Slider,Tag } from 'antd';
import { getProducts, getTags } from '../../../api/API_Product';
import { getCategories } from '../../../api/API_Category';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import './product.css'
const Product = () => {
    const [products, setProducts] = useState();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const productData = await getProducts();
                const activeProducts = productData.filter(product => product.state === 'active'); // Lọc sản phẩm có trạng thái "active"
                setProducts(activeProducts);
                setFilteredProducts(activeProducts);
                
                const categoriesData = await getCategories();
                setCategories(categoriesData);
                const tagData = await getTags();
                setTags(tagData.data);
            } catch (error) {
                console.log("Không thể tải danh mục");
            }
        };
        fetchApi();
    }, []);

    const handlePriceChange = (value) => {
        setPriceRange(value);
        filterProducts(selectedCategory, value);
    };

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
        filterProducts(categoryId === selectedCategory ? null : categoryId, priceRange);
    };

    const filterProducts = (category, price) => {
        let filtered = products || [];
        
        if (category) {
            filtered = filtered.filter(product => product.category_id === category);
        }
        
        filtered = filtered.filter(product => 
            product.price >= price[0] && product.price <= price[1]
        );
        
        setFilteredProducts(filtered);
    };

    const handleProductClick = (id) => {
        navigate(`/product-detail/${id}`);
    };

    return (
        <div className="customer-content-container">
            <div className="filter-product-container">
                <div className="filter category-filter">
                    <h3 className="filter-title">Categories</h3>
                    <div className="list-category">
                        <ul className="category-list">
                            {/* {categories?.map((category) => (
                                <li
                                    key={category.id}
                                    className={`category-item ${selectedCategory === category.id ? 'selected' : ''}`}
                                    onClick={() => handleCategoryClick(category.id)}
                                >
                                    {category.category_name}
                                </li>
                            ))} */}
                        </ul>
                    </div>

                    <div className="price-filter">
                        <h3 className="filter-title">Price Range</h3>
                        <Slider
                            range
                            min={0}
                            max={1000}
                            defaultValue={priceRange}
                            onChange={handlePriceChange}
                            className="price-slider"
                        />
                        <div className="price-range-display">
                            <span>${priceRange[0]}</span>
                            <span>${priceRange[1]}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="products-container">
                {(filteredProducts || []).map((product) => (
                    <div 
                        className="card-product" 
                        key={product.product_id}
                        onClick={() => handleProductClick(product.product_id)}
                    >
                        <div className="card-image">
                            <img alt={product.product_name} src={product?.images[0]?.url} />
                        </div>
                        <div className="card-content">
                            <h6 className="product-name">{product.product_name}</h6>
                            <div className="rate-container">
                                <Rate disabled defaultValue={5} className="custom-rate" />
                                <h6>(74 people rated)</h6>
                            </div>
                            <div className='tag-container'>
                                {tags?.map((tag)=>(
                                    <Tag color="blue">{tag.tag}</Tag>
                                ))}
                            </div>
                            <div className="price-container">
                                <h4 className="product-sale-price">$100</h4>
                                <h3 className="product-price">${product.price}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

           
        </div>
    );
};

export default Product;