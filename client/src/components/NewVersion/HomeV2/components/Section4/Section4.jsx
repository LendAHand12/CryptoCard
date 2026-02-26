import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

export const Section4 = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleNavigateProduct = () => {
    history.push("/product");
  };

  return (
    <div className="section4ContainerV2 containerV2">
      <div className="left">
        <div className="circleOverlay">
          <svg
            width="475"
            height="476"
            viewBox="0 0 475 476"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="237.5"
              cy="237.519"
              r="237.5"
              fill="#F4E096"
              fill-opacity="0.04"
            />
          </svg>

          <img src="/img/newVersion/s4.png" />
        </div>
      </div>

      <div className="right">
        <div className="rightTop">
          <div>{t("section4.t1")}</div>
        </div>

        <div
          className="rightBot"
          onClick={handleNavigateProduct}
          style={{ cursor: "pointer" }}
        >
          {t("section4.t2")}
        </div>
      </div>
    </div>
  );
};
