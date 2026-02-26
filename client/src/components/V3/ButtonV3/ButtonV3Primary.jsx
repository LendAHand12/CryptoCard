import clsx from "clsx";
import "./ButtonV3Primary.scss";
import { Spin } from "antd";

export const buttonV3PrimarySizes = {
  default: "default",
  lg: "lg",
};

export const ButtonV3Primary = ({
  isLoading,
  isDisabled,
  onClick,
  children,
  style,
  isFullWidth = false,
  size = buttonV3PrimarySizes.default,
}) => {
  const btnClasses = clsx("ButtonV3Primary", {
    default: size === buttonV3PrimarySizes.default,
    lg: size === buttonV3PrimarySizes.lg,
    fit: isFullWidth === false,
    full: isFullWidth === true,
    disabled: isDisabled === true,
  });

  const handleClickMdw = () => {
    if (isLoading || isDisabled) return;

    if (typeof onClick === "function") {
      onClick();
    }
  };

  return (
    <div className={btnClasses} onClick={handleClickMdw} style={style}>
      {isLoading ? (
        <Spin style={{ transform: "translateY(-2px)" }} />
      ) : (
        children
      )}
    </div>
  );
};
