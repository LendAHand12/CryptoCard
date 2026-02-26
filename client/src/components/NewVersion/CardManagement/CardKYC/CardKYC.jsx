import { useRedirectHomeIfNotLogin } from "src/hooks/useRedirectHomeIfNotLogin";
import "./CardKYC.scss";
import { useEffect, useState } from "react";
import { Steps } from "antd";
import {
  CheckCircleOutlined,
  CreditCardOutlined,
  MoneyCollectOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { useStep1 } from "./hooks/useStep1";
import { useStep2 } from "./hooks/useStep2";
import { Step4 } from "./Step4";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import { useTranslation } from "react-i18next";

export const CardKYC = () => {
  const { isLogin } = useRedirectHomeIfNotLogin();
  const [current, setCurrent] = useState(0);
  const { search } = useLocation();
  const queryValues = queryString.parse(search);
  const history = useHistory();
  const { t } = useTranslation();
  const isCardPhysic = queryValues.applyType == "3";

  const nextStep = () => {
    if (current === 3) return;
    setCurrent(current + 1);
  };

  const prevStep = () => {
    if (current === 0) return;
    setCurrent(current - 1);
  };

  const goToStep = (step) => {
    setCurrent(step);
  };

  const {
    firstNameRef,
    lastNameRef,
    idPassportRef,
    phoneRef,
    zipCodeRef,
    addressRef,
    emailRef,
    formData,
    isDisabledStep1Btn,
    handleChangeFieldsInput,
    handleChangePhoneCode,
    handleChangeBirthday,
    handleChangeGender,
    handleChangeCountryId,
    handleChangeNationalityId,
  } = useStep1();
  const {
    formDataImgs,
    isDisabledBtnStep2,
    signatureRef,
    isPendingRequest,
    handleChangeImgField,
    handleRemoveImg,
    handleClearSign,
    handleCheckIsEmptySign,
    handleSetSign,
    handleRequestKYC,
  } = useStep2(formData, nextStep, isCardPhysic, goToStep);

  // TODO fee step
  const steps = !isCardPhysic
    ? [
        {
          key: "1",
          title: <div>{t("cardKYC.t1")}</div>,
          icon: <UserOutlined />,
        },
        {
          key: "2",
          title: <div>{t("cardKYC.t2")}</div>,
          icon: <SolutionOutlined />,
        },
        {
          key: "4",
          title: <div>{t("cardKYC.t3")}</div>,
          icon: <CreditCardOutlined />,
        },
        {
          key: "3",
          title: <div>{t("cardKYC.t4")}</div>,
          icon: <CheckCircleOutlined />,
        },
      ]
    : [
        {
          key: "1",
          title: <div>{t("cardKYC.t1")}</div>,
          icon: <UserOutlined />,
        },
        {
          key: "2",
          title: <div>{t("cardKYC.t2")}</div>,
          icon: <SolutionOutlined />,
        },
        {
          key: "3",
          title: <div>{t("cardKYC.t4")}</div>,
          icon: <CheckCircleOutlined />,
        },
      ];

  const renderStepUI = () => {
    switch (current) {
      case 0:
        return (
          <Step1
            emailRef={emailRef}
            firstNameRef={firstNameRef}
            lastNameRef={lastNameRef}
            idPassportRef={idPassportRef}
            phoneRef={phoneRef}
            zipCodeRef={zipCodeRef}
            addressRef={addressRef}
            currentStep={current}
            formData={formData}
            isDisabledStep1Btn={isDisabledStep1Btn}
            handleChangeFieldsInput={handleChangeFieldsInput}
            handleChangePhoneCode={handleChangePhoneCode}
            handleChangeBirthday={handleChangeBirthday}
            handleChangeGender={handleChangeGender}
            handleChangeCountryId={handleChangeCountryId}
            handleChangeNationalityId={handleChangeNationalityId}
            handleClickNextStep={nextStep}
            handleClickPrevStep={prevStep}
          />
        );

      case 1:
        return (
          <Step2
            currentStep={current}
            signatureRef={signatureRef}
            handleClickPrevStep={prevStep}
            handleClickNextStep={nextStep}
            formDataImgs={formDataImgs}
            handleChangeImgField={handleChangeImgField}
            handleRemoveImg={handleRemoveImg}
            isDisabledBtnStep2={isDisabledBtnStep2}
            handleClearSign={handleClearSign}
            handleCheckIsEmptySign={handleCheckIsEmptySign}
            handleSetSign={handleSetSign}
            handleRequestKYC={handleRequestKYC}
            isPendingRequest={isPendingRequest}
            isCardPhysic={isCardPhysic}
          />
        );

      case 2:
        return (
          <Step3
            currentStep={current}
            handleClickPrevStep={prevStep}
            handleClickNextStep={nextStep}
            handleRequestKYC={handleRequestKYC}
            isPendingRequest={isPendingRequest}
            cardFee={queryValues.cardFee || 0}
          />
        );

      case 3:
        return <Step4 />;

      default:
        return null;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [current]);

  useEffect(() => {
    if (
      !queryValues.cardFee ||
      !queryValues.cardTypeId ||
      !queryValues.minFirstRecharge ||
      !queryValues.feeRecharge ||
      !queryValues.cardCurr
    ) {
      history.push("/product-v3");
    }
  }, []);

  if (!isLogin) {
    return null;
  }

  return (
    <div className="containerV2">
      <div className="CardKYC">
        <div className="titleV2">KYC</div>

        <Steps current={current} items={steps} />

        <div className="stepContent">{renderStepUI()}</div>
      </div>
    </div>
  );
};
