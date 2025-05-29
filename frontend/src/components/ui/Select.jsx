import styles from "./Select.module.css";

const Select = ({
  value,
  onChange,
  options = [],
  disabled = false,
  placeholder = "请选择...",
  className = "",
  ...props
}) => {
  const selectClass = [
    styles.select,
    disabled ? styles.disabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.selectWrapper}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={selectClass}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className={styles.selectArrow}>▼</div>
    </div>
  );
};

export default Select;
