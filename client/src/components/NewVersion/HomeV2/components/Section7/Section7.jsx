import { useTranslation } from "react-i18next";

export const Section7 = () => {
  const { t } = useTranslation();

  return (
    <div className="section7ContainerV2 containerV2">
      <img src="/img/newVersion/s9.jfif" />
      <div className="textContent">{t("section7.t1")}</div>
    </div>
  );
};
