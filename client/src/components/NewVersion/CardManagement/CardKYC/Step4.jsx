import { Result } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

export const Step4 = () => {
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <div className="step4">
      <Result
        status="success"
        title={<div style={{ color: "#fff" }}>{t("cardKYC.t48")}</div>}
        subTitle={<div style={{ color: "#fff" }}>{t("cardKYC.t49")}</div>}
      />

      <div>
        <button
          style={{ margin: "0 auto" }}
          className="btnInside"
          onClick={() => history.push("/product-v3")}
        >
          {t("cardKYC.t50")}
        </button>
      </div>
    </div>
  );
};
