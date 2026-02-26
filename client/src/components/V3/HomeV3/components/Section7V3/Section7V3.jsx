import { useTranslation } from "react-i18next";
import "./Section7V3.scss";
import i20 from "src/assets/v3/i20.svg";
import i21 from "src/assets/v3/i21.svg";
import i22 from "src/assets/v3/i22.svg";

export const Section7V3 = () => {
  const { t } = useTranslation();

  // {t("homeV3.t7")}

  return (
    <div className="containerV3">
      <div className="Section7V3">
        <div className="title">{t("homeV3.t32")}</div>

        <div className="imgs">
          <img src={i20} />
          <img src={i21} />
          <img src={i22} />
        </div>
      </div>
    </div>
  );
};
