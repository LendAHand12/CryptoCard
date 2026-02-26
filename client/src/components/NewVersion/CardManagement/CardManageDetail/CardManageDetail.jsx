import {
  Button,
  Descriptions,
  Image,
  message,
  Modal,
  Spin,
  Upload,
} from "antd";
import "./CardManageDetail.scss";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import { useFadedIn } from "src/hooks/useFadedIn";
import { useRedirectHomeIfNotLogin } from "src/hooks/useRedirectHomeIfNotLogin";
import { useEffect, useMemo, useState } from "react";
import queryString from "query-string";
import { axiosService } from "src/util/service";
import {
  CardHistoryPayment,
  renderBillingMode,
  renderCardType,
  renderCardTypeByApplyType,
  renderCardTypeId,
  renderOperationType,
} from "..";
import { useDepositCard } from "../CardCreatedSuccess/hooks/useDepositCard";
import { useDetailCard } from "../CardCreatedSuccess/hooks/useDetailCard";
import { useOperations } from "../CardCreatedSuccess/hooks/useOperations";
import { CardItemVirtualFront } from "../CardItem/CardItemVirtualFront";
import { CardItemVirtualBack } from "../CardItem/CardItemVirtualBack";
import { CardItemPhysicFront } from "../CardItem/CardItemPhysicFront";
import { CardItemPhysicBack } from "../CardItem/CardItemPhysicBack";
import { CardHistoryDepositDetail } from "../CardHistoryDepositDetail/CardHistoryDepositDetail";
import { useTranslation } from "react-i18next";
import { beforeUpload } from "../CardKYC/Step2";
import { getBase64 } from "../CardKYC/hooks/useStep2";
import axios from "axios";
import i18n from "src/translation/i18n";
import { CardHistoryOperation } from "../CardHistoryOperation/CardHistoryOperation";
import { ID_CARD_TYPE_4_PRODUCTION, ID_CARD_TYPE_4_TEST } from "../..";
import { useSelector } from "react-redux";
import { roundedDown, roundedUp } from "src/util/roundNumber";

export const renderCardStatusDetail = (cardStatus) => {
  switch (cardStatus) {
    case 0:
      // return "Opening – Pre Apply";
      return i18n.t("outsideComponent.t48");
    case 1:
      // return "Opening – Pending for payment";
      return i18n.t("outsideComponent.t49");
    case 2:
      // return "Opening - Reviewing";
      return i18n.t("outsideComponent.t50");
    case 3:
      // return "Opening – Reviewed - Success";
      return i18n.t("outsideComponent.t51");
    case 4:
      // return "Opening – Reviewed - Rejected";
      return i18n.t("outsideComponent.t52");
    case 5:
      // return "Opening - Refunded";
      return i18n.t("outsideComponent.t53");
    case 6:
      // return "Opening - Shipped";
      return i18n.t("outsideComponent.t54");
    case 7:
      // return "Opening - Activating";
      return i18n.t("outsideComponent.t55");
    case 8:
      // return "Opening – Activation fails";
      return i18n.t("outsideComponent.t56");
    case 9:
      // return "Opening - Activated";
      return i18n.t("outsideComponent.t57");
    case 10:
      // return "Freeze";
      return i18n.t("outsideComponent.t58");
    case 11:
      // return "Activation - Reviewing";
      return i18n.t("outsideComponent.t59");
    case 12:
      // return "Activation – Reviewed - Rejected";
      return i18n.t("outsideComponent.t60");
    case 13:
      // return "Activation – Reviewed - Success";
      return i18n.t("outsideComponent.t61");
    case 14:
      // return "Cancelling Card";
      return i18n.t("outsideComponent.t62");
    case 15:
      // return "Cancelled Card";
      return i18n.t("outsideComponent.t63");
    case 21:
      // return "Refund - Reviewing";
      return i18n.t("outsideComponent.t64");
    case 22:
      // return "Refund – Reviewed - Rejected";
      return i18n.t("outsideComponent.t65");
    case 23:
      // return "Refund – Reviewed - Success";
      return i18n.t("outsideComponent.t66");
    case 24:
      // return "Opening - Wait Attachment";
      return i18n.t("outsideComponent.t67");
    case 30:
      // return "Wait for recharge";
      return i18n.t("outsideComponent.t68");
    default:
      return null;
  }
};

export const CardManageDetail = () => {
  const { domRef } = useFadedIn();
  const history = useHistory();
  const { isLogin } = useRedirectHomeIfNotLogin();
  const { search } = useLocation();
  const queryValues = queryString.parse(search);
  const [cardDetailData, setCardDetailData] = useState(null); // lấy thông tin lúc tạo card (thành công, thất bại,...)
  const [balanceData, setBalanceData] = useState(null);
  const [isPendingGetCard, setIsPendingGetCard] = useState(true);
  const [isPendingGetBalance, setIsPendingGetBalance] = useState(true);
  const { handleRedirectDepositPage } = useDepositCard();
  const { handleRedirectDetail } = useDetailCard();
  const { handleRequestAction } = useOperations();
  const idFromUrl = queryValues.id;
  const minDeposit = queryValues.minDeposit;
  const { t } = useTranslation();
  const [isOpenModalUpload, setOpenModalUpload] = useState(false);
  const [proofAddress, setProofAddress] = useState(false);
  const [isPendingProof, setIsPendingProof] = useState(false);
  const [toggleFrontCard, setToggleFrontCard] = useState(true);
  const [cardCVV, setCardCVV] = useState(null);
  const [cardDetailMoreData, setCardDetailMoreData] = useState(null); // lấy thông tin các field của card
  const [pinOfCardType4, setPinOfCardType4] = useState(null);
  const [messageErrorPinOfCardType4, setMessageErrorPinOfCardType4] =
    useState(null);
  const [isCanReKYC, setIsCanReKYC] = useState(false);
  const [isShowPin, setIsShowPin] = useState(false);
  const { eurToUsdRate } = useSelector((state) => state.globalReducer);

  const handleToggleShowPin = () => {
    setIsShowPin(!isShowPin);
  };

  const pinText = isShowPin ? pinOfCardType4 : "****";

  const isShowReKYCButton = cardDetailMoreData
    ? cardDetailMoreData.apply_type === 1
    : false;

  const [isOpenModalFreeze, setIsOpenModalFreeze] = useState(false);
  const [isOpenModalUnfreeze, setIsOpenModalUnfreeze] = useState(false);
  const [isOpenModalCancel, setIsOpenModalCancel] = useState(false);
  const [isOpenModalReport, setIsOpenModalReport] = useState(false);
  const [isOpenModalReset, setIsOpenModalReset] = useState(false);
  const [isOpenModalReIssue, setIsOpenModalReIssue] = useState(false);
  const [isOpenModalResend, setIsOpenModalResend] = useState(false);
  const [actionFocus, setActionFocus] = useState(null);

  const isRenderByAdmin = queryValues.isRenderByAdmin == "true";

  const isPhysicCard = cardDetailMoreData?.apply_type == "3";
  const isCardRejected = queryValues.r ? queryValues.r === "true" : false;

  // 4/11/2024 vì API trả về null nên bắt buộc phải lấy field trên URL trên xem coi nó có bị reject k (nếu ở ngoài trang product có trạng thái là "faild" và là card physic)
  const isShowReKYCButtonCardPhysic =
    queryValues?.applyType == 3 && isCardRejected;
  const cardTypeIdPhysic = queryValues?.cardTypeId;

  const handleOpenModalMdw = (action) => () => {
    switch (action) {
      // freeze
      case 1:
        setIsOpenModalFreeze(true);
        break;

      // unfreeze
      case 2:
        setIsOpenModalUnfreeze(true);
        break;

      // cancel
      case 9:
        setIsOpenModalCancel(true);
        break;

      // report
      case 3:
        setIsOpenModalReport(true);
        break;

      // reset
      case 4:
        setIsOpenModalReset(true);
        break;

      // re-issue
      case 5:
        setIsOpenModalReIssue(true);
        break;

      // resend
      case 6:
        setIsOpenModalReIssue(true);
        break;

      default:
        break;
    }
  };

  const handleClickMdw = (action) => () => {
    if (isRenderByAdmin) {
      message.error("No permission");
      return;
    }

    setActionFocus(Number(action));
    handleRequestAction(idFromUrl, action)();
  };

  const renderBtnsCard = useMemo(() => {
    if (!cardDetailMoreData) return null;

    const actions = cardDetailMoreData.support_business.split(",");

    return actions.map((action) => {
      return (
        <div
          className="btnInside"
          // onClick={handleClickMdw(action)}
          onClick={handleOpenModalMdw(Number(action))}
          key={action}
        >
          {renderOperationType(Number(action))}
        </div>
      );
    });
  }, [cardDetailMoreData]);

  const handleGetPIN = async () => {
    if (
      queryValues.cardTypeId == ID_CARD_TYPE_4_TEST ||
      queryValues.cardTypeId == ID_CARD_TYPE_4_PRODUCTION
    ) {
      try {
        const res = await axiosService.post("api/visaCard/queryPinToCard", {
          cardId: cardDetailData?.result?.card_id,
        });

        // don't know what field will response!
        if (res?.data?.data?.data?.card_pin) {
          setPinOfCardType4(res?.data?.data?.data?.card_pin || "");
        } else if (res?.data?.data?.data?.cardPin) {
          setPinOfCardType4(res?.data?.data?.data?.cardPin || "");
        } else if (res?.data?.data?.cardPin) {
          setPinOfCardType4(res?.data?.data?.data?.cardPin || "");
        } else {
          setPinOfCardType4(res?.data?.data?.card_pin || "");
        }

        // assume msg != null
        if (res?.data?.data?.msg != "ok") {
          setMessageErrorPinOfCardType4(res?.data?.data?.msg);
        }
      } catch (error) {}
    }
  };

  const handleShowPin = () => {
    if (!pinOfCardType4) {
      return;
    }

    message.destroy();
    message.info(`Your PIN is ${pinOfCardType4}`);
  };

  const handleGetCardDetailMoreData = async () => {
    if (!cardDetailData?.result?.card_type_id) return;

    try {
      const res = await axiosService.post("api/visaCard/listCardToType", {
        card_type_id: cardDetailData?.result?.card_type_id,
      });

      setCardDetailMoreData(res.data.data.data[0]);
    } catch (error) {}
  };

  useEffect(() => {
    if (cardDetailData) {
      handleGetCardDetailMoreData();
    }
  }, [cardDetailData]);

  const handleViewCardInfo = async () => {
    if (!cardDetailData?.result?.card_id) return;

    try {
      const res = await axiosService.post("api/visaCard/bankDetailCard", {
        card_id: cardDetailData?.result?.card_id,
      });

      setCardCVV(res.data.data.data.encoded_card_detail);
    } catch (error) {
      message.error(error?.resposne?.data?.message);
    }
  };

  const handleChangeProof = (info) => {
    if (info.file.status !== "uploading") {
      getBase64(info.file, (url) => {
        setProofAddress(url);
      });
    }
  };

  const handleRequestProof = async () => {
    if (!proofAddress) return;

    if (isPendingProof) return;

    setIsPendingProof(true);
    try {
      const res = await axiosService.post("api/visaCard/attachmentUpload", {
        mc_trade_no: queryValues.mcTradeNo,
        attachment: proofAddress.split("base64,")[1],
      });

      await handleGetData();
      message.success(res.data.message);
      setIsPendingProof(false);
      setOpenModalUpload(false);
    } catch (error) {
      message.error(error?.response?.data?.message);
      setIsPendingProof(false);
    }
  };

  const handleGetData = async () => {
    setIsPendingGetCard(true);
    try {
      const res = await axiosService.post(
        `api/visaCard/cardApplicationResults`,
        { mc_trade_no: queryValues.mcTradeNo }
      );

      // TODO REMOVE
      // MOCK
      // const mockRes = {
      //   ...res.data.data.data,
      //   result: {
      //     ...res.data.data.data.result,
      //     card_status: 4,
      //     fail_reason: "TEST MOCK",
      //   },
      // };
      // setCardDetailData(mockRes);

      // if (mockRes.result?.card_status === 4) {
      //   setIsCanReKYC(true);
      // }

      // TODO open then
      setCardDetailData(res.data.data.data);

      if (res?.data?.data?.data?.result?.card_status === 4) {
        setIsCanReKYC(true);
      }

      setTimeout(() => {
        setIsPendingGetCard(false);
      }, 300);
    } catch (error) {
      message.error(error?.response?.data?.message);
      setIsPendingGetCard(false);
    }
  };

  const handleGetBalance = async (cardId) => {
    setIsPendingGetBalance(true);
    try {
      const res = await axiosService.post("api/visaCard/getBalanceVisa", {
        card_id: cardId,
      });

      setBalanceData(res.data.data.data);

      setTimeout(() => {
        setIsPendingGetBalance(false);
      }, 300);
    } catch (error) {
      message.error(error?.response?.data?.message);

      setIsPendingGetBalance(false);
    }
  };

  const handleToggleCard = () => {
    setToggleFrontCard(!toggleFrontCard);
  };

  const handleRenderCardPreview = () => {
    const dataMapping = {
      mc_trade_no: queryValues.mcTradeNo || "",
      card_type_id: queryValues.cardTypeId || "",
      first_name: queryValues.fname || "",
      last_name: queryValues.lname || "",
      mobile: queryValues.phone || "",
      mobile_code: queryValues.phoneCode || "",
      email: queryValues.email || "",
      id: queryValues.id || "",
      card_number_hiden: cardDetailData?.result?.card_number || "",
    };

    // switch (queryValues.cardTypeId) {
    switch (queryValues.applyType) {
      // case "88990001":
      // case "88990003":
      case "1":
      case "2":
        return (
          <div className="wrappedCard">
            <div
              onClick={handleToggleCard}
              style={{ display: toggleFrontCard ? "block" : "none" }}
            >
              <div className="titleInside">{t("cardVisaDetail.t1")}</div>
              <CardItemVirtualFront
                data={dataMapping}
                isNotNeedClick={true}
                applyType={queryValues.applyType}
              />
            </div>

            <div
              onClick={handleToggleCard}
              style={{ display: !toggleFrontCard ? "block" : "none" }}
            >
              <div className="titleInside">{t("cardVisaDetail.t2")}</div>
              <CardItemVirtualBack
                data={dataMapping}
                isNotNeedClick={true}
                cardInfo={cardCVV}
                applyType={queryValues.applyType}
              />
            </div>
          </div>
        );

      // case "90000007":
      // case ID_CARD_TYPE_4_TEST:
      // case ID_CARD_TYPE_4_PRODUCTION:
      case "3":
        return (
          <div className="wrappedCard">
            <div
              onClick={handleToggleCard}
              style={{ display: toggleFrontCard ? "block" : "none" }}
            >
              <div className="titleInside">{t("cardVisaDetail.t1")}</div>
              <CardItemPhysicFront
                data={dataMapping}
                isNotNeedClick={true}
                applyType={queryValues.applyType}
              />
            </div>

            <div
              onClick={handleToggleCard}
              style={{ display: !toggleFrontCard ? "block" : "none" }}
            >
              <div className="titleInside">{t("cardVisaDetail.t2")}</div>
              <CardItemPhysicBack
                data={dataMapping}
                isNotNeedClick={true}
                cardInfo={cardCVV}
                applyType={queryValues.applyType}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleClickBtnReKyc = () => {
    history.push(`/re-kyc?cardTypeId=${cardDetailMoreData.card_type_id}`);
  };

  const handleClickBtnReKycPhysicCard = () => {
    history.push(`/re-kyc-type-physic?cardTypeId=${cardTypeIdPhysic}`);
  };

  const renderOtherBalance = (data) => {
    
    
    if (!data || !eurToUsdRate) return null;
    switch (data.card_currency) {
      case "usd":
        return `${roundedDown(data.current_balance * eurToUsdRate, 2)} EUR`;
      case "eur":
        return `${roundedDown(data.current_balance / eurToUsdRate, 2)} USDT`;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (
      !queryValues.mcTradeNo ||
      !queryValues.cardTypeId ||
      !queryValues.applyType
    ) {
      history.push("/my-card-v3");
    }
  }, []);

  useEffect(() => {
    handleGetData();
  }, []);

  useEffect(() => {
    if (cardDetailData) {
      handleGetBalance(cardDetailData?.result?.card_id);
      handleGetPIN();
    }
  }, [cardDetailData]);

  if (!isLogin) {
    return null;
  }

  return (
    <div className="containerV2">
      <div className="cardManageDetailContainer" ref={domRef}>
        <div className="titleV2">{t("cardVisaDetail.t3")}</div>

        {cardDetailData && (
          <div className="sectionIntro">
            <div className="titleInside">{t("cardVisaDetail.t26")}</div>
            {isPendingGetBalance && <div>{t("cardVisaDetail.t27")}</div>}
            {!isPendingGetBalance && (
              <Descriptions
                column={1}
                size={window.innerWidth < 600 ? "small" : "default"}
                bordered
                className="customAntdDesc"
              >
                {/* <Descriptions.Item
                  label={
                    <div className="labelInsideV2">
                      {t("cardVisaDetail.t28")}
                    </div>
                  }
                >
                  <div className="contentInsideV2">
                    {Number(
                      Number(balanceData?.available_balance || 0).toFixed(3)
                    ).toLocaleString("en-US")}{" "}
                    {balanceData?.card_currency.toUpperCase()}
                  </div>
                </Descriptions.Item> */}
                <Descriptions.Item
                  label={
                    <div className="labelInsideV2">
                      {t("cardVisaDetail.t29")}
                    </div>
                  }
                >
                  <div className="contentInsideV2">
                    <span>
                      {Number(
                        Number(balanceData?.current_balance || 0).toFixed(3)
                      ).toLocaleString("en-US")}{" "}
                    </span>
                    <span>
                      {balanceData?.card_currency
                        ?.replace("usd", "usdt")
                        .toUpperCase()}
                    </span>
                    <span> - {renderOtherBalance(balanceData)}</span>
                  </div>
                </Descriptions.Item>
              </Descriptions>
            )}
          </div>
        )}

        {cardDetailData && idFromUrl && (
          <div className="sectionPreview">
            <div className="titleInside">{t("cardVisaDetail.t4")}</div>
            <div className="cardItems">{handleRenderCardPreview()}</div>
          </div>
        )}

        {cardDetailData && idFromUrl && cardDetailMoreData && (
          <div className="sectionActions">
            <div className="titleInside">{t("cardVisaDetail.t5")}</div>
            <div className="actions">
              <div
                className="btnInside"
                onClick={handleRedirectDepositPage(
                  idFromUrl,
                  cardDetailMoreData?.min_single_recharge_amount,
                  cardDetailMoreData?.recharge_fee,
                  cardDetailMoreData?.card_coin
                )}
              >
                {t("cardVisaDetail.t6")}
              </div>

              {!isPhysicCard && queryValues.applyType != "3" && (
                <div className="btnInside" onClick={handleViewCardInfo}>
                  View CVV
                </div>
              )}

              {/* {(queryValues.cardTypeId === ID_CARD_TYPE_4_PRODUCTION ||
                queryValues.cardTypeId === ID_CARD_TYPE_4_TEST) && (
                <div className="btnInside" onClick={handleShowPin}>
                  PIN
                </div>
              )} */}

              {renderBtnsCard}
            </div>
          </div>
        )}

        <div className="sectionIntro">
          <div className="titleInside">{t("cardVisaDetail.t13")}</div>
          {isPendingGetCard && <div>{t("cardVisaDetail.t14")}</div>}
          {!isPendingGetCard && (
            <Descriptions
              column={1}
              size={window.innerWidth < 600 ? "small" : "default"}
              bordered
              className="customAntdDesc"
            >
              {cardDetailData?.result?.fail_reason !== "" && (
                <Descriptions.Item
                  label={
                    <div className="labelInsideV2">
                      {t("cardVisaDetail.t20")}
                    </div>
                  }
                >
                  <div className="contentInsideV2">
                    {cardDetailData?.result?.fail_reason}
                  </div>
                </Descriptions.Item>
              )}

              <Descriptions.Item
                label={
                  <div className="labelInsideV2">{t("cardVisaDetail.t15")}</div>
                }
              >
                <div className="contentInsideV2">{queryValues.mcTradeNo}</div>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <div className="labelInsideV2">{t("cardVisaDetail.t16")}</div>
                }
              >
                <div className="contentInsideV2">
                  {cardDetailData?.result?.card_id || "-"}
                </div>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <div className="labelInsideV2">{t("cardVisaDetail.t17")}</div>
                }
              >
                <div className="contentInsideV2">
                  {cardDetailData?.result?.card_number || "-"}
                </div>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <div className="labelInsideV2">{t("cardVisaDetail.t18")}</div>
                }
              >
                <div
                  className="contentInsideV2"
                  style={{ display: "flex", gap: "16px", alignItems: "center" }}
                >
                  <div>
                    {renderCardStatusDetail(
                      cardDetailData?.result?.card_status
                    )}
                  </div>
                  {cardDetailData?.result?.card_status === 24 && (
                    <div
                      className="btnInside"
                      style={{ width: "fit-content", marginTop: "8px" }}
                      onClick={() => setOpenModalUpload(true)}
                    >
                      Upload
                    </div>
                  )}

                  {isShowReKYCButton && isCanReKYC && (
                    <div className="btnInside" onClick={handleClickBtnReKyc}>
                      Re-KYC
                    </div>
                  )}

                  {isShowReKYCButtonCardPhysic && (
                    <div
                      className="btnInside"
                      onClick={handleClickBtnReKycPhysicCard}
                    >
                      Re-KYC
                    </div>
                  )}
                </div>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <div className="labelInsideV2">{t("cardVisaDetail.t19")}</div>
                }
              >
                <div className="contentInsideV2">
                  {/* {renderCardTypeId(cardDetailData?.result.card_type_id)} */}
                  {renderCardTypeByApplyType(
                    cardDetailMoreData?.apply_type || ""
                  )}
                </div>
              </Descriptions.Item>

              {cardDetailData && (
                <>
                  <Descriptions.Item
                    label={
                      <div className="labelInsideV2">
                        {t("cardVisaDetail.t21")}
                      </div>
                    }
                  >
                    <div className="contentInsideV2">{queryValues.email}</div>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <div className="labelInsideV2">
                        {t("cardVisaDetail.t22")}
                      </div>
                    }
                  >
                    <div className="contentInsideV2">{queryValues.fname}</div>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <div className="labelInsideV2">
                        {t("cardVisaDetail.t23")}
                      </div>
                    }
                  >
                    <div className="contentInsideV2">{queryValues.lname}</div>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <div className="labelInsideV2">
                        {t("cardVisaDetail.t24")}
                      </div>
                    }
                  >
                    <div className="contentInsideV2">{queryValues.phone}</div>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <div className="labelInsideV2">
                        {t("cardVisaDetail.t25")}
                      </div>
                    }
                  >
                    <div className="contentInsideV2">
                      {queryValues.phoneCode}
                    </div>
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>
          )}
        </div>

        {cardDetailData && queryValues.applyType == 3 && (
          <div>
            {messageErrorPinOfCardType4 != null && (
              <div
                style={{
                  color: "#ff5d5d",
                  fontStyle: "italic",
                  fontSize: "14px",
                  marginBottom: "8px",
                }}
              >
                *{messageErrorPinOfCardType4}
              </div>
            )}
            <div
              style={{
                marginBottom: "36px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div>PIN</div>
              <input
                // value={pinOfCardType4}
                value={pinText}
                style={{
                  color: "white",
                  background: "transparent",
                  outline: "none",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "2px 4px",
                }}
              />

              <div
                style={{
                  textDecoration: "underline",
                  color: "#f4e096",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={handleToggleShowPin}
              >
                {isShowPin ? "Hide" : "Show"}
              </div>
            </div>
          </div>
        )}

        {cardDetailData && idFromUrl && (
          <div className="sectionCardHistoryDepositDetail">
            <div className="titleInside">{t("cardVisaDetail.t31")}</div>
            <CardHistoryDepositDetail
              cardId={cardDetailData?.result?.card_id}
              cardTypeId={queryValues.cardTypeId}
              cardCoin={cardDetailMoreData?.card_coin}
            />
          </div>
        )}

        {cardDetailData && idFromUrl && (
          <div className="sectionCardHistoryDepositDetail">
            <div className="titleInside">{t("historyOperation.t1")}</div>
            <CardHistoryOperation idApi={queryValues.id} />
          </div>
        )}

        {cardDetailData && idFromUrl && (
          <div className="sectionCardHistoryDepositDetail">
            <div className="titleInside">{t("historyPayment.t1")}</div>
            <CardHistoryPayment
              cardId={cardDetailData?.result?.card_id}
              cardCoin={cardDetailMoreData?.card_coin}
            />
          </div>
        )}
      </div>

      <Modal
        title={"Upload proof of home address verification"}
        open={isOpenModalUpload}
        footer={false}
        onCancel={() => {
          setOpenModalUpload(false);
        }}
      >
        <div className="uploadProofAddress">
          <div className="item">
            <div className="label">Upload image</div>

            <div className="card">
              <Upload
                customRequest={() => {}}
                accept="image/*"
                style={{ width: "100%" }}
                maxCount={1}
                onChange={handleChangeProof}
                beforeUpload={beforeUpload}
              >
                <div className="containImg" style={{ cursor: "pointer" }}>
                  <img
                    className="placeholderImg"
                    src="/img/newVersion/holdU.png"
                  />
                </div>
              </Upload>

              <Image className="imgPreview" src={proofAddress} />
            </div>
          </div>

          <button
            className="btnInside"
            disabled={!proofAddress}
            onClick={handleRequestProof}
          >
            {isPendingProof ? <Spin /> : "Upload"}
          </button>
        </div>
      </Modal>

      <Modal
        title={"Freeze"}
        open={isOpenModalFreeze}
        footer={false}
        onCancel={() => {
          setIsOpenModalFreeze(false);
        }}
      >
        <div>
          <div style={{ color: "#fff", padding: "16px" }}>
            Are you sure you want to freeze your cryptocard? Your cryptocard
            will temporarily disable, and you will not be able to make
            transactions until it is unfrozen. If you want to continue, click
            confirm
          </div>

          <div style={{ padding: "8px 0" }}>
            <div
              style={{
                backgroundColor: "#f4e096",
                padding: "8px 24px",
                borderRadius: "4px",
                color: "#000",
                fontWeight: 600,
                textAlign: "center",
                margin: "0 16px",
                marginBottom: "16px",
                cursor: "pointer",
              }}
              onClick={handleClickMdw(1)}
            >
              Confirm
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title={"Unfreeze"}
        open={isOpenModalUnfreeze}
        footer={false}
        onCancel={() => {
          setIsOpenModalUnfreeze(false);
        }}
      >
        <div>
          <div style={{ color: "#fff", padding: "16px" }}>
            Are you sure you want to unfreeze your cryptocard? Unfreezing your
            cryptocard will reactivate it, allowing you to resume transactions.
            If you want to continue, click confirm
          </div>

          <div style={{ padding: "8px 0" }}>
            <div
              style={{
                backgroundColor: "#f4e096",
                padding: "8px 24px",
                borderRadius: "4px",
                color: "#000",
                fontWeight: 600,
                textAlign: "center",
                margin: "0 16px",
                marginBottom: "16px",
                cursor: "pointer",
              }}
              onClick={handleClickMdw(2)}
            >
              Confirm
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title={"Cancel Card"}
        open={isOpenModalCancel}
        footer={false}
        onCancel={() => {
          setIsOpenModalCancel(false);
        }}
      >
        <div>
          <div style={{ color: "#fff", padding: "16px" }}>
            Are you sure you want to cancel your cryptocard? Canceling your
            cryptocard is a permanent action. Once canceled, you will not be
            able to reactivate the card. If you want to continue, click confirm
          </div>

          <div style={{ padding: "8px 0" }}>
            <div
              style={{
                backgroundColor: "#f4e096",
                padding: "8px 24px",
                borderRadius: "4px",
                color: "#000",
                fontWeight: 600,
                textAlign: "center",
                margin: "0 16px",
                marginBottom: "16px",
                cursor: "pointer",
              }}
              onClick={handleClickMdw(9)}
            >
              Confirm
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title={"Report loss"}
        open={isOpenModalReport}
        footer={false}
        onCancel={() => {
          setIsOpenModalReport(false);
        }}
      >
        <div>
          <div style={{ padding: "8px 0" }}>
            <div
              style={{
                backgroundColor: "#f4e096",
                padding: "8px 24px",
                borderRadius: "4px",
                color: "#000",
                fontWeight: 600,
                textAlign: "center",
                margin: "0 16px",
                marginBottom: "16px",
                cursor: "pointer",
              }}
              onClick={handleClickMdw(3)}
            >
              Confirm
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title={"Reset password"}
        open={isOpenModalReset}
        footer={false}
        onCancel={() => {
          setIsOpenModalReset(false);
        }}
      >
        <div>
          <div style={{ padding: "8px 0" }}>
            <div
              style={{
                backgroundColor: "#f4e096",
                padding: "8px 24px",
                borderRadius: "4px",
                color: "#000",
                fontWeight: 600,
                textAlign: "center",
                margin: "0 16px",
                marginBottom: "16px",
                cursor: "pointer",
              }}
              onClick={handleClickMdw(4)}
            >
              Confirm
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title={"Re-issue"}
        open={isOpenModalReIssue}
        footer={false}
        onCancel={() => {
          setIsOpenModalReIssue(false);
        }}
      >
        <div>
          <div style={{ padding: "8px 0" }}>
            <div
              style={{
                backgroundColor: "#f4e096",
                padding: "8px 24px",
                borderRadius: "4px",
                color: "#000",
                fontWeight: 600,
                textAlign: "center",
                margin: "0 16px",
                marginBottom: "16px",
                cursor: "pointer",
              }}
              onClick={handleClickMdw(5)}
            >
              Confirm
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title={"Resend PIN"}
        open={isOpenModalResend}
        footer={false}
        onCancel={() => {
          setIsOpenModalResend(false);
        }}
      >
        <div>
          <div style={{ padding: "8px 0" }}>
            <div
              style={{
                backgroundColor: "#f4e096",
                padding: "8px 24px",
                borderRadius: "4px",
                color: "#000",
                fontWeight: 600,
                textAlign: "center",
                margin: "0 16px",
                marginBottom: "16px",
                cursor: "pointer",
              }}
              onClick={handleClickMdw(6)}
            >
              Confirm
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
