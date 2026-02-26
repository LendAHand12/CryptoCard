import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  defaultLanguage,
  errorMessage,
  localStorageVariable,
  url,
} from "src/constant";
import { callToastError, callToastSuccess } from "src/function/toast/callToast";
import {
  setIsOpenModalLoginAction,
  setIsSwitchLoginToRegisterAction,
} from "src/redux/actions/globalActions";
import { checkAdmin as checkAdminCallApi } from "src/util/adminCallApi";
import {
  getLocalStorage,
  messageTransferHandle,
  removeLocalStorage,
  setLocalStorage,
} from "src/util/common";
import { axiosService } from "src/util/service";
import { userWalletFetchCount } from "src/redux/actions/coin.action";
import socket from "src/util/socket";
import useForm from "src/hooks/use-form";
import { message } from "antd";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

export const useLoginV3 = () => {
  const { isOpenModalLogin } = useSelector(
    (state) => state.globalReducer.modals
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [messageError, setMessageError] = useState({
    username: null,
    password: null,
  });
  const history = useHistory();

  const isDisabledBtnLogin =
    formData.username.trim() === "" ||
    formData.password.trim() === "" ||
    messageError.username !== null ||
    messageError.password !== null ||
    isLoading;

  const handleForgotPassword = () => {
    handleCloseModalLogin();
    history.replace(url.recovery_password);
  };

  const handleChangeInputField = (field) => (e) => {
    const value = e.target.value;

    setFormData({ ...formData, [field]: value });
    handleValidateField(field, value);
  };

  const handleValidateField = (field, value) => {
    let errorsTemp = {
      username: messageError.username,
      password: messageError.password,
    };

    if (field === "username") {
      if (value.trim().length < 3) {
        errorsTemp.username = t("v3.t1");
      } else {
        errorsTemp.username = null;
      }
    }

    if (field === "password") {
      if (value.trim().length < 6) {
        errorsTemp.password = t("v3.t2");
      } else {
        errorsTemp.password = null;
      }
    }

    setMessageError(errorsTemp);
  };

  const handleLogin = async () => {
    if (isLoading || isDisabledBtnLogin) return;

    setIsLoading(true);

    try {
      const response = await axiosService.post("/api/user/login", {
        userName: formData.username,
        password: formData.password,
      });

      // logic cũ (chưa dám sửa hay optimize)
      removeLocalStorage(localStorageVariable.expireToken);
      callToastSuccess(t("loggedInSuccessfully"));
      setLocalStorage(localStorageVariable.token, response.data.data.token);
      setLocalStorage(localStorageVariable.user, response.data.data);

      dispatch({ type: "USER_LOGIN" });
      dispatch(userWalletFetchCount());

      socket.emit("join", response.data.data.id);

      //lắng nghe các thông báo về chuyền tiền
      //  socket.on("messageTransfer", (res) => {
      //   messageTransferHandle(res, t);
      // });

      // chưa biết đoạn này để làm gì???
      // call api nếu là để check xem người dùng có phải là admin hay không
      (await handleCheckAdmin())
        ? dispatch({ type: "USER_ADMIN", payload: true })
        : dispatch({ type: "USER_ADMIN", payload: false });

      setIsLoading(false);
      handleCloseModalLogin();
      redirectToAdmin(response.data.data);
    } catch (error) {
      setIsLoading(false);
      callToastError(t("incorrectAccountOrPassword"));
    }
  };

  const handleCloseModalLogin = () => {
    dispatch(setIsOpenModalLoginAction(false));
  };

  const handleOpenModalLogin = () => {
    dispatch(setIsOpenModalLoginAction(true));
  };

  const handleSwitchLoginToRegister = () => {
    dispatch(setIsSwitchLoginToRegisterAction());
  };

  const handleCheckAdmin = async () => {
    try {
      await checkAdminCallApi();

      return true;
    } catch (error) {
      return false;
    }
  };

  const redirectToAdmin = function (userProfile) {
    const { id } = userProfile;
    if (id === 1) {
      history.push(url.admin_user);
      return;
    } else {
      history.push(url.home);
    }
  };

  // tại sao lại phải clear ???
  // logic cũ clear cái này là bởi vì lúc đó chỉ cần vào trang login là clear, còn bây giờ là mở modal login thay vì trang riêng
  // useEffect(() => {
  //   localStorage.clear();
  // }, []);

  return {
    isOpenModalLogin,
    handleCloseModalLogin,
    handleOpenModalLogin,
    handleSwitchLoginToRegister,
    handleLogin,
    formData,
    messageError,
    handleChangeInputField,
    isDisabledBtnLogin,
    isLoading,
    handleForgotPassword,
  };
};
