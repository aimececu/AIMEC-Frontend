import React from "react";
import Card from "./Card";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "max-w-4xl",
  className = "",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white dark:bg-secondary-800 rounded-lg ${size} w-full max-h-[90vh] flex flex-col`}>
        <Card className="flex flex-col h-full p-0 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary-300 dark:scrollbar-thumb-secondary-600 scrollbar-track-secondary-100 dark:scrollbar-track-secondary-800 hover:scrollbar-thumb-secondary-400 dark:hover:scrollbar-thumb-secondary-500">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-secondary-300 dark:scrollbar-thumb-secondary-600 scrollbar-track-secondary-100 dark:scrollbar-track-secondary-800 hover:scrollbar-thumb-secondary-400 dark:hover:scrollbar-thumb-secondary-500">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="p-6 border-t border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800">
              {footer}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Modal;
