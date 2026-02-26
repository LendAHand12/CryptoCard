import { Descriptions, Image, Input, message, Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { useRedirectHomeIfNotLogin } from "src/hooks/useRedirectHomeIfNotLogin";
import { axiosService, IS_DOMAIN_PRODUCTION } from "src/util/service";
import {
  BACK_CARD_PHYSIC,
  BACK_CARD_VIRTUAL,
  FRONT_CARD_PHYSIC,
  FRONT_CARD_VIRTUAL,
  renderAMLType,
  renderApplyType,
  renderBillingMode,
  renderCanChangeBillingAddress,
  renderCanRepeat,
  renderCardMaterial,
  renderCardOrganization,
  renderCardStatus,
  renderCardType,
  renderDocType,
  renderInitalDepositMandatory,
  renderMethodOfActivation,
  renderMoreCard,
  renderObtainWay,
  renderOperationType,
  renderSupportPoaType,
  renderSupportRecharge,
} from "../CardManagement";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import socket from "src/util/socket";
import { useTranslation } from "react-i18next";
import {
  renderBackCardImgByCardApplyType,
  renderBackCardImgByCardTypeId,
  renderFrontCardImgByCardApplyType,
  renderFrontCardImgByCardTypeId,
} from "src/util/renderCardImg";
import { useSelector } from "react-redux";
import { calculateEurToUsd } from "src/util/calculateEurToUsd";
import { roundNumber } from "src/util/roundNumber";
import { CardItemVirtualFront } from "../CardManagement/CardItem/CardItemVirtualFront";
import { CardItemPhysicFront } from "../CardManagement/CardItem/CardItemPhysicFront";
import { CardItemVirtualBack } from "../CardManagement/CardItem/CardItemVirtualBack";
import { CardItemPhysicBack } from "../CardManagement/CardItem/CardItemPhysicBack";
import { renderPercentRechargeFee } from "src/util/renderPercentRechargeFee";
import { calculateCreationFee } from "src/util/calculateCreateFee";
import { renderCurrency } from "src/util/renderCurrency";
import { Form4Fields } from "../Form4Fields/Form4Fields";

export const ID_CARD_TYPE_4_TEST = "6000005";
export const ID_CARD_TYPE_4_PRODUCTION = "71000003";

export const Product = () => {
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

  // const calculateCreationFee = (minRecharge, feeRechage, feeCard) => {
  //   const percentRechargeFee = renderPercentRechargeFee(feeRechage);

  //   const minRechargeNumber = Number(minRecharge);
  //   const totalMinRechargePlusFee =
  //     minRechargeNumber + (minRechargeNumber * percentRechargeFee) / 100;

  //   // return Number(minRecharge) + Number(feeRechage) + Number(feeCard); // logic cũ
  //   return totalMinRechargePlusFee + Number(feeCard);
  // };

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

    // TEST
    // const totalFee =
    //   parseNumberFirstRecharge + parseNumberFeeRecharge + parseNumberFeeCard;
    // const totalFeeNew = calculateCreationFee(
    //   parseNumberFirstRecharge,
    //   parseNumberFeeRecharge,
    //   parseNumberFeeCard
    // );

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
    if (!isLogin) {
      message.info(t("product.t1"));
      history.push("/login");
      return;
    }

    // bật tắt chế độ coming soon ở card physic
    // if (IS_DOMAIN_PRODUCTION) return;

    // const isPhysicalCard = record.apply_type == 3;

    // const isEnoughBalance = checkIsEnoughBalance(
    //   record.min_first_recharge_amount,
    //   record.recharge_fee,
    //   record.card_fee,
    //   record.card_coin,
    //   isPhysicalCard
    // );

    // if (!isEnoughBalance) {
    //   message.error(t("insufficientBalance"));
    //   return;
    // }

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
      let res;

      if (!isLogin) {
        res = await axiosService.post("api/visaCard/listCard");
      } else {
        res = await axiosService.post("api/visaCard/listCardToken");
      }

      // TODO remove
      // MOCK card fail
      // const resMock = res.data.data.data.map((r) => {
      //   if (r.card_type_id == "6000005") {
      //     return {
      //       ...r,
      //       transactionCardUser: {
      //         ...r.transactionCardUser,
      //         typeTransaction: "faild",
      //       },
      //     };
      //   }

      //   return r;
      // });
      // setData(resMock);
      // setIsPendingGetData(false);

      // TODO open then
      setData(res.data.data.data);
      setIsPendingGetData(false);
    } catch (error) {
      setIsPendingGetData(false);
    }
  };

  const handleClickBtnApplyVirtualCard = (d) => () => {
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

    // if (d.card_type_id === "88990001") {
    if (d.apply_type == "2") {
      history.push(
        `/create-visa-card?applyType=${d.apply_type}&cardTypeId=${d.card_type_id}&cardType=${d.card_type}&cardName=Placeholder&minFirstRecharge=${d.min_first_recharge_amount}&feeRecharge=${d.recharge_fee}&cardFee=${d.card_fee}&cardCurr=${d.card_coin}`
      );

      return;
    }

    // if (d.card_type_id === "88990003") {
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

        {/* Card material */}
        {/* <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t5")}</div>}
        >
          <div className="contentInsideV2">
            {currentCardFocus.apply_type == 1
              ? t("outsideComponent.t3")
              : renderCardMaterial(currentCardFocus.card_sub_type)}
          </div>
        </Descriptions.Item> */}

        {/* Card application mode */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t6")}</div>}
        >
          <div className="contentInsideV2">
            {renderApplyType(currentCardFocus.apply_type)}
          </div>
        </Descriptions.Item>

        {/* Billing mode */}
        {/* <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t7")}</div>}
        >
          <div className="contentInsideV2">
            {renderBillingMode(currentCardFocus.billing_kyc_column_limit)}
          </div>
        </Descriptions.Item> */}

        {/* Can change billing address */}
        {/* <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t8")}</div>}
        >
          <div className="contentInsideV2">
            {renderCanChangeBillingAddress(
              currentCardFocus.can_change_billing_address
            )}
          </div>
        </Descriptions.Item> */}

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

        {/* AML report Provide type */}
        {/* <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t13")}</div>}
        >
          <div className="contentInsideV2">
            {renderAMLType(currentCardFocus.aml_type)}
          </div>
        </Descriptions.Item> */}

        {/* Support recharge */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t14")}</div>}
        >
          <div className="contentInsideV2">
            {renderSupportRecharge(currentCardFocus.can_recharge)}
          </div>
        </Descriptions.Item>

        {/* Allow repeat email or phone to apply same card */}
        {/* <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t15")}</div>}
        >
          <div className="contentInsideV2">
            {renderCanRepeat(currentCardFocus.can_repeat)}
          </div>
        </Descriptions.Item> */}

        {/* Ways to obtain bank card */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t16")}</div>}
        >
          <div className="contentInsideV2">
            {renderObtainWay(currentCardFocus.card_detail_obtain_way)}
          </div>
        </Descriptions.Item>

        {/* Country Limit */}
        {/* <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t17")}</div>}
        >
          <div className="contentInsideV2">
            {currentCardFocus.kyc_country_limit}
          </div>
        </Descriptions.Item> */}

        {/* Unsupported nationality id */}
        {/* <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t18")}</div>}
        >
          <div className="contentInsideV2">
            {currentCardFocus.kyc_nationality_limit_id}
          </div>
        </Descriptions.Item> */}

        {/* Card Image */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t19")}</div>}
        >
          <div className="contentInsideV2">
            {/* <Image
              src="/img/newVersion/fronthewe.png"
              style={{ width: "350px" }}
            /> */}

            {/* <Image
              src={
                currentCardFocus.card_type === 1
                  ? FRONT_CARD_VIRTUAL
                  : FRONT_CARD_PHYSIC
              }
              style={{ maxWidth: "350px", width: "100%" }}
            /> */}
            {renderCardImgFront(currentCardFocus)}
            {/* <Image
              src={renderFrontCardImgByCardApplyType(
                currentCardFocus.apply_type
              )}
              style={{ maxWidth: "350px", width: "100%" }}
            /> */}
          </div>
        </Descriptions.Item>

        {/* Card Background */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t20")}</div>}
        >
          <div className="contentInsideV2">
            {/* <Image
              src="/img/newVersion/backhewe.png"
              style={{ width: "350px" }}
            /> */}

            {renderCardImgBack(currentCardFocus)}

            {/* <Image
              src={renderBackCardImgByCardApplyType(
                currentCardFocus.apply_type
              )}
              style={{ maxWidth: "350px", width: "100%" }}
            /> */}
          </div>
        </Descriptions.Item>

        {/* Minimum Card Fee */}
        {/* <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t21")}</div>}
        >
          <div className="contentInsideV2">
            {Number(Number(currentCardFocus.card_fee).toFixed(3))}{" "}
            {currentCardFocus.card_coin.toUpperCase()}{" "}
            {currentCardFocus.card_coin === "eur" && eurToUsdRate
              ? `- ${calculateEurToUsd(
                  eurToUsdRate,
                  currentCardFocus.card_fee
                )} USD`
              : ""}
          </div>
        </Descriptions.Item> */}

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

        {/* Minimum Deposit Fee */}
        {/* <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t23")}</div>}
        >
          <div className="contentInsideV2">
            {Number(currentCardFocus.recharge_fee).toFixed(3)}{" "}
            {currentCardFocus.card_coin.toUpperCase()}{" "}
            {currentCardFocus.card_coin === "eur" && eurToUsdRate
              ? `- ${calculateEurToUsd(
                  eurToUsdRate,
                  currentCardFocus.recharge_fee
                )} USD`
              : ""}
          </div>
        </Descriptions.Item> */}

        {/* Deposit Fee */}
        <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t24")}</div>}
        >
          <div className="contentInsideV2">
            {renderPercentRechargeFee(currentCardFocus.recharge_fee)} %
          </div>
        </Descriptions.Item>

        {/* China Postage */}
        {/* <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t25")}</div>}
        >
          <div className="contentInsideV2">
            {Number(currentCardFocus.china_postage).toFixed(3)}{" "}
            {currentCardFocus.card_coin.toUpperCase()}{" "}
            {currentCardFocus.card_coin === "eur" && eurToUsdRate
              ? `- ${calculateEurToUsd(
                  eurToUsdRate,
                  currentCardFocus.china_postage
                )} USD`
              : ""}
          </div>
        </Descriptions.Item> */}

        {/* Non-China Postage */}
        {/* <Descriptions.Item
          label={<div className="labelInsideV2">{t("product.t26")}</div>}
        >
          <div className="contentInsideV2">
            {Number(currentCardFocus.non_china_postage).toFixed(3)}{" "}
            {currentCardFocus.card_coin.toUpperCase()}{" "}
            {currentCardFocus.card_coin === "eur" && eurToUsdRate
              ? `- ${calculateEurToUsd(
                  eurToUsdRate,
                  currentCardFocus.non_china_postage
                )} USD`
              : ""}
          </div>
        </Descriptions.Item> */}

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
          <div className="contentInsideV2">
            {/* {renderInitalDepositMandatory(currentCardFocus.need_first_recharge)} */}
            Yes
          </div>
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
    // if (!(d.card_type_id === "88990001" || d.card_type_id === "88990003")) {
    if (!(d.apply_type == "1" || d.apply_type == "2")) {
      return null;
    }

    if (d?.cardUser) {
      return (
        // <div className="btnInside" onClick={handleViewCardInfo(d.cardUser)}>
        <div
          className="btnInside"
          onClick={() => {
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
    // if (
    //   !(
    //     d.card_type_id === "90000007" ||
    //     d.card_type_id === ID_CARD_TYPE_4_TEST ||
    //     d.card_type_id === ID_CARD_TYPE_4_PRODUCTION
    //   )
    // ) {

    if (!(d.apply_type == "3")) {
      return null;
    }

    if (d.transactionCardUser) {
      if (d.transactionCardUser.typeTransaction == "binding") {
        return (
          <div
            className="btnInside"
            onClick={() =>
              history.push(
                `/kyc-card?cardTypeId=${d.card_type_id}&minFirstRecharge=${d.min_first_recharge_amount}&feeRecharge=${d.recharge_fee}&cardFee=${d.card_fee}&cardCurr=${d.card_coin}&applyType=${d.apply_type}`
              )
            }
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
              // "r=true" đại diện cho card bị reject
              history.push(
                `/card-visa-detail?mcTradeNo=${d?.transactionCardUser?.mc_trade_no}&cardTypeId=${d?.transactionCardUser?.card_type_id}&id=${d?.transactionCardUser?.id}&fname=${d?.transactionCardUser?.first_name}&lname=${d?.transactionCardUser?.last_name}&phone=${d?.transactionCardUser?.mobile}&phoneCode=${d?.transactionCardUser?.mobile_code}&email=${d?.transactionCardUser?.email}&viewAll=1&applyType=${d.apply_type}&r=true`
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
          {/* {IS_DOMAIN_PRODUCTION && d.apply_type == 3
            ? "Coming soon"
            : t("product.t52")} */}
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
    if (d.card_type_id == "52500001") {
      return null;
    }

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
      <div className="cardItem" key={idx}>
        {/* <img
          src={
            d.card_type_id === "88990001" || d.card_type_id === "88990003"
              ? FRONT_CARD_VIRTUAL
              : FRONT_CARD_PHYSIC
          }
        /> */}
        {/* <img src={renderFrontCardImgByCardTypeId(d.card_type_id)} /> */}
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
          {d.card_type_id == "52500001" || d.card_type_id === "52500002" ? (
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
                <span className="value">{renderApplyType(d.apply_type)}</span>
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
                    {/* <span className="value">
                  {Number(Number(d.recharge_fee).toFixed(3))}{" "}
                  {d.card_coin.toUpperCase()}{" "}
                  {d.card_coin === "eur" && eurToUsdRate
                    ? `- ${calculateEurToUsd(eurToUsdRate, d.recharge_fee)} USD`
                    : ""}
                </span> */}
                    <span>{renderPercentRechargeFee(d.recharge_fee)} %</span>
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
            <div className="btnInside outline" onClick={handleViewDetail(d)}>
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

  return (
    <div className="productV2Container containerV2">
      <div className="sectionIntro">
        <img src="/img/newVersion/s11.png" />
        <div>2024 AmChain</div>
      </div>

      <div className="sectionCards">
        {isPendingGetData && (
          <div style={{ color: "#fff", textAlign: "center", fontSize: "18px" }}>
            {t("product.t61")}{" "}
          </div>
        )}
        {!isPendingGetData && renderCardItem}

        {/* <div className="cardItem">
          <img src="/img/newVersion/s12.png" />

          <div className="right">
            <div className="titleInside">Kompa Leon MoneyCard</div>
            <div className="btnInside">Apply now</div>
          </div>
        </div>

        <div className="cardItem">
          <img src="/img/newVersion/s13.png" />

          <div className="right">
            <div className="titleInside">Kompa Leon MoneyCard</div>
            <div className="btnInside">Apply now</div>
          </div>
        </div> */}
      </div>

      {/* <div className="sectionDesc">
        <div className="top">{t("product.t62")}</div>
        <div className="center">{t("product.t63")}</div>

        <ul className="bot">
          <li>{t("product.t64")}</li>
          <li>{t("product.t65")}</li>
          <li>{t("product.t66")}</li>
          <li>{t("product.t67")}</li>
          <li>{t("product.t68")}</li>
          <li>{t("product.t69")}</li>
          <li>{t("product.t70")}</li>
          <li>{t("product.t71")}</li>
          <li>{t("product.t72")}</li>
        </ul>

        <div className="btnInside">{t("product.t73")}</div>
      </div> */}

      {/* <div className="sectionPayment">
        <table>
          <tr>
            <th>{t("product.t74")}</th>
            <th>{t("product.t75")}</th>
            <th>{t("product.t76")}</th>
            <th>{t("product.t77")}</th>
          </tr>
          <tr>
            <td>{t("product.t78")}</td>
            <td>NAf 31.80</td>
            <td>USD 31.80</td>
            <td>USD 31.80</td>
          </tr>
          <tr>
            <td>{t("product.t79")}</td>
            <td>NAf 25.00</td>
            <td>USD 25.00</td>
            <td>USD 25.00</td>
          </tr>
          <tr>
            <td>{t("product.t80")}</td>
            <td>Naf 2000.00</td>
            <td>USD 2000.00</td>
            <td>USD 2000.00</td>
          </tr>
          <tr>
            <td>{t("product.t81")}</td>
            <td>NAf 2.12</td>
            <td>USD 2.12</td>
            <td>USD 2.12</td>
          </tr>
          <tr>
            <td>{t("product.t82")}</td>
            <td>NAf 5.30</td>
            <td>USD 5.30</td>
            <td>USD 5.30</td>
          </tr>
          <tr>
            <td>{t("product.t83")}</td>
            <td>NAf 31.80</td>
            <td>USD 31.80</td>
            <td>USD 31.80</td>
          </tr>
          <tr>
            <td>{t("product.t84")}</td>
            <td>NAf 10.60</td>
            <td>USD 10.60</td>
            <td>USD 10.60</td>
          </tr>
          <tr>
            <td>{t("product.t85")}</td>
            <td colSpan={3}>{t("product.t86")}</td>
          </tr>
        </table>
      </div> */}

      {/* <div className="sectionSearch">
        <img src="/img/newVersion/s18.jfif" />
        <div className="inside">
          <div className="searchInside">
            <input placeholder="I am looking for..." />
          </div>

          <div className="btnInside">{t("product.t87")}</div>
        </div>
      </div> */}

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
