import React from "react";

interface InputFieldProps {
  label: string; // Label for the input field
  value: any; // Value of the input field
  onChange?: (value: any) => void; // Callback for input changes
  readOnly?: boolean; // Whether the input is read-only
  placeholder?: string; // Placeholder text for the input field
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  readOnly = false,
  placeholder = "",
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-00 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`w-full px-4 py-2 ${
          readOnly ? "bg-gray-100 cursor-not-allowed" : "bg-gray-50"
        } rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue`}
      />
    </div>
  );
};

export default InputField;
