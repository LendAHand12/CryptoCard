import WalletTop from "src/components/seresoWallet/WalletTop";
import "./DepositAmcAndHewe.scss";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import queryString from "query-string";
import { useEffect } from "react";
import { DepositContent } from "./components/DepositContent/DepositContent";
import { HistoryDeposit } from "./components/HistoryDeposit/HistoryDeposit";
import { useTranslation } from "react-i18next";

export const DepositAmcAndHewe = () => {
  const { search } = useLocation();
  const { t } = useTranslation();
  const history = useHistory();
  const queryValues = queryString.parse(search);
  const isAmcOrHewe =
    queryValues.token === "AMC" || queryValues.token === "HEWE";

  useEffect(() => {
    if (!isAmcOrHewe) {
      history.push("/wallet-v3");
    }
  }, []);

  if (!isAmcOrHewe) {
    return null;
  }

  return (
    <div className="DepositAmcAndHewe containerV2">
      <div className="titleV2" style={{ marginTop: "24px", marginBottom: "0" }}>
        <span>
          {t("deposit")} {queryValues.token}
        </span>
      </div>
      <WalletTop />

      <div className="contentInside">
        <DepositContent token={queryValues.token} />
        <HistoryDeposit token={queryValues.token} />
      </div>
    </div>
  );
};
