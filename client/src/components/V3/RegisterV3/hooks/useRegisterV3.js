import { useFormik } from "formik";
import { t } from "i18next";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { commontString, errorMessage, url } from "src/constant";
import { callToastError, callToastSuccess } from "src/function/toast/callToast";
import {
  setIsOpenModalRegisterAction,
  setIsSwitchRegisterToLoginAction,
} from "src/redux/actions/globalActions";
import { axiosService } from "src/util/service";
import * as Yup from "yup";

export const useRegisterV3 = () => {
  const { isOpenModalRegister } = useSelector(
    (state) => state.globalReducer.modals
  );
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const search = new URLSearchParams(window.location.search);
  const ref = search.get("ref");
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: "",
      email: "",
      password: "",
      password2: "",
      referral: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("require")
        .matches(/^[a-zA-Z0-9@]+$/, "noSpace")
        .min(6, "usernameMustBeGreaterThanOrEqualTo3Characters")
        .max(12, "usernameMustBeLessThanOrEqualTo3Characters"),
      email: Yup.string().required("require").email("invalidEmail"),
      password: Yup.string()
        .required("require")
        .min(6, "passwordMustBeGreaterThanOrEqualTo6Characters"),
      password2: Yup.string()
        .required("require")
        .oneOf([Yup.ref("password"), null], "passwordNotMatch"),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      await handleSignUp(
        {
          Referral: ref || "67d5497458ce",
          email: values.email,
          password: values.password2,
          userName: values.username,
          tokenRecaptcha: "abc",
        },
        resetForm
      );
    },
  });

  const handleSignUp = async (info, callbackFn) => {
    setLoading(true);
    try {
      await axiosService.post("/api/user/signup", info);

      if (typeof callbackFn === "function") {
        callbackFn();
      }

      callToastSuccess(t(commontString.success));
      handleCloseModalRegister();

      history.replace(url.confirm_email);
    } catch (error) {
      const errorMes =
        error?.response?.data?.message || error?.response?.data?.errors[0]?.msg;
      let showError = "";
      switch (errorMes) {
        case errorMessage.accountExist:
          showError = t("theAccountNameAlreadyExistsInTheSystem");
          break;
        case errorMessage.emailExist:
          showError = t("emailAlreadyExistsInTheSystem");
          break;
        case errorMessage.password_2:
          showError = t("passwordMustBeGreaterThanOrEqualTo6Characters");
          break;
        case errorMessage.usernameMini:
          showError = t("usernameMustBeGreaterThanOrEqualTo3Characters");
          break;
        default:
          showError = errorMes;
          break;
      }
      callToastError(showError);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModalRegister = () => {
    dispatch(setIsOpenModalRegisterAction(false));
  };

  const handleOpenModalRegister = () => {
    dispatch(setIsOpenModalRegisterAction(true));
  };

  const handleSwitchRegisterToLogin = () => {
    dispatch(setIsSwitchRegisterToLoginAction());
  };

  return {
    isOpenModalRegister,
    handleCloseModalRegister,
    handleOpenModalRegister,
    handleSwitchRegisterToLogin,
    formik,
    loading,
    ref,
    t,
  };
};
