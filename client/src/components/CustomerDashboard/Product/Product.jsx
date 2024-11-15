import React, { useEffect, useState } from 'react';
import { Rate, Slider,Tag,Spin } from 'antd';
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
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const productData = await getProducts();
                const activeProducts = productData.filter(product => product.state === 'active'); // Lọc sản phẩm có trạng thái "active"
                setProducts(activeProducts);
                setFilteredProducts(activeProducts);
                setIsLoading(true)
                const categoriesData = await getCategories();
                setCategories(categoriesData);
                const tagData = await getTags();
                setTags(tagData.data);
            } catch (error) {
                console.log("Không thể tải danh mục");
            }finally{
                setIsLoading(false)
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

    return (
        <div className="customer-content-container">
            {/* <div className="filter-product-container">
                <div className="filter category-filter">
                    <h3 className="filter-title">Categories</h3>
                    <div className="list-category">
                        <ul className="category-list">
                            
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
            </div> */}
        
            <div className="products-container">
            {isLoading ? (
                    <LoadingOverlay isLoading={isLoading}/>
            ):(
                    <CategorySection
                    title={"Tất Cả Sản Phẩm"}
                    products={filteredProducts}
                    layout={'vertical'}
               />
            )}
               
            </div>

           
        </div>
    );
};

export default Product;