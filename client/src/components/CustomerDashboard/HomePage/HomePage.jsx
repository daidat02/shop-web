import React, { useRef,useState,useEffect } from 'react';
import './homepage.css';
import {Rate}  from 'antd';
import {StarOutlined,GiftOutlined,HomeOutlined,MobileOutlined,ShoppingOutlined,PieChartOutlined,HeartOutlined }  from '@ant-design/icons';
import CategorySection from '../Product/CategorySection'
import { getProducts } from '../../../api/API_Product';
import { getCategories } from '../../../api/API_Category';
import LoadingOverlay from '../ActionComponents/LoadingOverlay';

const HomePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchApi = async () => {
            setIsLoading(true)
            try {
                const productData = await getProducts();
                const activeProducts = productData.filter(product => product.state === 'active'); // Lọc sản phẩm có trạng thái "active"
                setProducts(activeProducts);
                const categoriesData = await getCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.log("Không thể tải danh mục");
            }finally{
                setIsLoading(false)
            }
        };
        fetchApi();
    }, []);
   
    const topDeals = products?.filter(product => product.isTopDeal);
    const bestOffers = products?.filter(product => product.isBestOffer);

    // Group remaining products by category
    const productsByCategory = products?.reduce((acc, product) => {
        const category = product.category.category_name;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {});

    return (
        <div className="customer-homepage-container">
            {isLoading &&(
                <LoadingOverlay isLoading={isLoading}/>
            )}
            <div className='categories-container'>
                <div className='category'>
                    <div className='category-icon' style={{background:'#ffefca'}}><StarOutlined style={{color:'orange'}} /></div>
                    <span className='category-name'>Deals</span>
                </div>
                <div className='category'>
                    <div className='category-icon'><ShoppingOutlined /></div>
                    <span className='category-name'>Grocery</span>
                </div>
                <div className='category'>
                    <div className='category-icon'><StarOutlined /></div>
                    <span className='category-name'>Fashion</span>
                </div>
                <div className='category'>
                    <div className='category-icon'><MobileOutlined /></div>
                    <span className='category-name'>Mobile</span>
                </div>
                <div className='category'>
                    <div className='category-icon'><StarOutlined /></div>
                    <span className='category-name'>Skincare</span>
                </div>
                <div className='category'>
                    <div className='category-icon'><HomeOutlined /></div>
                    <span className='category-name'>Home</span>
                </div>
                <div className='category'>
                    <div className='category-icon'><StarOutlined /></div>
                    <span className='category-name'>Dining</span>
                </div>
                <div className='category'>
                    <div className='category-icon'><GiftOutlined /></div>
                    <span className='category-name'>Gifts</span>
                </div>
                <div className='category'>
                    <div className='category-icon'><HeartOutlined /></div>
                    <span className='category-name'>Wish List</span>
                </div>
                <div className='category'>
                    <div className='category-icon'><PieChartOutlined /></div>
                    <span className='category-name'>Others</span>
                </div>
            </div>      
            <div className='banner'>
                {/* Banner content */}
            </div>
                
            <div className='homepage-content'>
                
                 {bestOffers?.length > 0 && (
                    <CategorySection 
                        title="Flash Sale" 
                        products={bestOffers}
                        type="best-offers"
                        layout="horizontal"
                    />
                )}
                {/* Best Offers Section */}
                {bestOffers?.length > 0 && (
                    <CategorySection 
                        title="Top Deals today" 
                        products={bestOffers}
                        type="best-offers"
                        layout="horizontal"
                    />
                )}

                {/* Top Deals Section */}
                {topDeals?.length > 0 && (
                    <CategorySection 
                        title="Best Offers" 
                        products={topDeals}
                        type="top-deals"
                        layout="horizontal"
                    />
                )}
        
                {/* Regular Category Sections */}
                    <CategorySection 
                        // key={category} 
                        title={'Sản Phẩm Nổi Bật'} 
                        products={products} 
                        layout="vertical"
                    />
            </div>
        </div>
    );
};

export default HomePage;