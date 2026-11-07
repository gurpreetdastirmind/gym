import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronRight, FiUser, FiBox, FiMapPin, FiHeart, FiLock, FiBell, FiLogOut } from 'react-icons/fi';
import headphoneIcon from '../images/headphone-icon.png';

const MyAccount = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Check login status on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // If not logged in, redirect to login page
      navigate('/login');
    }
  }, [navigate]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Logged out successfully');
    navigate('/login');
  };

  if (!user) return null; // Don't render anything while checking auth

  const menuItems = [
    { icon: <FiBox size={24} />, title: 'Orders', desc: 'View your order history, track orders and reorder products.', link: '/track-order' },
    { icon: <FiMapPin size={24} />, title: 'Addresses', desc: 'Manage your shipping and billing addresses.', link: '#' },
    { icon: <FiUser size={24} />, title: 'Personal Information', desc: 'Update your name, email and phone number.', link: '/edit-profile' },
    { icon: <FiHeart size={24} />, title: 'Wishlist', desc: 'View and manage your saved products.', link: '#' },
    { icon: <FiLock size={24} />, title: 'Change Password', desc: 'Update your account password.', link: '/change-password'  },
    { icon: <FiBell size={24} />, title: 'Notifications', desc: 'Manage your email and SMS preferences.', link: '#' },
  ];

  return (
    <div className="bg-white min-h-screen py-10 font-sans">
      <div className="container mx-auto px-4 max-w-[600px]">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
          <Link to="/" className="hover:text-[#009e3e]">Home</Link>
          <FiChevronRight />
          <span className="text-[#009e3e]">My Account</span>
        </div>

        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-black text-black mb-1">My Account</h1>
            <h2 className="text-lg font-bold text-black mb-2">Manage your account</h2>
            <p className="text-gray-600 text-sm max-w-[280px] leading-relaxed">
              View and update your personal information, orders and preferences.
            </p>
          </div>
          
          <div className="bg-[#009e3e] text-white p-3 rounded-full flex items-center justify-center mt-2">
            <FiUser size={40} />
          </div>
        </div>

        {/* Dynamic Welcome Banner */}
        <div className="bg-[#eaf5ee] rounded-xl p-4 flex items-center justify-between mb-8 border border-[#d0ebd9]">
          <div className="flex items-center gap-4">
            <div className="bg-[#009e3e] text-white p-3 rounded-full flex-shrink-0">
              <FiUser size={28} />
            </div>
            <div>
              <h3 className="font-bold text-black text-[15px] mb-0.5">Welcome, {user.fullName}!</h3>
              <p className="text-gray-600 text-[13px] leading-tight max-w-[220px]">
                {user.email}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 transition-colors flex-shrink-0"
          >
            Logout <FiLogOut size={16} />
          </button>
        </div>

        {/* Menu List */}
        <div className="flex flex-col gap-3 mb-8">
          {menuItems.map((item, index) => (
            <Link 
              key={index} 
              to={item.link} 
              className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="text-black">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-black text-[15px] mb-0.5">{item.title}</h3>
                  <p className="text-gray-500 text-[13px] leading-tight">{item.desc}</p>
                </div>
              </div>
              <FiChevronRight className="text-black" size={20} />
            </Link>
          ))}

          {/* Logout Row */}
          <button 
            onClick={handleLogout}
            className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow w-full text-left"
          >
            <div className="flex items-center gap-4">
              <div className="text-red-500"><FiLogOut size={24} /></div>
              <div>
                <h3 className="font-bold text-red-500 text-[15px] mb-0.5">Logout</h3>
                <p className="text-gray-500 text-[13px] leading-tight">Sign out from your account.</p>
              </div>
            </div>
            <FiChevronRight className="text-red-500" size={20} />
          </button>
        </div>

        {/* Need Help Banner */}
        <div className="bg-[#eaf5ee] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-[#d0ebd9]">
          <div className="flex items-center gap-4">
            <img src={headphoneIcon} alt="Help" className="w-14 h-auto object-contain flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-black mb-1">Need Help?</h3>
              <p className="text-[13px] text-gray-700 leading-relaxed max-w-[250px]">
                If you face any issues with your account, our support team is here to help.
              </p>
            </div>
          </div>
          <Link 
            to="/contact-support" 
            className="border-2 border-[#009e3e] text-[#009e3e] hover:bg-[#009e3e] hover:text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 transition-colors flex-shrink-0"
          >
            Contact & Support <FiChevronRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default MyAccount;