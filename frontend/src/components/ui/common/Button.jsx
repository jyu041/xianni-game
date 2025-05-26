import React from "react";

const Button = ({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  variant = "default",
  size = "medium",
  ...props
}) => {
  const baseClasses = "button";
  const variantClasses = {
    default: "button-default",
    primary: "button-primary",
    secondary: "button-secondary",
    danger: "button-danger",
    success: "button-success",
  };

  const sizeClasses = {
    small: "button-small",
    medium: "button-medium",
    large: "button-large",
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabled ? "button-disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
