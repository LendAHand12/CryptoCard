import { useTranslation } from "react-i18next";

export const Section8 = () => {
  const { t } = useTranslation();

  return (
    <div className="section8ContainerV2 containerV2">
      <img src="/img/newVersion/s10.jfif" />

      <div className="right">
        <div className="top">{t("section8.t1")}</div>

        {/* <div className="bot">
          <div className="botTop">{t("section8.t2")}</div>
          <div className="botBot">{t("section8.t3")}</div>
        </div> */}
      </div>
    </div>
  );
};
