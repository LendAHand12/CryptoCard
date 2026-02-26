import { FLOAT_NOTIF_CONSTANT } from "../constant/floatNotifConstant";

export const pushNotifAction = (payload) => {
  return {
    type: FLOAT_NOTIF_CONSTANT.PUSH_NOTIF,
    payload,
  };
};

export const popNotifAction = (payload) => {
  return {
    type: FLOAT_NOTIF_CONSTANT.POP_NOTIF,
    payload,
  };
};

export const removeNotifAction = (payload) => {
  return {
    type: FLOAT_NOTIF_CONSTANT.REMOVE_NOTIF,
    payload,
  };
};

export const CLEAR_NOTIF = () => {
  return {
    type: FLOAT_NOTIF_CONSTANT.CLEAR_NOTIF,
  };
};
