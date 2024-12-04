import React, { useEffect } from "react";

const Modal = ({ isOpen, onClose, children }) => {
  // Close the modal when the Esc key is pressed
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-black text-3xl font-bold"
          aria-label="Close Modal"
        >
          &times; {/* This is the "X" character */}
        </button>

        {/* Modal Content */}
        <div className="max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
