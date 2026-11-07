import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  // Fake MRP for the crossed-out effect
  const mrp = product.mrp || Math.round(product.price * 1.5);

  return (
    <div className="bg-white rounded-lg overflow-hidden flex flex-col h-full">
      
      {/* Image Container */}
      <div className="bg-[#f4f7f6] p-2 flex justify-center items-center h-40 md:h-56 relative">
        <img src={product.image} alt={product.name} className="h-full object-contain mix-blend-multiply" />
        
        {/* Green Cart Button exactly like the image */}
        <button 
          onClick={() => addToCart(product)}
          className="absolute bottom-2 right-2 bg-[#2e8b57] text-white p-2 rounded-md hover:bg-green-700 transition-colors shadow-md"
        >
          <FiShoppingCart size={16} />
        </button>
      </div>
      
      {/* Details Container */}
      <div className="p-2 md:p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 text-[11px] md:text-sm leading-tight mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-[9px] md:text-xs text-gray-500 mb-1">{product.servings}</p>
          
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-yellow-400 text-[9px] md:text-[10px]">
              <FiStar fill="currentColor" /><FiStar fill="currentColor" /><FiStar fill="currentColor" /><FiStar fill="currentColor" /><FiStar fill="currentColor" />
            </div>
            <span className="text-[9px] text-gray-400">({product.reviews})</span>
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
  );
};

export default ProductCard;