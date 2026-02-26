import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getUserWallet } from "src/redux/constant/coin.constant";
import { useTranslation } from "react-i18next";
import i18n from "src/translation/i18n";
import { DOMAIN } from "src/util/service";
import css from "./walletTop.module.scss";
import { getListCoinRealTime } from "src/redux/constant/listCoinRealTime.constant";

export const titleWalletTop = {
  walletOverview: "walletOverview",
  widthdraw: "widthdraw",
  transfer: "transfer",
  deposit: "diposit",
};

export const calculateTotalUSDT = (
  allCoinSocket,
  { usdtBalance, amcBalance, heweBalance, btcBalance, ethBalance, bnbBalance }
) => {
  try {
    if (!allCoinSocket) return 0;

    const usdtBalancePrice =
      (allCoinSocket.find((c) => c.name == "USDT").price || 0) * usdtBalance;
    const amcBalancePrice =
      (allCoinSocket.find((c) => c.name == "AMC").price || 0) * amcBalance;
    const heweBalancePrice =
      (allCoinSocket.find((c) => c.name == "HEWE").price || 0) * heweBalance;
    const bnbBalancePrice =
      (allCoinSocket.find((c) => c.name == "BNB").price || 0) * bnbBalance;
    const ethBalancePrice =
      (allCoinSocket.find((c) => c.name == "ETH").price || 0) * ethBalance;
    const btcBalancePrice =
      (allCoinSocket.find((c) => c.name == "BTC").price || 0) * btcBalance;

    return (
      usdtBalancePrice +
      amcBalancePrice +
      heweBalancePrice +
      bnbBalancePrice +
      ethBalancePrice +
      btcBalancePrice
    );
  } catch (error) {
    return 0;
  }
};

function WalletTop(props) {
  const { title } = props;

  const userWallet = useSelector(getUserWallet);
  const { t } = useTranslation();

  const [userWalletUsdt, setUserWalletUsdt] = useState(0);
  const allCoin = useSelector(getListCoinRealTime);

  const {
    eurToUsdRate,
    usdtBalance,
    amcBalance,
    heweBalance,
    btcBalance,
    ethBalance,
    bnbBalance,
  } = useSelector((state) => state.globalReducer);

  const totalUSDT = calculateTotalUSDT(allCoin, {
    usdtBalance,
    amcBalance,
    heweBalance,
    btcBalance,
    ethBalance,
    bnbBalance,
  });

  const totalEUR = Number((totalUSDT * eurToUsdRate).toFixed(4)).toLocaleString(
    "en-US"
  );

  const renderClassShowTitle = function (tit) {
    return tit === title ? "" : "--d-none";
  };

  useEffect(() => {
    setUserWalletUsdt(() =>
      new Intl.NumberFormat(i18n.language).format(
        userWallet["usdt_balance"] || 0
      )
    );
  }, [userWallet]);

  return (
    <>
      <div className={css["walletTop"]}>
        <h5 className={css["title"]}>
          <span
            className={
              css["title__header"] +
              ` ${renderClassShowTitle(titleWalletTop.walletOverview)}`
            }
          >
            <span>{t("walletOverview")}</span>
          </span>
          <span
            className={`title__header ${renderClassShowTitle(
              titleWalletTop.widthdraw
            )}`}
          >
            <span>{t("withdraw")}</span>
          </span>
          <span
            className={`title__header ${renderClassShowTitle(
              titleWalletTop.transfer
            )}`}
          >
            <span>{t("transfer")}</span>
          </span>
          <span
            className={`title__header ${renderClassShowTitle(
              titleWalletTop.deposit
            )}`}
          >
            <span>{t("deposit")} Crypto</span>
          </span>
        </h5>
        <div className={css["info"]}>
          <div>{t("totalBalance")}</div>
          <div>
            {/* <span>{userWalletUsdt}</span>{" "} */}
            <span>
              {/* OLD */}
              {/* {Number(usdtBalance.toFixed(4)).toLocaleString("en-US")} */}

              {/* NEW */}
              {Number(totalUSDT.toFixed(4)).toLocaleString("en-US")}
            </span>
            <img src={DOMAIN + "images/USDT.png"} alt="usdt" />
          </div>
        </div>
      </div>

      <div className={css["walletTop"]}>
        <div className={css["info"]}>
          <div>{t("amount")} EUR</div>
          <div>
            <span>
              {/* OLD */}
              {/* {Number((usdtBalance * eurToUsdRate).toFixed(4)).toLocaleString(
                "en-US"
              )} */}

              {/* NEW */}
              {totalEUR}
            </span>{" "}
            EUR
            {/* <img src={DOMAIN + "images/USDT.png"} alt="usdt" /> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default WalletTop;
