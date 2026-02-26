import { Descriptions, Image, message, Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { useRedirectHomeIfNotLogin } from "src/hooks/useRedirectHomeIfNotLogin";
import { axiosService, IS_DOMAIN_PRODUCTION } from "src/util/service";
import {
  renderApplyType,
  renderCardMaterial,
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
} from "src/components/NewVersion/CardManagement";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import socket from "src/util/socket";
import { useTranslation } from "react-i18next";
import {
  renderBackCardImgByCardApplyType,
  renderFrontCardImgByCardApplyType,
} from "src/util/renderCardImg";
import { useSelector } from "react-redux";
import { calculateEurToUsd } from "src/util/calculateEurToUsd";
import { roundNumber } from "src/util/roundNumber";
import { CardItemVirtualFront } from "src/components/NewVersion/CardManagement/CardItem/CardItemVirtualFront";
import { CardItemPhysicFront } from "src/components/NewVersion/CardManagement/CardItem/CardItemPhysicFront";
import { CardItemVirtualBack } from "src/components/NewVersion/CardManagement/CardItem/CardItemVirtualBack";
import { CardItemPhysicBack } from "src/components/NewVersion/CardManagement/CardItem/CardItemPhysicBack";
import { renderPercentRechargeFee } from "src/util/renderPercentRechargeFee";
import { calculateCreationFee } from "src/util/calculateCreateFee";
import { renderCurrency } from "src/util/renderCurrency";
import { Form4Fields } from "src/components/NewVersion/Form4Fields/Form4Fields";
import { usePermissionAdmin } from "src/hooks/usePermissionAdmin";
import { adminFunction } from "../../sidebar";
import NoPermision from "../../no-permision";

export const ID_CARD_TYPE_4_TEST = "6000005";
export const ID_CARD_TYPE_4_PRODUCTION = "71000003";

const PREVENT_ADMIN_CLICK = false;

export const ListProductUser = ({ userId }) => {
  const [data, setData] = useState([]);
  const { isLogin } = useRedirectHomeIfNotLogin();
  const history = useHistory();
  const [currentInfoCard, setCurrentInfoCard] = useState(null);
  const [currentCardFocus, setCurrentCardFocus] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isPendingGetData, setIsPendingGetData] = useState(true);
  const [isOpenModalInfocard, setIsOpenModalInfocard] = useState(false);
  const [isOpenModalLinked, setIsOpenModalLinked] = useState(false);
  const [formDataLinked, setFormDataLinked] = useState({
    card_no: "",
    envelope_no: "",
    card_type_id: "",
  });
  const [isPendingLink, setIsPendingLink] = useState(false);
  const [togglePwd, setTogglePwd] = useState(true);
  const isDisabledBtn =
    formDataLinked.card_no === "" ||
    formDataLinked.envelope_no === "" ||
    formDataLinked.card_type_id === "" ||
    isPendingLink;
  const { t } = useTranslation();
  const { usdtBalance, eurToUsdRate } = useSelector(
    (state) => state.globalReducer
  );
  const EUR_BALANCE = eurToUsdRate * usdtBalance;
  const USD_BALANCE = usdtBalance;

  const { isNoPermission } = usePermissionAdmin(adminFunction.user);

  const [isOpenModalRegister, setIsOpenModalRegister] = useState(false);
  const [cardFee, setCardFee] = useState(0);

  const handleOpenModalRegister = () => {
    setIsOpenModalRegister(true);
  };

  const handleCloseModalRegister = () => {
    setIsOpenModalRegister(false);
  };

  const isNumber = (value) => {
    const regex = /^[0-9]+$/;

    return regex.test(value);
  };

  const handleChangeInputField = (field) => (e) => {
    const value = e.target.value;

    if (value === "") {
      setFormDataLinked({ ...formDataLinked, [field]: "" });
      return;
    }

    if (!isNumber(value)) {
      return;
    }

    if (field === "card_no") {
      setFormDataLinked({
        ...formDataLinked,
        [field]: value,
        envelope_no: value.slice(value.length - 6, value.length),
      });
      return;
    }

    setFormDataLinked({ ...formDataLinked, [field]: value });
  };

  const handleRequestLinkToCard = async () => {
    if (isPendingLink) return;

    setIsPendingLink(true);

    try {
      const res = await axiosService.post("api/visaCard/bindingVisa", {
        card_no: formDataLinked.card_no,
        envelope_no: formDataLinked.envelope_no,
        card_type_id: formDataLinked.card_type_id,
      });

      handleGetData();
      message.success(res.data.message);
      setIsPendingLink(false);
      handleCloseModalLinked();
    } catch (error) {
      setIsPendingLink(false);
      message.error(error.response.data.message);
    }
  };

  const checkIsEnoughBalance = (
    firstRecharge,
    feeRecharge,
    feeCard,
    currency,
    isPhysicalCard = false
  ) => {
    const parseNumberFirstRecharge = Number(firstRecharge);
    const parseNumberFeeRecharge = Number(feeRecharge);
    const parseNumberFeeCard = Number(feeCard);
    const totalFee = calculateCreationFee(
      parseNumberFirstRecharge,
      parseNumberFeeRecharge,
      parseNumberFeeCard,
      isPhysicalCard
    );

    switch (currency.toLowerCase()) {
      case "eur":
        if (EUR_BALANCE === 0) {
          return false;
        }

        if (totalFee > EUR_BALANCE) {
          return false;
        }

        return true;

      case "usd":
        if (USD_BALANCE === 0) {
          return false;
        }

        if (totalFee > USD_BALANCE) {
          return false;
        }

        return true;

      default:
        return false;
    }
  };

  const handleOpenModalLinked = (record) => () => {
    if (PREVENT_ADMIN_CLICK) return;

    if (!isLogin) {
      message.info(t("product.t1"));
      history.push("/login");
      return;
    }

    setFormDataLinked({ ...formDataLinked, card_type_id: record.card_type_id });
    setIsOpenModalLinked(true);
  };

  const handleCloseModalLinked = () => {
    setIsOpenModalLinked(false);
    setCurrentCardFocus(null);
    setFormDataLinked({ card_no: "", envelope_no: "", card_type_id: "" });
  };

  const handleViewDetail = (cardData) => () => {
    setCurrentCardFocus(cardData);
    setIsOpenModal(true);
  };

  const handleGetData = async () => {
    try {
      const res = await axiosService.post("api/visaCard/listCardUserId", {
        userid: userId,
      });

      setData(res.data.data.data);
      setIsPendingGetData(false);
    } catch (error) {
      setIsPendingGetData(false);
    }
  };

  const handleClickBtnApplyVirtualCard = (d) => () => {
    if (PREVENT_ADMIN_CLICK) return;

    if (!isLogin) {
      message.info(t("product.t1"));
      history.push("/login");
      return;
    }

    // card physic (coming soon)
    if (IS_DOMAIN_PRODUCTION && d.apply_type == 3) {
      return;
    }

    // check balaance
    const isEnoughBalance = checkIsEnoughBalance(
      d.min_first_recharge_amount,
      d.recharge_fee,
      d.card_fee,
      d.card_coin
    );
    if (!isEnoughBalance) {
      message.error(t("insufficientBalance"));
      return;
    }

    if (d.apply_type == "2") {
      history.push(
        `/create-visa-card?applyType=${d.apply_type}&cardTypeId=${d.card_type_id}&cardType=${d.card_type}&cardName=Placeholder&minFirstRecharge=${d.min_first_recharge_amount}&feeRecharge=${d.recharge_fee}&cardFee=${d.card_fee}&cardCurr=${d.card_coin}`
      );

      return;
    }

    if (d.apply_type == "1") {
      history.push(
        `/create-visa-card?applyType=${d.apply_type}&cardTypeId=${d.card_type_id}&cardType=${d.card_type}&cardName=Placeholder&minFirstRecharge=${d.min_first_recharge_amount}&feeRecharge=${d.recharge_fee}&cardFee=${d.card_fee}&cardCurr=${d.card_coin}`
      );

      return;
    }
  };

  const renderCardImgFront = (cardData) => {
    try {
      if (!cardData.cardUser) {
        throw Error("Show default img");
      }

      switch (cardData.apply_type.toString()) {
        case "1":
        case "2":
          return (
            <CardItemVirtualFront
              data={cardData.cardUser}
              isNotNeedClick={true}
              applyType={cardData.apply_type}
              imgStyle={{ maxWidth: "350px" }}
            />
          );

        case "3":
          return (
            <CardItemPhysicFront
              data={cardData.cardUser}
              isNotNeedClick={true}
              applyType={cardData.apply_type}
              imgStyle={{ maxWidth: "350px" }}
            />
          );

        default:
          return (
            <Image
              src={renderFrontCardImgByCardApplyType(
                cardData.apply_type,
                cardData.card_type_id
              )}
              style={{ maxWidth: "350px", width: "100%" }}
            />
          );
      }
    } catch (error) {
      return (
        <Image
          src={renderFrontCardImgByCardApplyType(
            cardData.apply_type,
            cardData.card_type_id
          )}
          style={{ maxWidth: "350px", width: "100%" }}
        />
      );
    }
  };

  const renderCardImgBack = (cardData) => {
    try {
      if (!cardData.cardUser) {
        throw Error("Show default img");
      }

      switch (cardData.apply_type.toString()) {
        case "1":
        case "2":
          return (
            <CardItemVirtualBack
              data={cardData.cardUser}
              isNotNeedClick={true}
              applyType={cardData.apply_type}
              imgStyle={{ maxWidth: "350px" }}
            />
          );

        case "3":
          return (
            <CardItemPhysicBack
              data={cardData.cardUser}
              isNotNeedClick={true}
              applyType={cardData.apply_type}
              imgStyle={{ maxWidth: "350px" }}
            />
          );

        default:
          return (
            <Image
              src={renderBackCardImgByCardApplyType(
                cardData.apply_type,
                cardData.card_type_id
              )}
              style={{ maxWidth: "350px", width: "100%" }}
            />
          );
      }
    } catch (error) {
      return (
        <Image
          src={renderBackCardImgByCardApplyType(
            cardData.apply_type,
            cardData.card_type_id
          )}
          style={{ maxWidth: "350px", width: "100%" }}
        />
      );
    }
  };

  const renderDescCard = () => {
    const labelDesc = "labelInside";

    if (!currentCardFocus) {
      return [];
    }

    return (
      <>
        {/* Status */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t2")}</div>}
        >
          <div className="contentInsideV2">
            {renderCardStatus(currentCardFocus.status)}
          </div>
        </Descriptions.Item>

        {/* Card Type ID */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t3")}</div>}
        >
          <div className="contentInsideV2">{currentCardFocus.card_type_id}</div>
        </Descriptions.Item>

        {/* Card Type */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t4")}</div>}
        >
          <div className="contentInsideV2">
            {renderCardType(currentCardFocus.card_type)}
          </div>
        </Descriptions.Item>

        {/* Card application mode */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t6")}</div>}
        >
          <div className="contentInsideV2">
            {renderApplyType(currentCardFocus.apply_type)}
          </div>
        </Descriptions.Item>

        {/* Doc type */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t9")}</div>}
        >
          <div className="contentInsideV2">
            {renderDocType(currentCardFocus.doc_type)}
          </div>
        </Descriptions.Item>

        {/* Card Curr */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t10")}</div>}
        >
          <div className="contentInsideV2">
            {renderCurrency(currentCardFocus.card_coin.toUpperCase())}
          </div>
        </Descriptions.Item>

        {/* Card Assoc */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t11")}</div>}
        >
          <div className="contentInsideV2">
            {renderCardOrganization(currentCardFocus.card_org)}
          </div>
        </Descriptions.Item>

        {/* Method of Activation */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t12")}</div>}
        >
          <div className="contentInsideV2">
            {renderMethodOfActivation(currentCardFocus.activate_type)}
          </div>
        </Descriptions.Item>

        {/* Support recharge */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t14")}</div>}
        >
          <div className="contentInsideV2">
            {renderSupportRecharge(currentCardFocus.can_recharge)}
          </div>
        </Descriptions.Item>

        {/* Ways to obtain bank card */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t16")}</div>}
        >
          <div className="contentInsideV2">
            {renderObtainWay(currentCardFocus.card_detail_obtain_way)}
          </div>
        </Descriptions.Item>

        {/* Card Image */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t19")}</div>}
        >
          <div className="contentInsideV2">
            {renderCardImgFront(currentCardFocus)}
          </div>
        </Descriptions.Item>

        {/* Card Background */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t20")}</div>}
        >
          <div className="contentInsideV2">
            {renderCardImgBack(currentCardFocus)}
          </div>
        </Descriptions.Item>

        {/* Actual Card Fee */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t22")}</div>}
        >
          <div className="contentInsideV2">
            {Number(Number(currentCardFocus.card_fee).toFixed(3))}{" "}
            {renderCurrency(currentCardFocus.card_coin.toUpperCase())}{" "}
            {currentCardFocus.card_coin === "eur" && eurToUsdRate
              ? `- ${calculateEurToUsd(
                  eurToUsdRate,
                  currentCardFocus.card_fee
                )} USDT`
              : ""}
          </div>
        </Descriptions.Item>

        {/* Deposit Fee */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t24")}</div>}
        >
          <div className="contentInsideV2">
            {renderPercentRechargeFee(currentCardFocus.recharge_fee)} %
          </div>
        </Descriptions.Item>

        {/* Deposit Limit Per-day */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t27")}</div>}
        >
          <div className="contentInsideV2">
            {Number(Number(currentCardFocus.max_recharge_amount).toFixed(3))}{" "}
            {renderCurrency(currentCardFocus.card_coin.toUpperCase())}{" "}
            {currentCardFocus.card_coin === "eur" && eurToUsdRate
              ? `- ${calculateEurToUsd(
                  eurToUsdRate,
                  currentCardFocus.max_recharge_amount
                )} USDT`
              : ""}
          </div>
        </Descriptions.Item>

        {/* Minimum initial deposit amount */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t28")}</div>}
        >
          <div className="contentInsideV2">
            {Number(
              Number(currentCardFocus.min_first_recharge_amount).toFixed(3)
            )}{" "}
            {renderCurrency(currentCardFocus.card_coin.toUpperCase())}{" "}
            {currentCardFocus.card_coin === "eur" && eurToUsdRate
              ? `- ${calculateEurToUsd(
                  eurToUsdRate,
                  currentCardFocus.min_first_recharge_amount
                )} USDT`
              : ""}
          </div>
        </Descriptions.Item>

        {/* Minimum Deposit Limit */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t29")}</div>}
        >
          <div className="contentInsideV2">
            {Number(
              Number(currentCardFocus.min_single_recharge_amount).toFixed(3)
            )}{" "}
            {renderCurrency(currentCardFocus.card_coin.toUpperCase())}{" "}
            {currentCardFocus.card_coin === "eur" && eurToUsdRate
              ? `- ${calculateEurToUsd(
                  eurToUsdRate,
                  currentCardFocus.min_single_recharge_amount
                )} USDT`
              : ""}
          </div>
        </Descriptions.Item>

        {/* Maximum Single Deposit Limit */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t30")}</div>}
        >
          <div className="contentInsideV2">
            {Number(
              Number(currentCardFocus.max_single_recharge_amount).toFixed(3)
            )}{" "}
            {renderCurrency(currentCardFocus.card_coin.toUpperCase())}{" "}
            {currentCardFocus.card_coin === "eur" && eurToUsdRate
              ? `- ${calculateEurToUsd(
                  eurToUsdRate,
                  currentCardFocus.max_single_recharge_amount
                )} USDT`
              : ""}
          </div>
        </Descriptions.Item>

        {/* initial deposit is mandatory */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t31")}</div>}
        >
          <div className="contentInsideV2">Yes</div>
        </Descriptions.Item>

        {/* Apply Pay Coin */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t32")}</div>}
        >
          <div className="contentInsideV2">
            {JSON.parse(currentCardFocus.apply_pay_coin)
              .map((coin) => coin.toUpperCase())
              .join(", ")}
          </div>
        </Descriptions.Item>

        {/* Recharge Pay Coin */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t33")}</div>}
        >
          <div className="contentInsideV2">
            {JSON.parse(currentCardFocus.recharge_pay_coin)
              .map((coin) => coin.toUpperCase())
              .join(", ")}
          </div>
        </Descriptions.Item>

        {/* More actions */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t34")}</div>}
        >
          <div className="contentInsideV2">
            {currentCardFocus.support_business
              .split(",")
              .map((businessValue) =>
                renderOperationType(Number(businessValue))
              )
              .join(", ")}
          </div>
        </Descriptions.Item>

        {/* Support Refund */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t35")}</div>}
        >
          <div className="contentInsideV2">
            {currentCardFocus.support_refund === 1 ? "Yes" : "No"}
          </div>
        </Descriptions.Item>

        {/* support the same user to open multiple cards of the same card type */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t36")}</div>}
        >
          <div className="contentInsideV2">
            {renderMoreCard(currentCardFocus.more_card)}
          </div>
        </Descriptions.Item>

        {/* AML report */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t37")}</div>}
        >
          <div className="contentInsideV2">
            {currentCardFocus.need_aml_report === 0 ? "No need" : "Need"}
          </div>
        </Descriptions.Item>

        {/* Proof of address */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t38")}</div>}
        >
          <div className="contentInsideV2">
            {currentCardFocus.need_poa === 0 ? "No need" : "Need"}
          </div>
        </Descriptions.Item>

        {/* Support Poa supply Type */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t39")}</div>}
        >
          <div className="contentInsideV2">
            {renderSupportPoaType(currentCardFocus.support_poa_type)}
          </div>
        </Descriptions.Item>
      </>
    );
  };

  const renderDescCardInfo = () => {
    if (!currentInfoCard) return;

    return (
      <>
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t40")}</div>}
        >
          <div className="contentInsideV2">{currentInfoCard.email}</div>
        </Descriptions.Item>
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t41")}</div>}
        >
          <div className="contentInsideV2">{currentInfoCard.mobile}</div>
        </Descriptions.Item>
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t42")}</div>}
        >
          <div className="contentInsideV2">{currentInfoCard.mobile_code}</div>
        </Descriptions.Item>
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t43")}</div>}
        >
          <div className="contentInsideV2">{currentInfoCard.card_id}</div>
        </Descriptions.Item>
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t44")}</div>}
        >
          <div className="contentInsideV2">
            {currentInfoCard.card_number_hiden}
          </div>
        </Descriptions.Item>
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t45")}</div>}
        >
          <div className="contentInsideV2">{currentInfoCard.first_name}</div>
        </Descriptions.Item>
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t46")}</div>}
        >
          <div className="contentInsideV2">{currentInfoCard.last_name}</div>
        </Descriptions.Item>
      </>
    );
  };

  const handleViewCardInfo = (d) => () => {
    setCurrentInfoCard(d);
    setIsOpenModalInfocard(true);
  };

  const renderBtnApplyVirtualCard = (d) => {
    if (!(d.apply_type == "1" || d.apply_type == "2")) {
      return null;
    }

    if (d?.cardUser) {
      return (
        <div
          className="btnInside"
          onClick={() => {
            if (PREVENT_ADMIN_CLICK) return;

            history.push(
              `/card-visa-detail?mcTradeNo=${d.cardUser.mc_trade_no}&cardTypeId=${d.cardUser.card_type_id}&id=${d.cardUser.id}&fname=${d.cardUser.first_name}&lname=${d.cardUser.last_name}&phone=${d.cardUser.mobile}&phoneCode=${d.cardUser.mobile_code}&email=${d.cardUser.email}&viewAll=1&applyType=${d.apply_type}`
            );
          }}
        >
          {t("product.t47")}
        </div>
      );
    } else if (d?.transactionCardUser) {
      return (
        <div
          className="btnInside"
          onClick={() => {
            if (PREVENT_ADMIN_CLICK) return;

            history.push(
              `/card-visa-detail?mcTradeNo=${d.transactionCardUser.mc_trade_no}&cardTypeId=${d.transactionCardUser.card_type_id}&viewAll=0&applyType=${d.apply_type}`
            );
          }}
        >
          {t("product.t48")}
        </div>
      );
    } else {
      return (
        <div className="btnInside" onClick={handleClickBtnApplyVirtualCard(d)}>
          {IS_DOMAIN_PRODUCTION && d.apply_type == 3
            ? "Coming soon"
            : t("product.t49")}
        </div>
      );
    }
  };

  const renderBtnApplyPhysicCard = (d) => {
    if (!(d.apply_type == "3")) {
      return null;
    }

    if (d.transactionCardUser) {
      if (d.transactionCardUser.typeTransaction == "binding") {
        return (
          <div
            className="btnInside"
            onClick={() => {
              if (PREVENT_ADMIN_CLICK) return;

              history.push(
                `/kyc-card?cardTypeId=${d.card_type_id}&minFirstRecharge=${d.min_first_recharge_amount}&feeRecharge=${d.recharge_fee}&cardFee=${d.card_fee}&cardCurr=${d.card_coin}&applyType=${d.apply_type}`
              );
            }}
          >
            KYC
          </div>
        );
      } else if (d.transactionCardUser.typeTransaction == "pendingBindingKYC") {
        return (
          <div
            className="btnInside"
            style={{
              cursor: "default",
              backgroundColor: "#1a1a1a",
              color: "#fff",
            }}
          >
            {t("product.t50")}
          </div>
        );
      } else if (d.transactionCardUser.typeTransaction == "faild") {
        return (
          <div
            className="btnInside"
            onClick={() => {
              if (PREVENT_ADMIN_CLICK) return;

              history.push(
                `/card-visa-detail?mcTradeNo=${d?.transactionCardUser?.mc_trade_no}&cardTypeId=${d?.transactionCardUser?.card_type_id}&id=${d?.transactionCardUser?.id}&fname=${d?.transactionCardUser?.first_name}&lname=${d?.transactionCardUser?.last_name}&phone=${d?.transactionCardUser?.mobile}&phoneCode=${d?.transactionCardUser?.mobile_code}&email=${d?.transactionCardUser?.email}&viewAll=1&applyType=${d.apply_type}`
              );
            }}
          >
            {t("product.t51.2")}
          </div>
        );
      } else {
        return (
          <div
            className="btnInside"
            onClick={() => {
              if (PREVENT_ADMIN_CLICK) return;

              history.push(
                `/card-visa-detail?mcTradeNo=${d?.cardUser?.mc_trade_no}&cardTypeId=${d?.cardUser?.card_type_id}&id=${d?.cardUser?.id}&fname=${d?.cardUser?.first_name}&lname=${d?.cardUser?.last_name}&phone=${d?.cardUser?.mobile}&phoneCode=${d?.cardUser?.mobile_code}&email=${d?.cardUser?.email}&viewAll=1&applyType=${d.apply_type}`
              );
            }}
          >
            {t("product.t51")}
          </div>
        );
      }
    } else {
      return (
        <div className="btnInside" onClick={handleOpenModalLinked(d)}>
          {t("product.t98")}
        </div>
      );
    }
  };

  const renderBtnRegisterOfPhysicCard = (d) => {
    if (!isLogin) return null;

    if (!(d.apply_type == "3")) {
      return null;
    }

    return (
      <div
        className="btnInside"
        onClick={() => {
          if (PREVENT_ADMIN_CLICK) return;

          handleOpenModalRegister();

          if (d.card_coin === "usd") {
            setCardFee(d.card_fee);
          } else {
            setCardFee(calculateEurToUsd(eurToUsdRate, d.card_fee));
          }
        }}
      >
        {t("register")}
      </div>
    );
  };

  // có thêm loại thẻ thứ 4 là card_type_id = 6000005 , logic tạo thẻ tương tự thẻ thứ 3 .
  // Ở môi trường test thẻ thứ 4 sẽ có  card_type_id = 6000005 sau này lên production thì  card_type_id = 71000003
  const renderCardItem = data.map((d, idx) => {
    // const renderCardItem = data.slice(0, -1).map((d, idx) => {
    const isPhysicalCard = d.apply_type == 3;

    const feeCreateCard = roundNumber(
      calculateCreationFee(
        d.min_first_recharge_amount,
        d.recharge_fee,
        d.card_fee,
        isPhysicalCard
      )
    );

    return (
      <>
        {/* ẩn thẻ 52500001 bên admin */}
        {d.card_type_id != "52500001" && (
          <div className="cardItem" key={idx}>
            <div className="imgContainer">
              <img
                src={renderFrontCardImgByCardApplyType(
                  d.apply_type,
                  d.card_type_id
                )}
              />
            </div>

            <div className="right">
              {/* Nếu là card 52500001 thì hiện thêm chữ Apply Pay */}
              {d.card_type_id == "52500002" ? (
                <div className="titleInside">
                  {renderCardType(d.card_type)} Card (Apple Pay)
                </div>
              ) : d.card_type_id == "72000001" ? (
                <div className="titleInside">
                  {renderCardType(d.card_type)} Card (Google Pay)
                </div>
              ) : (
                <div className="titleInside">
                  {renderCardType(d.card_type)} Card
                </div>
              )}

              <div className="cardContent">
                <ul>
                  {/* Nếu là card virtual thì ẩn chỗ này */}
                  {d.card_type != 1 && (
                    <li>
                      <span className="label">{t("product.t53")} </span>
                      <span className="value">
                        {d.apply_type == 1
                          ? t("outsideComponent.t3")
                          : renderCardMaterial(d.card_sub_type)}
                      </span>
                    </li>
                  )}
                  <li>
                    <span className="label">{t("product.t54")} </span>
                    <span className="value">
                      {renderApplyType(d.apply_type)}
                    </span>
                  </li>
                  <li>
                    <span className="label">{t("product.t55")} </span>
                    <span className="value">
                      {renderCurrency(d.card_coin.toUpperCase())}
                    </span>
                  </li>

                  {
                    <>
                      {/* ẩn minimum first deposit amount cho thẻ vật lý */}
                      {d.card_type != 2 && (
                        <li>
                          <span className="label">{t("product.t93")} </span>
                          <span className="value">
                            {" "}
                            {Number(
                              Number(d.min_first_recharge_amount).toFixed(3)
                            )}{" "}
                            {renderCurrency(d.card_coin.toUpperCase())}{" "}
                            {d.card_coin === "eur" && eurToUsdRate
                              ? `- ${calculateEurToUsd(
                                  eurToUsdRate,
                                  d.min_first_recharge_amount
                                )} USDT`
                              : ""}
                          </span>
                        </li>
                      )}
                      <li>
                        <span className="label">{t("product.t56")} </span>
                        <span className="value">
                          {" "}
                          {Number(
                            Number(d.min_single_recharge_amount).toFixed(3)
                          )}{" "}
                          {renderCurrency(d.card_coin.toUpperCase())}{" "}
                          {d.card_coin === "eur" && eurToUsdRate
                            ? `- ${calculateEurToUsd(
                                eurToUsdRate,
                                d.min_single_recharge_amount
                              )} USDT`
                            : ""}
                        </span>
                      </li>
                      <li>
                        <span className="label">{t("product.t57")} </span>
                        <span className="value">
                          {Number(Number(d.max_recharge_amount).toFixed(3))}{" "}
                          {renderCurrency(d.card_coin.toUpperCase())}{" "}
                          {d.card_coin === "eur" && eurToUsdRate
                            ? `- ${calculateEurToUsd(
                                eurToUsdRate,
                                d.max_recharge_amount
                              )} USDT`
                            : ""}
                        </span>
                      </li>
                      <li>
                        <span className="label">{t("product.t97")} </span>
                        <span className="value">
                          {Number(Number(d.annual_fee).toFixed(3))}{" "}
                          {renderCurrency(d.card_coin.toUpperCase())}{" "}
                          {d.card_coin === "eur" && eurToUsdRate
                            ? `- ${calculateEurToUsd(
                                eurToUsdRate,
                                d.annual_fee
                              )} USDT`
                            : ""}
                        </span>
                      </li>
                      <li>
                        <span className="label">{t("product.t58")} </span>
                        <span className="value">
                          {Number(Number(d.card_fee).toFixed(3))}{" "}
                          {renderCurrency(d.card_coin.toUpperCase())}{" "}
                          {d.card_coin === "eur" && eurToUsdRate
                            ? `- ${calculateEurToUsd(
                                eurToUsdRate,
                                d.card_fee
                              )} USDT`
                            : ""}
                        </span>
                      </li>
                      <li>
                        <span className="label">{t("depositCard.t11")} </span>
                        <span>
                          {renderPercentRechargeFee(d.recharge_fee)} %
                        </span>
                      </li>
                      <li>
                        <span className="label">{t("product.t96")} </span>
                        <span className="value">
                          {feeCreateCard}{" "}
                          {renderCurrency(d.card_coin.toUpperCase())}{" "}
                          {d.card_coin === "eur" && eurToUsdRate
                            ? `- ${calculateEurToUsd(
                                eurToUsdRate,
                                feeCreateCard
                              )} USDT`
                            : ""}
                        </span>
                      </li>
                    </>
                  }
                </ul>
              </div>

              <div className="btns">
                <div
                  className="btnInside outline"
                  onClick={handleViewDetail(d)}
                >
                  {t("product.t59")}
                </div>
                {/* virtual card */}
                {renderBtnApplyVirtualCard(d)}

                {/* btn register for card physic */}
                {renderBtnRegisterOfPhysicCard(d)}

                {/* physic card */}
                {renderBtnApplyPhysicCard(d)}
              </div>
            </div>
          </div>
        )}
      </>
    );
  });

  useEffect(() => {
    if (isLogin) {
      socket.on(`notification`, (res) => {
        if (res.notify_type === "OPEN_CARD") {
          handleGetData();
        }
      });
    }
  }, [isLogin]);

  useEffect(() => {
    handleGetData();
  }, []);

  if (isNoPermission) {
    return <NoPermision />;
  }

  return (
    <div className="productV2Container containerV2">
      <div className="sectionCards">
        {isPendingGetData && (
          <div style={{ color: "#fff", textAlign: "center", fontSize: "18px" }}>
            {t("product.t61")}{" "}
          </div>
        )}
        {!isPendingGetData && renderCardItem}
      </div>

      <Modal
        title={t("product.t88")}
        open={isOpenModal}
        footer={false}
        width={1000}
        onCancel={() => {
          setIsOpenModal(false);
          setCurrentCardFocus(null);
        }}
      >
        <div
          style={{
            color: "#fff",
            maxHeight: "calc(100vh - 300px)",
            overflowY: "auto",
            padding: "16px",
          }}
        >
          <Descriptions
            className="customAntdDesc"
            bordered
            style={{ color: "#fff" }}
            column={1}
            size={window.innerWidth < 768 ? "small" : "default"}
          >
            {renderDescCard()}
          </Descriptions>
        </div>
      </Modal>

      <Modal
        title={t("product.t89")}
        open={isOpenModalLinked}
        footer={false}
        onCancel={handleCloseModalLinked}
      >
        <div
          style={{
            color: "#fff",
            maxHeight: "calc(100vh - 300px)",
            overflowY: "auto",
            padding: "16px",
          }}
        >
          <div className="linkedCardContainer">
            <div className="item">
              <div className="label">{t("product.t90")}</div>
              <input
                value={formDataLinked.card_no}
                onChange={handleChangeInputField("card_no")}
                className="inputInside"
              />
            </div>

            <div className="item">
              <div className="label">Envelope</div>
              <input
                type={togglePwd ? "password" : "text"}
                value={formDataLinked.envelope_no}
                onChange={handleChangeInputField("envelope_no")}
                className="inputInside"
              />

              <i
                className="fa-regular fa-eye eyePwd"
                onClick={() => setTogglePwd(!togglePwd)}
              ></i>
            </div>

            <button
              disabled={isDisabledBtn}
              onClick={handleRequestLinkToCard}
              className="btnInside"
            >
              {isPendingLink ? <Spin /> : t("product.t92")}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        title={t("product.t91")}
        open={isOpenModalInfocard}
        footer={false}
        onCancel={() => setIsOpenModalInfocard(false)}
      >
        <div
          style={{
            color: "#fff",
            maxHeight: "calc(100vh - 300px)",
            overflowY: "auto",
            padding: "16px",
          }}
        >
          <Descriptions
            className="customAntdDesc"
            bordered
            style={{ color: "#fff" }}
            column={1}
            size={window.innerWidth < 768 ? "small" : "default"}
          >
            {renderDescCardInfo()}
          </Descriptions>
        </div>
      </Modal>

      <Form4Fields
        isOpenModal={isOpenModalRegister}
        handleCloseModal={handleCloseModalRegister}
        handleOpenModal={handleOpenModalRegister}
        cardFee={cardFee}
      />
    </div>
  );
};
