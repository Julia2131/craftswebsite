import clsx from "clsx";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  className,
  ...props
}) {
  const baseStyle =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",

    success:
      "bg-green-600 text-white hover:bg-green-700 active:bg-green-800",

    danger:
      "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",

    outline:
      "border border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100",

    ghost:
      "text-gray-700 hover:bg-gray-100 active:bg-gray-200",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        baseStyle,
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      )}

      {!loading && icon}

      {children}
    </button>
  );
}