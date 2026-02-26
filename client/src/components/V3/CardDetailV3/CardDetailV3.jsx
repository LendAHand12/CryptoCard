import { ButtonV3, buttonV3Sizes } from "../ButtonV3/ButtonV3";
import "./CardDetailV3.scss";
import i31 from "src/assets/v3/i31.png";
import { useCardDetailV3 } from "./hooks/useCardDetailV3";
import { Image, Modal, Spin, Upload } from "antd";
import {
  CardHistoryOperation,
  CardHistoryPayment,
  renderCardStatusDetail,
  renderCardTypeByApplyType,
  renderOperationType,
} from "src/components/NewVersion";
import { CardHistoryDepositDetail } from "src/components/NewVersion/CardManagement/CardHistoryDepositDetail/CardHistoryDepositDetail";
import { beforeUpload } from "src/components/admin/AdminKycUser/Step2";
import { useTranslation } from "react-i18next";
import { ModalV3 } from "../ModalV3/ModalV3";
import i45 from "src/assets/v3/i45.png";
import QRCode from "react-qr-code";

export const CardDetailV3 = () => {
  const {
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
    qrCodeCardGooglePay,
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
  } = useCardDetailV3();

  const renderBalance = () => {
    if (!cardDetailData || isPendingGetBalance) return null;

    return (
      <span>
        <span>
          {Number(
            Number(balanceData?.current_balance || 0).toFixed(3)
          ).toLocaleString("en-US")}{" "}
        </span>
        <span>
          {balanceData?.card_currency?.replace("usd", "usdt").toUpperCase()}
        </span>
        {Boolean(balanceData) && (
          <span> - {renderOtherBalance(balanceData)}</span>
        )}
      </span>
    );
  };

  const renderMessageErrorCardPin = () => {
    if (messageErrorPinOfCardType4 == null) return;

    return (
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
    );
  };

  const renderCardPin = () => {
    if (!cardDetailData || queryValues.applyType != 3) {
      return null;
    }

    return (
      <div>
        <>{renderMessageErrorCardPin()}</>
        <div className="pin">
          <div className="title">{t("cardDetailV3.t1")}</div>

          <div className="value">
            <div style={{ width: "40px", lineHeight: "1", height: "15px" }}>
              {pinText}
            </div>

            <div className="toggleEye" onClick={handleToggleShowPin}>
              {isShowPin ? (
                <i class="fa-regular fa-eye"></i>
              ) : (
                <i class="fa-regular fa-eye-slash"></i>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderButtons = () => {
    const isShowBtnViewCVV = !isPhysicCard && queryValues.applyType != "3";

    const actions = cardDetailMoreData
      ? cardDetailMoreData.support_business.split(",")
      : [];

    const buttonsOfBusiness = actions.map((action, idx) => {
      return (
        <ButtonV3
          size={buttonV3Sizes.lg}
          isFullWidth={true}
          onClick={handleOpenModalMdw(Number(action))}
          key={idx}
        >
          <span className="text-gradient-t-b text-center text-xs">
            {renderOperationType(Number(action))}
          </span>
        </ButtonV3>
      );
    });

    return (
      <>
        <>
          {/* DEPOSIT */}
          <ButtonV3
            size={buttonV3Sizes.lg}
            isFullWidth={true}
            onClick={handleRedirectDepositPage(
              idFromUrl,
              cardDetailMoreData?.min_single_recharge_amount,
              cardDetailMoreData?.recharge_fee,
              cardDetailMoreData?.card_coin
            )}
          >
            <span className="text-gradient-t-b text-center text-xs">
              {t("cardVisaDetail.t6")}
            </span>
          </ButtonV3>
        </>

        <>
          {/* VIEW CVV */}
          {isShowBtnViewCVV && (
            <ButtonV3
              size={buttonV3Sizes.lg}
              isFullWidth={true}
              onClick={handleViewCardInfo}
            >
              <span className="text-gradient-t-b text-center text-xs">
                {t("cardDetailV3.t2")}
              </span>
            </ButtonV3>
          )}
        </>

        <>{buttonsOfBusiness}</>
      </>
    );
  };

  const renderCardDetails = () => {
    const isHasCardDetailData = cardDetailData;
    const isShowBtnUpload = cardDetailData?.result?.card_status === 24;
    const isShowReasonFail = cardDetailData?.result?.fail_reason !== "";

    if (isPendingGetCard) {
      return (
        <div className="rowItem">
          <div style={{ flex: "1", textAlign: "center" }}>{t("noData")}</div>
        </div>
      );
    }

    return (
      <>
        <>
          {isShowReasonFail && (
            <div className="rowItem">
              <div className="label">{t("cardVisaDetail.t20")}</div>
              <div className="value">{cardDetailData?.result?.fail_reason}</div>
            </div>
          )}
        </>

        <div className="rowItem">
          <div className="label">{t("cardVisaDetail.t15")}</div>
          <div className="value">{queryValues.mcTradeNo}</div>
        </div>

        <div className="rowItem">
          <div className="label">{t("cardVisaDetail.t16")}</div>
          <div className="value">{cardDetailData?.result?.card_id || "-"}</div>
        </div>

        <div className="rowItem">
          <div className="label">{t("cardVisaDetail.t17")}</div>
          <div className="value">
            {cardDetailData?.result?.card_number || "-"}
          </div>
        </div>

        <div className="rowItem">
          <div className="label">{t("cardVisaDetail.t18")}</div>
          <div className="value">
            <div>
              {renderCardStatusDetail(cardDetailData?.result?.card_status)}
            </div>

            {isShowBtnUpload && (
              <ButtonV3
                isFullWidth={true}
                onClick={() => setOpenModalUpload(true)}
                style={{ marginTop: "8px" }}
              >
                {t("cardDetailV3.t3")}
              </ButtonV3>
            )}

            {isShowReKYCButton && isCanReKYC && (
              <ButtonV3
                isFullWidth={true}
                onClick={handleClickBtnReKyc}
                style={{ marginTop: "8px" }}
              >
                Re-KYC
              </ButtonV3>
            )}

            {isShowReKYCButtonCardPhysic && (
              <ButtonV3
                isFullWidth={true}
                onClick={handleClickBtnReKycPhysicCard}
                style={{ marginTop: "8px" }}
              >
                Re-KYC
              </ButtonV3>
            )}
          </div>
        </div>

        <div className="rowItem">
          <div className="label">{t("cardVisaDetail.t19")}</div>
          <div className="value">
            {renderCardTypeByApplyType(cardDetailMoreData?.apply_type || "")}
          </div>
        </div>

        {isHasCardDetailData && (
          <>
            <div className="rowItem">
              <div className="label">{t("cardVisaDetail.t21")}</div>
              <div className="value">{queryValues.email}</div>
            </div>

            <div className="rowItem">
              <div className="label">{t("cardVisaDetail.t22")}</div>
              <div className="value">{queryValues.fname}</div>
            </div>

            <div className="rowItem">
              <div className="label">{t("cardVisaDetail.t23")}</div>
              <div className="value">{queryValues.lname}</div>
            </div>

            <div className="rowItem">
              <div className="label">{t("cardVisaDetail.t24")}</div>
              <div className="value">{queryValues.phone}</div>
            </div>

            <div className="rowItem">
              <div className="label">{t("cardVisaDetail.t25")}</div>
              <div className="value">{queryValues.phoneCode}</div>
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <>
      {/* VERSION 3 */}
      <div className="containerV3" ref={topRef}>
        <div className="CardDetailV3">
          <img
            src={i45}
            style={{
              position: "absolute",
              top: "0",
              left: "50%",
              transform: "translate(-40%, -80%)",
            }}
          />

          <div className="sectionIntro">
            <div className="title">{t("v3.t3")}</div>

            <div className="cardImgs">
              {cardDetailData && idFromUrl && handleRenderCardPreview()}
            </div>
          </div>

          <div className="wrappedOutside">
            <div className="sectionActions">
              <div className="titleInside">{t("v3.t4")}</div>

              <div className="balance">
                <div className="title">{t("v3.t5")}</div>
                <div className="amount">{renderBalance()}</div>

                <div className="bgImg">
                  <img src={i31} />
                </div>
              </div>

              <>{renderCardPin()}</>

              <div className="actions">{renderButtons()}</div>

              {cardDetailData?.result?.card_type_id === "72000001" &&
                qrCodeCardGooglePay && (
                  <div
                    style={{
                      alignSelf: "center",
                      background: "#fff",
                      padding: "8px",
                      width: "fit-content",
                      height: "fit-content",
                      paddingBottom: "0px",
                    }}
                  >
                    <QRCode value={qrCodeCardGooglePay} size={200} />
                  </div>
                )}

              {cardDetailData?.result?.card_type_id === "72000002" &&
                qrCodeCardGooglePay &&
                isShowPin && (
                  <>
                    <div
                      style={{
                        alignSelf: "center",
                        background: "#fff",
                        padding: "8px",
                        width: "fit-content",
                        height: "fit-content",
                        paddingBottom: "0px",
                      }}
                    >
                      <QRCode value={qrCodeCardGooglePay} size={200} />
                    </div>
                  </>
                )}
            </div>

            <div className="sectionInformation">
              <div className="titleInside">{t("v3.t6")}</div>

              <div className="boxContainer">
                <div className="title">{t("v3.t7")}</div>

                <>{renderCardDetails()}</>
              </div>
            </div>
          </div>

          {cardDetailData && idFromUrl && (
            <div className="sectionTransaction">
              <div className="titleInside">{t("v3.t8")}</div>

              <CardHistoryDepositDetail
                cardId={cardDetailData?.result?.card_id}
                cardTypeId={queryValues.cardTypeId}
                cardCoin={cardDetailMoreData?.card_coin}
              />
            </div>
          )}

          {cardDetailData && idFromUrl && (
            <div className="sectionOperation">
              <div className="titleInside">{t("v3.t9")}</div>

              <CardHistoryOperation idApi={queryValues.id} />
            </div>
          )}

          {cardDetailData && idFromUrl && (
            <div className="sectionTransaction">
              <div className="titleInside">{t("v3.t10")}</div>

              <CardHistoryPayment
                cardId={cardDetailData?.result?.card_id}
                cardCoin={cardDetailMoreData?.card_coin}
              />
            </div>
          )}
        </div>
      </div>

      <ModalV3
        // title={t("v3.t11")}
        // open={isOpenModalUpload}
        // footer={false}
        // onCancel={() => {
        //   setOpenModalUpload(false);
        // }}

        isOpenModal={isOpenModalUpload}
        handleCloseModal={() => {
          setOpenModalUpload(false);
        }}
      >
        <div className="uploadProofAddress">
          <div className="item">
            <div className="label">{t("v3.t12")}</div>

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
      </ModalV3>

      <ModalV3
        // title={"Freeze"}
        // open={isOpenModalFreeze}
        // footer={false}
        // onCancel={() => {
        //   setIsOpenModalFreeze(false);
        // }}

        isOpenModal={isOpenModalFreeze}
        handleCloseModal={() => {
          setIsOpenModalFreeze(false);
        }}
      >
        <div>
          <div style={{ color: "#fff", padding: "16px" }}>{t("v3.t13")}</div>

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
              {t("confirm")}
            </div>
          </div>
        </div>
      </ModalV3>

      <ModalV3
        // title={"Unfreeze"}
        // open={isOpenModalUnfreeze}
        // footer={false}
        // onCancel={() => {
        //   setIsOpenModalUnfreeze(false);
        // }}

        isOpenModal={isOpenModalUnfreeze}
        handleCloseModal={() => {
          setIsOpenModalUnfreeze(false);
        }}
      >
        <div>
          <div style={{ color: "#fff", padding: "16px" }}>{t("v3.t14")}</div>

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
              {t("confirm")}
            </div>
          </div>
        </div>
      </ModalV3>

      <ModalV3
        // title={"Cancel Card"}
        // open={isOpenModalCancel}
        // footer={false}
        // onCancel={() => {
        //   setIsOpenModalCancel(false);
        // }}

        isOpenModal={isOpenModalCancel}
        handleCloseModal={() => {
          setIsOpenModalCancel(false);
        }}
      >
        <div>
          <div style={{ color: "#fff", padding: "16px" }}>{t("v3.t15")}</div>

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
              {t("confirm")}
            </div>
          </div>
        </div>
      </ModalV3>

      <ModalV3
        // title={"Report loss"}
        // open={isOpenModalReport}
        // footer={false}
        // onCancel={() => {
        //   setIsOpenModalReport(false);
        // }}

        isOpenModal={isOpenModalReport}
        handleCloseModal={() => {
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
              {t("confirm")}
            </div>
          </div>
        </div>
      </ModalV3>

      <ModalV3
        // title={"Reset password"}
        // open={isOpenModalReset}
        // footer={false}
        // onCancel={() => {
        //   setIsOpenModalReset(false);
        // }}

        isOpenModal={isOpenModalReset}
        handleCloseModal={() => {
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
              {t("confirm")}
            </div>
          </div>
        </div>
      </ModalV3>

      <ModalV3
        // title={"Re-issue"}
        // open={isOpenModalReIssue}
        // footer={false}
        // onCancel={() => {
        //   setIsOpenModalReIssue(false);
        // }}

        isOpenModal={isOpenModalReIssue}
        handleCloseModal={() => {
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
              {t("confirm")}
            </div>
          </div>
        </div>
      </ModalV3>

      <ModalV3
        // title={"Resend PIN"}
        // open={isOpenModalResend}
        // footer={false}
        // onCancel={() => {
        //   setIsOpenModalResend(false);
        // }}

        isOpenModal={isOpenModalResend}
        handleCloseModal={() => {
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
              {t("confirm")}
            </div>
          </div>
        </div>
      </ModalV3>
    </>
  );
};
