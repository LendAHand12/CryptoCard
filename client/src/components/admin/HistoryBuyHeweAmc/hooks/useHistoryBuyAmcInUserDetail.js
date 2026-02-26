import { useEffect, useState } from "react";
import { axiosService } from "src/util/service";

export const useHistoryBuyAmcInUserDetail = (userId) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePage = (p) => {
    setPage(p);
  };

  const handleGetData = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      let payload = { limit, page, query: `userid=${userId} AND symbol='AMC'` };

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
  }, [page]);

  return {
    data,
    isLoading,
    page,
    limit,
    total,
    handleGetData,
    handleChangePage,
  };
};
