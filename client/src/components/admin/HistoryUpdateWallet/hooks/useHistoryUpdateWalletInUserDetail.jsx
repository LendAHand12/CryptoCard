import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { axiosService, DOMAIN } from "src/util/service";

export const useHistoryUpdateWalletInUserDetail = (userId) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [coinSelected, setCoinSelected] = useState(null);
  const { listCoinRealTime } = useSelector(
    (state) => state.listCoinRealTimeReducer
  );
  const [mode, setMode] = useState("default"); // 'default' or 'symbol'

  const handleClickClear = () => {
    if (isLoading) return;
    setMode("default");
    setCoinSelected("");
    setPage(1);
  };

  const handleSelectCoin = (coin) => () => {
    if (isLoading) return;
    setCoinSelected(coin);
    setMode("symbol");
    setPage(1);
  };

  const coins = listCoinRealTime
    ? listCoinRealTime.map((coin, idx) => {
        const isSelected = coinSelected === coin.name;

        const NAME_COINS_EXCLUDE = [];

        const handleSelectCoinMdw = () => {
          if (NAME_COINS_EXCLUDE.includes(coin.name)) {
            return;
          }

          handleSelectCoin(coin.name)();
        };

        return (
          <div
            key={idx}
            className={`coin ${isSelected ? "selected" : ""}`}
            onClick={handleSelectCoinMdw}
          >
            <img src={DOMAIN + coin.image} />
            <div>{coin.name}</div>
          </div>
        );
      })
    : null;

  const handleChangeSymbol = (e) => {
    setSymbol(e.target.value);
    setPage(1);
  };

  const handleChangePage = (p) => {
    setPage(p);
  };

  const handleGetData = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      let payload = {};

      if (mode === "symbol") {
        payload = {
          limit,
          page,
          query: `userid=${userId} AND symbol='${coinSelected}'`,
        };
      } else {
        payload = {
          limit,
          page,
          query: `userid=${userId} `,
        };
      }

      const res = await axiosService.post(
        "api/adminv2/getHistoryUpdateWallet",
        payload
      );

      setData(res.data.data.array);
      setTotal(res.data.data.total);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleGetData();
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [page, symbol, coinSelected]);

  return {
    data,
    isLoading,
    page,
    limit,
    total,
    symbol,
    handleGetData,
    handleChangePage,
    handleChangeSymbol,
    handleClickClear,
    coinSelected,
    coins,
  };
};
