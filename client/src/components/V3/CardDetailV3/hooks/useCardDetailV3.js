import { message } from "antd";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import {
  ID_CARD_TYPE_4_PRODUCTION,
  ID_CARD_TYPE_4_TEST,
} from "src/components/NewVersion";
import { useDepositCard } from "src/components/NewVersion/CardManagement/CardCreatedSuccess/hooks/useDepositCard";
import { useOperations } from "src/components/NewVersion/CardManagement/CardCreatedSuccess/hooks/useOperations";
import { CardItemPhysicBack } from "src/components/NewVersion/CardManagement/CardItem/CardItemPhysicBack";
import { CardItemPhysicFront } from "src/components/NewVersion/CardManagement/CardItem/CardItemPhysicFront";
import { CardItemVirtualBack } from "src/components/NewVersion/CardManagement/CardItem/CardItemVirtualBack";
import { CardItemVirtualFront } from "src/components/NewVersion/CardManagement/CardItem/CardItemVirtualFront";
import { getBase64 } from "src/components/NewVersion/CardManagement/CardKYC/hooks/useStep2";
import { roundedDown } from "src/util/roundNumber";
import { axiosService } from "src/util/service";

// TODO nếu sửa logic ở đây thì nhớ sửa luôn ở file CardManageDetail (vì ở admin cũng render giao diện sử dụng component này vì khách muốn :)
export const useCardDetailV3 = () => {
  const topRef = useRef();
  const history = useHistory();
  const { search } = useLocation();
  const queryValues = queryString.parse(search);
  const [qrCodeCardGooglePay, setQrCodeCardGooglePay] = useState(null);
  const [cardDetailData, setCardDetailData] = useState(null); // lấy thông tin lúc tạo card (thành công, thất bại,...)
  const [balanceData, setBalanceData] = useState(null);
  const [isPendingGetCard, setIsPendingGetCard] = useState(true);
  const [isPendingGetBalance, setIsPendingGetBalance] = useState(true);
  const { handleRedirectDepositPage } = useDepositCard();
  const { handleRequestAction } = useOperations();
  const idFromUrl = queryValues.id;
  const { t } = useTranslation();
  const [isOpenModalUpload, setOpenModalUpload] = useState(false);
  const [proofAddress, setProofAddress] = useState(false);
  const [isPendingProof, setIsPendingProof] = useState(false);
  const [cardCVV, setCardCVV] = useState(null);
  const [cardDetailMoreData, setCardDetailMoreData] = useState(null); // lấy thông tin các field của card
  const [pinOfCardType4, setPinOfCardType4] = useState(null);
  const [messageErrorPinOfCardType4, setMessageErrorPinOfCardType4] =
    useState(null);
  const [isCanReKYC, setIsCanReKYC] = useState(false);
  const [isShowPin, setIsShowPin] = useState(false);
  const { eurToUsdRate } = useSelector((state) => state.globalReducer);

  const handleToggleShowPin = async () => {
    setIsShowPin(!isShowPin);
    if (
      cardDetailData?.result?.card_type_id === "72000002" &&
      isShowPin === false &&
      qrCodeCardGooglePay === null
    ) {
      const tokenRes = await axiosService.post("api/visaCard/getTokenCard", {
        card_id: cardDetailData?.result?.card_id,
        operation_type: 2,
      });

      // Hiển thị mã QR chứa token
      setQrCodeCardGooglePay(tokenRes.data.data.data);
    }
  };

  const pinText = isShowPin ? pinOfCardType4 : "";

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

  const handleViewCardInfo = async () => {
    if (!cardDetailData?.result?.card_id) return;

    try {
      // Chỉ gọi API getTokenCard cho card có id 72000001 (Thẻ Google Pay)
      if (cardDetailData?.result?.card_type_id === "72000001") {
        const tokenRes = await axiosService.post("api/visaCard/getTokenCard", {
          card_id: cardDetailData?.result?.card_id,
        });

        // Hiển thị mã QR chứa token
        setQrCodeCardGooglePay(tokenRes.data.data.data);
      } else {
        const res = await axiosService.post("api/visaCard/bankDetailCard", {
          card_id: cardDetailData?.result?.card_id,
        });

        setCardCVV(res.data.data.data.encoded_card_detail);
      }

      topRef?.current?.scrollIntoView({ behaviour: "smooth" });
    } catch (error) {
      message.error(error?.response?.data?.message);
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
          <>
            <div>
              <CardItemVirtualFront
                data={dataMapping}
                isNotNeedClick={true}
                applyType={queryValues.applyType}
              />
            </div>

            <div>
              <CardItemVirtualBack
                data={dataMapping}
                isNotNeedClick={true}
                cardInfo={cardCVV}
                applyType={queryValues.applyType}
              />
            </div>
          </>
        );

      // case "90000007":
      // case ID_CARD_TYPE_4_TEST:
      // case ID_CARD_TYPE_4_PRODUCTION:
      case "3":
        return (
          <>
            <div>
              <CardItemPhysicFront
                data={dataMapping}
                isNotNeedClick={true}
                applyType={queryValues.applyType}
              />
            </div>

            <div>
              <CardItemPhysicBack
                data={dataMapping}
                isNotNeedClick={true}
                cardInfo={cardCVV}
                applyType={queryValues.applyType}
              />
            </div>
          </>
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
      handleGetCardDetailMoreData();
    }
  }, [cardDetailData]);

  useEffect(() => {
    if (cardDetailData) {
      handleGetBalance(cardDetailData?.result?.card_id);
      handleGetPIN();
    }
  }, [cardDetailData]);

  return {
    qrCodeCardGooglePay,
    balanceData,
    isPendingGetCard,
    isPendingGetBalance,
    handleRedirectDepositPage,
    isOpenModalUpload,
    messageErrorPinOfCardType4,
    isCanReKYC,
    handleToggleShowPin,
    pinText,
    isShowReKYCButton,
    isOpenModalFreeze,
    isOpenModalUnfreeze,
    isOpenModalCancel,
    isOpenModalReport,
    isOpenModalReset,
    isOpenModalReIssue,
    isOpenModalResend,
    isPhysicCard,
    isShowReKYCButtonCardPhysic,
    handleClickMdw,
    handleViewCardInfo,
    handleChangeProof,
    handleRequestProof,
    handleRenderCardPreview,
    handleClickBtnReKyc,
    handleClickBtnReKycPhysicCard,
    renderOtherBalance,
    cardDetailData,
    t,
    idFromUrl,
    cardDetailMoreData,
    queryValues,
    setOpenModalUpload,
    isShowPin,
    proofAddress,
    isPendingProof,
    setIsOpenModalFreeze,
    setIsOpenModalUnfreeze,
    setIsOpenModalCancel,
    setIsOpenModalReport,
    setIsOpenModalReset,
    setIsOpenModalReIssue,
    setIsOpenModalResend,
    topRef,
    handleOpenModalMdw,
  };
};
