import { Label } from "@medusajs/ui";
import React, { useEffect, useImperativeHandle, useState } from "react";

import Eye from "@modules/common/icons/eye";
import EyeOff from "@modules/common/icons/eye-off";

type InputProps = Omit<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
  "placeholder"
> & {
  label: string;
  errors?: Record<string, unknown>;
  touched?: Record<string, unknown>;
  name: string;
  topLabel?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, name, label, touched, required, topLabel, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [inputType, setInputType] = useState(type);

    useEffect(() => {
      if (type === "password" && showPassword) {
        setInputType("text");
      }

      if (type === "password" && !showPassword) {
        setInputType("password");
      }
    }, [type, showPassword]);

    useImperativeHandle(ref, () => inputRef.current!);

    return (
      <div className="flex flex-col w-full">
        {topLabel && (
          <Label className="mb-2 text-sm font-medium text-dark">
            {topLabel}
          </Label>
        )}
        <div className="flex flex-col w-full">
          <label htmlFor={name} className="mb-2 text-sm font-medium text-dark">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="flex relative w-full">
            <input
              type={inputType}
              name={name}
              id={name}
              placeholder=" "
              required={required}
              className="block w-full h-11 px-4 bg-gray-1 border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue border-gray-3 hover:bg-white transition-colors duration-200"
              {...props}
              ref={inputRef}
            />
            {type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-dark-4 px-4 focus:outline-none transition-all duration-150 outline-none focus:text-dark absolute right-0 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
