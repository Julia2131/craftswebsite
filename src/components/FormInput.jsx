import { useState } from "react";

export default function FormInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  helper,
  error,
  icon,
  type = "text"
}) {

  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? "border-red-500"
    : focused
    ? "border-blue-500"
    : "border-slate-300";

  return (
    <div className="flex flex-col gap-1">

      {/* LABEL */}
      <label
        htmlFor={name}
        className="text-sm font-medium"
      >
        {label}
      </label>

      {/* INPUT + ICON */}
      <div className={`flex items-center border rounded-md px-3 py-3 ${borderColor}`}>

        {icon && (
          <span className="mr-2 text-slate-400">
            {icon}
          </span>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={`${name}-helper`}
          className="w-full outline-none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

      </div>

      {/* HELPER TEXT */}
      {!error && helper && (
        <p
          id={`${name}-helper`}
          className="text-xs text-gray-500"
        >
          {helper}
        </p>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}

    </div>
  );
}