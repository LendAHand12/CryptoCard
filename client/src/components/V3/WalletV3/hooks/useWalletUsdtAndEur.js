import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { calculateTotalUSDT } from "src/components/seresoWallet/WalletTop";
import { getUserWallet } from "src/redux/constant/coin.constant";
import { getListCoinRealTime } from "src/redux/constant/listCoinRealTime.constant";

export const useWalletUsdtAndEur = () => {
  const userWallet = useSelector(getUserWallet);
  const allCoin = useSelector(getListCoinRealTime);
  const { t } = useTranslation();

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
  const totalUSDTFormatted = Number(totalUSDT.toFixed(4)).toLocaleString(
    "en-US"
  );

  const totalEURFormatted = Number(
    (totalUSDT * eurToUsdRate).toFixed(4)
  ).toLocaleString("en-US");

  return { totalUSDTFormatted, totalEURFormatted };
};
