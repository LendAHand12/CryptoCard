import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { axiosService, DOMAIN } from "src/util/service";

export const useHistoryUpdateWallet = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchNameOrEmail, setSearchNameOrEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coinSelected, setCoinSelected] = useState(null);
  const { listCoinRealTime } = useSelector(
    (state) => state.listCoinRealTimeReducer
  );
  const [mode, setMode] = useState("default"); // 'default' or 'symbol' or 'search'

  const handleClickClear = () => {
    if (isLoading) return;
    setMode("default");
    setCoinSelected("");
    setSearchNameOrEmail("");
    setPage(1);
  };

  const handleSelectCoin = (coin) => () => {
    if (isLoading) return;
    setCoinSelected(coin);
    setSearchNameOrEmail("");
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

  const handleChangeSearchNameOrEmail = (e) => {
    const value = e.target.value;

    setSearchNameOrEmail(e.target.value);
    setCoinSelected(null);
    setPage(1);

    if (value.trim() === "") {
      setMode("default");
    } else {
      setMode("search");
    }
  };

  const handleChangePage = (p) => {
    setPage(p);
  };

  const handleGetData = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      let payload = {};

      if (mode === "search") {
        payload = {
          limit,
          page,
          query: ` POSITION('${searchNameOrEmail}' IN userName) OR POSITION('${searchNameOrEmail}' IN email)`,
        };
      } else if (mode === "symbol") {
        payload = {
          limit,
          page,
          query: `symbol='${coinSelected}'`,
        };
      } else {
        payload = {
          limit,
          page,
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
  }, [page, searchNameOrEmail, coinSelected]);

  return {
    coins,
    data,
    isLoading,
    page,
    limit,
    total,
    searchNameOrEmail,
    handleGetData,
    handleChangePage,
    handleChangeSearchNameOrEmail,
    handleClickClear,
  };
};
