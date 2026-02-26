import moment from "moment";
import { useEffect, useState } from "react";
import { useExportExcel } from "src/hooks/useExportExcel";
import { roundedDown } from "src/util/roundNumber";
import { axiosService } from "src/util/service";
import { renderStatusDeposit } from "src/components/NewVersion/CardManagement/CardHistoryDepositDetail/CardHistoryDepositDetail";
import { renderFrontCardImgByCardApplyType } from "src/util/renderCardImg";
import { roundedUp } from "src/util/roundNumber";
import { DOMAIN } from "src/util/service";

export const useHistoryDepositToCard = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchNameOrEmail, setSearchNameOrEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [times, setTimes] = useState({
    timeStart: moment().subtract(30, "days").startOf("day"),
    timeEnd: moment().endOf("day"),
  });
  const [mode, setMode] = useState("time"); // or 'search'
  const [cardsCurrency, setCardsCurrency] = useState(null);

  const handleGetDataByRangeDate = async () => {
    return await axiosService.post(
      "api/adminv2/getHistoryDepositToCardToTimeAll",
      {
        timeStart: times.timeStart.startOf("day").unix(),
        timeEnd: times.timeEnd.endOf("day").unix(),
      }
    );
  };
  const { isLoading: isPendingExportToExcel, handleExportFileExcel } =
    useExportExcel({
      serviceGetData: handleGetDataByRangeDate,
      paramsPayload: {},
    });
  const handleClickExportBtn = () => {
    handleExportFileExcel({
      sheetName: "History buy deposit to card",
      headers: [
        { colName: "User ID" },
        { colName: "User Name" },
        { colName: "Email" },
        { colName: "Amount Coin" },
        { colName: "Amount" },
        { colName: "Status" },
        { colName: "Card Type ID" },
        { colName: "Card ID" },
        { colName: "Time" },
      ],
      onlyGetFieldData: [
        "userid",
        "userName",
        "email",
        "amountCoin",
        "amountUsd",
        "statusDeposit",
        "card_type_id",
        "card_id",
        "created_at",
      ],
      preprocessColumnsData: {
        amountCoin: (record) =>
          `${roundedUp(record.amountCoin, 4)} ${record?.symbolDeposit}`,
        amountUsd: (record) => {
          let curr = null;
          try {
            curr = cardsCurrency[record.card_type_id]?.coin?.toUpperCase();
          } catch (error) {}
          return `${roundedUp(record.amountUsd, 4)} ${curr}`;
        },
        statusDeposit: (record) => renderStatusDeposit(record?.statusDeposit),
        created_at: (record) =>
          new Date(record.created_at).toLocaleString("vi-VN"),
      },
    });
  };

  const handleGetListAllCardCurrency = async () => {
    try {
      // đoạn này gọi để lấy được currency của các card
      const cards = await axiosService.post("api/visaCard/listCardToken");
      const mappingCardTypeIdToCardCoin = {};
      cards.data.data.data.forEach((c) => {
        mappingCardTypeIdToCardCoin[c.card_type_id] = {
          coin: c.card_coin,
          applyType: c.apply_type,
        };
      });
      setCardsCurrency(mappingCardTypeIdToCardCoin);
    } catch (error) {}
  };

  const handleChangeDates = (dates) => {
    setMode("time");
    setPage(1);
    setSearchNameOrEmail("");
    setTimes({ timeStart: dates[0], timeEnd: dates[1] });
  };
  const handleChangeSearchNameOrEmail = (e) => {
    const value = e.target.value;
    if (value.trim() === "") {
      setMode("time");
    } else {
      setMode("search");
    }
    setSearchNameOrEmail(e.target.value);
    setPage(1);
    setTimes({
      timeStart: moment().subtract(30, "days").startOf("day"),
      timeEnd: moment().endOf("day"),
    });
  };
  const handleChangePage = (p) => {
    setPage(p);
  };
  const handleGetDataBySearch = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      let payload = {
        limit,
        page,
        keyword: searchNameOrEmail,
      };
      const res = await axiosService.post(
        "api/adminv2/getHistoryDepositToCardToKeyword",
        payload
      );
      setData(res.data.data.array);
      setTotal(res.data.data.total);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  const handleGetDataByTime = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      let payload = {
        limit,
        page,
        timeStart: times.timeStart.startOf("day").unix(),
        timeEnd: times.timeEnd.endOf("day").unix(),
      };
      const res = await axiosService.post(
        "api/adminv2/getHistoryDepositToCardToTime",
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
    handleGetListAllCardCurrency();
  }, []);

  useEffect(() => {
    if (!cardsCurrency) return;

    if (mode === "search") {
      const timeout = setTimeout(() => {
        handleGetDataBySearch();
      }, 500);
      return () => {
        clearTimeout(timeout);
      };
    } else if (mode === "time") {
      handleGetDataByTime();
    }
  }, [
    page,
    searchNameOrEmail,
    mode,
    times.timeStart,
    times.timeEnd,
    cardsCurrency,
  ]);

  return {
    data,
    isLoading,
    page,
    limit,
    total,
    searchNameOrEmail,
    handleChangePage,
    handleChangeSearchNameOrEmail,
    times,
    cardsCurrency,
    handleChangeDates,
    handleClickExportBtn,
    isPendingExportToExcel,
  };
};
