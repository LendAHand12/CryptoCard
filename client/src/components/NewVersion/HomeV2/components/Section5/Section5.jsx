import { useTranslation } from "react-i18next";

export const Section5 = () => {
  const { t } = useTranslation();
  return (
    <div className="section5ContainerV2 containerV2">
      <div className="cardItem">
        <div className="content">
          <div className="left">
            <div className="top">
              <div className="topLeft">{t("section5.t1")}</div>
              <div className="topRight">{t("section5.t2")}</div>
            </div>

            <div className="bottom">{t("section5.t3")}</div>
          </div>

          <div className="right">
            <img src="/img/newVersion/s5.png" />
          </div>
        </div>
      </div>

      <div className="cardItem">
        <div className="content">
          <div className="left">
            <div className="top">
              <div className="topLeft">{t("section5.t4")}</div>
              <div className="topRight">{t("section5.t5")}</div>
            </div>

            <div className="bottom">{t("section5.t6")}</div>
          </div>

          <div className="right">
            <img src="/img/newVersion/s6.png" />
          </div>
        </div>
      </div>

      <div className="cardItem">
        <div className="content">
          <div className="left">
            <div className="top">
              <div className="topLeft">{t("section5.t7")}</div>
              <div className="topRight">{t("section5.t8")}</div>
            </div>

            <div className="bottom">{t("section5.t9")}</div>
          </div>

          <div className="right">
            <img src="/img/newVersion/s7.png" />
          </div>
        </div>
      </div>

      <div className="cardItem">
        <div className="content">
          <div className="left">
            <div className="top">
              <div className="topLeft">{t("section5.t10")}</div>
              <div className="topRight">{t("section5.t11")}</div>
            </div>

            <div className="bottom">{t("section5.t12")}</div>
          </div>

          <div className="right">
            <img src="/img/newVersion/s5.png" />
          </div>
        </div>
      </div>
    </div>
  );
};
