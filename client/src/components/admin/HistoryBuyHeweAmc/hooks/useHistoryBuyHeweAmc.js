import moment from "moment";
import { useEffect, useState } from "react";
import { useExportExcel } from "src/hooks/useExportExcel";
import { roundedDown } from "src/util/roundNumber";
import { axiosService } from "src/util/service";

export const useHistoryBuyHeweAmc = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchNameOrEmail, setSearchNameOrEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [times, setTimes] = useState({
    timeStart: moment().startOf("day"),
    timeEnd: moment().endOf("day"),
  });
  const handleGetDataByRangeDate = async () => {
    return await axiosService.post("api/adminv2/getHistoryBuyCoin", {
      limit: 999999999,
      page: 1,
      query: `UNIX_TIMESTAMP(created_at)>=${times.timeStart
        .startOf("day")
        .unix()} AND UNIX_TIMESTAMP(created_at)<${times.timeEnd
        .endOf("day")
        .unix()}`,
    });
  };
  const { isLoading: isPendingExportToExcel, handleExportFileExcel } =
    useExportExcel({
      serviceGetData: handleGetDataByRangeDate,
      paramsPayload: {},
    });
  const handleClickExportBtn = () => {
    handleExportFileExcel({
      sheetName: "History buy token",
      headers: [
        { colName: "User ID" },
        { colName: "Email" },
        { colName: "User Name" },
        { colName: "Amount USDT" },
        { colName: "Amount Token" },
        { colName: "Bonus" },
        { colName: "Description" },
        { colName: "Hash" },
        { colName: "Address" },
        { colName: "Time" },
      ],
      onlyGetFieldData: [
        "userid",
        "email",
        "userName",
        "amount",
        "totalCoin",
        "bonus",
        "message",
        "hash",
        "addressTo",
        "created_at",
      ],
      preprocessColumnsData: {
        totalCoin: (record) =>
          `${roundedDown(record.totalCoin)} ${record.symbol}`,
        bonus: (record) => `${record.bonus} ${record.symbol}`,
      },
    });
  };
  
  const handleChangeDates = (dates) => {
    setTimes({ timeStart: dates[0], timeEnd: dates[1] });
  };

  const handleChangeSearchNameOrEmail = (e) => {
    setSearchNameOrEmail(e.target.value);
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

      if (searchNameOrEmail.trim() !== "") {
        payload = {
          limit,
          page,
          query: ` POSITION('${searchNameOrEmail}' IN userName) OR POSITION('${searchNameOrEmail}' IN email)`,
        };
      } else {
        payload = {
          limit,
          page,
        };
      }

      const res = await axiosService.post(
        "api/adminv2/getHistoryBuyCoin",
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
  }, [page, searchNameOrEmail]);

  return {
    data,
    isLoading,
    page,
    limit,
    total,
    searchNameOrEmail,
    handleGetData,
    handleChangePage,
    handleChangeSearchNameOrEmail,
    times,
    handleChangeDates,
    handleClickExportBtn,
    isPendingExportToExcel,
  };
};
