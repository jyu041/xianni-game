import styles from "./Card.module.css";

const Card = ({
  children,
  variant = "default",
  className = "",
  hover = true,
  ...props
}) => {
  const cardClass = [
    styles.card,
    styles[variant],
    hover ? styles.hover : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  );
};

export default Card;
