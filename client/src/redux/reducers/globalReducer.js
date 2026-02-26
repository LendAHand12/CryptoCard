import { coinString } from "src/constant";
import { globalConstant } from "../constant/globalConstant";

export const GLOBAL_TYPE = {
  UPDATE_RATE_EUR_TO_USD: "UPDATE_RATE_EUR_TO_USD",
  UPDATE_BALANCES: "UPDATE_BALANCES",
};

const defaultState = {
  eurToUsdRate: 0,
  usdtBalance: 0,
  amcBalance: 0,
  heweBalance: 0,
  btcBalance: 0,
  ethBalance: 0,
  bnbBalance: 0,
  isLoggedIn: localStorage.getItem("accessToken"),
  profile: null,
  modals: {
    isOpenModalLogin: false,
    isOpenModalRegister: false,
  },
};

export const globalReducer = (state = defaultState, action) => {
  switch (action.type) {
    case GLOBAL_TYPE.UPDATE_RATE_EUR_TO_USD:
      return {
        ...state,
        eurToUsdRate: Number(action.payload),
      };

    case GLOBAL_TYPE.UPDATE_BALANCES:
      return {
        ...state,
        usdtBalance: Number(action.payload.usdt_balance || 0),
        amcBalance: Number(action.payload.amc_balance || 0),
        heweBalance: Number(action.payload.hewe_balance || 0),
        btcBalance: Number(action.payload.btc_balance || 0),
        bnbBalance: Number(action.payload.bnb_balance || 0),
        ethBalance: Number(action.payload.eth_balance || 0),
      };

    case globalConstant.LOGOUT:
      return defaultState;

    case globalConstant.SET_PROFILE:
      return { ...state, profile: action.payload };

    case globalConstant.SET_IS_OPEN_MODAL_LOGIN:
      return {
        ...state,
        modals: { ...state.modals, isOpenModalLogin: action.payload },
      };

    case globalConstant.SET_IS_OPEN_MODAL_REGISTER:
      return {
        ...state,
        modals: { ...state.modals, isOpenModalRegister: action.payload },
      };

    case globalConstant.SWITCH_LOGIN_TO_REGISTER:
      return {
        ...state,
        modals: {
          ...state.modals,
          isOpenModalLogin: false,
          isOpenModalRegister: true,
        },
      };

    case globalConstant.SWITCH_REGISTER_TO_LOGIN:
      return {
        ...state,
        modals: {
          ...state.modals,
          isOpenModalLogin: true,
          isOpenModalRegister: false,
        },
      };

    default:
      return state;
  }
};
