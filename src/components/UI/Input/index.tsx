import React from "react";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "outline" | "filled";
  size?: "sm" | "md" | "lg";
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) => {
  const baseClasses =
    "rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20";

  const sizeClasses = {
    sm: "py-2 px-3 text-sm",
    md: "py-2.5 px-5",
    lg: "py-3 px-6 text-lg",
  };

  const variantClasses = {
    default: "border-gray-3 bg-gray-1",
    outline: "border-gray-3 bg-transparent",
    filled: "border-transparent bg-gray-1",
  };

  const errorClasses = error ? "border-red-500 focus:ring-red-500/20" : "";

  const inputClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${errorClasses}
    ${className}
  `.trim();

  return (
    <div className="w-full">
      {label && (
        <label
          className="block mb-2.5 text-sm font-medium text-dark"
          style={{ color: "#1C274C" }}
        >
          {label}
        </label>
      )}

      <input className={inputClasses} {...props} />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-600">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
