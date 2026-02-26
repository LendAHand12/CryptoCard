import { useEffect, useState } from "react";
import { axiosService } from "src/util/service";

export const useReferral = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetData = async () => {
    if (isLoading) return;

    try {
      const res = await axiosService.post("");

      setData(res.data.data.array);
      setTotal(res.data.data.total);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleChangePage = (p) => {
    if (isLoading) return;

    setPage(p);
  };

  useEffect(() => {
    handleGetData();
  }, [page]);

  return {
    data,
    total,
    page,
    limit,
    isLoading,
    handleGetData,
    handleChangePage,
  };
};
