import { useFadedIn } from "src/hooks/useFadedIn";
import "./CreateVisaCard.scss";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import queryString from "query-string";
import { useEffect } from "react";
import { CardRegisterForm } from "..";
import { useTranslation } from "react-i18next";
import { CardRegisterFormType03 } from "../CardRegisterForm/CardRegisterFormType03";

export const CreateVisaCard = () => {
  const { domRef } = useFadedIn();
  const { search } = useLocation();
  const history = useHistory();
  const queryValues = queryString.parse(search);
  const { t } = useTranslation();

  useEffect(() => {
    if (
      !queryValues.applyType ||
      !queryValues.cardTypeId ||
      !queryValues.cardCurr ||
      !queryValues.cardType ||
      !queryValues.cardName ||
      !queryValues.minFirstRecharge ||
      !queryValues.feeRecharge ||
      !queryValues.cardFee
    ) {
      history.push("/product-v3");
    }
  }, []);

  return (
    <div className="containerV2">
      <div className="createVisaCardContainer" ref={domRef}>
        <div className="titleV2">{t("createVisaCard.t1")}</div>

        {/* {queryValues.cardTypeId === "88990001" && ( */}
        {queryValues.applyType == "2" && (
          <CardRegisterForm
            cardId={queryValues.cardTypeId}
            cardType={queryValues.cardType}
            cardCurr={queryValues.cardCurr}
            cardName={queryValues.cardName}
          />
        )}

        {/* {queryValues.cardTypeId === "88990003" && ( */}
        {queryValues.applyType == "1" && (
          <CardRegisterFormType03
            cardId={queryValues.cardTypeId}
            cardType={queryValues.cardType}
            cardCurr={queryValues.cardCurr}
            cardName={queryValues.cardName}
          />
        )}
      </div>
    </div>
  );
};
