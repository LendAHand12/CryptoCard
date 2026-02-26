import { useEffect, useRef } from "react";

import { BrowserRouter, Switch, Route } from "react-router-dom";
import CreateBuySell from "./components/CreateBuySell";
import Login from "./components/Login";
import P2PTrading from "./components/P2PTrading";
import Signup from "./components/Signup";
import Swap from "./components/Swap";
import Wallet from "./components/Wallet";
import Config from "./Config";
import MainTemplate from "./templates/MainTemplate";
import SwaptobeWallet from "./components/seresoWallet";
import Profile from "./components/profile";
import Dashboard from "./components/admin/dashboard";
import AdminTemplate from "./templates/AdminTemplate";
import Home from "./components/home/index.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  exchangeRateSell,
  getExchange as getExchangeApi,
  getListBank,
  getListHistoryP2pPendding,
  getWalletApi,
} from "./util/userCallApi";
import {
  currencySetExchange,
  currencySetExchangeFetchStatus,
} from "./redux/actions/currency.action";
import { getFetchExchangeCount } from "./redux/constant/currency.constant";
import socket from "./util/socket";
import {
  setListCoinRealtime,
  setTotalAssetsBtcRealTime,
  setTotalAssetsRealTime,
} from "./redux/actions/listCoinRealTime.action";
import { userWalletFetchCount } from "./redux/constant/coin.constant";
import { coinUserWallet } from "./redux/actions/coin.action";
import {
  getLocalStorage,
  messageTransferHandle,
  removeLocalStorage,
  roundDecimalValues,
  roundDownDecimalValues,
  setIsMainAccount,
} from "./util/common";
import {
  getExchangeRateDisparityFetchCount,
  setExchangeRateDisparity,
  setExchangeRateDisparityApiStatus,
} from "./redux/reducers/exchangeRateDisparitySlice";
import { exchangeRateDisparity as exchangeRateDisparityCallApi } from "src/util/userCallApi";
import ExchangeRateDisparity from "./components/admin/exchangeRateDisparity";
import { api_status, localStorageVariable, url } from "./constant";
import Ads from "./components/admin/ads";
import TransactionSell from "./components/transactionSell";
import Confirm from "./components/confirm";
import AdsHistory from "./components/adsHistory";
import Exchange from "./components/admin/exchange";
import P2pManagement from "./components/p2pManagement";
import TransactionBuy from "./components/transactionBuy";
import Widthdraw from "./components/admin/widthdraw";
import User from "./components/admin/user";
import { create, all } from "mathjs";
import { setNotify } from "./redux/reducers/notifiyP2pSlice";
import RecoveryPassword from "./components/recoveryPassword";
import ForgotPassword from "./components/forgotPassword";
import Verify from "./components/verify";
import ConfirmEmail from "./components/confirmEmail";
import ConfigData from "./components/admin/configData";
import Transfer from "./components/seresoWallet/transfer";
import FormWithdraw from "./components/seresoWallet/walletWithdraw";
import TermOfService from "./components/V3/TermOfService/TermOfService";
import SerepayWalletDeposit from "./components/seresoWallet/walletDeposite";
import SwapAdmin from "./components/admin/swap";
import TransferAdmin from "./components/admin/transferAdmin";
import { setListBank, setStatus } from "./redux/reducers/bankSlice";
import {
  getExchangeRateSellFetchCount,
  setExchangeRateSell,
  setExchangeRateSellApiStatus,
} from "./redux/reducers/exchangeRateSellSlice";
import P2p from "./components/p2p";
import Deposite from "./components/admin/deposite";
import KycAdmin from "./components/admin/kyc";
import P2pAdmin from "./components/admin/p2p";
import { useTranslation } from "react-i18next";
import UserDetail from "./components/admin/user-detail";
import AdminManagement from "./components/admin/admin-management";
import { checkAdmin } from "./util/adminCallApi";
import {
  CardHall,
  HomeV2,
  Product,
  CardRegisterForm,
  CardManage,
  CardManageDetail,
  CardApplication,
  CardApplicationDetail,
  CardTransaction,
  CreateVisaCard,
  CardHistoryCreate,
  CardCreatedSuccess,
  CardDeposit,
  CardHistoryDeposit,
  CreateCardSuccessScreen,
  CardKYC,
  CardHistoryPaymentPage,
  ReKYC,
  DepositAmcAndHewe,
  WithdrawAmcAndHewe,
  SwapToken,
} from "./components/NewVersion";
import { useState } from "react";
import CardTemplate from "./templates/CardTemplate";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import { pushNotifAction } from "./redux/actions/floatNotifActions";
import { MOCK_NOTIF } from "./redux/reducers/floatNotifReducer";
import { axiosService } from "./util/service";
import { GLOBAL_TYPE } from "./redux/reducers/globalReducer";
import { CardPage } from "./components/NewVersion/Admin/CardPage/CardPage";
import { AdminCommission } from "./components/admin/adminCommission/AdminCommission";
import { HistoryRegisterCard } from "./components/NewVersion/HistoryRegisterCard/HistoryRegisterCard";
import { HistoryRegisterCardAdmin } from "./components/NewVersion/Admin/HistoryRegisterCardAdmin/HistoryRegisterCardAdmin";
import { HeweDB } from "./components/admin/HeweDB/HeweDB";
import { ReKYCPhysicCard } from "./components/NewVersion/CardManagement/ReKYCPhysicCard/ReKYCPhysicCard";
import { AdminKycUser } from "./components/admin/AdminKycUser/AdminKycUser.jsx";
import { HistoryBuyHeweAmc } from "./components/admin/HistoryBuyHeweAmc/HistoryBuyHeweAmc";
import { HistoryUpdateWallet } from "./components/admin/HistoryUpdateWallet/HistoryUpdateWallet";
import { HomeV3 } from "./components/V3/HomeV3/HomeV3";
import { ProductV3 } from "./components/V3/ProductV3/ProductV3";
import { BaseLayout } from "./components/V3/BaseLayout/BaseLayout";
import { WalletV3 } from "./components/V3/WalletV3/WalletV3";
import { CardDepositHistoryV3 } from "./components/V3/CardDepositHistoryV3/CardDepositHistoryV3";
import {
  RegisterCardHistory,
  RegisterCardHistoryV3,
} from "./components/V3/RegisterCardHistory/RegisterCardHistoryV3";
import { ProfileV3 } from "./components/V3/ProfileV3/ProfileV3";
import { ReferralV3 } from "./components/V3/ReferralV3/ReferralV3";
import { KYCV3 } from "./components/V3/KYCV3/KYCV3";
import { MyCardV3 } from "./components/V3/MyCardV3/MyCardV3";
import { LANGUAGUS } from "./components/NewVersion";
import { CardDetailV3 } from "./components/V3/CardDetailV3/CardDetailV3";
import { HistoryDepositToCard } from "./components/admin/HistoryDepositToCard/HistoryDepositToCard";
import { WalletDepositHistoryV3 } from "./components/V3/WalletDepositHistoryV3/WalletDepositHistoryV3";
// import { UserInfo } from "./components/NewVersion/Admin/UserInfo/UserInfo";

const config = {};
export const math = create(all, config);

export const fetchNotify = function (dispatchHook) {
  return new Promise((resolve, reject) => {
    getListHistoryP2pPendding({ limit: 100, page: 1 })
      .then((resp) => {
        const data = resp?.data?.data?.total || 0;
        dispatchHook(setNotify(data));
        resolve(true);
      })
      .catch((error) => {});
  });
};

function App() {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.loginReducer.isLogin);
  const fetchExchangeCount = useSelector(getFetchExchangeCount);
  const userWalletFetch = useSelector(userWalletFetchCount);
  const getExchangeRateDisparityFetch = useSelector(
    getExchangeRateDisparityFetchCount
  );
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en-US");

  const getExchangeRateSellFetch = useSelector(getExchangeRateSellFetchCount);
  const { t, i18n } = useTranslation();

  const userWallet = useRef([]);

  const getExchange = function () {
    dispatch(currencySetExchangeFetchStatus(api_status.fetching));
    getExchangeApi()
      .then((resp) => {
        dispatch(currencySetExchangeFetchStatus(api_status.fulfilled));
        dispatch(currencySetExchange(resp.data.data));
      })
      .catch((error) => {
        dispatch(currencySetExchangeFetchStatus(api_status.rejected));
      });
  };
  const getUserWallet = function () {
    const listAllCoinPromise = new Promise((resolve) => {
      socket.once("listCoin", (res) => {
        resolve(res);
      });
    });

    listAllCoinPromise.then((listAllCoin) => {
      getWalletApi()
        .then((resp) => {
          const apiResp = resp.data.data;
          const result = {};
          for (const [name, value] of Object.entries(apiResp)) {
            let price =
              listAllCoin.filter(
                (item) =>
                  item.name === name.replace("_balance", "").toUpperCase()
              )[0]?.price ?? 0;
            result[name] = roundDownDecimalValues(value, price);
          }
          if (Object.keys(result)) {
            userWallet.current = result;
            dispatch(coinUserWallet(result));
          }
        })
        .catch(() => {});
    });
  };
  const getExchangeRateDisparityApi = function () {
    dispatch(setExchangeRateDisparityApiStatus(api_status.fetching));
    exchangeRateDisparityCallApi({
      name: "exchangeRate",
    })
      .then((resp) => {
        const rate = resp.data.data[0].value;
        dispatch(setExchangeRateDisparity(rate));
      })
      .catch((error) => {
        dispatch(setExchangeRateDisparityApiStatus(api_status.rejected));
      });
  };
  const calTotalAssets = function (listCoinRealTime, userWallet) {
    if (
      !listCoinRealTime ||
      listCoinRealTime.length <= 0 ||
      !userWallet ||
      userWallet.length <= 0
    ) {
      return -1;
    }
    let result = 0;
    for (const [coinBalance, amount] of Object.entries(userWallet)) {
      const coinName = coinBalance.replace("_balance", "").toUpperCase();
      const price = listCoinRealTime.find(
        (item) => item.name === coinName
      )?.price;
      if (price) {
        result += +amount * price;
      }
    }
    return result;
  };
  const calTotalAssetsBtc = function (totalUsd, listCoinRealTime) {
    if (
      !totalUsd ||
      !listCoinRealTime ||
      totalUsd <= 0 ||
      listCoinRealTime.length <= 0
    )
      return;
    const priceBtc = listCoinRealTime.find(
      (item) => item.name === "BTC"
    )?.price;
    return roundDecimalValues(totalUsd / priceBtc, 100000000);
  };
  const fetchListBank = async function () {
    try {
      dispatch(setStatus(api_status.fetching));
      const listBank = (await getListBank())?.data;
      dispatch(
        setListBank(
          listBank.map((item) => ({
            image: item.logo,
            content: `${item.shortName} (${item.code})`,
            id: item.id,
            code: item.code,
            bin: item.bin,
            shortName: item.shortName,
          }))
        )
      );
      dispatch(setStatus(api_status.fulfilled));
    } catch (error) {
      dispatch(setStatus(api_status.rejected));
    }
  };
  const getExchangeRateSell = async function () {
    try {
      dispatch(setExchangeRateSellApiStatus(api_status.fetching));
      const resp = await exchangeRateSell();
      dispatch(setExchangeRateSell(resp?.data?.data.at(0)?.value));
    } catch (error) {
      dispatch(setExchangeRateSellApiStatus(api_status.rejected));
    }
  };
  const checkAccountAdmin = async () => {
    try {
      (await checkAdmin())
        ? dispatch({ type: "USER_ADMIN", payload: true })
        : dispatch({ type: "USER_ADMIN", payload: false });
    } catch (error) {}
  };

  const getRateEurToUsd = async () => {
    try {
      const res = await axiosService.post("api/p2pBank/getConfig", {
        name: "EURTOUSD", /// get tỉ giá EUR/USDT
      });

      dispatch({
        type: GLOBAL_TYPE.UPDATE_RATE_EUR_TO_USD,
        payload: res.data.data[0].value,
      });
    } catch (error) {}
  };

  const getWalletGlobal = async () => {
    try {
      const res = await axiosService.post("api/user/getWallet");

      dispatch({
        type: GLOBAL_TYPE.UPDATE_BALANCES,
        payload: res.data.data,
      });
    } catch (error) {}
  };

  useEffect(() => {
    getRateEurToUsd();
    getWalletGlobal();
  }, []);

  useEffect(() => {
    if (getLocalStorage(localStorageVariable.user)) {
      const user = getLocalStorage(localStorageVariable.user);
      socket.emit("join", user.id);
      socket.on("ok", (res) => {});
      if (user.expiresInRefreshToken < Date.now()) {
        removeLocalStorage(localStorageVariable.token);
        removeLocalStorage(localStorageVariable.user);
      }
    }
    socket.connect();
    socket.on("listCoin", (resp) => {
      dispatch(setListCoinRealtime(resp));
      const total = calTotalAssets(resp, userWallet.current);
      dispatch(setTotalAssetsRealTime(total));
      dispatch(setTotalAssetsBtcRealTime(calTotalAssetsBtc(total, resp)));
    });

    // kiểm tra xem có đang
    if (isLogin) {
      socket.on("messageTransfer", (res) => {
        messageTransferHandle(res, t);
      });
    }

    // kiểm tra xem tài khoản đang đăng nhập có phải là admin hay không
    checkAccountAdmin();

    fetchListBank();

    return () => {
      socket.disconnect();
    };
  }, []);
  useEffect(() => {
    if (isLogin) {
      socket.on("createP2p", (res) => {
        fetchNotify(dispatch);
      });
    } else {
      dispatch(setNotify(-1));
      socket.off("createP2p");
    }
  }, [isLogin]);
  useEffect(() => {
    getExchange();
  }, [fetchExchangeCount]);
  useEffect(() => {
    isLogin && getUserWallet();
  }, [userWalletFetch, isLogin]);
  useEffect(() => {
    getExchangeRateDisparityApi();
  }, [getExchangeRateDisparityFetch]);
  useEffect(() => {
    getExchangeRateSell();
  }, [getExchangeRateSellFetch]);

  useEffect(() => {
    if (isLogin) {
      socket.on(`notification`, (res) => {
        dispatch(pushNotifAction(res));
      });
    }
  }, [isLogin]);

  // test notif
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     dispatch(pushNotifAction(MOCK_NOTIF));
  //   }, 5000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  useEffect(() => {
    const langFromLS = localStorage.getItem("lang");

    if (!langFromLS) {
      localStorage.setItem("lang", lang);
    } else {
      try {
        const founded = LANGUAGUS.find((l) => l.value === langFromLS);

        if (!founded) {
          localStorage.setItem("lang", "en-US");
          i18n.changeLanguage("en-US");
          setLang("en-US");
          return;
        }

        i18n.changeLanguage(langFromLS);
      } catch (error) {}
    }
  }, [lang]);

  return (
    <BrowserRouter>
      <Config>
        {/* <Switch>
          <MainTemplate path={url.ads_history} component={AdsHistory} />
          <MainTemplate path={url.confirm} component={Confirm} />
          <MainTemplate path={url.transaction_buy} component={TransactionBuy} />
          <MainTemplate
            path={url.transaction_sell}
            component={TransactionSell}
          />
          <MainTemplate path={url.profile} component={Profile} />
          <MainTemplate path={url.p2p} component={P2p} />
          <MainTemplate path={url.wallet} component={SwaptobeWallet} />
          <MainTemplate path={url.p2p_management} component={P2pManagement} />
          <MainTemplate path="/p2p-trading" component={P2PTrading} />
          <MainTemplate path="/swap" component={Swap} />
          <MainTemplate path="/create-ads/buy" component={CreateBuySell} />
          <MainTemplate path="/create-ads/sell" component={CreateBuySell} />
          <MainTemplate path="/login" component={Login} />
          <MainTemplate path="/signup" component={Signup} />
          <MainTemplate
            path={url.recovery_password}
            component={RecoveryPassword}
          />
          <MainTemplate path={url.deposite} component={SerepayWalletDeposit} />
          <MainTemplate path={url.forgot_password} component={ForgotPassword} />
          <MainTemplate path={url.transfer} component={Transfer} />
          <MainTemplate path={url.widthdraw} component={FormWithdraw} />
          <MainTemplate path="/wallet" component={Wallet} />
          <MainTemplate path={url.confirm_email} component={ConfirmEmail} />
          <MainTemplate path={url.verify} component={Verify} />
          <AdminTemplate path="/admin/dashboard" component={Dashboard} />
          <AdminTemplate path="/admin/ads" component={Ads} />
          <AdminTemplate path={url.admin_configData} component={ConfigData} />
          <AdminTemplate path={url.admin_widthdraw} component={Widthdraw} />
          <AdminTemplate path={url.admin_exchange} component={Exchange} />
          <AdminTemplate path={url.admin_user} component={User} />
          <AdminTemplate
            path={url.admin_exchangeRateDisparity}
            component={ExchangeRateDisparity}
          />
          <AdminTemplate path={url.admin_transfer} component={TransferAdmin} />
          <AdminTemplate path={url.admin_swap} component={SwapAdmin} />
          <AdminTemplate path={url.admin_kyc} component={KycAdmin} />
          <AdminTemplate path={url.admin_deposit} component={Deposite} />
          <AdminTemplate path={url.admin_p2p} component={P2pAdmin} />
          <AdminTemplate path={url.admin_userDetail} component={UserDetail} />
          <AdminTemplate path={url.admin_adminManagement} component={AdminManagement} />
          <Route exact path="/" component={Home} />
        </Switch> */}

        {/* Migrate new version */}
        <Switch>
          <MainTemplate path={url.ads_history} component={AdsHistory} />
          <MainTemplate path={url.confirm} component={Confirm} />
          <MainTemplate path={url.transaction_buy} component={TransactionBuy} />
          <MainTemplate
            path={url.transaction_sell}
            component={TransactionSell}
          />
          <MainTemplate path={url.profile} component={Profile} />
          <MainTemplate path={url.p2p} component={P2p} />
          <MainTemplate path={url.wallet} component={SwaptobeWallet} />
          <MainTemplate path={url.p2p_management} component={P2pManagement} />
          <MainTemplate path="/p2p-trading" component={P2PTrading} />
          {/* <MainTemplate path="/swap" component={Swap} /> */}
          <MainTemplate path="/create-ads/buy" component={CreateBuySell} />
          <MainTemplate path="/create-ads/sell" component={CreateBuySell} />
          <MainTemplate path="/login" component={Login} />
          <MainTemplate path="/signup" component={Signup} />
          <MainTemplate
            path={url.recovery_password}
            component={RecoveryPassword}
          />
          <MainTemplate path={url.deposite} component={SerepayWalletDeposit} />
          <MainTemplate path={url.forgot_password} component={ForgotPassword} />
          <MainTemplate path={url.transfer} component={Transfer} />
          {/* <MainTemplate path={url.widthdraw} component={FormWithdraw} /> */}
          <MainTemplate path="/wallet" component={Wallet} />
          <MainTemplate path={url.confirm_email} component={ConfirmEmail} />
          <MainTemplate path={url.verify} component={Verify} />
          <MainTemplate path={"/product"} component={Product} />
          {/* <MainTemplate path={"/product-v3"} component={ProductV3} /> */}

          <MainTemplate path={"/swap-amc"} component={SwapToken} />
          <MainTemplate path={"/swap-hewe"} component={SwapToken} />

          <AdminTemplate path="/admin/dashboard" component={Dashboard} />
          <AdminTemplate path="/admin/ads" component={Ads} />
          <AdminTemplate path={url.admin_configData} component={ConfigData} />
          {/* <AdminTemplate path={url.admin_widthdraw} component={Widthdraw} /> */}
          <AdminTemplate path={url.admin_exchange} component={Exchange} />
          <AdminTemplate path={url.admin_user} component={User} />
          <AdminTemplate
            path={url.admin_exchangeRateDisparity}
            component={ExchangeRateDisparity}
          />
          <AdminTemplate path={url.admin_transfer} component={TransferAdmin} />
          <AdminTemplate path={url.admin_swap} component={SwapAdmin} />
          <AdminTemplate path={url.admin_kyc} component={KycAdmin} />
          <AdminTemplate path={url.admin_deposit} component={Deposite} />
          <AdminTemplate path={url.admin_p2p} component={P2pAdmin} />
          <AdminTemplate path={url.admin_userDetail} component={UserDetail} />
          <AdminTemplate
            path={url.admin_commission}
            component={AdminCommission}
          />
          {/* <AdminTemplate path={url.admin_userInfo} component={UserInfo} /> */}
          <AdminTemplate path={url.admin_card} component={CardPage} />
          <AdminTemplate
            path={url.admin_adminManagement}
            component={AdminManagement}
          />
          <AdminTemplate
            path={url.admin_registerCard}
            component={HistoryRegisterCardAdmin}
          />
          <AdminTemplate path={url.admin_hewedb} component={HeweDB} />
          <AdminTemplate path={url.admin_kyc_user} component={AdminKycUser} />
          <AdminTemplate
            path={url.admin_history_buy_hewe_amc}
            component={HistoryBuyHeweAmc}
          />
          <AdminTemplate
            path={url.admin_update_wallet}
            component={HistoryUpdateWallet}
          />
          <AdminTemplate
            path={url.admin_history_deposit_crypto_to_card}
            component={HistoryDepositToCard}
          />
          {/* <MainTemplate path={"/management-card"} component={CardManage} /> */}

          {/* <Route exact path="/" component={HomeV2} /> */}
          {/* <BaseLayout path="/" isNeedLogin={false} component={HomeV3} /> */}

          <Route exact path="/" component={HomeV3} />
          <BaseLayout
            isNeedLogin={false}
            path="/term-of-service"
            component={TermOfService}
          />

          <BaseLayout
            path="/product-v3"
            isNeedLogin={false}
            component={ProductV3}
          />

          <BaseLayout
            path="/wallet-v3"
            isNeedLogin={true}
            component={WalletV3}
          />

          <BaseLayout
            path="/card-deposit-history-v3"
            isNeedLogin={true}
            component={CardDepositHistoryV3}
          />

          <BaseLayout
            path="/register-card-history-v3"
            isNeedLogin={true}
            component={RegisterCardHistoryV3}
          />

          <BaseLayout
            path="/profile-v3"
            isNeedLogin={true}
            component={ProfileV3}
          />

          <BaseLayout
            path="/referral-v3"
            isNeedLogin={true}
            component={ReferralV3}
          />

          <BaseLayout path="/kyc-v3" isNeedLogin={false} component={KYCV3} />

          <BaseLayout
            path="/my-card-v3"
            isNeedLogin={true}
            component={MyCardV3}
          />

          <BaseLayout
            path="/card-detail-v3"
            isNeedLogin={true}
            component={CardDetailV3}
          />

          <BaseLayout
            path="/wallet-deposit-history-v3"
            isNeedLogin={true}
            component={WalletDepositHistoryV3}
          />

          <MainTemplate path={"/create-visa-card"} component={CreateVisaCard} />
          {/* <MainTemplate
            path={"/history-create-card"}
            component={CardHistoryCreate}
          /> */}
          <MainTemplate
            path={"/card-visa-detail"}
            component={CardManageDetail}
          />
          <MainTemplate
            path={"/card-created-success"}
            component={CardCreatedSuccess}
          />
          <MainTemplate path={"/card-deposit"} component={CardDeposit} />
          <MainTemplate
            path={"/history-deposit-card"}
            component={CardHistoryDeposit}
          />
          <MainTemplate
            path={"/history-deposit-card"}
            component={CardHistoryDeposit}
          />
          <MainTemplate
            path={"/success-created-card"}
            component={CreateCardSuccessScreen}
          />
          <MainTemplate path={"/kyc-card"} component={CardKYC} />
          <MainTemplate
            path={"/history-payment-card"}
            component={CardHistoryPaymentPage}
          />
          <MainTemplate path={"/re-kyc"} component={ReKYC} />
          <MainTemplate
            path={"/re-kyc-type-physic"}
            component={ReKYCPhysicCard}
          />
          <MainTemplate path={"/deposit-new"} component={DepositAmcAndHewe} />
          <MainTemplate path={"/withdraw-new"} component={WithdrawAmcAndHewe} />
          <MainTemplate
            path={"/history-register-card"}
            component={HistoryRegisterCard}
          />
        </Switch>
      </Config>
    </BrowserRouter>
  );
}
export default App;
