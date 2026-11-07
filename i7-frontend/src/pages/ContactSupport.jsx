import { FiChevronRight } from 'react-icons/fi';

// Import your custom images
import headphoneIcon from '../images/headphone-icon.png';
import messageIcon from '../images/message-icon.png';
import callIcon from '../images/call-icon.png';

const ContactSupport = () => {
  return (
    <div className="bg-[#f8f9fa] min-h-screen py-10 font-sans">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
          <a href="/" className="hover:text-[#00E600]">Home</a>
          <FiChevronRight />
          <span className="text-[#00E600]">Contact & Support</span>
        </div>

        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-black text-black mb-2">Contact & Support</h1>
            <h2 className="text-lg font-bold text-black mb-3">We are here to help you</h2>
            <p className="text-gray-600 text-sm max-w-md leading-relaxed">
              Have a question, need help with an order or want product guidance? Our team is ready to assist you.
            </p>
          </div>
          
          {/* Custom Headphone Image */}
          <div className="hidden md:block">
             <img src={headphoneIcon} alt="Support" className="w-24 h-auto object-contain" />
          </div>
        </div>

        {/* Call Us Card */}
        {/* INCREASED HEIGHT: Changed p-6 to py-8 px-6 and increased icon size */}
        <div className="bg-white rounded-3xl py-8 px-6 md:px-8 flex flex-col md:flex-row items-center justify-between shadow-sm border border-gray-100 mb-5">
          <div className="flex items-center gap-6 w-full md:w-auto mb-4 md:mb-0">
            
            {/* Increased Icon Container Size to w-16 h-16 */}
            <div className="flex items-center justify-center w-16 h-16 flex-shrink-0">
              <img src={callIcon} alt="Call" className="w-full h-full object-contain" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-black mb-1.5">Call Us</h3>
              <p className="text-black font-bold text-[17px] mb-1.5">+91 85957 04674</p>
              <p className="text-[13px] text-gray-500 font-medium">Mon - Sat, 10:00 AM - 6:00 PM (IST)</p>
            </div>
          </div>
          <a href="tel:+918595704674" className="bg-[#009e3e] hover:bg-[#008233] text-white px-7 py-3 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors">
            Call Now <FiChevronRight size={16} />
          </a>
        </div>

        {/* Email Us Card */}
        {/* INCREASED HEIGHT: Changed p-6 to py-8 px-6 and increased icon size */}
        <div className="bg-white rounded-3xl py-8 px-6 md:px-8 flex flex-col md:flex-row items-center justify-between shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-6 w-full md:w-auto mb-4 md:mb-0">
            
            {/* Increased Icon Container Size to w-16 h-16 */}
            <div className="flex items-center justify-center w-16 h-16 flex-shrink-0">
              <img src={messageIcon} alt="Email" className="w-full h-full object-contain" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-black mb-1.5">Email Us</h3>
              <p className="text-black font-bold text-[17px] mb-1.5">support@i7nutrition.in</p>
              <p className="text-[13px] text-gray-500 font-medium">We usually respond within 24 hours.</p>
            </div>
          </div>
          <a href="mailto:support@i7nutrition.in" className="bg-[#009e3e] hover:bg-[#008233] text-white px-7 py-3 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors">
            Send Email <FiChevronRight size={16} />
          </a>
        </div>

        {/* Still Need Help Banner */}
        <div className="bg-[#e5f9eb] rounded-2xl p-6 flex items-center gap-5">
          <img src={headphoneIcon} alt="Help" className="w-16 h-auto object-contain flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-black mb-1">Still need help?</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Our support team is happy to assist you with any query related to orders, products or your account.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactSupport;