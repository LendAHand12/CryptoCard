import { globalConstant } from "../constant/globalConstant";

export const setProfileAction = (payload) => {
  return {
    type: globalConstant.SET_PROFILE,
    payload,
  };
};

export const logoutAction = () => {
  return {
    type: globalConstant.LOGOUT,
  };
};

export const setIsOpenModalLoginAction = (payload) => {
  return {
    type: globalConstant.SET_IS_OPEN_MODAL_LOGIN,
    payload,
  };
};

export const setIsOpenModalRegisterAction = (payload) => {
  return {
    type: globalConstant.SET_IS_OPEN_MODAL_REGISTER,
    payload,
  };
};

export const setIsSwitchLoginToRegisterAction = () => {
  return {
    type: globalConstant.SWITCH_LOGIN_TO_REGISTER,
  };
};

export const setIsSwitchRegisterToLoginAction = () => {
  return {
    type: globalConstant.SWITCH_REGISTER_TO_LOGIN,
  };
};
