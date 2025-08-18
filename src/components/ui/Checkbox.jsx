import React from "react";
import clsx from "clsx";
import Icon from "./Icon";

const Checkbox = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  description,
  className = "",
  size = "md",
  variant = "primary",
  card = false,
  align = "start", // "start", "center", "end"
  ...props
}) => {
  const baseClasses =
    "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const variantClasses = {
    primary:
      "border-secondary-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-white dark:focus:ring-offset-secondary-800",
    secondary:
      "border-secondary-300 text-secondary-600 focus:ring-secondary-500 focus:ring-offset-white dark:focus:ring-offset-secondary-800",
    success:
      "border-secondary-300 text-green-600 focus:ring-green-500 focus:ring-offset-white dark:focus:ring-offset-secondary-800",
    warning:
      "border-secondary-300 text-yellow-600 focus:ring-yellow-500 focus:ring-offset-white dark:focus:ring-offset-secondary-800",
    danger:
      "border-secondary-300 text-red-600 focus:ring-red-500 focus:ring-offset-white dark:focus:ring-offset-secondary-800",
  };

  const checkboxClasses = clsx(
    "rounded border-2 bg-white dark:bg-secondary-700",
    sizeClasses[size],
    variantClasses[variant],
    baseClasses,
    // Estilos específicos para el estado checked
    checked && "bg-current border-current",
    className
  );

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
  };

  // Estilos del card que cambian según el estado
  const cardClasses = card
    ? [
        "p-3 border-2 rounded-lg transition-all duration-200 cursor-pointer",
        "bg-white dark:bg-secondary-800",
        // Estados del card
        checked
          ? [
              // Estado seleccionado
              "border-primary-500 bg-primary-50 dark:bg-primary-900/20",
              "shadow-sm ring-1 ring-primary-200 dark:ring-primary-800",
            ]
          : [
              // Estado no seleccionado
              "border-secondary-200 dark:border-secondary-700",
              "hover:border-secondary-300 dark:hover:border-secondary-600",
              "hover:bg-secondary-50 dark:hover:bg-secondary-700",
            ],
      ]
    : [];

  const handleChange = (e) => {
    if (onChange && !disabled) {
      onChange(e);
    }
  };

  const handleCardClick = () => {
    if (!disabled && onChange) {
      // Simular el evento del checkbox
      const syntheticEvent = {
        target: { checked: !checked, type: "checkbox" },
      };
      onChange(syntheticEvent);
    }
  };

  return (
    <div
      className={clsx(
        "flex space-x-3",
        alignClasses[align],
        card && cardClasses,
        disabled && "cursor-not-allowed opacity-50"
      )}
      onClick={card ? handleCardClick : undefined}
    >
      {/* Checkbox oculto pero funcional para accesibilidad */}
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only" // Oculto visualmente pero accesible
        {...props}
      />

      {/* Icono de check que aparece cuando está seleccionado */}
      {card && (
        <div
          className={clsx(
            "flex-shrink-0 transition-all duration-200",
            sizeClasses[size]
          )}
        >
          {checked && (
            <div
              className={clsx(
                "w-full h-full rounded border-2 flex items-center justify-center",
                "bg-primary-500 border-primary-500 text-white"
              )}
            >
              <Icon name="FiCheck" />
            </div>
          )}
          {!checked && (
            <div
              className={clsx(
                "w-full h-full rounded border-2",
                "bg-white dark:bg-secondary-700 border-secondary-300 dark:border-secondary-600"
              )}
            />
          )}
        </div>
      )}

      {/* Contenido del card */}
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <span
              className={clsx(
                "text-sm font-medium",
                disabled
                  ? "text-secondary-400 dark:text-secondary-500"
                  : "text-secondary-900 dark:text-white"
              )}
            >
              {label}
            </span>
          )}
          {description && (
            <p
              className={clsx(
                "text-xs mt-1",
                disabled
                  ? "text-secondary-400 dark:text-secondary-500"
                  : "text-secondary-500 dark:text-secondary-400"
              )}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkbox;
