import React from "react";

function EmptyState({
  illustration = "📦",
  title = "Không có dữ liệu",
  description = "",
  primaryActionText,
  onPrimaryAction,
  secondaryActionText,
  onSecondaryAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-6">

      {/* Illustration */}
      <div className="text-7xl mb-6">
        {illustration}
      </div>

      {/* Title */}
      <h2 className="text-3xl font-semibold mb-2">
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p className="text-gray-500 max-w-md mb-6">
          {description}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-4">

        {primaryActionText && (
          <button
            onClick={onPrimaryAction}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            {primaryActionText}
          </button>
        )}

        {secondaryActionText && (
          <button
            onClick={onSecondaryAction}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            {secondaryActionText}
          </button>
        )}

      </div>

    </div>
  );
}

export default EmptyState;