import { useHistory } from "react-router-dom/cjs/react-router-dom";
import "./Section1V3.scss";
import i1 from "src/assets/v3/i1.png";
import i2 from "src/assets/v3/i2.png";
import i3 from "src/assets/v3/i3.png";
import i4 from "src/assets/v3/i4.png";
import {
  ButtonV3Primary,
  buttonV3PrimarySizes,
} from "src/components/V3/ButtonV3/ButtonV3Primary";
import { useTranslation } from "react-i18next";
import { useFadedInRightToLeft } from "src/hooks/useFadedInRightToLeft";
import { AnimatedNumber } from "src/components/V3/AnimatedNumber/AnimatedNumber";

export const Section1V3 = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { domRef } = useFadedInRightToLeft();

  return (
    <div className="containerV3">
      <div className="Section1V3">
        <div className="left">
          <div className="rowTitle">
            <span>
              <span>{t("homeV3.t1")} </span>
              <span className="text-gradient-t-b">
                {t("homeV3.t2")}{" "}
              </span>
              <span> {t("homeV3.t3")}</span>
            </span>
          </div>

          <div className="rowDesc">{t("homeV3.t4")}</div>

          <div className="rowTool">
            <ButtonV3Primary
              style={{ width: "195px" }}
              size={buttonV3PrimarySizes.lg}
              onClick={() => history.push("/product-v3")}
            >
              <span>{t("homeV3.t5")}</span>
              <i
                className="fa-solid fa-arrow-right-long"
                style={{ marginLeft: "16px" }}
              ></i>
            </ButtonV3Primary>
          </div>

          <div className="rowStats">
            <div className="rowStatsLeft">
              <div className="imgsInside">
                <img src={i2} />
                <img src={i3} />
                <img src={i4} />
              </div>
            </div>

            <div className="rowStatsRight">
              {/* progressive */}
              {/* <div className="top">10.2K+</div> */}
              <div className="top">
                <AnimatedNumber
                  scrollStyle={{ transitionDuration: "5s" }}
                  listNumber={new Array(5 * 10 + 2).fill("").map((n, idx) => {
                    return `${parseFloat(idx * 0.2).toFixed(1)}K+`;
                  })}
                />
              </div>
              <div className="bottom">{t("homeV3.t6")}</div>
            </div>
          </div>
        </div>

        <div className="right">
          <img src={i1} />
        </div>
      </div>
    </div>
  );
};
