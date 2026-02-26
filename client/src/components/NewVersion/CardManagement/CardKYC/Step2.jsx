import { UploadOutlined } from "@ant-design/icons";
import { Button, Image, message, Spin, Upload } from "antd";
import { useEffect, useState } from "react";
import { useStep2 } from "./hooks/useStep2";
import SignaturePad from "react-signature-pad-wrapper";
import { useTranslation } from "react-i18next";

export const beforeUpload = (file) => {
  const isImgFiled = file.type.includes("image/");
  const isPNG = file.type === "image/png";
  const isJPG = file.type === "image/jpg";
  const isJPEG = file.type === "image/jpeg";

  // if (!isImgFiled ) {
  if (isPNG || isJPG || isJPEG) {
    return false;
  }

  message.error("Only upload image with format PNG, JPG, JPEG");
  return Upload.LIST_IGNORE;
};

export const Step2 = ({
  isDisabledBtnStep2,
  isPendingRequest,
  currentStep,
  handleClickPrevStep,
  handleClickNextStep,
  formDataImgs,
  handleChangeImgField,
  handleRemoveImg,
  signatureRef,
  handleClearSign,
  handleCheckIsEmptySign,
  handleSetSign,
  handleRequestKYC,
  isCardPhysic,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      alert(t("no2mb"))
    }, 200)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <>
      <div
        style={{ fontStyle: "italic", marginBottom: "12px", color: "#f4e096" }}
      >
        * Click to upload image
      </div>
      <div className="step2">
        <div className="item">
          <div className="label">{t("cardKYC.t33")}</div>

          <div className="card">
            <Upload
              customRequest={() => {}}
              accept="image/*"
              style={{ width: "100%" }}
              maxCount={1}
              onChange={handleChangeImgField("frontDoc")}
              beforeUpload={beforeUpload}
              onRemove={handleRemoveImg("frontDoc")}
            >
              {/* <Button icon={<UploadOutlined />}>Click to Upload</Button> */}
              <div className="containImg" style={{ cursor: "pointer" }}>
                <img
                  className="placeholderImg"
                  src="/img/newVersion/frontU.svg"
                />
              </div>
            </Upload>

            <Image className="imgPreview" src={formDataImgs.frontDoc} />
          </div>
        </div>

        <div className="item">
          <div className="label">{t("cardKYC.t34")}</div>

          <div className="card">
            <Upload
              customRequest={() => {}}
              accept="image/*"
              style={{ width: "100%" }}
              maxCount={1}
              onChange={handleChangeImgField("backDoc")}
              beforeUpload={beforeUpload}
              onRemove={handleRemoveImg("backDoc")}
            >
              {/* <Button icon={<UploadOutlined />}>Click to Upload</Button> */}
              <div className="containImg" style={{ cursor: "pointer" }}>
                <img
                  className="placeholderImg"
                  src="/img/newVersion/backU.svg"
                />
              </div>
            </Upload>

            <Image className="imgPreview" src={formDataImgs.backDoc} />
          </div>
        </div>

        <div className="item">
          <div className="label">{t("cardKYC.t35")}</div>

          <div className="card">
            <Upload
              customRequest={() => {}}
              accept="image/*"
              style={{ width: "100%" }}
              maxCount={1}
              onChange={handleChangeImgField("mixDoc")}
              beforeUpload={beforeUpload}
              onRemove={handleRemoveImg("mixDoc")}
            >
              {/* <Button icon={<UploadOutlined />}>Click to Upload</Button> */}
              <div className="containImg" style={{ cursor: "pointer" }}>
                <img
                  className="placeholderImg"
                  src="/img/newVersion/holdU.png"
                  style={{ borderRadius: "6px" }}
                />
              </div>
            </Upload>

            <Image className="imgPreview" src={formDataImgs.mixDoc || null} />
          </div>
        </div>

        <div className="item">
          <div className="label">{t("cardKYC.t36")}</div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              flex: "1",
              position: "relative",
            }}
          >
            <SignaturePad
              ref={signatureRef}
              options={{
                // minWidth: 3,
                // maxWidth: 10,
                width: "100%",
                height: "100%",
                penColor: "#000",
                backgroundColor: "#fff",
                strokeWidth: "0.1",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: 10000,
                background: "#00000090",
                color: "#fff",
                padding: "0 8px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={handleClearSign}
            >
              {t("cardKYC.t37")}
            </div>
          </div>
        </div>
      </div>

      <div className="btnsInside">
        <button
          className={`btnInside default ${isPendingRequest ? "disabled" : ""}`}
          onClick={() => {
            handleClickPrevStep();
          }}
        >
          {t("cardKYC.t38")}
        </button>

        <button
          className="btnInside"
          disabled={isDisabledBtnStep2}
          onClick={async () => {
            const isEmptySign = handleCheckIsEmptySign();

            if (isEmptySign) {
              message.error(t("cardKYC.t40"));
              return;
            }

            // nếu là card physic thì gọi api, bỏ qua màn fee
            if (isCardPhysic) {
              await handleRequestKYC();
            } else {
              handleSetSign();
              handleClickNextStep();
            }
          }}
        >
          {!isCardPhysic ? (
            t("cardKYC.t39")
          ) : isPendingRequest ? (
            <Spin />
          ) : (
            t("cardKYC.t51")
          )}
        </button>
      </div>
    </>
  );
};
