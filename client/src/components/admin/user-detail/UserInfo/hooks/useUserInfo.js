import { message } from "antd";
import { useEffect, useState } from "react";
import { axiosService } from "src/util/service";

export const useUserInfo = ({ userId }) => {
  const limit = 10;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isConfirm, setIsConfirm] = useState(false);

  const handleConfirm = (id) => async () => {
    if (isConfirm) return;

    setIsConfirm(true);
    try {
      const res = await axiosService.post(
        "api/visaCard/comfirmSignUpCardUserToAdmin",
        { id }
      );

      setIsLoading(false);
      handleGetData();
      message.success(res.data.message);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleChangePage = (p) => {
    setPage(p);
  };

  const handleGetData = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await axiosService.post(
        "api/visaCard/historySignUpCardUserToAdmin",
        { page: page, limit: limit, userid: userId }
      );

      setData(res.data.data.array);
      setTotal(res.data.data.total);
      setIsLoading(false);
    } catch (error) {
      message.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    handleGetData();
  }, [page]);

  return {
    data,
    isLoading,
    page,
    total,
    limit,
    handleChangePage,
    handleConfirm,
  };
};
