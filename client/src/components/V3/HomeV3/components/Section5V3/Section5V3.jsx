import { useHistory } from "react-router-dom/cjs/react-router-dom";
import "./Section5V3.scss";
import i11 from "src/assets/v3/i11.png";
import i12 from "src/assets/v3/i12.png";
import i13 from "src/assets/v3/i13.png";
import i14 from "src/assets/v3/i14.png";
import i46 from "src/assets/v3/i46.png";
import {
  ButtonV3Primary,
  buttonV3PrimarySizes,
} from "src/components/V3/ButtonV3/ButtonV3Primary";
import { useTranslation } from "react-i18next";

export const Section5V3 = () => {
  const history = useHistory();
  const { t } = useTranslation();

  // {t("homeV3.t7")}

  return (
    <div className="containerV3" style={{ zIndex: "499" }}>
      <div className="Section5V3">
        <div className="bgGrid">
          <img src={i11} />
        </div>

        <div className="bgFinger">
          <img src={i12} />
        </div>

        <div className="content">
          <div className="left">
            <div className="dot"></div>
            {/* <img src={i13} /> */}
            <div className="cGlass">
              <img src={i13} />
              <img src={i46} className="glass" />
            </div>
          </div>

          <div className="right">
            <div className="title">{t("homeV3.t21")}</div>
            <div className="menus">
              <div className="menu">
                <img src={i14} className="dot" />
                <div className="desc">{t("homeV3.t22")}</div>
              </div>

              <div className="menu">
                <img src={i14} className="dot" />
                <div className="desc">{t("homeV3.t23")}</div>
              </div>

              <div className="menu">
                <img src={i14} className="dot" />
                <div className="desc">{t("homeV3.t24")}</div>
              </div>

              <div className="menu">
                <img src={i14} className="dot" />
                <div className="desc">{t("homeV3.t25")}</div>
              </div>
            </div>
            <ButtonV3Primary
              size={buttonV3PrimarySizes.lg}
              onClick={() => history.push("/kyc-v3")}
            >
              {t("homeV3.t26")}
            </ButtonV3Primary>
          </div>
        </div>
      </div>
    </div>
  );
};
