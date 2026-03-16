import { useState } from "react";

export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  helperText,
  error,
  icon,
  suffix,
  id,
  required = false,
}) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? "border-red-500"
    : focused
    ? "border-indigo-500"
    : "border-gray-300";

  return (
    <div className="flex flex-col gap-1 w-full">

      {/* LABEL */}
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
      )}

      {/* INPUT WRAPPER */}
      <div
        className={`
        flex items-center
        border rounded-lg
        transition
        ${borderColor}
        `}
      >

        {/* ICON */}
        {icon && (
          <div className="pl-3 text-gray-400">
            {icon}
          </div>
        )}

        {/* INPUT */}
        <input
          id={id}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${id}-error` : `${id}-helper`
          }
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 px-3 py-2 outline-none"
        />

        {/* SUFFIX */}
        {suffix && (
          <div className="px-3 text-gray-500 border-l">
            {suffix}
          </div>
        )}
      </div>

      {/* ERROR MESSAGE */}
      {error ? (
        <p
          id={`${id}-error`}
          className="text-sm text-red-500"
        >
          {error}
        </p>
      ) : (
        helperText && (
          <p
            id={`${id}-helper`}
            className="text-sm text-gray-500"
          >
            {helperText}
          </p>
        )
      )}
    </div>
  );
}