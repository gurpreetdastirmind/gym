import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiShoppingBag, FiDollarSign, FiLogOut, FiActivity, FiBox, FiEdit, FiTrash2, FiTag, FiPlus, FiX, FiImage, FiArrowUp, FiSettings, FiPercent, FiList } from 'react-icons/fi';
import axiosInstance from '../api/axiosInstance';

// ✅ ADDED THIS LINE TO FIX IMAGES ON LIVE SITE
const BACKEND_URL = import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const [activeTab, setActiveTab] = useState('dashboard');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [banners, setBanners] = useState([]);
    const [orders, setOrders] = useState([]);

    // ✅ NEW STATES FOR COUPONS & SETTINGS
    const [coupons, setCoupons] = useState([]);
    const [settings, setSettings] = useState({ codCharge: '55', shippingCharge: '110' });
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const [isEditingCoupon, setIsEditingCoupon] = useState(false);
    const [currentCouponId, setCurrentCouponId] = useState(null);
    const [couponForm, setCouponForm] = useState({ code: '', discountType: 'percentage', discountValue: '', minOrderValue: '', isActive: true });

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

    const [isEditingProduct, setIsEditingProduct] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);

    const [isEditingBanner, setIsEditingBanner] = useState(false);
    const [currentBannerId, setCurrentBannerId] = useState(null);

    const [productForm, setProductForm] = useState({ name: '', description: '', price: '', mrp: '', servings: '', specifications: '', tags: '', sizes: '', categoryId: '', benefits: '' });

    // Base Ingredients & How to Use
    const [ingredientsList, setIngredientsList] = useState([{ name: '', amount: '', desc: '', img: null, existingImg: '' }]);
    const [howToUseList, setHowToUseList] = useState([{ text: '', img: null, existingImg: '' }]);

    // ✅ Flavour list state with specific fields, ingredients, and howToUse
    const [flavoursList, setFlavoursList] = useState([{
        name: '', inStock: true, isSelected: false, imgs: [], existingImgs: [],
        price: '', mrp: '', description: '', benefits: '',
        ingredientsList: [{ name: '', amount: '', desc: '', img: null, existingImg: '' }],
        howToUseList: [{ text: '', img: null, existingImg: '' }]
    }]);

    const [imageFiles, setImageFiles] = useState([]);

    const [categoryForm, setCategoryForm] = useState({ name: '', description: '', imageUrl: '' });
    const [categoryImage, setCategoryImage] = useState(null);

    const [bannerForm, setBannerForm] = useState({ title: '', link: '', position: 1, imageUrl: '' });
    const [bannerImage, setBannerImage] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser || storedUser.role !== 'admin') {
            alert('Access Denied. You are not an admin.');
            navigate('/login');
        } else {
            setUser(storedUser);
        }
    }, [navigate]);

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    useEffect(() => {
        if (activeTab === 'products' || activeTab === 'categories' || activeTab === 'users' || activeTab === 'banners') {
            fetchData();
        }
    }, [activeTab]);

    const fetchData = async () => {
        const [prodRes, catRes, userRes, bannerRes, couponRes, settingRes, orderRes] = await Promise.allSettled([
            axiosInstance.get('/products'),
            axiosInstance.get('/categories'),
            axiosInstance.get('/auth/users'),
            axiosInstance.get('/banners'),
            axiosInstance.get('/coupons'), // ✅ NEW
            axiosInstance.get('/coupons/settings'), // ✅ NEW
            axiosInstance.get('/orders')

        ]);

        if (prodRes.status === 'fulfilled') setProducts(prodRes.value.data);
        else { console.error("Products fetch failed:", prodRes.reason); setProducts([]); }

        if (catRes.status === 'fulfilled') setCategories(catRes.value.data);
        else { console.error("Categories fetch failed:", catRes.reason); setCategories([]); }

        if (userRes.status === 'fulfilled') setUsers(userRes.value.data);
        else { console.error("Users fetch failed:", userRes.reason); setUsers([]); }

        if (bannerRes.status === 'fulfilled') setBanners(bannerRes.value.data);
        else { console.error("Banners fetch failed:", bannerRes.reason); setBanners([]); }

        if (couponRes.status === 'fulfilled') setCoupons(couponRes.value.data);
        else { console.error("Coupon fetch failed:", couponRes.reason); setCoupons([]); }

        if (settingRes.status === 'fulfilled') setSettings(settingRes.value.data);
        else { console.error("setting fetch failed:", settingRes.reason); setSettings([]); }

        if (orderRes.status === 'fulfilled') setOrders(orderRes.value.data);
        else { console.error("order fetch failed:", orderRes.reason); setOrders([]); }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // --- PRODUCT HANDLERS ---
    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.keys(productForm).forEach(key => formData.append(key, productForm[key]));

        // Base Ingredients
        const ingredientDataToSend = ingredientsList.map(ing => ({
            name: ing.name, amount: ing.amount, desc: ing.desc, img: ing.existingImg
        }));
        formData.append('ingredientsData', JSON.stringify(ingredientDataToSend));
        ingredientsList.forEach(ing => {
            if (ing.img instanceof File) formData.append('ingredientImages', ing.img);
            else formData.append('ingredientImages', new Blob([]), '');
        });

        // Base How to Use
        const howToUseDataToSend = howToUseList.map(step => ({
            text: step.text, img: step.existingImg
        }));
        formData.append('howToUseData', JSON.stringify(howToUseDataToSend));
        howToUseList.forEach(step => {
            if (step.img instanceof File) formData.append('howToUseImages', step.img);
            else formData.append('howToUseImages', new Blob([]), '');
        });

        // ✅ Flavours Data (including ingredients and howToUse arrays)
        const flavoursDataToSend = flavoursList.map((flav, index) => {
            const flavourIngredientsData = flav.ingredientsList.map(ing => ({
                name: ing.name, amount: ing.amount, desc: ing.desc, img: ing.existingImg
            }));

            const flavourHowToUseData = flav.howToUseList.map(step => ({
                text: step.text, img: step.existingImg
            }));

            return {
                name: flav.name,
                inStock: flav.inStock,
                existingImgs: flav.existingImgs,
                price: flav.price,
                mrp: flav.mrp,
                description: flav.description,
                benefits: flav.benefits,
                ingredients: JSON.stringify(flavourIngredientsData),
                howToUse: JSON.stringify(flavourHowToUseData)
            };
        });
        formData.append('flavoursData', JSON.stringify(flavoursDataToSend));

        // Append flavour specific images
        flavoursList.forEach((flav, index) => {
            // Main Flavour Image
            if (flav.imgs && flav.imgs.length > 0) {
                formData.append(`flavourImage_${index}`, flav.imgs[0]);
            }

            // Flavour Ingredients Images
            flav.ingredientsList.forEach((ing, ingIndex) => {
                if (ing.img instanceof File) {
                    formData.append(`flavourIngredientImage_${index}_${ingIndex}`, ing.img);
                } else {
                    formData.append(`flavourIngredientImage_${index}_${ingIndex}`, new Blob([]), '');
                }
            });

            // Flavour HowToUse Images
            flav.howToUseList.forEach((step, stepIndex) => {
                if (step.img instanceof File) {
                    formData.append(`flavourHowToUseImage_${index}_${stepIndex}`, step.img);
                } else {
                    formData.append(`flavourHowToUseImage_${index}_${stepIndex}`, new Blob([]), '');
                }
            });
        });

        const imageFlavoursMap = imageFiles.map(imgObj => imgObj.flavour || 'generic');
        formData.append('imageFlavoursMap', JSON.stringify(imageFlavoursMap));
        imageFiles.forEach(imgObj => formData.append('images', imgObj.file));

        try {
            if (isEditingProduct) {
                await axiosInstance.put(`/products/${currentProductId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await axiosInstance.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            resetProductForm();
            setIsProductModalOpen(false);
            fetchData();
            alert('Product saved successfully!');
        } catch (error) {
            console.error(error);
            alert('Error saving product.');
        }
    };

    const resetProductForm = () => {
        setProductForm({ name: '', description: '', price: '', mrp: '', servings: '', specifications: '', tags: '', sizes: '', categoryId: '', benefits: '' });
        setIngredientsList([{ name: '', amount: '', desc: '', img: null, existingImg: '' }]);
        setHowToUseList([{ text: '', img: null, existingImg: '' }]);
        setFlavoursList([{
            name: '', inStock: true, isSelected: false, imgs: [], existingImgs: [], price: '', mrp: '', description: '', benefits: '',
            ingredientsList: [{ name: '', amount: '', desc: '', img: null, existingImg: '' }],
            howToUseList: [{ text: '', img: null, existingImg: '' }]
        }]);
        setImageFiles([]);
        setIsEditingProduct(false);
        setCurrentProductId(null);
    };

    const handleEditProduct = (prod) => {
        setIsEditingProduct(true);
        setCurrentProductId(prod.id);
        setProductForm({
            name: prod.name, description: prod.description || '', price: prod.price, mrp: prod.mrp || '',
            servings: prod.servings || '', specifications: prod.specifications || '', tags: prod.tags || '',
            sizes: prod.sizes || '', categoryId: prod.categoryId || '', benefits: prod.benefits || ''
        });

        try {
            const parsedIng = prod.ingredients && prod.ingredients.startsWith('[') ? JSON.parse(prod.ingredients) : [];
            setIngredientsList(parsedIng.length > 0 ? parsedIng.map(i => ({ ...i, img: null, existingImg: i.img })) : [{ name: '', amount: '', desc: '', img: null, existingImg: '' }]);
        } catch (e) { setIngredientsList([{ name: '', amount: '', desc: '', img: null, existingImg: '' }]); }

        try {
            const parsedHow = prod.howToUse && prod.howToUse.startsWith('[') ? JSON.parse(prod.howToUse) : [];
            setHowToUseList(parsedHow.length > 0 ? parsedHow.map(h => ({ ...h, img: null, existingImg: h.img })) : [{ text: '', img: null, existingImg: '' }]);
        } catch (e) { setHowToUseList([{ text: '', img: null, existingImg: '' }]); }

        try {
            const parsedFlav = prod.flavours && prod.flavours.startsWith('[') ? JSON.parse(prod.flavours) : [];
            setFlavoursList(parsedFlav.length > 0 ? parsedFlav.map(f => {
                let fIng = [];
                let fHow = [];
                try { fIng = f.ingredients ? JSON.parse(f.ingredients) : []; } catch (e) { }
                try { fHow = f.howToUse ? JSON.parse(f.howToUse) : []; } catch (e) { }

                return {
                    ...f,
                    isSelected: false,
                    imgs: [],
                    existingImgs: f.imgs || (f.img ? [f.img] : []),
                    price: f.price || '', mrp: f.mrp || '', description: f.description || '', benefits: f.benefits || '',
                    ingredientsList: fIng.length > 0 ? fIng.map(i => ({ ...i, img: null, existingImg: i.img })) : [{ name: '', amount: '', desc: '', img: null, existingImg: '' }],
                    howToUseList: fHow.length > 0 ? fHow.map(h => ({ ...h, img: null, existingImg: h.img })) : [{ text: '', img: null, existingImg: '' }]
                };
            }) : [{
                name: '', inStock: true, isSelected: false, imgs: [], existingImgs: [], price: '', mrp: '', description: '', benefits: '',
                ingredientsList: [{ name: '', amount: '', desc: '', img: null, existingImg: '' }],
                howToUseList: [{ text: '', img: null, existingImg: '' }]
            }]);
        } catch (e) {
            setFlavoursList([{
                name: '', inStock: true, isSelected: false, imgs: [], existingImgs: [], price: '', mrp: '', description: '', benefits: '',
                ingredientsList: [{ name: '', amount: '', desc: '', img: null, existingImg: '' }],
                howToUseList: [{ text: '', img: null, existingImg: '' }]
            }]);
        }

        setImageFiles([]);
        setIsProductModalOpen(true);
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try { await axiosInstance.delete(`/products/${id}`); fetchData(); } catch (error) { alert('Error deleting product.'); }
        }
    };

    const handleMainImageUpload = (e) => {
        const files = Array.from(e.target.files).slice(0, 10);
        const defaultFlavour = flavoursList.length > 0 && flavoursList[0].name ? flavoursList[0].name : '';

        const newImages = files.map(file => ({ file, flavour: defaultFlavour }));
        setImageFiles(prev => [...prev, ...newImages].slice(0, 10));
    };

    const handleMainImageFlavourChange = (index, flavourName) => {
        setImageFiles(prev => {
            const updated = [...prev];
            updated[index].flavour = flavourName;
            return updated;
        });
    };

    const removeImage = (indexToRemove) => setImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove));

    const makeMainImage = (indexToMove) => {
        setImageFiles((prev) => {
            const newFiles = [...prev];
            const [movedFile] = newFiles.splice(indexToMove, 1);
            newFiles.unshift(movedFile);
            return newFiles;
        });
    };

    // --- BASE INGREDIENTS & HOW TO USE ---
    const handleIngredientChange = (index, field, value) => { const updated = [...ingredientsList]; updated[index][field] = value; setIngredientsList(updated); };
    const handleIngredientImage = (index, file) => { const updated = [...ingredientsList]; updated[index].img = file; setIngredientsList(updated); };
    const addIngredient = () => setIngredientsList([...ingredientsList, { name: '', amount: '', desc: '', img: null, existingImg: '' }]);
    const removeIngredient = (index) => { if (ingredientsList.length > 1) setIngredientsList(ingredientsList.filter((_, i) => i !== index)); };

    const handleHowToUseChange = (index, field, value) => { const updated = [...howToUseList]; updated[index][field] = value; setHowToUseList(updated); };
    const handleHowToUseImage = (index, file) => { const updated = [...howToUseList]; updated[index].img = file; setHowToUseList(updated); };
    const addHowToUse = () => setHowToUseList([...howToUseList, { text: '', img: null, existingImg: '' }]);
    const removeHowToUse = (index) => { if (howToUseList.length > 1) setHowToUseList(howToUseList.filter((_, i) => i !== index)); };

    // --- FLAVOUR HANDLERS ---
    const handleFlavourChange = (flavourIndex, field, value) => {
        const updated = [...flavoursList];
        updated[flavourIndex][field] = value;
        setFlavoursList(updated);
    };

    const handleFlavourImages = (flavourIndex, files) => {
        const updated = [...flavoursList];
        updated[flavourIndex].imgs = Array.from(files).slice(0, 1);
        setFlavoursList(updated);
    };

    const addFlavour = () => setFlavoursList([...flavoursList, {
        name: '', inStock: true, isSelected: false, imgs: [], existingImgs: [], price: '', mrp: '', description: '', benefits: '',
        ingredientsList: [{ name: '', amount: '', desc: '', img: null, existingImg: '' }],
        howToUseList: [{ text: '', img: null, existingImg: '' }]
    }]);

    const removeFlavour = (index) => { if (flavoursList.length > 1) setFlavoursList(flavoursList.filter((_, i) => i !== index)); };

    // Flavour Ingredients Handlers
    const handleFlavourIngredientChange = (flavourIndex, ingIndex, field, value) => {
        const updated = [...flavoursList];
        updated[flavourIndex].ingredientsList[ingIndex][field] = value;
        setFlavoursList(updated);
    };
    const handleFlavourIngredientImage = (flavourIndex, ingIndex, file) => {
        const updated = [...flavoursList];
        updated[flavourIndex].ingredientsList[ingIndex].img = file;
        setFlavoursList(updated);
    };
    const addFlavourIngredient = (flavourIndex) => {
        const updated = [...flavoursList];
        updated[flavourIndex].ingredientsList.push({ name: '', amount: '', desc: '', img: null, existingImg: '' });
        setFlavoursList(updated);
    };
    const removeFlavourIngredient = (flavourIndex, ingIndex) => {
        const updated = [...flavoursList];
        if (updated[flavourIndex].ingredientsList.length > 1) {
            updated[flavourIndex].ingredientsList = updated[flavourIndex].ingredientsList.filter((_, i) => i !== ingIndex);
            setFlavoursList(updated);
        }
    };

    // Flavour HowToUse Handlers
    const handleFlavourHowToUseChange = (flavourIndex, stepIndex, field, value) => {
        const updated = [...flavoursList];
        updated[flavourIndex].howToUseList[stepIndex][field] = value;
        setFlavoursList(updated);
    };
    const handleFlavourHowToUseImage = (flavourIndex, stepIndex, file) => {
        const updated = [...flavoursList];
        updated[flavourIndex].howToUseList[stepIndex].img = file;
        setFlavoursList(updated);
    };
    const addFlavourHowToUse = (flavourIndex) => {
        const updated = [...flavoursList];
        updated[flavourIndex].howToUseList.push({ text: '', img: null, existingImg: '' });
        setFlavoursList(updated);
    };
    const removeFlavourHowToUse = (flavourIndex, stepIndex) => {
        const updated = [...flavoursList];
        if (updated[flavourIndex].howToUseList.length > 1) {
            updated[flavourIndex].howToUseList = updated[flavourIndex].howToUseList.filter((_, i) => i !== stepIndex);
            setFlavoursList(updated);
        }
    };

    // --- BANNER & CATEGORY HANDLERS ---
    const handleBannerSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', bannerForm.title);
        formData.append('link', bannerForm.link);
        formData.append('position', bannerForm.position);
        formData.append('imageUrl', bannerForm.imageUrl || '');
        if (bannerImage) formData.append('image', bannerImage);

        try {
            if (isEditingBanner) await axiosInstance.put(`/banners/${currentBannerId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            else await axiosInstance.post('/banners', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            resetBannerForm(); setIsBannerModalOpen(false); fetchData(); alert('Banner saved!');
        } catch (error) { alert('Error saving banner.'); }
    };

    const resetBannerForm = () => { setBannerForm({ title: '', link: '', position: 1, imageUrl: '' }); setBannerImage(null); setIsEditingBanner(false); setCurrentBannerId(null); };
    const handleEditBanner = (banner) => {
        setIsEditingBanner(true); setCurrentBannerId(banner.id);
        setBannerForm({ title: banner.title || '', link: banner.link || '', position: banner.position || 1, imageUrl: banner.image.startsWith('http') ? banner.image : '' });
        setBannerImage(null); setIsBannerModalOpen(true);
    };
    const handleDeleteBanner = async (id) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            try { await axiosInstance.delete(`/banners/${id}`); fetchData(); } catch (error) { alert('Error deleting banner.'); }
        }
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', categoryForm.name);
        formData.append('description', categoryForm.description);
        formData.append('imageUrl', categoryForm.imageUrl || '');
        if (categoryImage) formData.append('image', categoryImage);

        try {
            await axiosInstance.post('/categories', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setCategoryForm({ name: '', description: '' }); setCategoryImage(null); setIsCategoryModalOpen(false); fetchData(); alert('Category added!');
        } catch (error) { alert('Error saving category.'); }
    };

    // ✅ COUPON & SETTINGS HANDLERS
    const handleCouponSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...couponForm, discountValue: Number(couponForm.discountValue), minOrderValue: Number(couponForm.minOrderValue || 0) };
            if (isEditingCoupon) await axiosInstance.put(`/coupons/${currentCouponId}`, payload);
            else await axiosInstance.post('/coupons', payload);
            resetCouponForm(); setIsCouponModalOpen(false); fetchData(); alert('Coupon saved!');
        } catch (error) { alert(error.response?.data?.message || 'Error saving coupon'); }
    };

    const handleEditCoupon = (coupon) => {
        setIsEditingCoupon(true); setCurrentCouponId(coupon.id);
        setCouponForm({ code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue, minOrderValue: coupon.minOrderValue, isActive: coupon.isActive });
        setIsCouponModalOpen(true);
    };

    const handleDeleteCoupon = async (id) => {
        if (window.confirm('Delete this coupon?')) {
            try { await axiosInstance.delete(`/coupons/${id}`); fetchData(); } catch (error) { alert('Error deleting coupon'); }
        }
    };

    const resetCouponForm = () => {
        setCouponForm({ code: '', discountType: 'percentage', discountValue: '', minOrderValue: '', isActive: true });
        setIsEditingCoupon(false); setCurrentCouponId(null);
    };

    const handleSettingsUpdate = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put('/coupons/settings', settings);
            alert('Settings updated successfully!');
        } catch (error) { alert('Error updating settings'); }
    };

    const handleUpdateOrderStatus = async (id, newStatus) => {
        try {
            await axiosInstance.put(`/orders/${id}/status`, { status: newStatus });
            fetchData(); // Refresh list
        } catch (error) {
            alert('Error updating status');
        }
    };

    const handleCancelRequestAction = async (id, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this cancellation?`)) return;
        try {
            await axiosInstance.put(`/orders/${id}/cancel`, { action });
            fetchData();
        } catch (error) {
            alert('Error updating cancellation status');
        }
    };

    if (!user) return null;

    return (
        <div className="bg-[#f3f4f6] min-h-screen flex flex-col md:flex-row font-sans relative">
            <div className="w-full md:w-64 bg-[#0b100c] text-white p-6 flex flex-col md:h-screen sticky top-0 flex-shrink-0 z-10">
                <h2 className="text-2xl font-black mb-8"><span className="text-[#00E600]">i7</span> Admin Panel</h2>
                <nav className="flex flex-col gap-2 flex-1">
                    <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-3 p-3 rounded-lg font-semibold transition-colors text-left ${activeTab === 'dashboard' ? 'bg-[#00E600]/10 text-[#00E600]' : 'hover:bg-gray-800'}`}><FiActivity /> Dashboard</button>
                    <button onClick={() => setActiveTab('products')} className={`flex items-center gap-3 p-3 rounded-lg font-semibold transition-colors text-left ${activeTab === 'products' ? 'bg-[#00E600]/10 text-[#00E600]' : 'hover:bg-gray-800'}`}><FiShoppingBag /> Manage Products</button>
                    <button onClick={() => setActiveTab('categories')} className={`flex items-center gap-3 p-3 rounded-lg font-semibold transition-colors text-left ${activeTab === 'categories' ? 'bg-[#00E600]/10 text-[#00E600]' : 'hover:bg-gray-800'}`}><FiTag /> Manage Categories</button>
                    <button onClick={() => setActiveTab('users')} className={`flex items-center gap-3 p-3 rounded-lg font-semibold transition-colors text-left ${activeTab === 'users' ? 'bg-[#00E600]/10 text-[#00E600]' : 'hover:bg-gray-800'}`}><FiUsers /> Manage Users</button>
                    <button onClick={() => setActiveTab('banners')} className={`flex items-center gap-3 p-3 rounded-lg font-semibold transition-colors text-left ${activeTab === 'banners' ? 'bg-[#00E600]/10 text-[#00E600]' : 'hover:bg-gray-800'}`}><FiImage /> Manage Banners</button>
                    <button onClick={() => setActiveTab('coupons')} className={`flex items-center gap-3 p-3 rounded-lg font-semibold transition-colors text-left ${activeTab === 'coupons' ? 'bg-[#00E600]/10 text-[#00E600]' : 'hover:bg-gray-800'}`}><FiPercent /> Manage Coupons</button>
                    <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 p-3 rounded-lg font-semibold transition-colors text-left ${activeTab === 'settings' ? 'bg-[#00E600]/10 text-[#00E600]' : 'hover:bg-gray-800'}`}><FiSettings /> Charges & Settings</button>
                    <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-3 p-3 rounded-lg font-semibold transition-colors text-left ${activeTab === 'orders' ? 'bg-[#00E600]/10 text-[#00E600]' : 'hover:bg-gray-800'}`}><FiList /> Manage Orders</button>
                </nav>
                <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors mt-auto"><FiLogOut /> Logout</button>
            </div>

            <div className="flex-1 p-6 md:p-10 overflow-y-auto">
                {activeTab === 'dashboard' && (
                    <>
                        <h1 className="text-3xl font-bold text-black mb-2">Welcome back, {user.fullName}!</h1>
                        <p className="text-gray-500 mb-8">Here is what's happening with your store today.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><div className="flex justify-between items-start"><div><p className="text-gray-500 text-sm font-semibold mb-1">Total Revenue</p><h3 className="text-2xl font-black text-black">₹45,231</h3></div><div className="p-3 bg-green-100 text-green-600 rounded-full"><FiDollarSign size={24} /></div></div></div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><div className="flex justify-between items-start"><div><p className="text-gray-500 text-sm font-semibold mb-1">Total Orders</p><h3 className="text-2xl font-black text-black">156</h3></div><div className="p-3 bg-blue-100 text-blue-600 rounded-full"><FiShoppingBag size={24} /></div></div></div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><div className="flex justify-between items-start"><div><p className="text-gray-500 text-sm font-semibold mb-1">Total Users</p><h3 className="text-2xl font-black text-black">1,204</h3></div><div className="p-3 bg-purple-100 text-purple-600 rounded-full"><FiUsers size={24} /></div></div></div>
                        </div>
                    </>
                )}

                {activeTab === 'products' && (
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-black">Manage Products ({products.length})</h1>
                            <button onClick={() => { resetProductForm(); setIsProductModalOpen(true); }} className="flex items-center gap-2 bg-[#009e3e] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#008233] transition-colors shadow-sm"><FiPlus size={18} /> Add New Product</button>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr><th className="p-4 font-bold text-gray-700">Product</th><th className="p-4 font-bold text-gray-700">Category</th><th className="p-4 font-bold text-gray-700">Price</th><th className="p-4 font-bold text-gray-700 text-center">Actions</th></tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {products.map(prod => (
                                        <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 flex items-center gap-3">
                                                {/* ✅ FIXED IMAGE URL HERE */}
                                                <img src={prod.images?.[0] ? `${BACKEND_URL}${prod.images[0]}` : 'https://via.placeholder.com/40'} alt={prod.name} className="w-12 h-12 object-contain bg-gray-100 rounded-md p-1" />
                                                <span className="font-semibold text-gray-800">{prod.name}</span>
                                            </td>
                                            <td className="p-4 text-gray-600">{prod.Category?.name || 'N/A'}</td>
                                            <td className="p-4 font-bold text-black">₹{prod.price}</td>
                                            <td className="p-4 flex justify-center gap-3">
                                                <button onClick={() => handleEditProduct(prod)} className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded transition-colors"><FiEdit size={16} /></button>
                                                <button onClick={() => handleDeleteProduct(prod.id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded transition-colors"><FiTrash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'categories' && (
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-black">Manage Categories ({categories.length})</h1>
                            <button onClick={() => setIsCategoryModalOpen(true)} className="flex items-center gap-2 bg-[#009e3e] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#008233] transition-colors shadow-sm"><FiPlus size={18} /> Add New Category</button>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr><th className="p-4 font-bold text-gray-700">ID</th><th className="p-4 font-bold text-gray-700">Image</th><th className="p-4 font-bold text-gray-700">Category Name</th><th className="p-4 font-bold text-gray-700">Description</th></tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {categories.map(cat => (
                                        <tr key={cat.id} className="hover:bg-gray-50">
                                            <td className="p-4 text-gray-500">#{cat.id}</td>
                                            {/* ✅ FIXED IMAGE URL HERE */}
                                            <td className="p-4"><img src={cat.image ? `${BACKEND_URL}${cat.image}` : 'https://via.placeholder.com/40'} alt={cat.name} className="w-10 h-10 object-contain bg-gray-100 rounded-md" /></td>
                                            <td className="p-4 font-semibold text-gray-800">{cat.name}</td>
                                            <td className="p-4 text-gray-600">{cat.description || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-6"><h1 className="text-3xl font-bold text-black">Manage Users ({users.length})</h1></div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200"><tr><th className="p-4 font-bold text-gray-700">Name</th><th className="p-4 font-bold text-gray-700">Email</th><th className="p-4 font-bold text-gray-700">Phone</th><th className="p-4 font-bold text-gray-700">Role</th><th className="p-4 font-bold text-gray-700">Joined Date</th></tr></thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.length === 0 ? (
                                        <tr><td colSpan="5" className="p-16 text-center text-gray-400 font-medium">No users found.</td></tr>
                                    ) : (
                                        users.map(u => (
                                            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 font-semibold text-gray-800">{u.fullName}</td>
                                                <td className="p-4 text-gray-600">{u.email}</td>
                                                <td className="p-4 text-gray-600">{u.phone}</td>
                                                <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>{u.role.toUpperCase()}</span></td>
                                                <td className="p-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'banners' && (
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-black">Manage Banners ({banners.length})</h1>
                            <button onClick={() => { resetBannerForm(); setIsBannerModalOpen(true); }} className="flex items-center gap-2 bg-[#009e3e] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#008233] transition-colors shadow-sm"><FiPlus size={18} /> Add New Banner</button>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr><th className="p-4 font-bold text-gray-700">Preview</th><th className="p-4 font-bold text-gray-700">Title</th><th className="p-4 font-bold text-gray-700">Position</th><th className="p-4 font-bold text-gray-700 text-center">Actions</th></tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {banners.length === 0 ? (
                                        <tr><td colSpan="4" className="p-10 text-center text-gray-400">No banners found.</td></tr>
                                    ) : (
                                        banners.map(b => (
                                            <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                                {/* ✅ FIXED IMAGE URL HERE */}
                                                <td className="p-4"><img src={b.image.startsWith('http') ? b.image : `${BACKEND_URL}${b.image}`} alt="Banner" className="w-32 h-16 object-cover rounded border" /></td>
                                                <td className="p-4 font-semibold text-gray-800">{b.title || 'N/A'}</td>
                                                <td className="p-4"><span className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-xs font-bold">{b.position === 1 ? 'Top Challenge' : b.position === 2 ? 'Hero Banner' : 'Bottom Footer'}</span></td>
                                                <td className="p-4 flex justify-center gap-3">
                                                    <button onClick={() => handleEditBanner(b)} className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded transition-colors"><FiEdit size={16} /></button>
                                                    <button onClick={() => handleDeleteBanner(b.id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded transition-colors"><FiTrash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ✅ COUPONS TAB */}
                {activeTab === 'coupons' && (
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-black">Manage Coupons ({coupons.length})</h1>
                            <button onClick={() => { resetCouponForm(); setIsCouponModalOpen(true); }} className="flex items-center gap-2 bg-[#009e3e] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#008233] transition-colors shadow-sm"><FiPlus size={18} /> Create Coupon</button>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr><th className="p-4 font-bold text-gray-700">Code</th><th className="p-4 font-bold text-gray-700">Discount</th><th className="p-4 font-bold text-gray-700">Min Order</th><th className="p-4 font-bold text-gray-700">Status</th><th className="p-4 font-bold text-gray-700 text-center">Actions</th></tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {coupons.map(c => (
                                        <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 font-bold text-[#009e3e]">{c.code}</td>
                                            <td className="p-4 font-semibold text-black">{c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}</td>
                                            <td className="p-4 text-gray-600">₹{c.minOrderValue}</td>
                                            <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.isActive ? 'ACTIVE' : 'INACTIVE'}</span></td>
                                            <td className="p-4 flex justify-center gap-3">
                                                <button onClick={() => handleEditCoupon(c)} className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded transition-colors"><FiEdit size={16} /></button>
                                                <button onClick={() => handleDeleteCoupon(c.id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded transition-colors"><FiTrash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {coupons.length === 0 && <tr><td colSpan="5" className="p-10 text-center text-gray-400">No coupons found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ✅ SETTINGS TAB */}
                {activeTab === 'settings' && (
                    <div className="w-full max-w-2xl">
                        <h1 className="text-3xl font-bold text-black mb-6">Delivery & COD Charges</h1>
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                            <form onSubmit={handleSettingsUpdate} className="space-y-6">

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Standard Shipping Charge (₹)</label>
                                    <p className="text-xs text-gray-500 mb-2">This amount will be added to <strong>ALL orders below ₹500</strong> (Online & COD).</p>
                                    <input
                                        type="number"
                                        required
                                        value={settings.shippingCharge}
                                        onChange={(e) => setSettings({ ...settings, shippingCharge: e.target.value })}
                                        className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-[#009e3e]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">COD Extra Charge (₹)</label>
                                    <p className="text-xs text-gray-500 mb-2">This amount will be added <strong>ONLY if the user selects Cash on Delivery</strong>.</p>
                                    <input
                                        type="number"
                                        required
                                        value={settings.codCharge}
                                        onChange={(e) => setSettings({ ...settings, codCharge: e.target.value })}
                                        className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-[#009e3e]"
                                    />
                                </div>

                                <button type="submit" className="bg-[#009e3e] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#008233] transition-colors">
                                    Save Settings
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-black">Manage Orders ({orders.length})</h1>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="p-4 font-bold text-gray-700">Order ID</th>
                                        <th className="p-4 font-bold text-gray-700">Customer</th>
                                        <th className="p-4 font-bold text-gray-700">Total</th>
                                        <th className="p-4 font-bold text-gray-700">Status</th>
                                        <th className="p-4 font-bold text-gray-700">Actions / Reason</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.map(o => (
                                        <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <p className="font-bold text-[#009e3e]">{o.orderNumber}</p>
                                                <p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</p>
                                            </td>
                                            <td className="p-4 text-gray-600">{o.userEmail}<br /><span className="text-xs">{o.userPhone}</span></td>
                                            <td className="p-4 font-bold text-black">₹{o.totalAmount}</td>
                                            <td className="p-4">
                                                <select
                                                    value={o.status}
                                                    onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                                    className="border border-gray-300 rounded p-1.5 text-xs font-bold focus:outline-none focus:border-[#009e3e]"
                                                    disabled={o.status === 'Cancelled' || o.cancelStatus === 'Requested'}
                                                >
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Out for Delivery">Out for Delivery</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="p-4">
                                                {/* ✅ Handle Cancellation Requests here */}
                                                {o.cancelStatus === 'Requested' ? (
                                                    <div className="bg-red-50 border border-red-200 p-2 rounded-lg max-w-xs">
                                                        <p className="text-xs text-red-800 font-bold mb-1">Cancel Requested:</p>
                                                        <p className="text-xs text-gray-600 mb-2 italic">"{o.cancelReason}"</p>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => handleCancelRequestAction(o.id, 'Approve')} className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold hover:bg-red-600">Approve</button>
                                                            <button onClick={() => handleCancelRequestAction(o.id, 'Reject')} className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded font-bold hover:bg-gray-300">Reject</button>
                                                        </div>
                                                    </div>
                                                ) : o.cancelStatus === 'Approved' ? (
                                                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">Cancelled (Approved)</span>
                                                ) : o.cancelStatus === 'Rejected' ? (
                                                    <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">Cancel Rejected</span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">No actions</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && <tr><td colSpan="5" className="p-10 text-center text-gray-400">No orders found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* PRODUCT MODAL */}
            {isProductModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setIsProductModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><FiX size={24} /></button>
                        <h2 className="text-2xl font-bold mb-6 text-black">{isEditingProduct ? 'Edit Product' : 'Add New Product'}</h2>

                        <form onSubmit={handleProductSubmit} className="space-y-4">
                            {/* 1. BASIC INFO */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Product Name" required value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-[#009e3e]" />
                                <select required value={productForm.categoryId} onChange={e => setProductForm({ ...productForm, categoryId: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-[#009e3e] text-gray-700">
                                    <option value="">Select Category</option>
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input type="number" placeholder="Base Price (₹)" required value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-[#009e3e]" />
                                <input type="number" placeholder="Base MRP (₹)" value={productForm.mrp} onChange={e => setProductForm({ ...productForm, mrp: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-[#009e3e]" />
                                <input type="text" placeholder="Servings / Size" value={productForm.servings} onChange={e => setProductForm({ ...productForm, servings: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-[#009e3e]" />
                            </div>
                            <textarea placeholder="Base Description (Applies if flavour has no unique description)" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-[#009e3e]" rows="2"></textarea>

                            {/* 2. BASE KEY INGREDIENTS */}
                            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-black">Base Key Ingredients</h3>
                                    <button type="button" onClick={addIngredient} className="flex items-center gap-1 text-sm bg-[#009e3e] text-white px-3 py-1.5 rounded-md hover:bg-[#008233] transition-colors">
                                        <FiPlus size={14} /> Add Ingredient
                                    </button>
                                </div>
                                {ingredientsList.map((ing, index) => (
                                    <div key={index} className="flex flex-col md:flex-row gap-3 items-start mb-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm relative">
                                        <button type="button" onClick={() => removeIngredient(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><FiX size={16} /></button>
                                        <div className="w-20 h-20 border border-gray-300 rounded-lg flex flex-col items-center justify-center overflow-hidden relative cursor-pointer flex-shrink-0 bg-gray-50">
                                            {/* ✅ FIXED IMAGE URL HERE */}
                                            {ing.img ? <img src={URL.createObjectURL(ing.img)} alt="ing" className="w-full h-full object-contain" /> : ing.existingImg ? <img src={`${BACKEND_URL}${ing.existingImg}`} alt="ing" className="w-full h-full object-contain" /> : <><FiImage className="text-gray-400 mb-1" /><span className="text-[9px] text-gray-400">Image</span></>}
                                            <input type="file" accept="image/*" onChange={(e) => handleIngredientImage(index, e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                                            <input type="text" placeholder="Amount (e.g. 5 g)" value={ing.amount} onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)} className="border border-gray-300 p-2 rounded-md text-sm focus:border-[#009e3e] outline-none" />
                                            <input type="text" placeholder="Name (e.g. L-Citrulline)" value={ing.name} onChange={(e) => handleIngredientChange(index, 'name', e.target.value)} className="border border-gray-300 p-2 rounded-md text-sm focus:border-[#009e3e] outline-none" />
                                            <input type="text" placeholder="Description" value={ing.desc} onChange={(e) => handleIngredientChange(index, 'desc', e.target.value)} className="border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:border-[#009e3e]" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 3. FLAVOURS & IMAGES (WITH SPECIFIC DATA) */}
                            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-black">Flavours & Images</h3>
                                    <button type="button" onClick={addFlavour} className="flex items-center gap-1 text-sm bg-[#009e3e] text-white px-3 py-1.5 rounded-md hover:bg-[#008233] transition-colors">
                                        <FiPlus size={14} /> Add Flavour
                                    </button>
                                </div>

                                {flavoursList.map((flav, index) => (
                                    <div
                                        key={index}
                                        className={`flex flex-col gap-4 mb-6 p-4 rounded-lg border-2 transition-colors relative ${flav.isSelected ? 'border-[#009e3e] bg-[#f0fdf4]' : 'border-gray-200 bg-white'
                                            }`}
                                    >
                                        <button type="button" onClick={() => removeFlavour(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 bg-white rounded-full p-1"><FiX size={16} /></button>

                                        <div className="flex flex-col md:flex-row gap-4 items-start">
                                            <div className="w-full md:w-1/3">
                                                <label className="block text-xs font-bold text-gray-600 mb-1">Select Flavour</label>
                                                <select
                                                    value={flav.name}
                                                    onChange={(e) => handleFlavourChange(index, 'name', e.target.value)}
                                                    className="border border-gray-300 p-2.5 rounded-md text-sm focus:border-[#009e3e] outline-none w-full font-semibold bg-white mb-2"
                                                >
                                                    <option value="">-- Choose Flavour --</option>
                                                    <option value="Cola">Cola</option>
                                                    <option value="Guava">Guava</option>
                                                    <option value="Orange">Orange</option>
                                                    <option value="Lemon">Lemon</option>
                                                    <option value="Mango">Mango</option>
                                                    <option value="Watermelon">Watermelon</option>
                                                    <option value="Green Apple">Green Apple</option>
                                                    <option value="Fruit Punch">Fruit Punch</option>
                                                </select>

                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={flav.isSelected || false}
                                                        onChange={(e) => handleFlavourChange(index, 'isSelected', e.target.checked)}
                                                        className="w-4 h-4 text-[#009e3e] rounded focus:ring-[#009e3e] accent-[#009e3e]"
                                                    />
                                                    <span className="text-xs font-semibold text-gray-700">Upload image for this</span>
                                                </label>
                                            </div>

                                            <div className={`w-full md:w-1/3 flex flex-col gap-2 transition-opacity ${flav.isSelected ? 'opacity-100 pointer-events-auto' : 'opacity-50 pointer-events-none'}`}>
                                                <label className="block text-xs font-bold text-gray-600 mb-1">Upload Image (Max 1)</label>
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {flav.existingImgs && flav.existingImgs.map((img, i) => (
                                                        <div key={`exist-${i}`} className="w-12 h-12 border border-gray-300 rounded overflow-hidden">
                                                            {/* ✅ FIXED IMAGE URL HERE */}
                                                            <img src={`${BACKEND_URL}${img}`} alt="existing" className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                    {flav.imgs && flav.imgs.map((file, i) => (
                                                        <div key={`new-${i}`} className="w-12 h-12 border border-gray-300 rounded overflow-hidden">
                                                            <img src={URL.createObjectURL(file)} alt="new" className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                    {(!flav.imgs || flav.imgs.length === 0) && (!flav.existingImgs || flav.existingImgs.length === 0) && (
                                                        <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50">
                                                            <FiImage className="text-gray-400" size={16} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="relative border border-gray-300 rounded-md overflow-hidden bg-white">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFlavourImages(index, e.target.files)}
                                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                                                    />
                                                </div>
                                            </div>

                                            <div className="w-full md:w-1/3">
                                                <label className="block text-xs font-bold text-gray-600 mb-1">Stock Status</label>
                                                <select
                                                    value={flav.inStock}
                                                    onChange={(e) => handleFlavourChange(index, 'inStock', e.target.value === 'true')}
                                                    className="border border-gray-300 p-2.5 rounded-md text-sm focus:border-[#009e3e] outline-none w-full bg-white font-semibold"
                                                >
                                                    <option value="true">In Stock</option>
                                                    <option value="false">Out of Stock</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* ✅ Flavour-Specific Overrides */}
                                        <div className="bg-white p-3 border border-gray-100 rounded-lg">
                                            <h4 className="text-xs font-bold text-gray-800 mb-2">Flavour-Specific Details (Optional)</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                <input type="number" placeholder="Specific Price (₹)" value={flav.price} onChange={(e) => handleFlavourChange(index, 'price', e.target.value)} className="border border-gray-300 p-2 rounded-md text-sm focus:border-[#009e3e] outline-none" />
                                                <input type="number" placeholder="Specific MRP (₹)" value={flav.mrp} onChange={(e) => handleFlavourChange(index, 'mrp', e.target.value)} className="border border-gray-300 p-2 rounded-md text-sm focus:border-[#009e3e] outline-none" />
                                            </div>
                                            <textarea placeholder="Specific Description" value={flav.description} onChange={(e) => handleFlavourChange(index, 'description', e.target.value)} className="w-full border border-gray-300 p-2 rounded-md text-sm focus:border-[#009e3e] outline-none mb-3" rows="2"></textarea>

                                            <div className="mb-3">
                                                <textarea placeholder='Specific Benefits JSON (e.g. ["More Pump"])' value={flav.benefits} onChange={(e) => handleFlavourChange(index, 'benefits', e.target.value)} className="w-full border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:border-[#009e3e]" rows="2"></textarea>
                                            </div>

                                            {/* Flavour Ingredients */}
                                            <div className="border-t pt-3 mt-3">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h5 className="text-xs font-bold text-gray-700">Flavour Ingredients</h5>
                                                    <button type="button" onClick={() => addFlavourIngredient(index)} className="text-xs text-[#009e3e] font-bold flex items-center gap-1"><FiPlus size={12} /> Add</button>
                                                </div>
                                                {flav.ingredientsList.map((fIng, iIdx) => (
                                                    <div key={iIdx} className="flex flex-col md:flex-row gap-2 items-start mb-2 bg-gray-50 p-2 rounded border relative">
                                                        <button type="button" onClick={() => removeFlavourIngredient(index, iIdx)} className="absolute top-1 right-1 text-red-400"><FiX size={12} /></button>
                                                        <div className="w-12 h-12 border border-gray-300 rounded flex items-center justify-center overflow-hidden relative cursor-pointer bg-white">
                                                            {/* ✅ FIXED IMAGE URL HERE */}
                                                            {fIng.img ? <img src={URL.createObjectURL(fIng.img)} className="w-full h-full object-cover" /> : fIng.existingImg ? <img src={`${BACKEND_URL}${fIng.existingImg}`} className="w-full h-full object-cover" /> : <FiImage className="text-gray-400" />}
                                                            <input type="file" accept="image/*" onChange={(e) => handleFlavourIngredientImage(index, iIdx, e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                        </div>
                                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 w-full mt-1">
                                                            <input type="text" placeholder="Amount" value={fIng.amount} onChange={(e) => handleFlavourIngredientChange(index, iIdx, 'amount', e.target.value)} className="border border-gray-300 p-1 rounded text-xs outline-none" />
                                                            <input type="text" placeholder="Name" value={fIng.name} onChange={(e) => handleFlavourIngredientChange(index, iIdx, 'name', e.target.value)} className="border border-gray-300 p-1 rounded text-xs outline-none" />
                                                            <input type="text" placeholder="Desc" value={fIng.desc} onChange={(e) => handleFlavourIngredientChange(index, iIdx, 'desc', e.target.value)} className="border border-gray-300 p-1 rounded text-xs outline-none" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Flavour How To Use */}
                                            <div className="border-t pt-3 mt-3">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h5 className="text-xs font-bold text-gray-700">Flavour How to Use</h5>
                                                    <button type="button" onClick={() => addFlavourHowToUse(index)} className="text-xs text-[#009e3e] font-bold flex items-center gap-1"><FiPlus size={12} /> Add</button>
                                                </div>
                                                {flav.howToUseList.map((fHow, sIdx) => (
                                                    <div key={sIdx} className="flex flex-col md:flex-row gap-2 items-start mb-2 bg-gray-50 p-2 rounded border relative">
                                                        <button type="button" onClick={() => removeFlavourHowToUse(index, sIdx)} className="absolute top-1 right-1 text-red-400"><FiX size={12} /></button>
                                                        <div className="w-12 h-12 border border-gray-300 rounded flex items-center justify-center overflow-hidden relative cursor-pointer bg-white">
                                                            {/* ✅ FIXED IMAGE URL HERE */}
                                                            {fHow.img ? <img src={URL.createObjectURL(fHow.img)} className="w-full h-full object-cover" /> : fHow.existingImg ? <img src={`${BACKEND_URL}${fHow.existingImg}`} className="w-full h-full object-cover" /> : <FiImage className="text-gray-400" />}
                                                            <input type="file" accept="image/*" onChange={(e) => handleFlavourHowToUseImage(index, sIdx, e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                        </div>
                                                        <div className="flex-1 w-full mt-1">
                                                            <input type="text" placeholder="Step description" value={fHow.text} onChange={(e) => handleFlavourHowToUseChange(index, sIdx, 'text', e.target.value)} className="w-full border border-gray-300 p-1 rounded text-xs outline-none" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 4. BASE HOW TO USE */}
                            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-black">Base How to Use</h3>
                                    <button type="button" onClick={addHowToUse} className="flex items-center gap-1 text-sm bg-[#009e3e] text-white px-3 py-1.5 rounded-md hover:bg-[#008233] transition-colors">
                                        <FiPlus size={14} /> Add Step
                                    </button>
                                </div>
                                {howToUseList.map((step, index) => (
                                    <div key={index} className="flex flex-col md:flex-row gap-3 items-start mb-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm relative">
                                        <button type="button" onClick={() => removeHowToUse(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><FiX size={16} /></button>
                                        <div className="w-20 h-20 border border-gray-300 rounded-lg flex flex-col items-center justify-center overflow-hidden relative cursor-pointer flex-shrink-0 bg-gray-50">
                                            {/* ✅ FIXED IMAGE URL HERE */}
                                            {step.img ? <img src={URL.createObjectURL(step.img)} alt="step" className="w-full h-full object-contain" /> : step.existingImg ? <img src={`${BACKEND_URL}${step.existingImg}`} alt="step" className="w-full h-full object-contain" /> : <><FiImage className="text-gray-400 mb-1" /><span className="text-[9px] text-gray-400">Image</span></>}
                                            <input type="file" accept="image/*" onChange={(e) => handleHowToUseImage(index, e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                        <div className="flex-1 w-full mt-2 md:mt-0">
                                            <textarea placeholder="Enter how to use text (e.g. Mix 1 scoop in 250ml water)" value={step.text} onChange={(e) => handleHowToUseChange(index, 'text', e.target.value)} className="w-full border border-gray-300 p-3 rounded-md text-sm focus:border-[#009e3e] outline-none h-20 resize-none" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 5. BENEFITS & SPECS */}
                            <div className="bg-blue-50 p-3 rounded-lg mb-2 text-xs text-blue-800">
                                <strong>Tip:</strong> For Base Benefits, format them as a JSON array (e.g. ["Boosts Energy", "Enhances Pumps"]).
                            </div>
                            <textarea placeholder='Base Benefits JSON (e.g. ["Boosts Energy", "Enhances Pumps", "Improves Endurance"])' value={productForm.benefits} onChange={e => setProductForm({ ...productForm, benefits: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-[#009e3e]" rows="2"></textarea>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Specifications (e.g. 25g Protein)" value={productForm.specifications} onChange={e => setProductForm({ ...productForm, specifications: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-[#009e3e]" />
                                <input type="text" placeholder="Tags (e.g. muscle, recovery)" value={productForm.tags} onChange={e => setProductForm({ ...productForm, tags: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-[#009e3e]" />
                            </div>

                            {/* 6. MAIN PRODUCT IMAGES */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors relative mb-6">
                                <input type="file" multiple accept="image/*" onChange={handleMainImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                <FiImage className="mx-auto text-4xl text-gray-400 mb-3" />
                                <p className="text-base text-gray-600 font-medium">Click to upload main product images (Max 10)</p>
                                <p className="text-sm text-gray-400 mt-1">{imageFiles.length} files selected</p>
                            </div>

                            {imageFiles.length > 0 && (
                                <div className="flex flex-wrap gap-4 mb-6 p-4 border rounded-lg bg-gray-50">
                                    {imageFiles.map((imgObj, index) => (
                                        <div key={index} className="relative flex flex-col items-center bg-white p-2 rounded-lg border shadow-sm w-32">
                                            <div className="relative w-full h-24 border border-gray-200 rounded-md overflow-hidden bg-gray-100 mb-2">
                                                <img src={URL.createObjectURL(imgObj.file)} alt={`Preview ${index}`} className="w-full h-full object-cover" />

                                                <div className="absolute top-1 left-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                                    {index === 0 ? 'Main Thumb' : `Img ${index + 1}`}
                                                </div>

                                                <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm" title="Remove image"><FiX size={12} /></button>
                                            </div>

                                            {index !== 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => makeMainImage(index)}
                                                    className="text-[10px] text-blue-600 hover:text-blue-800 font-bold mb-1 flex items-center gap-1 w-full justify-center"
                                                >
                                                    <FiArrowUp size={10} /> Make Main Thumb
                                                </button>
                                            )}

                                            <select
                                                value={imgObj.flavour || ''}
                                                onChange={(e) => handleMainImageFlavourChange(index, e.target.value)}
                                                className="w-full text-xs border border-gray-300 rounded p-1.5 focus:border-[#009e3e] outline-none bg-gray-50 text-gray-700"
                                            >
                                                <option value="">Generic / No Flavour</option>
                                                {flavoursList.filter(f => f.name).map((flav, i) => (
                                                    <option key={i} value={flav.name}>Linked to {flav.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button type="submit" className="w-full bg-[#009e3e] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#008233] transition-colors mt-2">{isEditingProduct ? 'Update Product' : 'Save Product'}</button>
                        </form>
                    </div>
                </div>
            )}

            {/* BANNER MODAL */}
            {isBannerModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setIsBannerModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><FiX size={24} /></button>
                        <h2 className="text-2xl font-bold mb-6 text-black">{isEditingBanner ? 'Edit Banner' : 'Add New Banner'}</h2>
                        <form onSubmit={handleBannerSubmit} className="space-y-4">
                            <input type="text" placeholder="Banner Title (For Admin Reference)" value={bannerForm.title} onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:border-[#009e3e] outline-none" />
                            <input type="text" placeholder="Link URL (e.g. /shop)" value={bannerForm.link} onChange={e => setBannerForm({ ...bannerForm, link: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:border-[#009e3e] outline-none" />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Position (1, 2, or 3)</label>
                                <input type="number" min="1" max="3" placeholder="e.g. 1" value={bannerForm.position} onChange={e => setBannerForm({ ...bannerForm, position: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:border-[#009e3e] outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input type="text" placeholder="https://example.com/banner.jpg" value={bannerForm.imageUrl} onChange={e => setBannerForm({ ...bannerForm, imageUrl: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:border-[#009e3e] outline-none" />
                            </div>
                            <div className="text-center text-sm text-gray-400 font-medium">— OR —</div>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 relative">
                                <input type="file" accept="image/*" onChange={(e) => setBannerImage(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                <FiImage className="mx-auto text-3xl text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600 font-medium">Upload Banner Image</p>
                                <p className="text-xs text-gray-400 mt-1">{bannerImage ? bannerImage.name : 'No file selected'}</p>
                            </div>
                            <button type="submit" className="w-full bg-[#009e3e] text-white py-3 rounded-lg font-bold hover:bg-[#008233] transition-colors mt-4">{isEditingBanner ? 'Update Banner' : 'Save Banner'}</button>
                        </form>
                    </div>
                </div>
            )}

            {/* CATEGORY MODAL */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setIsCategoryModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><FiX size={24} /></button>
                        <h2 className="text-2xl font-bold mb-6 text-black">Add New Category</h2>
                        <form onSubmit={handleCategorySubmit} className="space-y-4">
                            <input type="text" placeholder="Category Name" required value={categoryForm.name} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-[#009e3e]" />
                            <textarea placeholder="Description (Optional)" value={categoryForm.description} onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-[#009e3e]" rows="3"></textarea>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                                <input type="text" placeholder="https://example.com/image.jpg" value={categoryForm.imageUrl} onChange={e => setCategoryForm({ ...categoryForm, imageUrl: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:border-[#009e3e]" />
                            </div>
                            <div className="text-center text-sm text-gray-400 font-medium">— OR —</div>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors relative">
                                <input type="file" accept="image/*" onChange={(e) => setCategoryImage(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                <FiImage className="mx-auto text-3xl text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600 font-medium">Click to upload category image</p>
                                <p className="text-xs text-gray-400 mt-1">{categoryImage ? categoryImage.name : 'No file selected'}</p>
                            </div>
                            <button type="submit" className="w-full bg-[#009e3e] text-white py-3 rounded-lg font-bold hover:bg-[#008233] transition-colors mt-4">Save Category</button>
                        </form>
                    </div>
                </div>
            )}

            {/* ✅ COUPON MODAL */}
            {isCouponModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setIsCouponModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><FiX size={24} /></button>
                        <h2 className="text-2xl font-bold mb-6 text-black">{isEditingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h2>
                        <form onSubmit={handleCouponSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Coupon Code</label>
                                <input type="text" required placeholder="e.g. SAVE10" value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:border-[#009e3e] outline-none uppercase" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Discount Type</label>
                                    <select value={couponForm.discountType} onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:border-[#009e3e] outline-none">
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Value</label>
                                    <input type="number" required placeholder="e.g. 10" value={couponForm.discountValue} onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:border-[#009e3e] outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Minimum Order Value (₹)</label>
                                <input type="number" placeholder="0 for no minimum" value={couponForm.minOrderValue} onChange={(e) => setCouponForm({ ...couponForm, minOrderValue: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:border-[#009e3e] outline-none" />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={couponForm.isActive} onChange={(e) => setCouponForm({ ...couponForm, isActive: e.target.checked })} className="w-4 h-4 accent-[#009e3e]" />
                                <span className="text-sm font-semibold text-gray-700">Active</span>
                            </label>
                            <button type="submit" className="w-full bg-[#009e3e] text-white py-3 rounded-lg font-bold hover:bg-[#008233] transition-colors mt-4">{isEditingCoupon ? 'Update Coupon' : 'Create Coupon'}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;