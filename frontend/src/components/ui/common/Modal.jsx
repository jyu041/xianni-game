import React, { useEffect } from "react";
import Button from "./Button.jsx";

const Modal = ({
  children,
  title,
  onClose,
  className = "",
  showCloseButton = true,
  closeOnEscape = true,
  closeOnOverlay = true,
}) => {
  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose, closeOnEscape]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal ${className}`}>
        {title && (
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            {showCloseButton && (
              <Button
                onClick={onClose}
                className="modal-close-button"
                variant="secondary"
                size="small"
              >
                ✕
              </Button>
            )}
          </div>
        )}

        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
