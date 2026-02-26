import { useRedirectHomeIfNotLogin } from "src/hooks/useRedirectHomeIfNotLogin";
import "./AdminKycUser.scss";
import { useEffect, useState } from "react";
import { Steps } from "antd";
import {
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { useStep1 } from "./hooks/useStep1";
import { useStep2 } from "./hooks/useStep2";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import { useTranslation } from "react-i18next";
import { IS_DOMAIN_PRODUCTION } from '../../../util/service.js';
import { ID_CARD_TYPE_4_PRODUCTION, ID_CARD_TYPE_4_TEST } from '../../NewVersion/index.js';

export const AdminKycUser = () => {
  const { isLogin } = useRedirectHomeIfNotLogin();
  const [current, setCurrent] = useState(0);
  const history = useHistory();
  const { t } = useTranslation();
  const {id} = useParams();
  const isCardPhysic = true
  const cardTypeId = IS_DOMAIN_PRODUCTION ? ID_CARD_TYPE_4_PRODUCTION : ID_CARD_TYPE_4_TEST
  
  
  

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
  } = useStep2(formData, nextStep, isCardPhysic, goToStep, id, cardTypeId);

  // TODO fee step
  const steps = [
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

      default:
        return null;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [current]);

  if (!isLogin) {
    return null;
  }

  return (
    <div className="containerV2">
      <div className="AdminKycUser">
        <div className="titleV2">KYC for ID {id}</div>

        <Steps current={current} items={steps} />

        <div className="stepContent">{renderStepUI()}</div>
      </div>
    </div>
  );
};
