import { useFadedIn } from "src/hooks/useFadedIn";
import "./CardHistoryPaymentPage.scss";
import { CardHistoryPayment } from "..";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import { useEffect } from "react";
import queryString from "query-string";

export const CardHistoryPaymentPage = () => {
  const { domRef } = useFadedIn();
  const { t } = useTranslation();
  const { search } = useLocation();
  const queryValues = queryString.parse(search);
  const history = useHistory();

  useEffect(() => {
    if (!queryValues.cardId) {
      history.push("/product");
    }
  }, []);

  return (
    <div className="containerV2">
      <div className="CardHistoryPaymentPage" ref={domRef}>
        <div className="titleV2">{t("historyPayment.t1")}</div>
      </div>

      {queryValues.cardId && <CardHistoryPayment cardId={queryValues.cardId} />}
    </div>
  );
};
