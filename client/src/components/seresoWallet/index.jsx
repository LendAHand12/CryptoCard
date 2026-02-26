import React, { useEffect, useState } from "react";
import SerepayWalletList from "./walletList";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getLocalStorage, roundDownDecimalValues } from "src/util/common";
import {
  coinString,
  defaultLanguage,
  localStorageVariable,
  url,
} from "src/constant";
import i18n from "src/translation/i18n";

import WalletTop, { titleWalletTop } from "./WalletTop";
import { axiosService } from "src/util/service";
import { GLOBAL_TYPE } from "src/redux/reducers/globalReducer";
import { coinUserWallet } from "src/redux/actions/coin.action";
function SwaptobeWallet() {
  const history = useHistory();
  const isLogin = useSelector((root) => root.loginReducer.isLogin);
  const { listCoinRealTime } = useSelector(
    (state) => state.listCoinRealTimeReducer
  );
  const { userWallet } = useSelector((state) => state.coinReducer);
  const [apiResp, setApiResp] = useState(null);
  const dispatch = useDispatch();

  const dispatchWalletLogicOld = (apiResp) => {
    try {
      const result = {};
      for (const [name, value] of Object.entries(apiResp)) {
        let price =
          listCoinRealTime.filter(
            (item) => item.name === name.replace("_balance", "").toUpperCase()
          )[0]?.price ?? 0;
        result[name] = roundDownDecimalValues(value, price);
      }
      if (Object.keys(result)) {
        userWallet.current = result;

        dispatch(coinUserWallet(result));
      }
    } catch (error) {}
  };

  const getWalletGlobal = async () => {
    try {
      const res = await axiosService.post("api/user/getWallet");

      setApiResp(res.data.data); //  vì logic cũ phần listCoinRealTime k có ngay nên phải lưu để set lại

      dispatch({
        type: GLOBAL_TYPE.UPDATE_BALANCES,
        payload: res.data.data,
      });
    } catch (error) {}
  };

  useEffect(() => {
    getWalletGlobal();
  }, []);

  useEffect(() => {
    if (
      apiResp &&
      listCoinRealTime !== null &&
      listCoinRealTime?.length !== 0
    ) {
      dispatchWalletLogicOld(apiResp);
    }
  }, [listCoinRealTime?.length, apiResp]);

  useEffect(() => {
    if (!isLogin) {
      history.push(url.login);
      return;
    }

    const language =
      getLocalStorage(localStorageVariable.lng) || defaultLanguage;
    // i18n.changeLanguage(language);
  }, []);

  return (
    <div className="swaptobe-wallet fadeInBottomToTop">
      <div className="container">
        <WalletTop title={titleWalletTop.walletOverview} />
        <SerepayWalletList />
      </div>
    </div>
  );
}
export default SwaptobeWallet;
