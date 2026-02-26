import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import i18n, { availableLanguage } from "src/translation/i18n";
import {
  coinString,
  image_domain,
  localStorageVariable,
  url,
} from "src/constant";
import {
  formatCurrency,
  formatNumber,
  getLocalStorage,
  rountRange,
  setLocalStorage,
} from "src/util/common";
import { DOMAIN } from "src/util/service";
import { Spin } from "antd";
import { useHistory } from "react-router-dom";
import { getUserWallet } from "src/redux/constant/coin.constant";
import { getCurrent, getExchange } from "src/redux/constant/currency.constant";
import { getListCoinRealTime } from "src/redux/constant/listCoinRealTime.constant";
import { Button, buttonClassesType } from "src/components/Common/Button";
import { math } from "src/App";
import css from "./walletList.module.scss";
import { roundedDown, roundNumber } from "src/util/roundNumber";
import { useAccount } from "wagmi";

function SerepayWalletList() {
  const history = useHistory();
  const { t } = useTranslation();
  const allCoin = useSelector(getListCoinRealTime);
  const myListCoin = useSelector(getUserWallet);
  const userSelectedCurrency = useSelector(getCurrent);
  const exchange = useSelector(getExchange);
  const { amcBalance, heweBalance } = useSelector(
    (state) => state.globalReducer
  );
  const { address } = useAccount();
  const isConnectedWallet = address !== null && address !== undefined;

  const handleClickBtnSwap = (token) => () => {
    history.push(`/swap-${token}`);
  };

  useEffect(() => {
    const language =
      getLocalStorage(localStorageVariable.lng) || availableLanguage.vi;
    // i18n.changeLanguage(language);
  }, []);

  const getMyCoin = function (coinName) {
    if (myListCoin) {
      const key = coinName.toLowerCase() + "_balance";
      return myListCoin[key] ? myListCoin[key] : 0;
    }
  };
  const swapOnClickHandle = function (coinName, amountCoin) {
    setLocalStorage(localStorageVariable.coinFromWalletList, coinName);
    setLocalStorage(localStorageVariable.amountFromWalletList, amountCoin);
    history.push(url.swap);
    return;
  };
  const widthdrawClickHandle = function (coinName) {
    setLocalStorage(localStorageVariable.coinFromWalletList, coinName);
    history.push(url.widthdraw);
    return;

    // history.push(`/withdraw-new?token=${coinName}`);
  };
  const transferClickHandle = function (coinName) {
    history.push(url.transfer);
    setLocalStorage(localStorageVariable.coinFromWalletList, coinName);
    return;
  };
  const convertCurrency = function (usd, currency, exchange) {
    if (usd === 0) return 0;
    if (!usd || !currency || !exchange || !exchange.length) return -1;
    const rate =
      exchange.filter((item) => item.title === currency)[0]?.rate ?? 0;
    const rateFraction = math.fraction(rate);
    const usdFraction = math.fraction(usd);
    return math.number(math.multiply(rateFraction, usdFraction));
  };
  const depositeClickHandle = function (coinname) {
    setLocalStorage(localStorageVariable.coinFromWalletList, coinname);
    history.push(url.deposite);
  };
  const renderButton = function (name) {
    if (name === "USDT") {
      return (
        name === coinString.USDT && (
          <Button
            style={{ width: "106px" }}
            onClick={depositeClickHandle.bind(null, name)}
          >
            {t("deposit")}
          </Button>
        )
      );
    }

    if (name === "HEWE" || name === "AMC") {
      if (!isConnectedWallet) {
        return null;
      }

      return (
        <Button
          style={{ width: "106px" }}
          onClick={() => {
            history.push(`deposit-new?token=${name}`);
          }}
        >
          {t("deposit")}
        </Button>
      );
    }

    return null;
  };
  const renderListCurrency = (listCurrencyData) => {
    return listCurrencyData?.map((item) => (
      <li key={item.token_key} className={css["list-item"]}>
        <div className={css["name"]}>
          <img src={DOMAIN + item.image} alt=".." />
          <span>{item.name}</span>
          <div>{item.token_key}</div>
        </div>

        <div className={css["price"]}>
          <span>
            {item.name !== "HEWE" && item.name !== "AMC"
              ? formatCurrency(
                  i18n.language,
                  userSelectedCurrency,
                  convertCurrency(item.price, userSelectedCurrency, exchange)
                )
              : item.name === "HEWE"
              ? `$${roundedDown(item.price, 7)}`
              : `$${roundedDown(item.price, 4)}`}
          </span>
          <span className={css["swaptobeWalletList__own"]}>
            <span>{t("own")}:</span>
            <span>
              {item.name !== "HEWE" && item.name !== "AMC"
                ? formatNumber(
                    getMyCoin(item.name, myListCoin),
                    i18n.language,
                    rountRange(item.price)
                  )
                : item.name === "HEWE"
                ? roundedDown(heweBalance, 7)
                : roundedDown(amcBalance, 4)}
              <img
                src={image_domain.replace("USDT", item.name)}
                alt={item.name}
              />
            </span>
          </span>
        </div>
        <div className={css["action"]}>
          {renderButton(item.name)}
          {/* {(item.name.toLowerCase() === "usdt" ||
            item.name.toLowerCase() === "amc" ||
            item.name.toLowerCase() === "hewe") && (
            <Button
              onClick={widthdrawClickHandle.bind(null, item.name)}
              type={buttonClassesType.outline}
              // style={{
              //   visibility:
              //     item.name === "HEWE" || item.name === "AMC"
              //       ? "hidden"
              //       : "visible",
              // }}
            >
              {t("withdraw")}
            </Button>
          )} */}
          {/* <Button
            onClick={transferClickHandle.bind(null, item.name)}
            type={buttonClassesType.outline}
          >
            {t("transfer")}
          </Button> */}
          {/* <Button
            onClick={swapOnClickHandle.bind(
              null,
              item.name,
              getMyCoin(item.name, myListCoin)
            )}
            type={buttonClassesType.outline}
          >
            {t("swap")}
          </Button> */}

          {item.name.toLowerCase() === "amc" && (
            <Button
              style={{ width: "106px" }}
              onClick={handleClickBtnSwap(item.name.toLowerCase())}
            >
              {t("buy")} AMC
            </Button>
          )}

          {item.name.toLowerCase() === "hewe" && (
            <Button
              style={{ width: "106px" }}
              onClick={handleClickBtnSwap(item.name.toLowerCase())}
            >
              {t("buy")} HEWE
            </Button>
          )}
        </div>
      </li>
    ));
  };

  return (
    <div className={css["swaptobeWalletList"]}>
      <ul className={css["list"]}>
        {!allCoin && (
          <div className="spin-container">
            <Spin />
          </div>
        )}
        {renderListCurrency(allCoin)}
      </ul>
    </div>
  );
}
export default SerepayWalletList;
