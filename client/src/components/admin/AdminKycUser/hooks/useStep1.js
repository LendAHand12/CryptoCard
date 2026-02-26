import { message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export const useStep1 = () => {
  const { t } = useTranslation();
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

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const idPassportRef = useRef(null);
  const phoneRef = useRef(null);
  const zipCodeRef = useRef(null);
  const addressRef = useRef(null);
  const emailRef = useRef(null);

  const isDisabledStep1Btn =
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

  const handleValidateEmail = (field, value) => {
    if (value !== "" && !isEmail(value)) {
      message.destroy();
      message.error("Please enter valid email");
      setErrorsMsg({ ...errorsMsg, emergencyContact: true });
      emailRef.current?.classList.add("invalid");
    } else {
      setErrorsMsg({ ...errorsMsg, emergencyContact: false });
      emailRef.current?.classList.remove("invalid");
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleValidateEmail("emergencyContact", formData.emergencyContact);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [formData.emergencyContact]);

  return {
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
  };
};
