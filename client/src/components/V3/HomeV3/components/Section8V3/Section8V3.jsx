import { useTranslation } from "react-i18next";
import "./Section8V3.scss";
import i23 from "src/assets/v3/i23.png";
import i24 from "src/assets/v3/i24.png";
import i25 from "src/assets/v3/i25.png";
import i45 from "src/assets/v3/i45.png";

export const Section8V3 = () => {
  const { t } = useTranslation();

  // {t("homeV3.t7")}

  return (
    <div className="containerV3">
      <img src={i45} className="layerBlur2S8" style={{ zIndex: "1" }} />

      <div className="Section8V3">
        <img src={i45} className="layerBlur" style={{ zIndex: "1" }} />

        <div className="left">
          <div className="title">{t("homeV3.t33")}</div>

          <div className="desc">{t("homeV3.t34")}</div>

          <div className="apps">
            <img src={i24} />
            <img src={i25} />
          </div>
        </div>

        <div className="right">
          <img src={i23} className="imgPhone" style={{ zIndex: "2" }} />
        </div>
      </div>
    </div>
  );
};
