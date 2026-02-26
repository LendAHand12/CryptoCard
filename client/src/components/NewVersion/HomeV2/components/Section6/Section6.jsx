import { useTranslation } from "react-i18next";

export const Section6 = () => {
  const { t } = useTranslation();

  return (
    <div className="section6ContainerV2 containerV2">
      <div className="left">
        <div className="titleInside">{t("section6.t1")}</div>

        <img src="/img/newVersion/s8.png" />

        <div className="contentInside">{t("section6.t2")}</div>

        <div className="highlight">{t("section6.t3")}</div>
      </div>

      <div className="right">
        <div className="titleInside">{t("section6.t4")}</div>

        <div className="item">
          <div>{t("section6.t5")}</div>
          <i class="fa-solid fa-circle-arrow-right iconInside"></i>
        </div>
        <div className="item">
          <div>{t("section6.t6")}</div>
          <i class="fa-solid fa-circle-arrow-right iconInside"></i>
        </div>
        <div className="item">
          <div>{t("section6.t7")}</div>
          <i class="fa-solid fa-circle-arrow-right iconInside"></i>
        </div>
      </div>
    </div>
  );
};
