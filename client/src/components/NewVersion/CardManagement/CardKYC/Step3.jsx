import { Spin } from "antd";
import queryString from "query-string";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import { renderPercentRechargeFee } from "src/util/renderPercentRechargeFee";
import { roundedUp, roundNumber } from "src/util/roundNumber";
import { calculateRechargeFeePrice } from "../CardRegisterForm/CardFeeScreen";
import { calculateCreationFee } from "src/util/calculateCreateFee";
import { replaceUsdToUsdt } from "src/util/replaceUsdToUsdt";

export const Step3 = ({
  currentStep,
  handleClickPrevStep,
  handleClickNextStep,
  isPendingRequest,
  handleRequestKYC,
  cardFee,
}) => {
  const { userWallet } = useSelector((state) => state.coinReducer);
  const { t } = useTranslation();
  const { search } = useLocation();
  const queryValues = queryString.parse(search);
  const { eurToUsdRate } = useSelector((state) => state.globalReducer);
  const currency = queryValues.cardCurr
    ? queryValues.cardCurr.toUpperCase()
    : "";
  const cardFeeURL = queryValues.cardFee ? Number(queryValues.cardFee) : 0;
  const cardFeeRecharge = queryValues.feeRecharge
    ? Number(queryValues.feeRecharge)
    : 0;
  const minFirstRecharge = queryValues.minFirstRecharge
    ? Number(queryValues.minFirstRecharge)
    : 0;
  const rechargePercent = renderPercentRechargeFee(cardFeeRecharge);
  const rechargePercentPrice = calculateRechargeFeePrice(
    rechargePercent,
    minFirstRecharge
  );

  // const totalPay = Number(
  //   cardFeeURL + cardFeeRecharge + minFirstRecharge
  // ).toFixed(3);

  const totalPay = calculateCreationFee(
    minFirstRecharge,
    cardFeeRecharge,
    cardFeeURL
  );

  if (!eurToUsdRate || Number(eurToUsdRate) === 0) {
    return null;
  }

  return (
    <>
      <div className="step3">
        <div className="titleInside">{t("cardKYC.t41")}</div>
        <div className="fee" style={{ display: "flex" }}>
          <div>
            <span className="highlight">{roundedUp(totalPay, 2)}</span>{" "}
            {replaceUsdToUsdt(currency)}
          </div>{" "}
          {currency === "EUR" ? (
            <div>
              <span className="highlight" style={{ marginLeft: "4px" }}>
                - {roundedUp(totalPay / eurToUsdRate, 2)}
              </span>{" "}
              USDT
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="desc1">{t("cardKYC.t42")}</div>

        <div className="items">
          {/* issuing fee */}
          <div className="item">
            <div className="label">{t("cardKYC.t43")}</div>
            <div className="value">
              {roundedUp(cardFeeURL, 2)} {replaceUsdToUsdt(currency)}{" "}
              {currency === "EUR" ? (
                <>- {roundedUp(cardFeeURL / eurToUsdRate, 2)} USDT</>
              ) : (
                ""
              )}
            </div>
          </div>

          {/* min recharge first */}
          <div className="item">
            <div className="label">{t("product.t94")}</div>
            <div className="value">
              {roundedUp(minFirstRecharge, 2)} {replaceUsdToUsdt(currency)}{" "}
              {currency === "EUR" ? (
                <>- {roundedUp(minFirstRecharge / eurToUsdRate, 2)} USDT</>
              ) : (
                ""
              )}
            </div>
          </div>

          {/* recharge fee */}
          <div className="item">
            <div className="label">{t("product.t24")}</div>
            <div className="value">
              {/* {roundedUp(cardFeeRecharge, 2)} {replaceUsdToUsdt(currency)}{" "}
              {currency === "EUR" ? (
                <>- {roundedUp(cardFeeRecharge / eurToUsdRate, 2)} USDT</>
              ) : (
                ""
              )} */}

              <span>{renderPercentRechargeFee(cardFeeRecharge)}% </span>
              <span>
                {" "}
                {roundedUp(rechargePercentPrice, 2)}{" "}
                {replaceUsdToUsdt(currency)}{" "}
                {currency === "EUR" ? (
                  <>
                    ({roundedUp(rechargePercentPrice / eurToUsdRate, 2)} USDT)
                  </>
                ) : (
                  ""
                )}
              </span>
            </div>
          </div>

          <div className="item">
            <div className="label">{t("cardKYC.t44")}</div>
            <div className="value">USDT</div>
          </div>
        </div>

        <div className="available">
          {t("cardKYC.t45")}{" "}
          <span>{roundedUp(userWallet?.usdt_balance || 0, 2)}</span> USDT
        </div>
      </div>

      <div className="btnsInside">
        <button
          className={`btnInside default`}
          onClick={() => {
            if (isPendingRequest) return;

            handleClickPrevStep();
          }}
        >
          {t("cardKYC.t46")}
        </button>

        <button
          className="btnInside"
          onClick={async () => {
            if (isPendingRequest) return;

            await handleRequestKYC();
          }}
        >
          {isPendingRequest ? <Spin /> : t("cardKYC.t47")}
        </button>
      </div>
    </>
  );
};
