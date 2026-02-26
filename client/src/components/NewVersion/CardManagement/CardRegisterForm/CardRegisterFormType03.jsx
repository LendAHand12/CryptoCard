import { useHistory } from "react-router-dom/cjs/react-router-dom";
import "./CardRegisterFormType03.scss";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  DatePicker,
  Descriptions,
  Image,
  message,
  Radio,
  Select,
  Spin,
  Upload,
} from "antd";
import { toast } from "react-toastify";
import { axiosService } from "src/util/service";
import { useDispatch, useSelector } from "react-redux";
import { CardItemVirtualFrontPreview } from "./CardItemVirtualFrontPreview";
import { CardItemVirtualBackPreview } from "./CardItemVirtualBackPreview";
import { roundDownDecimalValues } from "src/util/common";
import { coinUserWallet } from "src/redux/actions/coin.action";
import { useTranslation } from "react-i18next";
import { codePhoneOptions } from "..";
import SignaturePad from "react-signature-pad-wrapper";
import { CardFeeScreen } from "./CardFeeScreen";
import { GLOBAL_TYPE } from "src/redux/reducers/globalReducer";
import { compressImg } from "src/util/compressImg";

const getBase64 = async (img, callback) => {
  try {
    const newImg = await compressImg(img);

    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(newImg);
  } catch (error) {}
};

const beforeUpload = (file) => {
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

export const CardRegisterFormType03 = ({
  cardId,
  cardCurr,
  cardName,
  cardType,
}) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const { userWallet } = useSelector((state) => state.coinReducer);
  const { listCoinRealTime } = useSelector(
    (state) => state.listCoinRealTimeReducer
  );
  const isLogin = useSelector((state) => state.loginReducer.isLogin);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    phoneCode: "84",
    docNo: "",
    address: "",
    birthday: "",
    city: "",
    gender: "",
    countryId: "203",
    emergencyContact: "",
    nationalityId: "203",
    state: "",
    zipCode: "",
  });
  const [errorsMsg, setErrorsMsg] = useState({
    firstName: null,
    lastName: null,
    phone: null,
    docNo: null,
    address: null,
    birthday: null,
    city: null,
    gender: null,
    emergencyContact: null,
    state: null,
    zipCode: null,
  });

  const [formDataImgs, setFormDataImgs] = useState({
    frontDoc: null,
    backDoc: null,
    mixDoc: null,
    signImg: null,
  });

  const signatureRef = useRef(null);

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const idPassportRef = useRef(null);
  const phoneRef = useRef(null);
  const zipCodeRef = useRef(null);
  const addressRef = useRef(null);
  const emailRef = useRef(null);

  const isDisabledBtnStep0 =
    formData.firstName === "" ||
    formData.lastName === "" ||
    formData.phone === "" ||
    formData.docNo === "" ||
    formData.address === "" ||
    formData.birthday === "" ||
    formData.city === "" ||
    formData.gender === "" ||
    formData.emergencyContact === "" ||
    formData.state === "" ||
    formData.zipCode === "" ||
    errorsMsg.firstName ||
    errorsMsg.lastName ||
    errorsMsg.phone ||
    errorsMsg.docNo ||
    errorsMsg.address ||
    errorsMsg.birthday ||
    errorsMsg.city ||
    errorsMsg.gender ||
    errorsMsg.emergencyContact ||
    errorsMsg.state ||
    errorsMsg.zipCode;

  const isDisabledBtnStep1 =
    !formDataImgs.frontDoc ||
    !formDataImgs.backDoc ||
    !formDataImgs.mixDoc ||
    isLoading;

  const { t } = useTranslation();

  const mappingCountryIDOptions = useMemo(() => {
    return codePhoneOptions.map((option) => {
      return {
        value: option.id,
        label: option.label.split(" ")[1],
      };
    });
  }, []);

  const getWalletGlobal = async () => {
    try {
      const res = await axiosService.post("api/user/getWallet");

      dispatch({
        type: GLOBAL_TYPE.UPDATE_BALANCES,
        payload: res.data.data,
      });
    } catch (error) {}
  };

  const renderCardType = (cardType) => {
    switch (Number(cardType)) {
      case 1:
        return "Virtual";

      case 2:
        return "Physical";

      default:
        return null;
    }
  };

  const handleGetWallet = async () => {
    try {
      const res = await axiosService.post("api/user/getWallet");

      const apiResp = res.data.data;
      const result = {};
      for (const [name, value] of Object.entries(apiResp)) {
        let price =
          listCoinRealTime.filter(
            (item) => item.name === name.replace("_balance", "").toUpperCase()
          )[0]?.price ?? 0;
        result[name] = roundDownDecimalValues(value, price);
      }
      if (Object.keys(result)) {
        userWallet.current = result;
        dispatch(coinUserWallet(result));
      }
    } catch (error) {}
  };

  const isEngChar = (value) => {
    const reg = /^[a-zA-Z ]+$/;

    if (!reg.test(value)) {
      return false;
    }

    return true;
  };

  const isAddressValid = (value) => {
    const reg = /^[a-zA-Z0-9 ]+$/;

    if (!reg.test(value)) {
      return false;
    }

    return true;
  };

  const isPositiveInteger = (value) => {
    return Number.isInteger(value) && value >= 0;
  };

  const isEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(value);
  };

  const handleValidateFName = (field, value) => {
    if (value !== "" && !isEngChar(value)) {
      message.destroy();
      message.error(t("formRegisterType3.t1"));
      setErrorsMsg({ ...errorsMsg, firstName: true });
      firstNameRef.current.classList.add("invalid");
    } else {
      setErrorsMsg({ ...errorsMsg, firstName: false });
      firstNameRef.current.classList.remove("invalid");
    }
  };

  const handleValidateLName = (field, value) => {
    if (value !== "" && !isEngChar(value)) {
      message.destroy();
      message.error(t("formRegisterType3.t2"));
      setErrorsMsg({ ...errorsMsg, lastName: true });
      lastNameRef.current.classList.add("invalid");
    } else {
      setErrorsMsg({ ...errorsMsg, lastName: false });
      lastNameRef.current.classList.remove("invalid");
    }
  };

  const handleValidateAddress = (field, value) => {
    if (value !== "" && !isAddressValid(value)) {
      message.destroy();
      message.error(t("formRegisterType3.t3"));
      setErrorsMsg({ ...errorsMsg, address: true });
      addressRef.current.classList.add("invalid");
    } else {
      setErrorsMsg({ ...errorsMsg, address: false });
      addressRef.current.classList.remove("invalid");
    }
  };

  const handleValidatePhone = (field, value) => {
    if (value !== "" && !isPositiveInteger(Number(value))) {
      message.destroy();
      message.error(t("formRegisterType3.t4"));
      setErrorsMsg({ ...errorsMsg, phone: true });
      phoneRef.current.classList.add("invalid");
    } else {
      setErrorsMsg({ ...errorsMsg, phone: false });
      phoneRef.current.classList.remove("invalid");
    }
  };

  const handleChangePhoneCode = (value) => {
    setFormData({ ...formData, phoneCode: value });
  };

  const handleChangeBirthday = (date) => {
    setFormData({ ...formData, birthday: date });
  };

  const handleValidateIDPassport = (field, value) => {
    const regexCheckPassport = /^[a-zA-Z0-9]+$/;

    if (value !== "" && !regexCheckPassport.test(value)) {
      message.destroy();
      message.error(t("formRegisterType3.t5"));
      setErrorsMsg({ ...errorsMsg, docNo: true });
      idPassportRef.current.classList.add("invalid");
    } else {
      setErrorsMsg({ ...errorsMsg, docNo: false });
      idPassportRef.current.classList.remove("invalid");
    }
  };

  const handleChangeGender = (e) => {
    const value = e.target.value;

    setFormData({ ...formData, gender: value });
  };

  const handleChangeCountryId = (value) => {
    setFormData({ ...formData, countryId: value });
  };

  const handleChangeNationalityId = (value) => {
    setFormData({ ...formData, nationalityId: value });
  };

  const handleValidateContact = (field, value) => {
    if (value !== "" && !isEngChar(value)) {
      message.destroy();
      message.error(t("formRegisterType3.t6"));
      setErrorsMsg({ ...errorsMsg, emergencyContact: true });
      emailRef.current.classList.add("invalid");
    } else {
      setErrorsMsg({ ...errorsMsg, emergencyContact: false });
      emailRef.current.classList.remove("invalid");
    }
  };

  const handleValidateZipCode = (field, value) => {
    if (value !== "" && !isPositiveInteger(Number(value))) {
      message.destroy();
      message.error(t("formRegisterType3.t7"));
      setErrorsMsg({ ...errorsMsg, zipCode: true });
      zipCodeRef.current.classList.add("invalid");
    } else {
      setErrorsMsg({ ...errorsMsg, zipCode: false });
      zipCodeRef.current.classList.remove("invalid");
    }
  };

  const handleChangeFieldsInput = (field) => (e) => {
    const value = e.target.value;

    setFormData({ ...formData, [field]: value });

    switch (field) {
      case "firstName":
        handleValidateFName(field, value);
        break;

      case "lastName":
        handleValidateLName(field, value);
        break;

      case "emergencyContact":
        handleValidateContact(field, value);
        break;

      case "phone":
        handleValidatePhone(field, value);
        break;

      case "docNo":
        handleValidateIDPassport(field, value);
        break;

      case "zipCode":
        handleValidateZipCode(field, value);
        break;

      case "address":
        handleValidateAddress(field, value);
        break;

      default:
        break;
    }
  };

  const handleChangeImgField = (field) => (info) => {
    if (info.file.status !== "uploading") {
      getBase64(info.file, (url) => {
        setFormDataImgs({ ...formDataImgs, [field]: url });
      });
    }
  };

  const handleRemoveImg = (field) => () => {
    setFormDataImgs({ ...formDataImgs, [field]: null });
  };

  const handleClearSign = () => {
    signatureRef.current.clear();
  };

  const handleCheckIsEmptySign = () => {
    return signatureRef.current.isEmpty();
  };

  const handleRequestCreateCard = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await axiosService.post(
        "api/visaCard/createCardKycVirtualCard",
        {
          card_type_id: cardId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          mobile: formData.phone,
          mobile_code: formData.phoneCode,
          doc_no: formData.docNo,
          address: formData.address,
          birthday: formData.birthday.format("YYYY-MM-DD"),
          city: formData.city,
          gender: Number(formData.gender),
          country_id: Number(formData.countryId),
          emergency_contact: formData.emergencyContact,
          nationality_id: Number(formData.nationalityId),
          state: formData.state,
          zip_code: formData.zipCode,
          front_doc: formDataImgs.frontDoc.split("base64,")[1],
          back_doc: formDataImgs.backDoc.split("base64,")[1],
          mix_doc: formDataImgs.mixDoc.split("base64,")[1],
          // sign_img: signatureRef.current.toDataURL().split("base64,")[1],
          sign_img: formDataImgs.signImg,
        }
      );

      handleGetWallet();
      getWalletGlobal();
      setIsLoading(false);
      message.success(res.data.message);
      history.replace("/success-created-card");
    } catch (error) {
      setIsLoading(false);
      message.error(error?.response.data.message);
    }
  };

  const handleClickBtnRequestCreateCard = async () => {
    await handleRequestCreateCard();
  };

  const handleCheckStep1 = () => {
    const isEmptySign = handleCheckIsEmptySign();

    if (isEmptySign) {
      message.error(t("formRegisterType3.t8"));
      return;
    }

    setFormDataImgs({
      ...formDataImgs,
      signImg: signatureRef.current.toDataURL().split("base64,")[1],
    });

    setStep(2);
  };

  useEffect(() => {
    if (step == 1) {
      const timeout = setTimeout(() => {
        alert(t('no2mb'))
      }, 200)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [step])

  if (!isLogin) {
    return null;
  }

  return (
    <div className="CardRegisterFormType03">
      <div className="sectionNote">{t("createVisaCard.t5")}</div>

      <div className="sectionCard">
        <div className="titleInside">{t("createVisaCard.t6")}</div>
        <div className="descInside">
          <Descriptions
            className="customAntdDesc"
            bordered
            style={{ color: "#fff" }}
            column={1}
            size={window.innerWidth < 768 ? "small" : "default"}
          >
            <Descriptions.Item
              label={
                <div className="labelInsideV2">{t("createVisaCard.t7")}</div>
              }
            >
              <div className="contentInsideV2">{cardCurr.toUpperCase()}</div>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <div className="labelInsideV2">{t("createVisaCard.t8")}</div>
              }
            >
              <div className="contentInsideV2">{renderCardType(cardType)}</div>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <div className="labelInsideV2">{t("createVisaCard.t9")}</div>
              }
            >
              <div className="contentInsideV2">{cardName}</div>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>

      <div className="sectionPreview">
        <div className="titleInside">{t("createVisaCard.t10")}</div>

        <div className="previewCards">
          <CardItemVirtualFrontPreview />
          <CardItemVirtualBackPreview
            data={{
              first_name: formData.firstName,
              last_name: formData.lastName,
            }}
          />
        </div>
      </div>

      <div className="sectionInfo">
        <div className="titleInside">{t("createVisaCard.t11")}</div>
        <div className="formInside">
          {step === 0 && (
            <>
              <div className="item" ref={firstNameRef}>
                <div className="label">{t("formRegisterType3.t9")}</div>
                <input
                  className="inputInside"
                  value={formData.firstName}
                  onChange={handleChangeFieldsInput("firstName")}
                  placeholder={t("formRegisterType3.t10")}
                />
              </div>

              <div className="item" ref={lastNameRef}>
                <div className="label">{t("formRegisterType3.t11")}</div>
                <input
                  className="inputInside"
                  value={formData.lastName}
                  onChange={handleChangeFieldsInput("lastName")}
                  placeholder={t("formRegisterType3.t12")}
                />
              </div>

              <div className="item">
                <div className="label">{t("formRegisterType3.t13")}</div>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    flex: "1",
                  }}
                >
                  <Radio.Group
                    onChange={handleChangeGender}
                    value={formData.gender}
                  >
                    <Radio value={1}>
                      <div style={{ color: "#fff" }}>
                        {t("formRegisterType3.t14")}
                      </div>
                    </Radio>
                    <Radio value={2}>
                      <div style={{ color: "#fff" }}>
                        {t("formRegisterType3.t15")}
                      </div>
                    </Radio>
                  </Radio.Group>
                </div>
              </div>

              <div className="item" ref={idPassportRef}>
                <div className="label">{t("formRegisterType3.t16")}</div>
                <input
                  className="inputInside"
                  placeholder={t("formRegisterType3.t17")}
                  value={formData.docNo}
                  onChange={handleChangeFieldsInput("docNo")}
                />
              </div>

              <div className="item" ref={phoneRef}>
                <div className="label">{t("formRegisterType3.t18")}</div>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    flex: "1",
                  }}
                >
                  <Select
                    style={{ minWidth: "115px" }}
                    options={codePhoneOptions}
                    value={formData.phoneCode}
                    onChange={handleChangePhoneCode}
                  />
                  <input
                    style={{ flex: "1" }}
                    className="inputInside"
                    placeholder={t("formRegisterType3.t19")}
                    value={formData.phone}
                    onChange={handleChangeFieldsInput("phone")}
                  />
                </div>
              </div>

              <div className="item">
                <div className="label">{t("formRegisterType3.t20")}</div>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    flex: "1",
                  }}
                >
                  <DatePicker
                    allowClear={false}
                    style={{ width: "100%" }}
                    value={formData.birthday}
                    onChange={handleChangeBirthday}
                    placeholder={t("formRegisterType3.t21")}
                  />
                </div>
              </div>

              <div className="item" ref={emailRef}>
                <div className="label">{t("formRegisterType3.t22")}</div>
                <input
                  className="inputInside"
                  placeholder={t("formRegisterType3.t23")}
                  value={formData.emergencyContact}
                  onChange={handleChangeFieldsInput("emergencyContact")}
                />
              </div>

              <div className="item" ref={addressRef}>
                <div className="label">{t("formRegisterType3.t24")}</div>
                <input
                  className="inputInside"
                  value={formData.address}
                  onChange={handleChangeFieldsInput("address")}
                  placeholder={t("formRegisterType3.t25")}
                />
              </div>

              <div className="item">
                <div className="label">{t("formRegisterType3.t26")}</div>
                <input
                  className="inputInside"
                  value={formData.state}
                  onChange={handleChangeFieldsInput("state")}
                  placeholder={t("formRegisterType3.t27")}
                />
              </div>

              <div className="item">
                <div className="label">{t("formRegisterType3.t28")}</div>
                <input
                  className="inputInside"
                  value={formData.city}
                  onChange={handleChangeFieldsInput("city")}
                  placeholder={t("formRegisterType3.t29")}
                />
              </div>

              <div className="item" ref={zipCodeRef}>
                <div className="label">{t("formRegisterType3.t30")}</div>
                <input
                  className="inputInside"
                  value={formData.zipCode}
                  onChange={handleChangeFieldsInput("zipCode")}
                  placeholder={t("formRegisterType3.t31")}
                />
              </div>

              <div className="item">
                <div className="label">{t("formRegisterType3.t32")}</div>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    flex: "1",
                  }}
                >
                  <Select
                    options={mappingCountryIDOptions}
                    value={formData.countryId}
                    onChange={handleChangeCountryId}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div className="item">
                <div className="label">{t("formRegisterType3.t33")}</div>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    flex: "1",
                  }}
                >
                  <Select
                    options={mappingCountryIDOptions}
                    value={formData.nationalityId}
                    onChange={handleChangeNationalityId}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="itemStep2">
                <div className="label">{t("formRegisterType3.t34")}</div>

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

              <div className="itemStep2">
                <div className="label">{t("formRegisterType3.t35")}</div>

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

              <div className="itemStep2">
                <div className="label">{t("formRegisterType3.t36")}</div>

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

                  <Image
                    className="imgPreview"
                    src={formDataImgs.mixDoc || null}
                  />
                </div>
              </div>

              <div className="itemStep2">
                <div className="label">{t("formRegisterType3.t37")}</div>

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
                    {t("formRegisterType3.t38")}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* SHOW FEE SCREEN */}
        {step === 2 && <CardFeeScreen />}

        {step === 0 && (
          <button
            className={`btnInside ${isDisabledBtnStep0 ? "disabled" : ""}`}
            disabled={isDisabledBtnStep0}
            onClick={() => setStep(1)}
          >
            {t("formRegisterType3.t39")}
          </button>
        )}

        {step === 1 && (
          <button
            className={`btnInside ${isDisabledBtnStep1 ? "disabled" : ""}`}
            disabled={isDisabledBtnStep1}
            onClick={handleCheckStep1}
          >
            {t("formRegisterType3.t39")}
          </button>
        )}

        {step === 2 && (
          <button
            className={`btnInside`}
            onClick={handleClickBtnRequestCreateCard}
          >
            {isLoading ? <Spin /> : t("formRegisterType3.t40")}
          </button>
        )}
      </div>
    </div>
  );
};
