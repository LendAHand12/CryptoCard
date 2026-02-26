import { DatePicker, Radio, Select } from "antd";
import { codePhoneOptions } from '../../NewVersion/index.js';
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const Step1 = ({
  firstNameRef,
  lastNameRef,
  idPassportRef,
  phoneRef,
  zipCodeRef,
  addressRef,
  emailRef,
  formData,
  currentStep,
  isDisabledStep1Btn,
  handleChangeFieldsInput,
  handleChangePhoneCode,
  handleChangeBirthday,
  handleChangeGender,
  handleChangeCountryId,
  handleChangeNationalityId,
  handleClickNextStep,
  handleClickPrevStep,
}) => {
  const { t } = useTranslation();

  const mappingCountryIDOptions = useMemo(() => {
    return codePhoneOptions.map((option) => {
      return {
        value: option.id,
        label: option.label.split(" ")[1],
      };
    });
  }, []);

  return (
    <>
      <div className="step1">
        <div className="item" ref={firstNameRef}>
          <div className="label">{t("cardKYC.t5")}</div>
          <input
            className="inputInside"
            value={formData.firstName}
            onChange={handleChangeFieldsInput("firstName")}
            placeholder={t("cardKYC.t6")}
          />
        </div>

        <div className="item" ref={lastNameRef}>
          <div className="label">{t("cardKYC.t7")}</div>
          <input
            className="inputInside"
            value={formData.lastName}
            onChange={handleChangeFieldsInput("lastName")}
            placeholder={t("cardKYC.t8")}
          />
        </div>

        <div className="item">
          <div className="label">{t("cardKYC.t9")}</div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              flex: "1",
            }}
          >
            <Radio.Group onChange={handleChangeGender} value={formData.gender}>
              <Radio value={1}>
                <div style={{ color: "#fff" }}>{t("cardKYC.t10")}</div>
              </Radio>
              <Radio value={2}>
                <div style={{ color: "#fff" }}>{t("cardKYC.t11")}</div>
              </Radio>
            </Radio.Group>
          </div>
        </div>

        <div className="item" ref={idPassportRef}>
          <div className="label">{t("cardKYC.t12")}</div>
          <input
            className="inputInside"
            placeholder={t("cardKYC.t13")}
            value={formData.docNo}
            onChange={handleChangeFieldsInput("docNo")}
          />
        </div>

        <div className="item" ref={phoneRef}>
          <div className="label">{t("cardKYC.t14")}</div>

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
              placeholder={t("cardKYC.t15")}
              value={formData.phone}
              onChange={handleChangeFieldsInput("phone")}
            />
          </div>
        </div>

        <div className="item">
          <div className="label">{t("cardKYC.t16")}</div>
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
              placeholder={t("cardKYC.t17")}
            />
          </div>
        </div>

        <div className="item" ref={emailRef}>
          <div className="label">{t("cardKYC.t18")}</div>
          <input
            className="inputInside"
            placeholder={t("cardKYC.t19")}
            value={formData.emergencyContact}
            onChange={handleChangeFieldsInput("emergencyContact")}
          />
        </div>

        <div className="item" ref={addressRef}>
          <div className="label">{t("cardKYC.t20")}</div>
          <input
            className="inputInside"
            value={formData.address}
            onChange={handleChangeFieldsInput("address")}
            placeholder={t("cardKYC.t21")}
          />
        </div>

        <div className="item">
          <div className="label">{t("cardKYC.t22")}</div>
          <input
            className="inputInside"
            value={formData.state}
            onChange={handleChangeFieldsInput("state")}
            placeholder={t("cardKYC.t23")}
          />
        </div>

        <div className="item">
          <div className="label">{t("cardKYC.t24")}</div>
          <input
            className="inputInside"
            value={formData.city}
            onChange={handleChangeFieldsInput("city")}
            placeholder={t("cardKYC.t25")}
          />
        </div>

        <div className="item" ref={zipCodeRef}>
          <div className="label">{t("cardKYC.t26")}</div>
          <input
            className="inputInside"
            value={formData.zipCode}
            onChange={handleChangeFieldsInput("zipCode")}
            placeholder={t("cardKYC.t27")}
          />
        </div>

        <div className="item">
          <div className="label">{t("cardKYC.t28")}</div>
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
          <div className="label">{t("cardKYC.t29")}</div>
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
      </div>

      <div className="btnsInside">
        <button
          className={`btnInside default ${currentStep === 0 ? "disabled" : ""}`}
          onClick={handleClickPrevStep}
        >
          {t("cardKYC.t30")}
        </button>

        <button
          className="btnInside"
          disabled={isDisabledStep1Btn}
          onClick={handleClickNextStep}
        >
          {t("cardKYC.t31")}
        </button>
      </div>
    </>
  );
};
