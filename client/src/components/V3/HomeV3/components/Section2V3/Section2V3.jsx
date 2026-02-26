import { useTranslation } from "react-i18next";
import "./Section2V3.scss";
import { AnimatedNumber } from "src/components/V3/AnimatedNumber/AnimatedNumber";

export const Section2V3 = () => {
  const { t } = useTranslation();

  return (
    <div className="containerV3">
      <div className="Section2V3">
        <div className="rowInside">
          <div className="colInside">
            <div className="title">
              <AnimatedNumber
                scrollStyle={{ transitionDuration: "3s" }}
                listNumber={new Array(17).fill("").map((n, idx) => {
                  return `${idx}y`;
                })}
              />
            </div>
            <div className="desc text-gradient-t-b">{t("homeV3.t7")}</div>
          </div>

          <div className="colInside">
            <div className="title">
              <AnimatedNumber
                scrollStyle={{ transitionDuration: "3s" }}
                listNumber={new Array(26).fill("").map((n, idx) => {
                  return `${idx * 10}+`;
                })}
              />
            </div>
            <div className="desc text-gradient-t-b">{t("homeV3.t8")}</div>
          </div>

          <div className="colInside">
            <div className="title">
              <AnimatedNumber
                scrollStyle={{ transitionDuration: "3s" }}
                listNumber={new Array(11).fill("").map((n, idx) => {
                  return `${idx}+`;
                })}
              />
            </div>
            <div className="desc text-gradient-t-b">{t("homeV3.t9")}</div>
          </div>

          <div className="colInside">
            <div className="title">
              <AnimatedNumber
                scrollStyle={{ transitionDuration: "3s" }}
                listNumber={new Array(5 * 10 + 2).fill("").map((n, idx) => {
                  return `${parseFloat(idx * 0.2).toFixed(1)}K+`;
                })}
              />
            </div>
            <div className="desc text-gradient-t-b">{t("homeV3.t10")}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
