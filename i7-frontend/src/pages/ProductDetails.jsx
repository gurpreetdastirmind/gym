import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useCart } from '../context/CartContext';
import { 
  FiChevronRight, FiStar, FiShoppingCart, FiZap, 
  FiCheckCircle, FiFileText, FiMinus, FiPlus, FiCheck 
} from 'react-icons/fi';
import { GiBiceps, GiRunningShoe, GiMuscleUp, GiHeartBeats } from 'react-icons/gi';
import { TbTarget, TbLeaf, TbFlask } from 'react-icons/tb';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [quantity, setQuantity] = useState(1);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [parsedFlavours, setParsedFlavours] = useState([]);
  const [selectedFlavour, setSelectedFlavour] = useState(null);
  
  const [imageFlavourMap, setImageFlavourMap] = useState([]);

  const mockImages = [
    "/assets/power-blast.jpg", 
    "/assets/supp-facts.jpg",  
    "/assets/powder-scoop.jpg", 
    "/assets/cola-flavor.jpg"
  ];

  const staticIngredients = [
    { name: "L-Citrulline", amount: "5 g", desc: "Supports nitric oxide production", img: "/assets/citrulline.jpg" },
    { name: "Beta-Alanine", amount: "2 g", desc: "Helps improve muscle endurance", img: "/assets/beta-alanine.jpg" }
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        const data = response.data;
        setProduct(data);

        let map = [];
        if (data.imageFlavoursMap) {
           try { 
             map = typeof data.imageFlavoursMap === 'string' ? JSON.parse(data.imageFlavoursMap) : data.imageFlavoursMap; 
           } catch(e){ console.error("Map parse error", e); }
        }
        setImageFlavourMap(map);

        let flavours = [];
        try {
          if (data.flavours) {
            flavours = typeof data.flavours === 'string' ? JSON.parse(data.flavours) : data.flavours;
          }
        } catch (e) { console.error("Error parsing flavours", e); }
        setParsedFlavours(flavours);

        if (flavours.length > 0) {
            const firstAvailableIndex = flavours.findIndex(f => f.inStock !== false && f.inStock !== 'false');
            if (firstAvailableIndex !== -1) {
                setSelectedFlavour(firstAvailableIndex);
            }
        }
        
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct({
          id: 1, name: "Power Blast X Advance Pre Workout", 
          description: "High-performance pre-workout.",
          price: 999, mrp: 1399, servings: "30 Servings", images: []
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-xl">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center font-bold text-xl">Product not found</div>;

  function getImageUrl(imgPath) {
    if (!imgPath) return '/assets/product-placeholder.jpg';
    return imgPath.startsWith('http') ? imgPath : `http://localhost:5000${imgPath}`;
  };

  let rawImagesArray = [];
  try {
    if (Array.isArray(product.images)) {
      rawImagesArray = product.images;
    } else if (typeof product.images === 'string') {
      rawImagesArray = JSON.parse(product.images);
    }
  } catch (e) {
    rawImagesArray = [];
  }

  const allRawImages = rawImagesArray.length > 0 ? rawImagesArray : mockImages;

  // Image Filtering Logic
  let finalDisplayImages = [];

  if (selectedFlavour !== null && parsedFlavours[selectedFlavour]) {
      const flavourName = parsedFlavours[selectedFlavour].name.toLowerCase();

      const filteredImages = allRawImages.filter((imgPath) => {
          const lowerImgPath = imgPath.toLowerCase();
          if (lowerImgPath.includes(flavourName)) return true;
          if (lowerImgPath.includes('generic')) return true;
          return false;
      });

      finalDisplayImages = filteredImages.length > 0 ? filteredImages.map(getImageUrl) : allRawImages.map(getImageUrl);
  } else {
      finalDisplayImages = allRawImages.map(getImageUrl);
  }

  const currentMainImage = finalDisplayImages[selectedImage] || finalDisplayImages[0];

  // ✅ DYNAMIC DATA LOGIC
  const currentFlavourData = selectedFlavour !== null ? parsedFlavours[selectedFlavour] : null;

  const displayPrice = currentFlavourData?.price ? Number(currentFlavourData.price) : product.price;
  const displayMrp = currentFlavourData?.mrp ? Number(currentFlavourData.mrp) : (product.mrp || Math.round(product.price * 1.4));
  const displayDescription = currentFlavourData?.description ? currentFlavourData.description : (product.description || "No description provided.");

  let parsedIngredients = staticIngredients;
  let parsedBenefits = ["Boosts Energy & Focus", "Enhances Muscle Pumps", "Improves Endurance", "Increases Workout Performance"];
  let parsedHowToUse = [];

  try {
    // Check if flavour has specific data, otherwise parse global product data
    if (currentFlavourData?.ingredients) {
        const parsed = typeof currentFlavourData.ingredients === 'string' ? JSON.parse(currentFlavourData.ingredients) : currentFlavourData.ingredients;
        if (parsed.length > 0) parsedIngredients = parsed;
    } else if (product.ingredients) {
        parsedIngredients = typeof product.ingredients === 'string' ? JSON.parse(product.ingredients) : product.ingredients;
    }

    if (currentFlavourData?.benefits) {
        const parsed = typeof currentFlavourData.benefits === 'string' ? JSON.parse(currentFlavourData.benefits) : currentFlavourData.benefits;
        if (parsed.length > 0) parsedBenefits = parsed;
    } else if (product.benefits) {
        parsedBenefits = typeof product.benefits === 'string' ? JSON.parse(product.benefits) : product.benefits;
    }

    if (currentFlavourData?.howToUse) {
        const parsed = typeof currentFlavourData.howToUse === 'string' ? JSON.parse(currentFlavourData.howToUse) : currentFlavourData.howToUse;
        if (parsed.length > 0) parsedHowToUse = parsed;
    } else if (product.howToUse) {
        parsedHowToUse = typeof product.howToUse === 'string' ? JSON.parse(product.howToUse) : product.howToUse;
    }
  } catch (e) {
    console.error("Error parsing JSON", e);
  }

 const handleAddToCart = () => {
    const flavourName = selectedFlavour !== null ? parsedFlavours[selectedFlavour].name : '';
    
    // ✅ FIX: Pass the current main image so the cart shows the right flavour
    addToCart({ 
      ...product, 
      price: displayPrice, 
      quantity, 
      selectedFlavour: flavourName,
      images: [currentMainImage] // Overrides the array with the specific image currently displayed
    });
    alert('Added to cart!');
  };

  const handleBuyNow = () => {
    const flavourName = selectedFlavour !== null ? parsedFlavours[selectedFlavour].name : '';
    
    // ✅ FIX: Pass the current main image
    addToCart({ 
      ...product, 
      price: displayPrice, 
      quantity, 
      selectedFlavour: flavourName,
      images: [currentMainImage] 
    });
    navigate('/checkout');
  };

  return (
    <div className="bg-white font-sans pb-10">
      <div className="container mx-auto px-4 py-3 max-w-7xl">
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Link to="/" className="hover:text-[#009e3e]">Home</Link>
          <FiChevronRight />
          <Link to="/shop" className="hover:text-[#009e3e]">Shop</Link>
          <FiChevronRight />
          <span className="text-[#009e3e]">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl flex flex-col lg:flex-row gap-8 mb-10">
        <div className="w-full lg:w-1/2 flex flex-col md:flex-row gap-4">
          
          <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-visible">
            {finalDisplayImages.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedImage(idx)}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-md border-2 cursor-pointer p-1 flex-shrink-0 ${
                  selectedImage === idx ? 'border-[#009e3e]' : 'border-gray-200'
                }`}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-contain rounded" />
              </div>
            ))}
          </div>

          <div className="flex-1 bg-gray-50 rounded-xl flex items-center justify-center p-4 order-1 md:order-2 min-h-[300px] md:min-h-[500px]">
            <img 
               key={currentMainImage}
               src={currentMainImage} 
               alt={product.name} 
               className="max-h-full max-w-full object-contain mix-blend-multiply" 
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 text-xl font-black italic">
              <span className="text-[#009e3e]">i7</span> NUTRITION
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">FUEL YOUR WELLNESS</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-black mb-2 uppercase">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400 text-lg">
              <FiStar fill="currentColor" /><FiStar fill="currentColor" /><FiStar fill="currentColor" /><FiStar fill="currentColor" /><FiStar fill="currentColor" />
            </div>
            <span className="text-sm text-gray-500">(51 Reviews)</span>
          </div>

          <div className="flex items-end gap-4 mb-6">
            <span className="text-3xl md:text-4xl font-black text-black">₹{displayPrice}</span>
            <span className="text-lg text-gray-400 line-through mb-1">₹{displayMrp}</span>
            <div className="bg-green-50 border border-green-200 text-[#009e3e] px-3 py-1 rounded-md text-sm font-bold ml-auto">
              {product.servings || '30 SERVINGS'}
            </div>
          </div>

          {parsedFlavours.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-black mb-3">Flavour</h3>
              <div className="flex gap-4 flex-wrap">
                {parsedFlavours.map((flav, idx) => {
                  const isSelected = selectedFlavour === idx;
                  const isOutOfStock = flav.inStock === false || flav.inStock === 'false';
                  
                  const thumbnailImg = flav.imgs && flav.imgs.length > 0 ? flav.imgs[0] : flav.img;

                  return (
                    <div 
                      key={idx}
                      onClick={() => {
                        if (!isOutOfStock) {
                            setSelectedFlavour(idx);
                            setSelectedImage(0);
                        }
                      }}
                      className={`border-2 rounded-xl p-3 w-28 text-center relative transition-all ${
                        isSelected ? 'border-red-800 bg-[#fff5f5] shadow-md' : 'border-gray-200 hover:border-gray-300'
                      } ${isOutOfStock ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-red-700 text-white rounded-full p-0.5 z-10">
                          <FiCheck size={10}/>
                        </div>
                      )}
                      
                      {isOutOfStock && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase whitespace-nowrap z-10">
                          Out of Stock
                        </div>
                      )}
                      
                      {thumbnailImg ? (
                        <img src={getImageUrl(thumbnailImg)} alt={flav.name} className="h-12 mx-auto object-contain mb-2" />
                      ) : (
                        <div className="h-12 w-full bg-gray-100 rounded mx-auto mb-2 flex items-center justify-center text-[10px] text-gray-400">No Img</div>
                      )}
                      
                      <span className={`text-sm font-bold block ${isSelected ? 'text-black' : 'text-gray-600'}`}>
                        {flav.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-4 mb-8">
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-500 hover:text-black"><FiMinus /></button>
              <span className="w-10 text-center font-bold">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="text-gray-500 hover:text-black"><FiPlus /></button>
            </div>
            
            <button onClick={handleAddToCart} className="flex-1 bg-[#009e3e] hover:bg-[#008233] text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 transition-colors py-2">
              <FiShoppingCart size={22} /> ADD TO CART
            </button>
          </div>

          <button onClick={handleBuyNow} className="w-full border-2 border-[#009e3e] text-[#009e3e] hover:bg-[#f0fdf4] font-bold text-lg py-3 rounded-xl flex items-center justify-center gap-2 transition-colors mb-8">
            <FiZap size={22} /> BUY NOW
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl mb-12">
        <div className="flex border-b border-gray-200 overflow-x-auto hide-scrollbar mb-6">
          <button onClick={() => setActiveTab('overview')} className={`px-6 py-3 font-bold text-sm whitespace-nowrap ${activeTab === 'overview' ? 'bg-[#009e3e] text-white rounded-t-lg' : 'text-gray-600 hover:text-black'}`}>Product Overview</button>
          <button onClick={() => setActiveTab('ingredients')} className={`px-6 py-3 font-bold text-sm whitespace-nowrap ${activeTab === 'ingredients' ? 'bg-[#009e3e] text-white rounded-t-lg' : 'text-gray-600 hover:text-black'}`}>Ingredients</button>
          <button onClick={() => setActiveTab('benefits')} className={`px-6 py-3 font-bold text-sm whitespace-nowrap ${activeTab === 'benefits' ? 'bg-[#009e3e] text-white rounded-t-lg' : 'text-gray-600 hover:text-black'}`}>Benefits</button>
          <button onClick={() => setActiveTab('how-to-use')} className={`px-6 py-3 font-bold text-sm whitespace-nowrap ${activeTab === 'how-to-use' ? 'bg-[#009e3e] text-white rounded-t-lg' : 'text-gray-600 hover:text-black'}`}>How to Use</button>
        </div>

        {activeTab === 'overview' && (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-black text-black mb-3 flex items-center gap-2">Product Overview <span className="w-8 h-1 bg-[#009e3e]"></span></h2>
              <p className="text-gray-700 leading-relaxed mb-8">{displayDescription}</p>

              <h3 className="font-bold text-black mb-4">Key Ingredients <span className="text-sm font-normal text-gray-500">(Per Serving)</span></h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {parsedIngredients.map((ing, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-lg p-3 text-center shadow-sm flex flex-col items-center justify-start">
                    {ing.img ? (
                      <img src={getImageUrl(ing.img)} alt={ing.name} className="h-16 w-full object-contain mb-2 rounded" />
                    ) : (
                      <div className="h-16 w-full flex items-center justify-center bg-gray-50 rounded mb-2 text-gray-300 text-xs">No Image</div>
                    )}
                    <h4 className="font-black text-lg">{ing.amount}</h4>
                    <p className="font-bold text-xs text-black">{ing.name}</p>
                    <p className="text-[10px] text-gray-500 mt-1 leading-tight">{ing.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-1/3">
              <h2 className="text-xl font-black text-black mb-4 flex items-center gap-2">Key Benefits <span className="w-6 h-1 bg-[#009e3e]"></span></h2>
              <div className="space-y-4 mb-8">
                {parsedBenefits.map((benefit, idx) => {
                  const Icon = [FiZap, GiBiceps, GiRunningShoe, TbTarget, GiMuscleUp][idx % 5];
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <Icon className="text-[#009e3e] text-2xl mt-1 flex-shrink-0" />
                      <h4 className="font-bold text-sm text-black">{benefit}</h4>
                    </div>
                  );
                })}
              </div>

              <h2 className="text-xl font-black text-black mb-4 flex items-center gap-2">How to Use <span className="w-6 h-1 bg-[#009e3e]"></span></h2>
              <div className="space-y-4 mb-4">
                {parsedHowToUse.length > 0 ? (
                  parsedHowToUse.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {step.img ? (
                        <img src={getImageUrl(step.img)} alt="Step" className="w-10 h-10 object-contain flex-shrink-0" />
                      ) : (
                        <FiCheckCircle className="text-[#009e3e] text-2xl flex-shrink-0 mt-1" />
                      )}
                      <p className="text-sm text-gray-700">{step.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No usage instructions provided.</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'ingredients' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {parsedIngredients.map((ing, idx) => (
              <div key={idx} className="border border-gray-100 rounded-lg p-3 text-center shadow-sm">
                {ing.img && <img src={getImageUrl(ing.img)} alt={ing.name} className="h-16 w-full object-contain mb-2" />}
                <h4 className="font-black text-lg">{ing.amount}</h4>
                <p className="font-bold text-xs text-black">{ing.name}</p>
                <p className="text-[10px] text-gray-500 mt-1">{ing.desc}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'benefits' && (
          <div className="space-y-4 max-w-xl">
            {parsedBenefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <FiCheckCircle className="text-[#009e3e] text-2xl mt-1" />
                <h4 className="font-bold text-base text-black">{benefit}</h4>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'how-to-use' && (
          <div className="space-y-6 max-w-xl">
            {parsedHowToUse.length > 0 ? (
              parsedHowToUse.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 border-b pb-4 last:border-b-0">
                  {step.img && <img src={getImageUrl(step.img)} alt="Step" className="w-16 h-16 object-contain flex-shrink-0" />}
                  <div>
                    <h4 className="font-bold text-black mb-1">Step {idx + 1}</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{step.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No instructions provided.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;