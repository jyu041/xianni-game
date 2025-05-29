import styles from "./Input.module.css";

const Input = ({
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  error = false,
  className = "",
  ...props
}) => {
  const inputClass = [
    styles.input,
    error ? styles.error : "",
    disabled ? styles.disabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={inputClass}
      {...props}
    />
  );
};

export default Input;
