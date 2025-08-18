import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import Button from "./Button";
import Icon from "./Icon";

const ConfirmDialog = ({
  isOpen = false,
  onClose,
  onConfirm,
  title = "Confirmar Acción",
  message = "¿Estás seguro de que quieres realizar esta acción?",
  icon = "FiAlertTriangle",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmVariant = "danger",
  cancelVariant = "outline",
  waitTime = null, // Tiempo en segundos para deshabilitar el botón de confirmar
  showCancelButton = true,
  size = "max-w-md"
}) => {
  const [timeRemaining, setTimeRemaining] = useState(waitTime);
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(false);

  // Efecto para manejar el tiempo de espera
  useEffect(() => {
    if (waitTime && waitTime > 0) {
      setTimeRemaining(waitTime);
      setIsConfirmDisabled(true);

      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsConfirmDisabled(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [waitTime, isOpen]);

  // Resetear el estado cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen && waitTime && waitTime > 0) {
      setTimeRemaining(waitTime);
      setIsConfirmDisabled(true);
    }
  }, [isOpen, waitTime]);

  const handleConfirm = () => {
    if (!isConfirmDisabled) {
      onConfirm();
    }
  };

  const handleClose = () => {
    onClose();
  };

  const getIconColor = () => {
    switch (confirmVariant) {
      case "danger":
        return "text-red-500";
      case "warning":
        return "text-yellow-500";
      case "success":
        return "text-green-500";
      case "primary":
        return "text-blue-500";
      default:
        return "text-red-500";
    }
  };

  const getButtonText = () => {
    if (waitTime && waitTime > 0 && isConfirmDisabled) {
      return `${confirmText} (${timeRemaining}s)`;
    }
    return confirmText;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      size={size}
      showCloseButton={false}
    >
      <div className="text-center">
        {/* Icono */}
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
          <Icon
            name={icon}
            className={`h-6 w-6 ${getIconColor()}`}
          />
        </div>

        {/* Mensaje */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {message}
          </p>
        </div>

        {/* Botones */}
        <div className="flex justify-center gap-3">
          {showCancelButton && (
            <Button
              variant={cancelVariant}
              onClick={handleClose}
              className="min-w-[100px]"
            >
              {cancelText}
            </Button>
          )}
          
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className={`min-w-[100px] ${
              isConfirmDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {getButtonText()}
          </Button>
        </div>

        {/* Información adicional sobre el tiempo de espera */}
        {/* {waitTime && waitTime > 0 && isConfirmDisabled && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            ⏱️ El botón se habilitará en {timeRemaining} segundo{timeRemaining !== 1 ? "s" : ""}
          </p>
        )} */}
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
