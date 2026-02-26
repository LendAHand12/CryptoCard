import { coinString } from "src/constant";
import { FLOAT_NOTIF_CONSTANT } from "../constant/floatNotifConstant";

export const MOCK_NOTIF = {
  card_id: "21969637889900011496",
  detail: "Deposit money to card successfully",
  email: "test2@gmail.com",
  mc_trade_no: "77",
  notify_type: "RECHARGE",
  result: "1",
  title: "Input money to card",
  userName: "test2",
  userid: 1417,
};
const defaultState = {
  notifs: [],
  orderNotif: 0,
};

export const floatNotifReducer = (state = defaultState, action) => {
  switch (action.type) {
    case FLOAT_NOTIF_CONSTANT.CLEAR_NOTIF:
      return {
        ...state,
        notifs: [],
      };

    case FLOAT_NOTIF_CONSTANT.PUSH_NOTIF:
      const mappingWithKey = {
        ...action.payload,
        key: state.orderNotif,
      };
      const concatNotifs = [...state.notifs, mappingWithKey];

      return {
        ...state,
        notifs: concatNotifs,
        orderNotif: state.orderNotif + 1,
      };

    case FLOAT_NOTIF_CONSTANT.POP_NOTIF:
      const newNotifs = state.notifs.slice(1);

      return {
        ...state,
        notifs: newNotifs,
      };

    case FLOAT_NOTIF_CONSTANT.REMOVE_NOTIF:
      const newNotifsAfterRemove = state.notifs.filter(
        (notif) => notif.key !== action.payload
      );

      return {
        ...state,
        notifs: newNotifsAfterRemove,
      };

    default:
      return state;
  }
};
