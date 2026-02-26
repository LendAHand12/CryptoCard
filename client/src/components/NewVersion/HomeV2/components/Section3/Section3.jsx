import { useTranslation } from "react-i18next";

export const Section3 = () => {
  const { t } = useTranslation();
  return (
    <div className="section3ContainerV2 containerV2">
      <div className="top">
        <div className="topLeft">{t("section3.t1")}</div>
        <div className="topRight">
          {t("section3.t2")} <i class="fa-solid fa-angle-right"></i>
        </div>
      </div>

      <div className="bottom">
        <div className="left">
          <div className="cardInside">
            <img src="/img/newVersion/s2.png" />
            <div className="content">
              <div className="cardContent">
                <div className="tagInside">{t("section3.t3")}</div>

                <div className="titleInside">{t("section3.t4")}</div>

                <div classname="contentInside">{t("section3.t5")}</div>
              </div>

              <div className="moreInside">
                {t("section3.t6")} <i class="fa-solid fa-angle-right"></i>
              </div>
            </div>
          </div>

          <div className="cardInside">
            <img src="/img/newVersion/s2.png" />
            <div className="content">
              <div className="tagInside">{t("section3.t7")}</div>

              <div className="titleInside">{t("section3.t8")}</div>

              <div classname="contentInside">{t("section3.t9")}</div>

              <div className="moreInside">
                {t("section3.t10")} <i class="fa-solid fa-angle-right"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="right">
          <div className="cardInside">
            <img src="/img/newVersion/s3.png" />
            <div className="content">
              <div className="cardContent">
                <div className="tagInside">{t("section3.t11")}</div>

                <div className="titleInside">{t("section3.t12")}</div>

                <div classname="contentInside">{t("section3.t13")}</div>
              </div>

              <div className="moreInside">
                {t("section3.t14")} <i class="fa-solid fa-angle-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
