import React from 'react';

interface CommonButtonProps {
  title: string;
  onClick?: () => void;
  variant?: 'yellow' | 'charcoal' | 'red' | 'outline' | 'blue';
  className?: string;
  textClassName?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit';
}

const CommonButton: React.FC<CommonButtonProps> = ({
  title,
  onClick,
  variant = 'yellow',
  className = '',
  textClassName = '',
  disabled = false,
  loading = false,
  type = 'button',
}) => {
  const baseStyles = 'px-5 py-2.5 rounded-lg flex items-center justify-center font-bold transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed select-none text-sm md:text-base';
  
  const variantStyles = {
    yellow: 'bg-jb-yellow text-jb-dark hover:bg-[#e0b800] border-2 border-jb-yellow hover:border-[#e0b800]',
    charcoal: 'bg-jb-charcoal text-white hover:bg-black border-2 border-jb-charcoal hover:border-black',
    red: 'bg-jb-red text-white hover:bg-[#c1141a] border-2 border-jb-red hover:border-[#c1141a]',
    blue: 'bg-jb-blue text-white hover:bg-[#004694] border-2 border-jb-blue hover:border-[#004694]',
    outline: 'bg-transparent text-jb-charcoal hover:bg-jb-charcoal hover:text-white border-2 border-jb-charcoal',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <span className={textClassName}>{title}</span>
      )}
    </button>
  );
};

export default CommonButton;
