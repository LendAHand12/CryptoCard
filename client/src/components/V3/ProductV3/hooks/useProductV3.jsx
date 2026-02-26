import { Descriptions, Image, message } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
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
import { CardItemPhysicBack } from "src/components/NewVersion/CardManagement/CardItem/CardItemPhysicBack";
import { CardItemPhysicFront } from "src/components/NewVersion/CardManagement/CardItem/CardItemPhysicFront";
import { CardItemVirtualBack } from "src/components/NewVersion/CardManagement/CardItem/CardItemVirtualBack";
import { CardItemVirtualFront } from "src/components/NewVersion/CardManagement/CardItem/CardItemVirtualFront";
import { useCheckLoggedIn } from "src/hooks/V3/useCheckLoggedIn";
import { useModalV3 } from "src/hooks/V3/useModalV3";
import { calculateCreationFee } from "src/util/calculateCreateFee";
import { calculateEurToUsd } from "src/util/calculateEurToUsd";
import {
  renderBackCardImgByCardApplyType,
  renderFrontCardImgByCardApplyType,
} from "src/util/renderCardImg";
import { renderCurrency } from "src/util/renderCurrency";
import { renderPercentRechargeFee } from "src/util/renderPercentRechargeFee";
import { axiosService, IS_DOMAIN_PRODUCTION } from "src/util/service";
import socket from "src/util/socket";
import { ButtonV3, buttonV3Sizes } from "../../ButtonV3/ButtonV3";
import { useLoginV3 } from "../../LoginV3/hooks/useLoginV3";
import { ButtonV3Primary } from "../../ButtonV3/ButtonV3Primary";
import { GLOBAL_TYPE } from "src/redux/reducers/globalReducer";

export const useProductV3 = () => {
  const [data, setData] = useState([]);
  const { isLogin } = useCheckLoggedIn();
  const history = useHistory();
  const [currentCardFocus, setCurrentCardFocus] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isPendingGetData, setIsPendingGetData] = useState(true);
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
  const [isOpenModalRegister, setIsOpenModalRegister] = useState(false);
  const [cardFee, setCardFee] = useState(0);
  const dispatch = useDispatch();
  const { handleOpenModalLogin } = useLoginV3();

  const EUR_BALANCE = eurToUsdRate * usdtBalance;
  const USD_BALANCE = usdtBalance;

  // Hàm render tổng phí tương tự như render card_fee
  const renderTotalFee = (cardData) => {
    const totalFee = calculateCreationFee(
      cardData.min_first_recharge_amount,
      cardData.recharge_fee,
      cardData.card_fee,
      false // isPhysicalCard = false cho virtual card
    );

    return (
      <>
        <span>{Number(Number(totalFee).toFixed(3))} </span>
        <span>{renderCurrency(cardData.card_coin.toUpperCase())} </span>
        <span>
          {cardData.card_coin === "eur" && eurToUsdRate
            ? `- ${calculateEurToUsd(eurToUsdRate, totalFee)} USDT`
            : ""}
        </span>
      </>
    );
  };

  const getWalletGlobal = async () => {
    try {
      const res = await axiosService.post("api/user/getWallet");

      dispatch({
        type: GLOBAL_TYPE.UPDATE_BALANCES,
        payload: res.data.data,
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (isLogin) {
      getWalletGlobal();
    }
  }, [isLogin]);

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
    if (!isLogin) {
      message.info(t("product.t1"));
      // history.push("/login");
      handleOpenModalLogin();
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
      // history.push("/login");
      handleOpenModalLogin();
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
              imgStyle={{ maxWidth: "300px" }}
            />
          );

        case "3":
          return (
            <CardItemPhysicFront
              data={cardData.cardUser}
              isNotNeedClick={true}
              applyType={cardData.apply_type}
              imgStyle={{ maxWidth: "300px" }}
            />
          );

        default:
          return (
            <Image
              src={renderFrontCardImgByCardApplyType(
                cardData.apply_type,
                cardData.card_type_id
              )}
              style={{ maxWidth: "300px", width: "100%" }}
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
          style={{ maxWidth: "300px", width: "100%" }}
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
              imgStyle={{ maxWidth: "300px" }}
            />
          );

        case "3":
          return (
            <CardItemPhysicBack
              data={cardData.cardUser}
              isNotNeedClick={true}
              applyType={cardData.apply_type}
              imgStyle={{ maxWidth: "300px" }}
            />
          );

        default:
          return (
            <Image
              src={renderBackCardImgByCardApplyType(
                cardData.apply_type,
                cardData.card_type_id
              )}
              style={{ maxWidth: "300px", width: "100%" }}
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
          style={{ maxWidth: "300px", width: "100%" }}
        />
      );
    }
  };

  const renderBtnApplyVirtualCard = (d) => {
    if (!(d.apply_type == "1" || d.apply_type == "2")) {
      return null;
    }

    if (d?.cardUser) {
      return (
        <ButtonV3Primary
          isFullWidth={true}
          size={buttonV3Sizes.lg}
          styleTextContainer={{ padding: 0 }}
          onClick={() => {
            history.push(
              `/card-detail-v3?mcTradeNo=${d.cardUser.mc_trade_no}&cardTypeId=${d.cardUser.card_type_id}&id=${d.cardUser.id}&fname=${d.cardUser.first_name}&lname=${d.cardUser.last_name}&phone=${d.cardUser.mobile}&phoneCode=${d.cardUser.mobile_code}&email=${d.cardUser.email}&viewAll=1&applyType=${d.apply_type}`
            );
          }}
        >
          {t("product.t47")}
        </ButtonV3Primary>
      );
    } else if (d?.transactionCardUser) {
      return (
        <ButtonV3
          isFullWidth={true}
          size={buttonV3Sizes.lg}
          styleTextContainer={{ padding: 0 }}
          onClick={() => {
            history.push(
              `/card-detail-v3?mcTradeNo=${d.transactionCardUser.mc_trade_no}&cardTypeId=${d.transactionCardUser.card_type_id}&viewAll=0&applyType=${d.apply_type}`
            );
          }}
        >
          {t("product.t48")}
        </ButtonV3>
      );
    } else {
      return (
        <ButtonV3Primary
          isFullWidth={true}
          size={buttonV3Sizes.lg}
          styleTextContainer={{ padding: 0 }}
          onClick={handleClickBtnApplyVirtualCard(d)}
        >
          {IS_DOMAIN_PRODUCTION && d.apply_type == 3
            ? "Coming soon"
            : t("product.t49")}
        </ButtonV3Primary>
      );
    }
  };

  const renderBtnApplyPhysicCard = (d) => {
    if (d.apply_type != "3") {
      return null;
    }

    if (d.transactionCardUser) {
      if (d.transactionCardUser.typeTransaction == "binding") {
        return (
          <ButtonV3
            isFullWidth={true}
            size={buttonV3Sizes.lg}
            styleTextContainer={{ padding: 0 }}
            onClick={() =>
              history.push(
                `/kyc-card?cardTypeId=${d.card_type_id}&minFirstRecharge=${d.min_first_recharge_amount}&feeRecharge=${d.recharge_fee}&cardFee=${d.card_fee}&cardCurr=${d.card_coin}&applyType=${d.apply_type}`
              )
            }
          >
            KYC
          </ButtonV3>
        );
      } else if (d.transactionCardUser.typeTransaction == "pendingBindingKYC") {
        return (
          <ButtonV3
            isFullWidth={true}
            size={buttonV3Sizes.lg}
            styleTextContainer={{ padding: 0 }}
            style={{
              cursor: "default",
              backgroundColor: "#1a1a1a",
              color: "#fff",
            }}
          >
            {t("product.t50")}
          </ButtonV3>
        );
      } else if (d.transactionCardUser.typeTransaction == "faild") {
        return (
          <ButtonV3
            isFullWidth={true}
            size={buttonV3Sizes.lg}
            styleTextContainer={{ padding: 0 }}
            onClick={() => {
              // "r=true" đại diện cho card bị reject
              history.push(
                `/card-detail-v3?mcTradeNo=${d?.transactionCardUser?.mc_trade_no}&cardTypeId=${d?.transactionCardUser?.card_type_id}&id=${d?.transactionCardUser?.id}&fname=${d?.transactionCardUser?.first_name}&lname=${d?.transactionCardUser?.last_name}&phone=${d?.transactionCardUser?.mobile}&phoneCode=${d?.transactionCardUser?.mobile_code}&email=${d?.transactionCardUser?.email}&viewAll=1&applyType=${d.apply_type}&r=true`
              );
            }}
          >
            {t("product.t51.2")}
          </ButtonV3>
        );
      } else {
        return (
          <ButtonV3Primary
            isFullWidth={true}
            size={buttonV3Sizes.lg}
            styleTextContainer={{ padding: 0 }}
            onClick={() => {
              history.push(
                `/card-detail-v3?mcTradeNo=${d?.cardUser?.mc_trade_no}&cardTypeId=${d?.cardUser?.card_type_id}&id=${d?.cardUser?.id}&fname=${d?.cardUser?.first_name}&lname=${d?.cardUser?.last_name}&phone=${d?.cardUser?.mobile}&phoneCode=${d?.cardUser?.mobile_code}&email=${d?.cardUser?.email}&viewAll=1&applyType=${d.apply_type}`
              );
            }}
          >
            {t("product.t51")}
          </ButtonV3Primary>
        );
      }
    } else {
      return (
        <ButtonV3Primary
          isFullWidth={true}
          size={buttonV3Sizes.lg}
          styleTextContainer={{ padding: 0 }}
          className="btnInside"
          onClick={handleOpenModalLinked(d)}
        >
          {!isLogin ? t("product.t49") : t("product.t98")}
        </ButtonV3Primary>
      );
    }
  };

  const renderBtnRegisterOfPhysicCard = (d) => {
    if (!isLogin) return null;

    if (d.apply_type != "3") {
      return null;
    }

    // cập nhật 22/11/2024: nếu có thẻ rồi thì không cần hiển thị nút register nữa
    if (
      d.transactionCardUser &&
      d.transactionCardUser.typeTransaction == "BindingKYCSuccess"
    ) {
      return null;
    }

    return (
      <ButtonV3
        isFullWidth={true}
        size={buttonV3Sizes.lg}
        styleTextContainer={{ padding: 0 }}
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
      </ButtonV3>
    );
  };

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

  return {
    data,

    isOpenModal,
    isPendingGetData,
    isOpenModalLinked,

    togglePwd,
    setTogglePwd,

    isDisabledBtn,

    isOpenModalRegister,
    cardFee,

    handleCloseModalRegister,

    handleChangeInputField,
    handleRequestLinkToCard,
    renderBtnApplyVirtualCard,
    renderBtnApplyPhysicCard,
    renderBtnRegisterOfPhysicCard,

    setIsOpenModal,
    setCurrentCardFocus,
    handleCloseModalLinked,
    formDataLinked,
    isPendingLink,
    handleOpenModalRegister,

    eurToUsdRate,
    handleViewDetail,
    currentCardFocus,
    renderCardImgFront,
    renderTotalFee,
  };
};
