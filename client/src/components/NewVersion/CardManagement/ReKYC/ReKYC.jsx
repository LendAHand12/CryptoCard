import { useDispatch, useSelector } from "react-redux";
import "./ReKYC.scss";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { codePhoneOptions } from "..";
import { axiosService } from "src/util/service";
import { DatePicker, Image, message, Radio, Select, Spin, Upload } from "antd";
import SignaturePad from "react-signature-pad-wrapper";
import { beforeUpload } from "../CardKYC/Step2";
import { getBase64 } from "../CardKYC/hooks/useStep2";
import { useFadedIn } from "src/hooks/useFadedIn";
import queryString from "query-string";

// REKYC dành cho card virtual (apply type = 1);
export const ReKYC = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const { domRef } = useFadedIn();
  const { search } = useLocation();
  const queryValues = queryString.parse(search);
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

  const [cardUserData, setCardUserData] = useState(null);

  const signatureRef = useRef(null);

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const idPassportRef = useRef(null);
  const phoneRef = useRef(null);
  const zipCodeRef = useRef(null);
  const addressRef = useRef(null);
  const emailRef = useRef(null);

  const isDisabledBtnStep1 =
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

  const isDisabledBtnStep2 =
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
      const res = await axiosService.post("api/visaCard/reCardKycVirtualCard", {
        card_type_id: queryValues.cardTypeId,
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
        sign_img: signatureRef.current.toDataURL().split("base64,")[1],
      });

      setIsLoading(false);
      message.success(res.data.message);
      history.replace("/product");
    } catch (error) {
      setIsLoading(false);
      message.error(error?.response.data.message);
    }
  };

  const handleClickBtnRequestCreateCard = async () => {
    const isEmptySign = handleCheckIsEmptySign();

    if (isEmptySign) {
      message.error(t("formRegisterType3.t8"));
      return;
    }

    await handleRequestCreateCard();
  };

  const handleFindCardDetail = async () => {
    try {
      const res = await axiosService.post("api/visaCard/listCardToken");
      const listCard = res.data.data.data;

      const cardFound = listCard.find((card) => {
        if (
          card.apply_type == 1 &&
          card.card_type_id == queryValues.cardTypeId
        ) {
          return true;
        }

        return false;
      });

      if (!cardFound?.transactionCardUser) {
        message.error("Invalid ID");
        history.push("/product-v3");
        return;
      }

      setCardUserData(cardFound.transactionCardUser);
    } catch (error) {}
  };

  useEffect(() => {
    if (!cardUserData) return;

    setFormData({
      ...formData,
      firstName: cardUserData.first_name,
      lastName: cardUserData.last_name,
      phone: cardUserData.mobile,
      phoneCode: cardUserData.mobile_code,
      email: cardUserData.email,
    });
  }, [cardUserData]);

  useEffect(() => {
    if (!queryValues.cardTypeId) {
      history.push("/product-v3");
    }
  }, []);

  useEffect(() => {
    if (isLogin) {
      handleFindCardDetail();
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      alert(t("no2mb"));
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (!isLogin || !cardUserData) {
    return null;
  }

  return (
    <div className="containerV2">
      <div className="ReKYCContainer" ref={domRef}>
        <div className="titleV2">KYC</div>

        <div className="ReKYC">
          <div className="sectionNote">{t("createVisaCard.t5")}</div>

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
                        <div
                          className="containImg"
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            className="placeholderImg"
                            src="/img/newVersion/frontU.svg"
                          />
                        </div>
                      </Upload>

                      <Image
                        className="imgPreview"
                        src={formDataImgs.frontDoc}
                      />
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
                        <div
                          className="containImg"
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            className="placeholderImg"
                            src="/img/newVersion/backU.svg"
                          />
                        </div>
                      </Upload>

                      <Image
                        className="imgPreview"
                        src={formDataImgs.backDoc}
                      />
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
                        <div
                          className="containImg"
                          style={{ cursor: "pointer" }}
                        >
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

            {step === 0 && (
              <button
                className={`btnInside ${isDisabledBtnStep1 ? "disabled" : ""}`}
                disabled={isDisabledBtnStep1}
                onClick={() => setStep(1)}
              >
                {t("formRegisterType3.t39")}
              </button>
            )}

            {step === 1 && (
              <button
                className={`btnInside ${isDisabledBtnStep2 ? "disabled" : ""}`}
                disabled={isDisabledBtnStep2}
                onClick={handleClickBtnRequestCreateCard}
              >
                {isLoading ? <Spin /> : "KYC"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
