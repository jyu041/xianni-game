import { useState, useEffect } from "react";
import styles from "./ResponsiveLayout.module.css";

const ResponsiveLayout = ({ children, className = "", ...props }) => {
  const [screenSize, setScreenSize] = useState("desktop");

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize("mobile");
      } else if (width < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);

    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  const layoutClass = [styles.responsiveLayout, styles[screenSize], className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={layoutClass} data-screen-size={screenSize} {...props}>
      {children}
    </div>
  );
};

export default ResponsiveLayout;
