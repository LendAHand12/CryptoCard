import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useChangeAddress } from "src/components/NewVersion/HeaderV2/hooks/useChangeAddress";
import { coinUserWallet } from "src/redux/actions/coin.action";
import { getListCoinRealTime } from "src/redux/constant/listCoinRealTime.constant";
import { GLOBAL_TYPE } from "src/redux/reducers/globalReducer";
import { roundDownDecimalValues } from "src/util/common";
import { roundedDown } from "src/util/roundNumber";
import { axiosService } from "src/util/service";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { message as antMessage } from "antd";

// ─── Đọc địa chỉ ví admin từ .env (REACT_APP_ADMIN_WALLET) ──────────────────
const ADMIN_WALLET = process.env.REACT_APP_ADMIN_WALLET;

// ─── USDT BEP-20 trên BSC mainnet ────────────────────────────────────────────
const USDT_CONTRACT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"; // USDT BEP-20
const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getBalanceOfCoin = (coinName, balances) => {
  try {
    switch (coinName) {
      case "USDT": return balances.usdtBalance;
      case "BTC":  return balances.btcBalance;
      case "ETH":  return balances.ethBalance;
      case "BNB":  return balances.bnbBalance;
      case "AMC":  return balances.amcBalance;
      case "HEWE": return balances.heweBalance;
      default:     return 0;
    }
  } catch { return 0; }
};

export const formatRoundedBalance = (coinName, balance) => {
  switch (coinName) {
    case "HEWE": return roundedDown(balance, 7);
    case "AMC":  return roundedDown(balance, 4);
    default:     return roundedDown(balance, 4);
  }
};

const preprocessDataCoins = (allCoin, balances) => {
  try {
    if (!allCoin) return [];
    return allCoin.map((coin) => ({
      image: coin.image,
      price: coin.price,
      name: coin.name,
      balance: getBalanceOfCoin(coin.name, balances),
      token_key: coin.token_key,
    }));
  } catch { return []; }
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useWalletV3 = () => {
  const [isOpenDeposit, setIsOpenDeposit]           = useState(false);
  const [currentCoinDeposit, setCurrentCoinDeposit] = useState(null);
  const [currentNetwork, setCurrentNetwork]         = useState(null);
  const [depositAmount, setDepositAmount]           = useState("");
  const [isDepositing, setIsDepositing]             = useState(false);
  const [pendingTxHash, setPendingTxHash]           = useState(null);
  const [apiResp, setApiResp]                       = useState(null);

  // Địa chỉ ví admin lấy thẳng từ env — không cần state hay API call
  const adminWalletAddress = ADMIN_WALLET;

  const topRef   = useRef(null);
  const dispatch = useDispatch();

  const { listCoinRealTime } = useSelector((s) => s.listCoinRealTimeReducer);
  const { userWallet }       = useSelector((s) => s.coinReducer);
  const allCoin              = useSelector(getListCoinRealTime);
  const {
    usdtBalance, amcBalance, heweBalance, btcBalance, ethBalance, bnbBalance,
  } = useSelector((s) => s.globalReducer);

  const balances  = { usdtBalance, amcBalance, heweBalance, btcBalance, ethBalance, bnbBalance };
  const dataCoins = preprocessDataCoins(allCoin, balances);

  const history = useHistory();
  const { address } = useAccount();
  const isConnectedWallet = address !== null && address !== undefined;
  const { addressFromProfile } = useChangeAddress();
  const { open } = useWeb3Modal();

  // wagmi v2
  const { writeContractAsync } = useWriteContract();
  const { isSuccess: isTxConfirmed } = useWaitForTransactionReceipt({
    hash: pendingTxHash ?? undefined,
    query: { enabled: !!pendingTxHash },
  });

  // ── wallet balance helpers ───────────────────────────────────────────────
  const dispatchWalletLogicOld = (resp) => {
    try {
      const result = {};
      for (const [name, value] of Object.entries(resp)) {
        const price = listCoinRealTime?.find(
          (item) => item.name === name.replace("_balance", "").toUpperCase()
        )?.price ?? 0;
        result[name] = roundDownDecimalValues(value, price);
      }
      if (Object.keys(result).length) {
        userWallet.current = result;
        dispatch(coinUserWallet(result));
      }
    } catch {}
  };

  const getWalletGlobal = async () => {
    try {
      const res = await axiosService.post("api/user/getWallet");
      setApiResp(res.data.data);
      dispatch({ type: GLOBAL_TYPE.UPDATE_BALANCES, payload: res.data.data });
    } catch {}
  };

  // ── navigation ───────────────────────────────────────────────────────────
  const handleClickBtnSwap = (token) => () => history.push(`/swap-${token}`);

  // ── open deposit section ─────────────────────────────────────────────────
  const handleClickBtnDeposit = (coinName, network) => () => {
    setCurrentCoinDeposit(coinName?.toUpperCase());
    setCurrentNetwork(network);
    setIsOpenDeposit(true);
    topRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ── trigger MetaMask / WalletConnect USDT transfer ───────────────────────
  const handleDeposit = useCallback(async () => {
    if (!isConnectedWallet) {
      antMessage.warning("Vui lòng kết nối ví trước");
      return;
    }
    if (!adminWalletAddress) {
      antMessage.error("Chưa cấu hình REACT_APP_ADMIN_WALLET trong .env");
      return;
    }
    const parsedAmount = parseFloat(depositAmount);
    if (!depositAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      antMessage.warning("Nhập số lượng hợp lệ");
      return;
    }

    setIsDepositing(true);
    try {
      const amountWei = parseUnits(parsedAmount.toString(), 18);
      // Gửi thẳng USDT → ví admin qua MetaMask/WalletConnect
      const hash = await writeContractAsync({
        address: USDT_CONTRACT_ADDRESS,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [adminWalletAddress, amountWei],
      });
      antMessage.info("Giao dịch đã gửi, đang chờ xác nhận on-chain...");
      setPendingTxHash(hash);
    } catch (err) {
      console.error(err);
      antMessage.error(err?.shortMessage || "Giao dịch thất bại");
      setIsDepositing(false);
    }
  }, [isConnectedWallet, adminWalletAddress, depositAmount, writeContractAsync]);

  // ── sau khi tx confirmed → gọi server cộng balance ──────────────────────
  useEffect(() => {
    if (!isTxConfirmed || !pendingTxHash) return;
    const confirm = async () => {
      try {
        await axiosService.post("api/blockico/confirmDeposit", {
          txHash: pendingTxHash,
          symbol: currentCoinDeposit || "USDT",
          amount: depositAmount,
        });
        antMessage.success(
          `Deposit ${depositAmount} ${currentCoinDeposit || "USDT"} thành công!`
        );
        setDepositAmount("");
        setIsOpenDeposit(false);
        await getWalletGlobal();
      } catch (err) {
        const msg =
          err?.response?.data?.errors ||
          "Không thể xác nhận deposit với server";
        antMessage.error(typeof msg === "string" ? msg : JSON.stringify(msg));
      } finally {
        setPendingTxHash(null);
        setIsDepositing(false);
      }
    };
    confirm();
  }, [isTxConfirmed, pendingTxHash]);

  // ── on mount ─────────────────────────────────────────────────────────────
  useEffect(() => {
    getWalletGlobal();
  }, []);

  useEffect(() => {
    if (apiResp && listCoinRealTime?.length) {
      dispatchWalletLogicOld(apiResp);
    }
  }, [listCoinRealTime?.length, apiResp]);

  return {
    currentCoinDeposit,
    isOpenDeposit,
    handleClickBtnDeposit,
    topRef,
    dataCoins,
    handleClickBtnSwap,
    currentNetwork,
    // deposit
    adminWalletAddress,
    depositAmount,
    setDepositAmount,
    isDepositing,
    handleDeposit,
    // wallet connect
    isConnectedWallet,
    address,
    open,
    addressFromProfile,
  };
};
