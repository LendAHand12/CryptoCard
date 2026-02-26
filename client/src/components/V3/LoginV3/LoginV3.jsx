import { useTogglePassword } from "src/hooks/V3/useTogglePassword";
import { ModalV3 } from "../ModalV3/ModalV3";
import { useLoginV3 } from "./hooks/useLoginV3";
import "./LoginV3.scss";
import { EyeAndSlashEye } from "../EyeAndSlashEye/EyeAndSlashEye";
import { Spin } from "antd";
import { errorMessage } from "src/constant";
import { useTranslation } from "react-i18next";

export const LoginV3 = () => {
  const {
    isOpenModalLogin,
    handleCloseModalLogin,
    handleSwitchLoginToRegister,
    handleLogin,
    formData,
    messageError,
    handleChangeInputField,
    isDisabledBtnLogin,
    isLoading,
    handleForgotPassword,
  } = useLoginV3();
  const { isShow, handleTogglePassword } = useTogglePassword();
  const { t } = useTranslation();

  return (
    <ModalV3
      isOpenModal={isOpenModalLogin}
      handleCloseModal={handleCloseModalLogin}
    >
      <div className="LoginV3">
        <div className="title">{t("login")}</div>

        <div className="content">
          <div className="formItem">
            <div className="label">{t("userName")}</div>
            <div className="inputContainer">
              <input
                value={formData.username}
                onChange={handleChangeInputField("username")}
                className={`inputInside ${
                  messageError.username !== null ? "isError" : ""
                }`}
                placeholder={t("userName")}
              />
            </div>
            {messageError.username !== null && (
              <div className="errorMsg">{messageError.username}</div>
            )}
          </div>

          <div className="formItem">
            <div className="label">{t("password")}</div>
            <div className="inputContainer">
              <input
                className={`inputInside ${
                  messageError.password !== null ? "isError" : ""
                }`}
                placeholder={t("password")}
                type={isShow ? "text" : "password"}
                value={formData.password}
                onChange={handleChangeInputField("password")}
              />

              <div className="eyeBtn">
                <EyeAndSlashEye
                  isShow={isShow}
                  handleClickEye={handleTogglePassword}
                />
              </div>
            </div>
            {messageError.password !== null && (
              <div className="errorMsg">{messageError.password}</div>
            )}
          </div>

          <div className="forgot" onClick={handleForgotPassword}>
            {t("forgotPassword")}?
          </div>

          <button
            className="btnInside"
            disabled={isDisabledBtnLogin}
            onClick={handleLogin}
          >
            {isLoading ? <Spin /> : t("login")}
          </button>

          <div className="noAccount">
            <span>{t("dontHaveAnAccount")} </span>
            <span
              className="sign text-gradient-t-b"
              onClick={handleSwitchLoginToRegister}
            >
              {t("letsSignUp")}
            </span>
          </div>
        </div>
      </div>
    </ModalV3>
  );
};
