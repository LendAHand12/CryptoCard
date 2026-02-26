import { useTranslation } from "react-i18next";
import "./Section3V3.scss";
import i5 from "src/assets/v3/i5.png";
import i6 from "src/assets/v3/i6.png";
import i7 from "src/assets/v3/i7.png";

export const Section3V3 = () => {
  const { t } = useTranslation();

  // {t("homeV3.t7")}
  return (
    <div className="containerV3">
      <div className="Section3V3">
        <div className="titleInside">{t("homeV3.t11")}</div>

        <div className="gridInfo">
          <div className="info">
            <div className="left">
              <img src={i5} />
            </div>

            <div className="right">
              <div className="top">{t("homeV3.t12")}</div>
              {/* <div className="bottom">{t("homeV3.t13")}</div> */}
            </div>
          </div>

          <div className="info">
            <div className="left">
              <img src={i6} />
            </div>

            <div className="right">
              <div className="top">{t("homeV3.t14")}</div>
              {/* <div className="bottom">{t("homeV3.t15")}</div> */}
            </div>
          </div>

          <div className="info">
            <div className="left">
              <img src={i7} />
            </div>

            <div className="right">
              <div className="top">{t("homeV3.t16")}</div>
              {/* <div className="bottom">{t("homeV3.t17")}</div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
