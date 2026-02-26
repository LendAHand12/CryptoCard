import {
  renderApplyType,
  renderCardOrganization,
  renderCardStatus,
  renderCardType,
  renderDocType,
  renderMethodOfActivation,
  renderMoreCard,
  renderObtainWay,
  renderOperationType,
  renderSupportPoaType,
  renderSupportRecharge,
} from "src/components/NewVersion";
import "./CardInfoDetail.scss";
import i27 from "src/assets/v3/i27.png";
import { useTranslation } from "react-i18next";
import { calculateEurToUsd } from "src/util/calculateEurToUsd";
import { renderCurrency } from "src/util/renderCurrency";
import { renderPercentRechargeFee } from "src/util/renderPercentRechargeFee";
import { renderFrontCardImgByCardApplyType } from "src/util/renderCardImg";

export const CardInfoDetail = ({
  cardInfoData,
  eurToUsdRate,
  renderCardImgFront,
}) => {
  const { t } = useTranslation();

  // TODO đang ở phần detail read more
  return (
    <div className="CardInfoDetail">
      <div className="cardImg">
        {/* <img src={i27} /> */}
        {/* {renderCardImgFront(cardInfoData)} */}
        <img
          src={renderFrontCardImgByCardApplyType(
            cardInfoData.apply_type,
            cardInfoData.card_type_id
          )}
        />
      </div>

      <div className="cardContent">
        {/* Status */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t2")}</div>
          <div className="cardValue">
            {renderCardStatus(cardInfoData.status)}
          </div>
        </div>

        {/* Card Type ID */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t3")}</div>
          <div className="cardValue">{cardInfoData.card_type_id}</div>
        </div>

        {/* Card Type */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t4")}</div>
          <div className="cardValue">
            {renderCardType(cardInfoData.card_type)}
          </div>
        </div>

        {/* Card application mode */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t6")}</div>
          <div className="cardValue">
            {renderApplyType(cardInfoData.apply_type)}
          </div>
        </div>

        {/* Doc type */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t9")}</div>
          <div className="cardValue">
            {renderDocType(cardInfoData.doc_type)}
          </div>
        </div>

        {/* Card Curr */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t10")}</div>
          <div className="cardValue">
            {renderCurrency(cardInfoData.card_coin.toUpperCase())}
          </div>
        </div>

        {/* Card Assoc */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t11")}</div>
          <div className="cardValue">
            {renderCardOrganization(cardInfoData.card_org)}
          </div>
        </div>

        {/* Method of Activation */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t12")}</div>
          <div className="cardValue">
            {renderMethodOfActivation(cardInfoData.activate_type)}
          </div>
        </div>

        {/* Support recharge */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t14")}</div>
          <div className="cardValue">
            {renderSupportRecharge(cardInfoData.can_recharge)}
          </div>
        </div>

        {/* Ways to obtain bank card */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t16")}</div>
          <div className="cardValue">
            {renderObtainWay(cardInfoData.card_detail_obtain_way)}
          </div>
        </div>

        {/* Actual Card Fee */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t22")}</div>
          <div className="cardValue">
            {Number(Number(cardInfoData.card_fee).toFixed(3))}{" "}
            {renderCurrency(cardInfoData.card_coin.toUpperCase())}{" "}
            {cardInfoData.card_coin === "eur" && eurToUsdRate
              ? `- ${calculateEurToUsd(
                  eurToUsdRate,
                  cardInfoData.card_fee
                )} USDT`
              : ""}
          </div>
        </div>

        {/* Deposit Fee */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t24")}</div>
          <div className="cardValue">
            {renderPercentRechargeFee(cardInfoData.recharge_fee)} %
          </div>
        </div>

        {/* Deposit Limit Per-day */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t27")}</div>
          <div className="cardValue">
            {Number(Number(cardInfoData.max_recharge_amount).toFixed(3))}{" "}
            {renderCurrency(cardInfoData.card_coin.toUpperCase())}{" "}
            {cardInfoData.card_coin === "eur" && eurToUsdRate
              ? `- ${calculateEurToUsd(
                  eurToUsdRate,
                  cardInfoData.max_recharge_amount
                )} USDT`
              : ""}
          </div>
        </div>

        {/* Minimum initial deposit amount */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t28")}</div>
          <div className="cardValue">
            {" "}
            {Number(
              Number(cardInfoData.min_first_recharge_amount).toFixed(3)
            )}{" "}
            {renderCurrency(cardInfoData.card_coin.toUpperCase())}{" "}
            {cardInfoData.card_coin === "eur" && eurToUsdRate
              ? `- ${calculateEurToUsd(
                  eurToUsdRate,
                  cardInfoData.min_first_recharge_amount
                )} USDT`
              : ""}
          </div>
        </div>

        {/* Minimum Deposit Limit */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t29")}</div>
          <div className="cardValue">
            {Number(Number(cardInfoData.min_single_recharge_amount).toFixed(3))}{" "}
            {renderCurrency(cardInfoData.card_coin.toUpperCase())}{" "}
            {cardInfoData.card_coin === "eur" && eurToUsdRate
              ? `- ${calculateEurToUsd(
                  eurToUsdRate,
                  cardInfoData.min_single_recharge_amount
                )} USDT`
              : ""}
          </div>
        </div>

        {/* Maximum Single Deposit Limit */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t30")}</div>
          <div className="cardValue">
            {Number(Number(cardInfoData.max_single_recharge_amount).toFixed(3))}{" "}
            {renderCurrency(cardInfoData.card_coin.toUpperCase())}{" "}
            {cardInfoData.card_coin === "eur" && eurToUsdRate
              ? `- ${calculateEurToUsd(
                  eurToUsdRate,
                  cardInfoData.max_single_recharge_amount
                )} USDT`
              : ""}
          </div>
        </div>

        {/* initial deposit is mandatory */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t31")}</div>
          <div className="cardValue">Yes</div>
        </div>

        {/* Apply Pay Coin */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t32")}</div>
          <div className="cardValue">
            {JSON.parse(cardInfoData.apply_pay_coin)
              .map((coin) => coin.toUpperCase())
              .join(", ")}
          </div>
        </div>

        {/* Recharge Pay Coin */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t33")}</div>
          <div className="cardValue">
            {JSON.parse(cardInfoData.recharge_pay_coin)
              .map((coin) => coin.toUpperCase())
              .join(", ")}
          </div>
        </div>

        {/* More actions */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t34")}</div>
          <div className="cardValue">
            {cardInfoData.support_business
              .split(",")
              .map((businessValue) =>
                renderOperationType(Number(businessValue))
              )
              .join(", ")}
          </div>
        </div>

        {/* Support Refund */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t35")}</div>
          <div className="cardValue">
            {cardInfoData.support_refund === 1 ? "Yes" : "No"}
          </div>
        </div>

        {/* support the same user to open multiple cards of the same card type */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t36")}</div>
          <div className="cardValue">
            {renderMoreCard(cardInfoData.more_card)}
          </div>
        </div>

        {/* AML report */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t37")}</div>
          <div className="cardValue">
            {cardInfoData.need_aml_report === 0 ? "No need" : "Need"}
          </div>
        </div>

        {/* Proof of address */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t38")}</div>
          <div className="cardValue">
            {cardInfoData.need_poa === 0 ? "No need" : "Need"}
          </div>
        </div>

        {/* Support Poa supply Type */}
        <div className="cardRow">
          <div className="cardLabel">{t("product.t39")}</div>
          <div className="cardValue">
            {renderSupportPoaType(cardInfoData.support_poa_type)}
          </div>
        </div>
      </div>
    </div>
  );
};
