import { useEffect, useState } from "react";
import { axiosService } from "src/util/service";

export const useListHistoryDepositCoin = ({ userId }) => {
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePage = (p) => {
    setPage(p);
  };

  const handleGetListData = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const query = `user_id=${userId}`;
      const res = await axiosService.post(
        "api/adminv2/getHistoryDepositAdmin",
        { limit, page, query: query }
      );

      
      setData(res.data.data.array);
      setTotal(res.data.data.total);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetListData();
  }, [page]);

  return {
    data,
    limit,
    total,
    page,
    isLoading,
    handleChangePage,
    handleGetListData,
  };
};
