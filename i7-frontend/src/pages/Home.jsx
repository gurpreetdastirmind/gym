import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import axiosInstance from '../api/axiosInstance';

// Static assets that are not dynamic
import iconAmino from '../images/no-amino.png';
import iconHeavyMetal from '../images/no-heavy.png';
import iconMelamine from '../images/no-melamine.png';
import iconAflatoxins from '../images/no-aflar.png';
import iconPesticides from '../images/no-pesticides.png';
import iconLabTested from '../images/no-party.png';

const Home = () => {
  const { cartCount, addToCart } = useCart();
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);      // ✅ NEW: state for products
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  // Fetch dynamic banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axiosInstance.get('/banners');
        const sortedBanners = response.data.sort((a, b) => a.position - b.position);
        setBanners(sortedBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // ✅ NEW: Fetch products from backend and show max 8 on home page
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/products');
        // Take only first 8 products for the home page
        setProducts(response.data.slice(0, 8));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Helper to get full image URL (handles uploaded files vs external URLs)
  const getImageUrl = (imgPath) => {
    if (!imgPath) return 'https://via.placeholder.com/300?text=No+Image';
    return imgPath.startsWith('http') ? imgPath : `https://i7-backend.onrender.com${imgPath}`;
  };

  const topBanners = banners.filter(b => b.position === 1 || b.position === 2);
  const bottomBanner = banners.find(b => b.position === 3);

  return (
    <div className="bg-white font-sans">
      
      <main className="container mx-auto px-2 md:px-4 py-2">
        
        {/* 1. DYNAMIC TOP BANNERS */}
        {topBanners.length > 0 ? (
          topBanners.map((banner) => (
            <div key={banner.id} className="w-full mb-3">
              <Link to={banner.link || '#'}>
                <img 
                  src={getImageUrl(banner.image)} 
                  alt={banner.title || `Banner`} 
                  className="w-full rounded-md shadow-sm object-cover" 
                />
              </Link>
            </div>
          ))
        ) : (
          !loading && (
            <div className="w-full mb-3 p-10 bg-gray-100 rounded-md text-center text-gray-500">
              No top banners found. Please add banners from the Admin Dashboard.
            </div>
          )
        )}

        {/* 2. Trust Badges Row */}
        <div className="flex flex-wrap justify-center md:justify-between items-center border-y border-gray-100 py-4 mb-6 bg-white">
          <div className="flex items-center justify-center px-2 md:px-4">
            <img src={iconAmino} alt="No Amino Spiking" className="h-8 md:h-10 w-auto object-contain" />
          </div>
          <div className="hidden md:block text-gray-300 text-lg font-light">|</div>
          <div className="flex items-center justify-center px-2 md:px-4">
            <img src={iconHeavyMetal} alt="No Heavy Metal" className="h-8 md:h-10 w-auto object-contain" />
          </div>
          <div className="hidden md:block text-gray-300 text-lg font-light">|</div>
          <div className="flex items-center justify-center px-2 md:px-4">
            <img src={iconMelamine} alt="No Melamine" className="h-8 md:h-10 w-auto object-contain" />
          </div>
          <div className="hidden md:block text-gray-300 text-lg font-light">|</div>
          <div className="flex items-center justify-center px-2 md:px-4">
            <img src={iconAflatoxins} alt="No Aflatoxins" className="h-8 md:h-10 w-auto object-contain" />
          </div>
          <div className="hidden md:block text-gray-300 text-lg font-light">|</div>
          <div className="flex items-center justify-center px-2 md:px-4">
            <img src={iconPesticides} alt="No Pesticides" className="h-8 md:h-10 w-auto object-contain" />
          </div>
          <div className="hidden md:block text-gray-300 text-lg font-light">|</div>
          <div className="flex items-center justify-center px-2 md:px-4">
            <img src={iconLabTested} alt="3rd Party Lab Tested" className="h-8 md:h-10 w-auto object-contain" />
          </div>
        </div>

        {/* 3. Product Section Header */}
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex items-center gap-3 md:gap-4">
            <h2 className="text-lg md:text-xl font-black text-black uppercase tracking-wide">
              OUR PRODUCTS
            </h2>
            <div className="w-8 md:w-12 h-[2px] md:h-[3px] bg-[#00E600]"></div>
          </div>
          <Link to="/shop" className="text-[#2e8b57] font-semibold text-xs md:text-sm flex items-center gap-1 hover:underline">
            View all <FiArrowRight />
          </Link>
        </div>

        {/* 4. DYNAMIC Product Grid - Max 8 products */}
        {productsLoading ? (
          <div className="text-center py-20 font-bold text-gray-500">Loading products...</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 mb-8">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                addToCart={addToCart} 
                getImageUrl={getImageUrl}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No products available. Please add products from the Admin Dashboard.
          </div>
        )}

        {/* 5. DYNAMIC BOTTOM BANNER */}
        {bottomBanner && (
          <div className="w-full flex flex-col gap-4 mb-8">
            <Link to={bottomBanner.link || '#'}>
              <img 
                src={getImageUrl(bottomBanner.image)} 
                alt={bottomBanner.title || "Bottom Banner"} 
                className="w-full rounded-md shadow-sm object-cover" 
              />
            </Link>
          </div>
        )}

      </main>
    </div>
  );
};

// Inner Component for Product Card
const ProductCard = ({ product, addToCart, getImageUrl }) => {
  const mrp = product.mrp || Math.round(product.price * 1.5);
  // Get first image from images array
  const productImage = getImageUrl(product.images?.[0]);

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-lg overflow-hidden flex flex-col h-full border border-gray-100 hover:shadow-md transition-shadow">
        <div className="bg-[#f4f7f6] p-2 flex justify-center items-center h-40 md:h-56 relative">
          <img 
            src={productImage} 
            alt={product.name} 
            className="h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" 
          />
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="absolute bottom-2 right-2 bg-[#2e8b57] text-white p-2 rounded-md hover:bg-green-700 transition-colors shadow-md z-10"
          >
            <FiShoppingCart size={16} />
          </button>
        </div>
        <div className="p-2 md:p-3 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 text-[11px] md:text-sm leading-tight mb-1 line-clamp-2 h-8 md:h-10 group-hover:text-[#009e3e] transition-colors">
              {product.name}
            </h3>
            <p className="text-[9px] md:text-xs text-gray-500 mb-1">
              {product.servings || 'N/A'}
            </p>
            <div className="flex items-center gap-1 mb-2">
              <div className="flex text-yellow-400 text-[9px] md:text-[10px]">
                <FiStar fill="currentColor" /><FiStar fill="currentColor" /><FiStar fill="currentColor" /><FiStar fill="currentColor" /><FiStar fill="currentColor" />
              </div>
              <span className="text-[9px] text-gray-400">(51)</span>
            </div>
          </div>
          <div className="flex justify-between items-end mt-1">
            <div className="flex flex-col">
              <span className="font-bold text-sm md:text-base text-black">₹{product.price}</span>
              <span className="text-[9px] md:text-xs text-gray-400 line-through">₹{mrp}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Home;