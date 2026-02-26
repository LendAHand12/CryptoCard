import { useEffect, useState } from "react";
import { axiosService } from "src/util/service";

export const useListChangeWallet = ({ userId }) => {
  const [data, setData] = useState([]);

  const handleGetListData = async () => {
    try {
      const res = await axiosService.post(
        "api/visaCard/historyWalletConnectToId",
        { userid: userId }
      );

      
      setData(res.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    handleGetListData();
  }, []);

  return { data, handleGetListData };
};
