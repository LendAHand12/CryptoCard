import { message, Modal, Radio } from "antd";
import { useState } from "react";
import "./Form4Fields.scss";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { roundedUp } from "src/util/roundNumber";
import { getListCoinRealTime } from "src/redux/constant/listCoinRealTime.constant";
import { axiosService } from "src/util/service";
import { ModalV3 } from "src/components/V3/ModalV3/ModalV3";

export const Form4Fields = ({ isOpenModal, handleCloseModal, cardFee }) => {
  const { usdtBalance, amcBalance } = useSelector(
    (state) => state.globalReducer
  );
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    name: "",
    address: "",
  });
  const [errorsMsg, setErrorsMsg] = useState({
    name: null,
    phone: null,
    address: null,
  });
  const isDisabledBtn =
    formData.phone.trim() === "" ||
    formData.name.trim() === "" ||
    formData.address.trim() === "" ||
    errorsMsg.address !== null ||
    errorsMsg.name !== null ||
    errorsMsg.phone !== null;
  const { t } = useTranslation();
  const [paymentOption, setPaymentOption] = useState("usdt");
  const allCoin = useSelector(getListCoinRealTime);
  const amcPrice = allCoin ? allCoin.find((c) => c.name == "AMC").price : 1;

  const amountPayment =
    paymentOption === "usdt" ? cardFee : roundedUp((cardFee / amcPrice) * 0.95);

  const handleChangePayment = (e) => {
    setPaymentOption(e.target.value);
  };

  const checkIsNumber = (value) => {
    return /^-?\d+$/.test(value);
  };

  function isOnlyLetters(value) {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(value);
  }

  const checkIsAddressValid = (value) => {
    const reg = /^[a-zA-Z0-9 /]+$/;

    if (!reg.test(value)) {
      return false;
    }

    return true;
  };
  const handleValidatePhoneField = (value) => {
    if (value.length > 0 && !checkIsNumber(value)) {
      return t("outsideComponent.t75");
    } else {
      return null;
    }
  };

  const handleValidateAge = (value) => {
    if (!checkIsNumber(value)) {
      return t("outsideComponent.t76");
    } else if (Number(value) <= 0 || Number(value) >= 200) {
      return t("outsideComponent.t76");
    } else {
      return null;
    }
  };

  const handleValidateAddress = (value) => {
    if (value.length > 0 && !checkIsAddressValid(value)) {
      // return t("outsideComponent.t77");
      return null;
    } else {
      return null;
    }
  };

  const handleValidateName = (value) => {
    if (value.length > 0 && !isOnlyLetters(value)) {
      return t("outsideComponent.t78");
    } else {
      return null;
    }
  };

  const handleValidateErrorFields = (field, value) => {
    const errorsMsgTemp = { ...errorsMsg };

    if (field === "name") {
      errorsMsgTemp.name = handleValidateName(value);
    }

    if (field === "age") {
      errorsMsgTemp.age = handleValidateAge(value);
    }

    if (field === "phone") {
      errorsMsgTemp.phone = handleValidatePhoneField(value);
    }

    if (field === "address") {
      errorsMsgTemp.address = handleValidateAddress(value);
    }

    setErrorsMsg(errorsMsgTemp);
  };

  const handleChangeInputField = (field) => (e) => {
    const value = e.currentTarget.value;

    setFormData({ ...formData, [field]: value });
    handleValidateErrorFields(field, value);
  };

  const handleRequestSubmit = async () => {
    if (isLoading || isDisabledBtn) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await axiosService.post("api/visaCard/signUpCardBinding", {
        fullName: formData.name,
        address: formData.address,
        phone: formData.phone,
        type: paymentOption === "usdt" ? "1" : "2",
      });

      setIsLoading(false);
      message.success(res.data.message);
      handleCloseModal();
    } catch (error) {
      setIsLoading(false);
      message.error(error.response.data.message);
    }
  };

  // return (
  //   <Modal
  //     title="Operations"
  //     open={isOpenModal}
  //     footer={false}
  //     onCancel={handleCloseModal}
  //   >
  //     <div className="formControlInside">
  //       <div className="rowInside">
  //         <div className="labelInside">{t("outsideComponent.t79")}</div>
  //         <div className="inputInside">
  //           <input
  //             value={formData.name}
  //             onChange={handleChangeInputField("name")}
  //           />

  //           {errorsMsg.name !== null && (
  //             <div className="errorInside">{errorsMsg.name}</div>
  //           )}
  //         </div>
  //       </div>

  //       <div className="rowInside">
  //         <div className="labelInside">{t("outsideComponent.t81")}</div>
  //         <div className="inputInside">
  //           <input
  //             value={formData.address}
  //             onChange={handleChangeInputField("address")}
  //           />

  //           {errorsMsg.address !== null && (
  //             <div className="errorInside">{errorsMsg.address}</div>
  //           )}
  //         </div>
  //       </div>

  //       <div className="rowInside">
  //         <div className="labelInside">{t("outsideComponent.t82")}</div>
  //         <div className="inputInside">
  //           <input
  //             value={formData.phone}
  //             onChange={handleChangeInputField("phone")}
  //           />

  //           {errorsMsg.phone !== null && (
  //             <div className="errorInside">{errorsMsg.phone}</div>
  //           )}
  //         </div>
  //       </div>

  //       <div style={{ color: "#fff" }}>
  //         <div style={{ marginBottom: "8px" }}>
  //           <div style={{ marginBottom: "6px" }}>Options payment:</div>

  //           <Radio.Group onChange={handleChangePayment} value={paymentOption}>
  //             <Radio value={"usdt"}>USDT</Radio>
  //             <Radio value={"amc"}>AMC {t("product.t99")}</Radio>
  //           </Radio.Group>
  //         </div>

  //         <div>
  //           <div style={{ marginBottom: "6px" }}>
  //             Balance USDT: {roundedUp(usdtBalance)}
  //           </div>
  //           <div>Balance AMC: {roundedUp(amcBalance)}</div>
  //         </div>

  //         <div>
  //           <div style={{ marginTop: "2px" }}>
  //             Amount need to payment: {amountPayment}{" "}
  //             {paymentOption.toLocaleUpperCase()}
  //           </div>
  //         </div>
  //       </div>

  //       <button
  //         className="btnInside"
  //         disabled={isDisabledBtn}
  //         onClick={handleRequestSubmit}
  //       >
  //         {t("outsideComponent.t83")}
  //       </button>
  //     </div>
  //   </Modal>
  // );

  return (
    <ModalV3 isOpenModal={isOpenModal} handleCloseModal={handleCloseModal}>
      <div className="Form4FieldV3">
        <div className="title">Operations</div>

        {/* NEW */}
        <div className="content">
          <div className="formItem">
            <div className="label">{t("outsideComponent.t79")}</div>
            <div className="inputContainer">
              <input
                value={formData.name}
                onChange={handleChangeInputField("name")}
                className={`inputInside ${
                  errorsMsg.name !== null ? "isError" : ""
                }`}
              />
            </div>
            {errorsMsg.name !== null && (
              <div className="errorMsg">{errorsMsg.name}</div>
            )}
          </div>

          <div className="formItem">
            <div className="label">{t("outsideComponent.t81")}</div>
            <div className="inputContainer">
              <input
                className={`inputInside ${
                  errorsMsg.address !== null ? "isError" : ""
                }`}
                value={formData.address}
                onChange={handleChangeInputField("address")}
              />
            </div>
            {errorsMsg.address !== null && (
              <div className="errorMsg">{errorsMsg.address}</div>
            )}
          </div>

          <div className="formItem">
            <div className="label">{t("outsideComponent.t82")}</div>
            <div className="inputContainer">
              <input
                className={`inputInside ${
                  errorsMsg.phone !== null ? "isError" : ""
                }`}
                value={formData.phone}
                onChange={handleChangeInputField("phone")}
              />
            </div>
            {errorsMsg.phone !== null && (
              <div className="errorMsg">{errorsMsg.phone}</div>
            )}
          </div>

          <div className="formItem">
            <div className="label">Options payment:</div>
            <div className="inputContainer">
              <Radio.Group onChange={handleChangePayment} value={paymentOption}>
                <Radio value={"usdt"} style={{ color: "#fff" }}>
                  USDT
                </Radio>
                <Radio value={"amc"} style={{ color: "#fff" }}>
                  AMC {t("product.t99")}
                </Radio>
              </Radio.Group>
            </div>
          </div>

          <div>
            <div>Balance USDT: {roundedUp(usdtBalance)}</div>
            <div>Balance AMC: {roundedUp(amcBalance)}</div>
            <div>
              Amount need to payment: {amountPayment}{" "}
              {paymentOption.toLocaleUpperCase()}
            </div>
          </div>

          <button
            className="btnInside"
            disabled={isDisabledBtn}
            onClick={handleRequestSubmit}
          >
            {t("outsideComponent.t83")}
          </button>
        </div>
      </div>
    </ModalV3>
  );
};
