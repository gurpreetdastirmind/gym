const Button = ({ children, onClick, type = "button", variant = "primary", className = "" }) => {
  const baseStyles = "px-6 py-2 rounded-md font-semibold transition-colors duration-200";
  
  const variants = {
    primary: "bg-i7green text-white hover:bg-green-800",
    outline: "border-2 border-i7green text-i7green hover:bg-i7green hover:text-white",
    ghost: "text-gray-600 hover:text-i7green"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;