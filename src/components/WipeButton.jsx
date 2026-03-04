export default function WipeButton({
  children,
  className = "",
  type = "button",
  onClick,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={[
        "group relative inline-flex items-center justify-center",
        "overflow-hidden rounded-md border border-blue-600",
        "px-6 py-3 text-sm font-medium",
        "text-blue-600 bg-white",
        "transition-colors duration-300 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
        className,
      ].join(" ")}
    >
      {/* lớp màu xanh trượt vào */}
      <span
        className={[
          "absolute inset-0",
          "translate-x-[-110%] group-hover:translate-x-0",
          "bg-blue-600",
          "transition-transform duration-500 ease-out",
        ].join(" ")}
      />
      {/* chữ nằm trên */}
      <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
        {children}
      </span>
    </button>
  );
}