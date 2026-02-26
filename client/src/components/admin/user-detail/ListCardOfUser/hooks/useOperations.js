import { message } from "antd";
import { useState } from "react";
import { axiosService } from "src/util/service";

export const useOperations = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestAction = (idAPI, operationType) => async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const res = await axiosService.post("api/visaCard/operationCardUser", {
        id: Number(idAPI),
        type: Number(operationType),
      });

      message.success(res.data.message);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      // message.error(error.response.data.message);
      message.error(
        "If there is request prior to this operation request, new request would be denied"
      );
    }
  };

  return { handleRequestAction };
};
