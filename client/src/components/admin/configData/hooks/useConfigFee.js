import { message } from "antd";
import { useEffect, useState } from "react";
import { axiosService } from "src/util/service";

export const useConfigFee = ({ applyType }) => {
  const [isPendingConfigFee, setIsPendingConfigFee] = useState(false);
  const [feeValue, setFeeValue] = useState(null);
  const [note, setNote] = useState(null);

  const handleGetFeeValue = async () => {
    try {
      const res = await axiosService.post("api/p2pBank/getConfig", {
        name: `apply_type=${applyType}`,
      });

      setFeeValue(res.data.data[0].value);
      setNote(res.data.data[0].note);
    } catch (error) {}
  };

  const handleRequestConfigFee = async () => {
    if (isPendingConfigFee) return;

    if (feeValue === "") return;

    setIsPendingConfigFee(true);

    try {
      const res = await axiosService.post("api/p2pBank/updateConfig", {
        name: `apply_type=${applyType}`,
        value: feeValue,
      });

      message.success(res.data.message);
      setIsPendingConfigFee(false);
    } catch (error) {
      message.error(error.response.data.message);
      setIsPendingConfigFee(false);
    }
  };

  const handleChangeFeeValue = (value) => {
    setFeeValue(value);
  };

  useEffect(() => {
    handleGetFeeValue();
  }, []);

  return {
    feeValue,
    note,
    isPendingConfigFee,
    handleRequestConfigFee,
    handleChangeFeeValue,
  };
};
