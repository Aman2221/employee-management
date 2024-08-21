import React from "react";

const InputField = ({
  name = "",
  label = "",
  type = "",
  placeholder = "",
  onChange = () => {},
  extrClasses = "w-full",
}: {
  name?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  onChange?: (a: any) => void;
  extrClasses?: string;
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
        required
      />
    </div>
  );
};

export default InputField;
