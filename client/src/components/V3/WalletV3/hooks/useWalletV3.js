import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useChangeAddress } from "src/components/NewVersion/HeaderV2/hooks/useChangeAddress";
import { coinUserWallet } from "src/redux/actions/coin.action";
import { getListCoinRealTime } from "src/redux/constant/listCoinRealTime.constant";
import { GLOBAL_TYPE } from "src/redux/reducers/globalReducer";
import { roundDownDecimalValues } from "src/util/common";
import { roundedDown } from "src/util/roundNumber";
import { axiosService } from "src/util/service";
import { useAccount } from "wagmi";

const getBalanceOfCoin = (coinName, balances) => {
  try {
    switch (coinName) {
      case "USDT":
        return balances.usdtBalance;

      case "BTC":
        return balances.btcBalance;

      case "ETH":
        return balances.ethBalance;

      case "BNB":
        return balances.bnbBalance;

      case "AMC":
        return balances.amcBalance;

      case "HEWE":
        return balances.heweBalance;

      default:
        return 0;
    }
  } catch (error) {
    return 0;
  }
};

export const formatRoundedBalance = (coinName, balance) => {
  switch (coinName) {
    case "HEWE":
      return roundedDown(balance, 7);

    case "AMC":
      return roundedDown(balance, 4);

    default:
      return roundedDown(balance, 4);
  }
};

const preprocessDataCoins = (allCoin, balances) => {
  try {
    if (!allCoin) return [];

    const newAllCoin = allCoin.map((coin) => {
      return {
        image: coin.image,
        price: coin.price,
        name: coin.name,
        balance: getBalanceOfCoin(coin.name, balances),
        token_key: coin.token_key,
      };
    });

    return newAllCoin;
  } catch (error) {
    return [];
  }
};

export const useWalletV3 = () => {
  const [isOpenDeposit, setIsOpenDeposit] = useState(false);
  const topRef = useRef(null);
  const [currentCoinDeposit, setCurrentCoinDeposit] = useState(null);
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const [isPendingCreateWallet, setIsPendingCreateWallet] = useState(false);
  const [addressWalletDeposit, setAddressWalletDeposit] = useState(null);
  const [apiResp, setApiResp] = useState(null);
  const dispatch = useDispatch();
  const { listCoinRealTime } = useSelector(
    (state) => state.listCoinRealTimeReducer
  );
  const { userWallet } = useSelector((state) => state.coinReducer);
  const allCoin = useSelector(getListCoinRealTime);
  const history = useHistory();
  const { address } = useAccount();
  const isConnectedWallet = address !== null && address !== undefined;
  const { addressFromProfile } = useChangeAddress();
  const { open } = useWeb3Modal();

  // 

  const {
    eurToUsdRate,
    usdtBalance,
    amcBalance,
    heweBalance,
    btcBalance,
    ethBalance,
    bnbBalance,
  } = useSelector((state) => state.globalReducer);
  const balances = {
    usdtBalance,
    amcBalance,
    heweBalance,
    btcBalance,
    ethBalance,
    bnbBalance,
  };

  const dataCoins = preprocessDataCoins(allCoin, balances);

  const handleClickBtnSwap = (token) => () => {
    history.push(`/swap-${token}`);
  };
  const handleScollTop = () => {
    topRef?.current?.scrollIntoView({ behaviour: "smooth" });
  };

  const handleOpenSectionDeposit = () => {
    setIsOpenDeposit(true);

    handleScollTop();
  };

  const handleClickBtnDeposit = (coinName, network) => () => {
    handleOpenSectionDeposit();
    setCurrentCoinDeposit(coinName?.toUpperCase());
    setCurrentNetwork(network);
  };

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

  const handleCreateWalletUSDT = async () => {
    setIsPendingCreateWallet(true);

    try {
      const res = await axiosService.post("api/blockico/createWalletBEP20", {
        symbol: "USDT.BEP20",
      });

      setAddressWalletDeposit(res.data.data.address);
      setIsPendingCreateWallet(false);
    } catch (error) {
      if (error?.response?.data?.errors?.address) {
        setAddressWalletDeposit(error.response.data.errors.address);
      }
      setIsPendingCreateWallet(false);
    }
  };

  const handleCreateWalletAMCorHEWE = async (token) => {
    try {
      const symbol = token === "AMC" ? "AMC.AMC20" : "HEWE.AMC20";

      const res = await axiosService.post("api/blockico/createWalletBEP20", {
        symbol,
      });
      setAddressWalletDeposit(res.data.data.address);
      setIsPendingCreateWallet(false);
    } catch (error) {
      if (error?.response?.data?.errors?.address) {
        setAddressWalletDeposit(error.response.data.errors.address);
      }
      setIsPendingCreateWallet(false);
    }
  };

  // 
  // 

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
    if (currentCoinDeposit) {
      switch (currentCoinDeposit) {
        case "USDT":
          handleCreateWalletUSDT();
          break;

        case "AMC":
          handleCreateWalletAMCorHEWE("AMC");
          break;

        case "HEWE":
          handleCreateWalletAMCorHEWE("HEWE");
          break;

        default:
          break;
      }
    }
  }, [currentCoinDeposit]);

  return {
    currentCoinDeposit,
    isOpenDeposit,
    handleClickBtnDeposit,
    topRef,
    dataCoins,
    handleClickBtnSwap,
    currentNetwork,
    addressWalletDeposit,
    isPendingCreateWallet,
    isConnectedWallet,
    address,
    open,
    addressFromProfile,
  };
};
