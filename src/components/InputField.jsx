export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  suffix,
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="font-medium text-gray-700">
        {label}
      </label>

      <div className="flex items-center border rounded-lg overflow-hidden">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 outline-none"
        />

        {suffix && (
          <div className="px-3 text-gray-500 border-l">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
}