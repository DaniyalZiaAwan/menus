/* eslint-disable  @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef } from "react";

interface DropdownSelectProps {
  options: any[]; // Array of options
  defaultValue?: string; // Optional default value
  onChange?: (selected: any) => void; // Callback function for selected value
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  options,
  defaultValue = "",
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>(defaultValue);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown container

  const handleSelect = (option: any) => {
    setSelected(option.name);
    setIsOpen(false);
    if (onChange) onChange(option); // Trigger onChange callback if provided
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Selected Item */}
      <button
        className="w-full bg-gray-50 text-gray-700 py-2 px-4 rounded-lg flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span>{selected || "Select Menu"}</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul className="absolute w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {options.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(option)}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownSelect;
