import React from "react";

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
}

export default function InputField({
  id,
  label,
  type = "text",
  value,
  placeholder,
  onChange,
  required = false,
  error,
}: InputFieldProps) {
  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        className={`w-full border rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 
          focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition 
          ${error ? "border-red-400" : "border-gray-300"}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
