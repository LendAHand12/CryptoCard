import clsx from "clsx";
import "./ButtonV3.scss";
import { Spin } from "antd";

export const buttonV3Sizes = {
  default: "default",
  lg: "lg",
};

export const ButtonV3 = ({
  onClick,
  isLoading,
  isDisabled,
  children,
  style,
  isFullWidth = false,
  size = buttonV3Sizes.default,
  styleContent = {},
  styleTextContainer = {},
}) => {
  const btnClasses = clsx("ButtonV3", {
    default: size === buttonV3Sizes.default,
    lg: size === buttonV3Sizes.lg,
    fit: isFullWidth === false,
    full: isFullWidth === true,
    disabled: isDisabled === true,
  });

  const handleClickMdw = () => {
    if (isLoading || isDisabled) {
      return;
    }

    if (typeof onClick === "function") {
      onClick();
    }
  };

  return (
    <div className={btnClasses} onClick={handleClickMdw} style={style}>
      <div className="bgGradient">
        <div className="content" style={styleContent}>
          <div className="containerText" style={styleTextContainer}>
            {isLoading ? (
              <Spin style={{ transform: "translateY(-2px)" }} />
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
