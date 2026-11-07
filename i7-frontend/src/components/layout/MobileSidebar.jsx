import { Link } from 'react-router-dom';
import { FiX, FiHome, FiUser, FiShoppingBag, FiActivity, FiTruck, FiPhone } from 'react-icons/fi';
import { MdPolicy, MdSecurity, MdAssignmentReturn, MdLocalShipping, MdSupportAgent } from 'react-icons/md';
import { HiOutlineClipboardList, HiOutlineShieldCheck } from 'react-icons/hi';

const MobileSidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Dark Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar Panel - REMOVED md:hidden so it shows on desktop too */}
      <div className={`fixed top-0 left-0 h-full w-[280px] bg-[#0b100c] text-white z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header (Close Button) */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <FiX className="text-3xl cursor-pointer text-white hover:text-[#00E600] transition-colors" onClick={() => setIsOpen(false)} />
        </div>

        {/* Main Menu Links */}
        <nav className="flex flex-col text-[14px] font-medium">
          
          {/* Home - Active State */}
          <Link to="/" onClick={() => setIsOpen(false)} className="p-4 bg-[#00E600]/10 text-[#00E600] flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-4">
              <FiHome size={20} /> Home
            </div>
            <span className="text-gray-400">›</span>
          </Link>

          <Link to="/login" onClick={() => setIsOpen(false)} className="p-4 hover:bg-gray-800 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-4">
              <FiUser size={20} /> Sign In
            </div>
            <span className="text-gray-400">›</span>
          </Link>

          <Link to="/my-account" onClick={() => setIsOpen(false)} className="p-4 hover:bg-gray-800 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-4">
              <FiUser size={20} /> My Account
            </div>
            <span className="text-gray-400">›</span>
          </Link>

          <Link to="/shop" onClick={() => setIsOpen(false)} className="p-4 hover:bg-gray-800 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-4">
              <FiShoppingBag size={20} /> Shop All Products
            </div>
            <span className="text-gray-400">›</span>
          </Link>

          <Link to="/lab-tested" onClick={() => setIsOpen(false)} className="p-4 hover:bg-gray-800 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-4">
              <FiActivity size={20} /> Lab Tested
            </div>
            <span className="text-gray-400">›</span>
          </Link>

          {/* Sub-Menu Container (Indented with borders like the image) */}
          <div className="mx-4 my-2 border border-gray-800 rounded-md overflow-hidden bg-[#0f1612]">
            <Link to="#" onClick={() => setIsOpen(false)} className="p-4 flex items-center justify-between border-b border-gray-800 hover:bg-gray-800">
              <div className="flex items-center gap-4">
                <HiOutlineClipboardList size={20} /> Terms & Conditions
              </div>
              <span className="text-gray-400">›</span>
            </Link>
            
            <Link to="#" onClick={() => setIsOpen(false)} className="p-4 flex items-center justify-between border-b border-gray-800 hover:bg-gray-800">
              <div className="flex items-center gap-4">
                <HiOutlineShieldCheck size={20} /> Privacy Policy
              </div>
              <span className="text-gray-400">›</span>
            </Link>

            <Link to="#" onClick={() => setIsOpen(false)} className="p-4 flex items-center justify-between border-b border-gray-800 hover:bg-gray-800">
              <div className="flex items-center gap-4">
                <MdAssignmentReturn size={20} /> Return Policy
              </div>
              <span className="text-gray-400">›</span>
            </Link>

            <Link to="#" onClick={() => setIsOpen(false)} className="p-4 flex items-center justify-between border-b border-gray-800 hover:bg-gray-800">
              <div className="flex items-center gap-4">
                <MdLocalShipping size={20} /> Shipping Policy
              </div>
              <span className="text-gray-400">›</span>
            </Link>

            <Link to="#" onClick={() => setIsOpen(false)} className="p-4 flex items-center justify-between hover:bg-gray-800">
              <div className="flex items-center gap-4">
                <MdSecurity size={20} /> Security Policy
              </div>
              <span className="text-gray-400">›</span>
            </Link>
          </div>

          {/* Contact & Support - Active Green State */}
          <Link to="/contact-support" onClick={() => setIsOpen(false)} className="p-4 bg-[#00E600]/10 text-[#00E600] flex items-center justify-between border-b border-t border-gray-800">
            <div className="flex items-center gap-4">
              <FiPhone size={20} /> Contact & Support
            </div>
            <span className="text-[#00E600]">›</span>
          </Link>

          <Link to="/track-order" onClick={() => setIsOpen(false)} className="p-4 hover:bg-gray-800 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-4">
              <FiTruck size={20} /> Track Order
            </div>
            <span className="text-gray-400">›</span>
          </Link>

        </nav>
      </div>
    </>
  );
};

export default MobileSidebar;