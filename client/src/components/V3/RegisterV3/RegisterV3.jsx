import { useTogglePassword } from "src/hooks/V3/useTogglePassword";
import { ModalV3 } from "../ModalV3/ModalV3";
import { useRegisterV3 } from "./hooks/useRegisterV3";
import "./RegisterV3.scss";
import { EyeAndSlashEye } from "../EyeAndSlashEye/EyeAndSlashEye";

export const RegisterV3 = () => {
  const {
    isOpenModalRegister,
    handleCloseModalRegister,
    handleSwitchRegisterToLogin,
    formik,
    loading,
    ref,
    t,
  } = useRegisterV3();
  const { isShow, handleTogglePassword } = useTogglePassword();
  const {
    isShow: isShowConfirm,
    handleTogglePassword: handleTogglePasswordConfirm,
  } = useTogglePassword();

  return (
    <ModalV3
      isOpenModal={isOpenModalRegister}
      handleCloseModal={handleCloseModalRegister}
    >
      <form className="RegisterV3">
        <div className="title">{t("register")}</div>

        <div className="content">
          <div className="formItem">
            <div className="label">{t("userName")}</div>
            <div className="inputContainer">
              <input
                className={`inputInside ${
                  formik.errors?.username ? "isError" : ""
                }`}
                placeholder={t("userName")}
                id="username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
              />
            </div>
            {formik.errors?.username && (
              <div className="errorMsg">{t(formik.errors?.username)}</div>
            )}
          </div>

          <div className="formItem">
            <div className="label">Email</div>
            <div className="inputContainer">
              <input
                className={`inputInside ${
                  formik.errors?.email ? "isError" : ""
                }`}
                placeholder="Email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
            </div>
            {formik.errors?.email && (
              <div className="errorMsg">{t(formik.errors?.email)}</div>
            )}
          </div>

          <div className="formItem">
            <div className="label">{t("password")}</div>
            <div className="inputContainer">
              <input
                className={`inputInside ${
                  formik.errors?.password ? "isError" : ""
                }`}
                placeholder={t("password")}
                type={isShow ? "text" : "password"}
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
              />

              <div className="eyeBtn">
                <EyeAndSlashEye
                  isShow={isShow}
                  handleClickEye={handleTogglePassword}
                />
              </div>
            </div>
            {formik.errors?.password && (
              <div className="errorMsg">{t(formik.errors?.password)}</div>
            )}
          </div>

          <div className="formItem">
            <div className="label">{t("confirmPassword")}</div>
            <div className="inputContainer">
              <input
                className={`inputInside ${
                  formik.errors?.password2 ? "isError" : ""
                }`}
                placeholder={t("confirmPassword")}
                type={isShowConfirm ? "text" : "password"}
                id="password2"
                name="password2"
                value={formik.values.password2}
                onChange={formik.handleChange}
              />

              <div className="eyeBtn">
                <EyeAndSlashEye
                  isShow={isShowConfirm}
                  handleClickEye={handleTogglePasswordConfirm}
                />
              </div>
            </div>
            {formik.errors?.password2 && (
              <div className="errorMsg">{t(formik.errors?.password2)}</div>
            )}
          </div>

          <div className="formItem">
            <div className="label">{t("referralCode")}</div>
            <div className="inputContainer">
              <input
                className="inputInside"
                id="referral"
                name="referral"
                value={ref}
                readOnly
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="btnInside"
            onClick={formik.handleSubmit}
          >
            {t("createAccount")}
          </button>

          <div className="hasAccount">
            <span>{t("alreadyHadAnAccount")} </span>
            <span
              className="sign text-gradient-t-b"
              onClick={handleSwitchRegisterToLogin}
            >
              {t("logIn")}
            </span>
          </div>
        </div>
      </form>
    </ModalV3>
  );
};
