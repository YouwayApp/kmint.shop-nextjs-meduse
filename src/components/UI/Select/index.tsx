import React from "react";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  variant?: "default" | "outline" | "filled";
  size?: "sm" | "md" | "lg";
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  placeholder,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) => {
  const baseClasses =
    "rounded-md border border-gray-3 bg-gray-1 w-full outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20";

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

  const selectClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${errorClasses}
    ${className}
  `.trim();

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2.5 text-sm font-medium text-dark">
          {label}
        </label>
      )}

      <select className={selectClasses} {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-600">{helperText}</p>
      )}
    </div>
  );
};

export default Select;
