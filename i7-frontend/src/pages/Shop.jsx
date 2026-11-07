import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiFilter, FiX, FiStar, FiShoppingCart, FiChevronDown, FiGrid } from 'react-icons/fi';
import { GiMuscleUp, GiChemicalDrop, GiWaterDrop } from 'react-icons/gi';
import { TbPill, TbFlask } from 'react-icons/tb';
import { useCart } from '../context/CartContext';
import axiosInstance from '../api/axiosInstance';

// A mapping of category names to icons (because icons can't come from the backend)
const CATEGORY_ICONS = {
  'Proteins': <GiMuscleUp size={24} />,
  'Creatine': <TbPill size={24} />,
  'Vitamins': <GiChemicalDrop size={24} />,
  'Minerals': <TbFlask size={24} />,
  'More': <GiWaterDrop size={24} />,
};

const Shop = () => {
  const { addToCart } = useCart();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // ✅ NEW: Dynamic categories
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [sortOption, setSortOption] = useState('best-selling');

  // ✅ Fetch products AND categories from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const prodRes = await axiosInstance.get('/products');
        setProducts(prodRes.data);

        // Fetch categories
        const catRes = await axiosInstance.get('/categories');
        // Add "All Products" as a virtual category at the top
        const formattedCategories = [
          { id: 'all', name: 'All Products', isAll: true },
          ...catRes.data
        ];
        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getImageUrl = (imgPath) => {
    if (!imgPath) return 'https://via.placeholder.com/300?text=No+Image';
    return imgPath.startsWith('http') ? imgPath : `https://i7-backend.onrender.com${imgPath}`;
  };

  // ✅ Filter Logic
  const filteredProducts = selectedCategory === 'All Products' 
    ? products 
    : products.filter(p => p.Category?.name === selectedCategory);

  if (sortOption === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="bg-white min-h-screen py-8 font-sans">
      <div className="container mx-auto px-4 max-w-[900px]">
        
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-medium">
          <Link to="/" className="hover:text-[#009e3e]">Home</Link>
          <FiChevronRight />
          <span className="text-[#009e3e]">Shop All Products</span>
        </div>

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-black text-black mb-1">Shop All Products</h1>
          <h2 className="text-lg font-bold text-black mb-2">Nutrition for a Healthier, Stronger You</h2>
          <p className="text-gray-600 text-sm leading-relaxed max-w-[500px]">
            Explore our complete range of high-quality, lab-tested supplements designed to support your health, fitness and everyday wellness.
          </p>
        </div>

        {/* ✅ DYNAMIC CATEGORY CIRCLES FROM BACKEND */}
        <div className="flex justify-start items-center mb-8 overflow-x-auto pb-2 hide-scrollbar gap-6">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.name;
            return (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className="flex flex-col items-center gap-2 min-w-[70px]"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isActive ? 'bg-white border-2 border-[#009e3e] text-[#009e3e]' : 'bg-[#f4f7f6] text-gray-500'
                }`}>
                  {cat.isAll ? <FiGrid size={24} /> : (CATEGORY_ICONS[cat.name] || <FiGrid size={24} />)}
                </div>
                <span className={`text-[11px] font-bold text-center ${isActive ? 'text-black' : 'text-gray-500'}`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* FILTER & SORT BAR */}
        <div className="flex justify-between items-center border border-gray-200 rounded-lg p-3 mb-6">
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 text-sm font-bold text-black"
          >
            <FiFilter /> Filters
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort By:</span>
            <div className="relative">
              <select 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none bg-transparent text-sm font-bold text-black focus:outline-none cursor-pointer pr-6"
              >
                <option value="best-selling">Best Selling</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <FiChevronDown className="absolute right-0 top-1 text-black pointer-events-none" />
            </div>
          </div>
        </div>

        {/* MOBILE SIDEBAR */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileFilterOpen(false)}></div>
            <div className="relative w-4/5 max-w-sm bg-white h-full shadow-xl p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg">Filters</h2>
                <FiX size={24} onClick={() => setIsMobileFilterOpen(false)} className="cursor-pointer" />
              </div>
              <h3 className="font-bold text-md mb-3 text-black">Categories</h3>
              <ul className="space-y-4">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`text-sm w-full text-left ${selectedCategory === cat.name ? 'text-[#009e3e] font-bold' : 'text-gray-600'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="text-center py-20 font-bold text-gray-500">Loading products...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
            {filteredProducts.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="group block">
                <div className="flex flex-col">
                  
                  <div className="bg-[#f4f7f6] rounded-xl p-4 flex justify-center items-center h-48 md:h-56 relative mb-3">
                    <img 
                      src={getImageUrl(product.images?.[0])} 
                      alt={product.name} 
                      className="h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-900 text-[14px] leading-tight mb-1 group-hover:text-[#009e3e] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[12px] text-gray-500 mb-2">
                      {product.servings || 'N/A'}
                    </p>
                    
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex text-[#ff9800] text-[11px]">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} fill="currentColor" />
                        ))}
                      </div>
                      <span className="text-[11px] text-gray-500">(51)</span>
                    </div>

                    <div className="flex items-end justify-between mt-auto">
                      <span className="font-black text-lg text-black">₹{product.price}</span>
                      
                      <button 
                        onClick={(e) => {
                          e.preventDefault(); 
                          addToCart(product);
                        }}
                        className="bg-[#009e3e] text-white p-2 rounded-lg hover:bg-[#008233] transition-colors z-10 relative"
                      >
                        <FiShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {/* NO RESULTS */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-lg font-bold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">Try changing your category filter.</p>
            <button onClick={() => setSelectedCategory('All Products')} className="bg-[#009e3e] text-white px-6 py-2 rounded-lg font-semibold">Clear Filters</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Shop;