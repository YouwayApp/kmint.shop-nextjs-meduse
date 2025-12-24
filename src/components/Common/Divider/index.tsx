import React from "react";

interface DividerProps {
  className?: string;
}

const Divider: React.FC<DividerProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-center my-8 sm:my-12 ${className}`}>
      <div className="flex items-center w-full max-w-[200px]">
        {/* Left Line */}
        <div className="flex-1 h-px bg-gray-3"></div>
        
        {/* Center Icon */}
        <div className="mx-4 flex-shrink-0">
          <svg
            width="32"
            height="24"
            viewBox="0 0 32 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-4"
          >
            <path
              d="M12 4C12 4 8 8 8 12C8 16 12 20 12 20"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M20 4C20 4 24 8 24 12C24 16 20 20 20 20"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
        
        {/* Right Line */}
        <div className="flex-1 h-px bg-gray-3"></div>
      </div>
    </div>
  );
};

export default Divider;

