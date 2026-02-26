import { message } from "antd";
import { useEffect, useState } from "react";
import { axiosService } from "src/util/service";

const LIMIT = 10;

export const useHistoryCommissionUser = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePage = (p) => {
    if (isLoading) return;
    setPage(p);
  };

  const handleGetData = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await axiosService.post("api/visaCard/commissionUser", {
        limit: LIMIT,
        page: page,
      });

      setData(res.data.data.array);
      setTotal(res.data.data.total);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      message.error(error?.response.data.message);
    }
  };

  useEffect(() => {
    handleGetData();
  }, [page]);

  return { isLoading, data, total, page, handleChangePage, limit: LIMIT };
};
