import { message } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFadedIn } from "src/hooks/useFadedIn";
import { useCheckLoggedIn } from "src/hooks/V3/useCheckLoggedIn";
import { axiosService } from "src/util/service";

export const useMyCardV3 = () => {
  const [page] = useState(1);
  const [data, setData] = useState([]);
  const { domRef } = useFadedIn();
  const [isLoading, setIsLoading] = useState(false);
  const LIMIT = 100;
  const { t } = useTranslation();

  const handleGetData = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // const res = await axiosService.post("api/visaCard/listCardToUser", {
      const res = await axiosService.post("api/visaCard/listCardToken", {
        limit: LIMIT,
        page: page,
      });

      // setData(res.data.data.array);
      // setTotal(res.data.data.total);

      setData(res.data.data.data);

      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    } catch (error) {
      setIsLoading(false);
      message.error(error.response.data.message);
    }
  };

  useEffect(() => {
    handleGetData();
  }, [page]);

  return {
    page,
    data,
    domRef,
    t,
  };
};
