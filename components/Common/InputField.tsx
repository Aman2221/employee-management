import React from "react";

const InputField = ({
  name = "",
  label = "",
  type = "",
  placeholder = "",
  onChange = () => {},
}: {
  name?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  onChange?: (a: React.FormEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div key={name}>
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white capitalize"
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        onChange={onChange}
        className={`outline-none border bg-transparent border-gray-300 text-gray-900 rounded-lg block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full`}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;
