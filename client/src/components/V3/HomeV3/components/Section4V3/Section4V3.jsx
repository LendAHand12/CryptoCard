import {
  ButtonV3Primary,
  buttonV3PrimarySizes,
} from "src/components/V3/ButtonV3/ButtonV3Primary";
import "./Section4V3.scss";
import i8 from "src/assets/v3/i8.png";
import i9 from "src/assets/v3/i9.png";
import i10 from "src/assets/v3/i10.png";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useTranslation } from "react-i18next";

export const Section4V3 = () => {
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <div className="containerV3" style={{ zIndex: "500" }}>
      <div className="Section4V3">
        <div className="left">
          <div className="title">{t("homeV3.t18")}</div>

          <div className="desc">{t("homeV3.t19")}</div>

          <div className="btns">
            <ButtonV3Primary
              size={buttonV3PrimarySizes.lg}
              onClick={() => history.push("/product-v3")}
            >
              <span>{t("homeV3.t20")}</span>
              <i
                className="fa-solid fa-arrow-right-long"
                style={{ marginLeft: "16px" }}
              ></i>
            </ButtonV3Primary>
          </div>
        </div>

        <div className="right">
          <div className="cardContainer">
            <img src={i8} className="card" />
            <img src={i10} className="star" />
          </div>
          <img src={i9} className="circle" />
        </div>
      </div>
    </div>
  );
};
