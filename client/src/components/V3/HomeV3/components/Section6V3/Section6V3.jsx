import { useTranslation } from "react-i18next";
import "./Section6V3.scss";
import i15 from "src/assets/v3/i15.png";
import i16 from "src/assets/v3/i16.png";
import i17 from "src/assets/v3/i17.png";
import i18 from "src/assets/v3/i18.png";
import i19 from "src/assets/v3/i19.png";

export const Section6V3 = () => {
  const { t } = useTranslation();

  // {t("homeV3.t7")}

  return (
    <div className="containerV3">
      <div className="Section6V3">
        <div className="cell">
          <div className="icon">
            <img src={i15} />
          </div>
          <div className="text text-gradient-t-b">{t("homeV3.t27")}</div>
        </div>

        <div className="cell">
          <div className="icon">
            <img src={i19} />
          </div>
          <div className="text text-gradient-t-b">{t("homeV3.t28")}</div>
        </div>

        <div className="cell">
          <div className="icon">
            <img src={i18} />
          </div>
          <div className="text text-gradient-t-b">{t("homeV3.t29")}</div>
        </div>

        <div className="cell">
          <div className="icon">
            <img src={i17} />
          </div>
          <div className="text text-gradient-t-b">{t("homeV3.t30")}</div>
        </div>

        <div className="cell">
          <div className="icon">
            <img src={i16} />
          </div>
          <div className="text text-gradient-t-b">{t("homeV3.t31")}</div>
        </div>
      </div>
    </div>
  );
};
