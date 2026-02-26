import { Button, Result } from "antd";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import "./CreateCardSuccessScreen.scss";
import { useFadedIn } from "src/hooks/useFadedIn";
import { useTranslation } from "react-i18next";

export const CreateCardSuccessScreen = () => {
  const history = useHistory();
  const { domRef } = useFadedIn();
  const { t } = useTranslation();

  return (
    <div ref={domRef} style={{ marginTop: "50px" }}>
      <Result
        status="success"
        title={
          <div style={{ color: "#fff" }}>{t("createSuccessScreen.t1")}</div>
        }
      />
      <div
        className="btnInsideSuccess"
        key="2"
        onClick={() => history.push("/")}
      >
        {t("createSuccessScreen.t2")}
      </div>
    </div>
  );
};
