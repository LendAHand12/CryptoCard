import { message } from "antd";
import { useEffect, useState } from "react";
import { axiosService } from "src/util/service";

export const useConfigCommisionDeposit = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeInput = (value) => {
    setData(value);
  };

  const handleRequestUpdateData = async (value) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await axiosService.post("api/p2pBank/updateConfig", {
        name: "comission_fee_deposit",
        value: Number(Number(data) / 100),
      });

      setIsLoading(false);
      message.success("Success");
    } catch (error) {
      message.error(error.response.data.message);
      setIsLoading(false);
    }
  };

  const handleGetData = async () => {
    try {
      const res = await axiosService.post("api/p2pBank/getConfig", {
        name: "comission_fee_deposit",
      });

      setData(res.data.data[0].value * 100);
    } catch (error) {}
  };

  useEffect(() => {
    handleGetData();
  }, []);

  return { isLoading, data, handleChangeInput, handleRequestUpdateData };
};
