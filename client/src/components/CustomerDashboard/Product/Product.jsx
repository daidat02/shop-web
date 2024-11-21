import React, { useEffect, useState } from 'react';
import { Rate, Slider, Tag, Spin } from 'antd';
import { getProducts, getTags } from '../../../api/API_Product';
import { getCategories } from '../../../api/API_Category';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './product.css'
import CategorySection from './CategorySection';
import LoadingOverlay from '../ActionComponents/LoadingOverlay';

const Product = () => {
    const [products, setProducts] = useState();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [sortBy, setSortBy] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const productData = await getProducts();
                const activeProducts = productData.filter(product => product.state === 'active');
                setProducts(activeProducts);
                setFilteredProducts(activeProducts);
                setIsLoading(true)
                const categoriesData = await getCategories();
                setCategories(categoriesData);
                const tagData = await getTags();
                setTags(tagData.data);
            } catch (error) {
                console.log("Không thể tải danh mục");
            } finally {
                setIsLoading(false)
            }
        };
        fetchApi();
    }, []);

 
    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
        filterProducts(
            categoryId === selectedCategory ? null : categoryId
        );
        console.log(filteredProducts)
    };
    const handleShowAllProducts = () => {
        setSelectedCategory(null);
        setFilteredProducts(products); // Set lại tất cả sản phẩm
    };

    const filterProducts = (category) => {
        let filtered = products || [];
        if (category) {
            filtered = filtered.filter(product => product.category._id === category);
        }
        
        setFilteredProducts(filtered);
    };

    return (
        <div className="customer-content-container">
            <div className='container'>
                <div className="filter-product-container">
                    <div className="filter">
                        <div className="filter-section">
                            <ul className="category-list">
                                <li
                                    className={`category-item ${selectedCategory === null ? 'selected' : ''}`}
                                    onClick={handleShowAllProducts}
                                >
                                    Tất Cả Sản Phẩm
                                </li>
                                {categories.map(category => (
                                    <li
                                        key={category.id}
                                        className={`category-item ${selectedCategory === category._id ? 'selected' : ''}`}
                                        onClick={() => handleCategoryClick(category._id)}
                                    >
                                        {category.category_name}
                                    </li>
                                ))}
                            </ul>
                        </div>

                      
                    </div>
                </div>

                <div className="products-container">
                    {isLoading ? (
                        <LoadingOverlay isLoading={isLoading} />
                    ) : (
                        <CategorySection
                            products={filteredProducts}
                            layout="vertical"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Product;