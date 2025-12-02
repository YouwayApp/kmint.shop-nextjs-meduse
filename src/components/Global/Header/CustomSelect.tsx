import React, { useState, useEffect } from "react";

interface Option {
  label: string;
  value: string;
  handle: string;
}

interface CustomSelectProps {
  options: Option[];
  onChange?: (option: Option) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options && options.length > 0
      ? options[0]
      : { label: "Seçin...", value: "", handle: "" }
  );

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    toggleDropdown();
    // Call the onChange callback if provided
    if (onChange) {
      onChange(option);
    }
  };

  // Update selectedOption when options change
  useEffect(() => {
    if (options && options.length > 0 && !selectedOption) {
      setSelectedOption(options[0]);
    }
  }, [options, selectedOption]);

  useEffect(() => {
    // closing modal while clicking outside
    function handleClickOutside(event) {
      if (!event.target.closest(".dropdown-content")) {
        toggleDropdown();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="dropdown-content custom-select relative w-full"
      style={{ width: "100%" }}
    >
      <div
        className={`select-selected whitespace-nowrap text-xs sm:text-sm pt-[13px] pb-[13px] ${
          isOpen ? "select-arrow-active" : ""
        }`}
        onClick={toggleDropdown}
      >
        {selectedOption?.label || "Seçin..."}
      </div>
      <div className={`select-items ${isOpen ? "" : "select-hide"}`}>
        {options && options.length > 0 ? (
          options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`select-item text-xs sm:text-sm ${
                selectedOption?.value === option.value ? "same-as-selected" : ""
              }`}
            >
              {option.label}
            </div>
          ))
        ) : (
          <div className="select-item text-xs sm:text-sm">
            Seçenek bulunamadı
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
