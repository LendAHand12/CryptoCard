import { useTranslation } from "react-i18next";

export const Section1 = () => {
  const { t } = useTranslation();

  return (
    <div className="section1ContainerV2 containerV2">
      <div className="top">
        <div className="left">
          <div>{t("section1.t1")}</div>
          <div>{t("section1.t2")}</div>
          <div>{t("section1.t3")}</div>
        </div>

        <div className="right">
          <div>{t("section1.t4")}</div>
          <div className="highlight">{t("section1.t5")}</div>
        </div>
      </div>

      <div className="bottom">
        <img src="/img/newVersion/s1.png" />
      </div>
    </div>
  );
};
