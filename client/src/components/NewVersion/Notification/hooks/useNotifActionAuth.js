import { message } from "antd";
import { useEffect, useState } from "react";
import { axiosService } from "src/util/service";

export const useNotifActionAuth = (callbackAfter, authId, cardId) => {
  const [isPendingAction, setIsPendingAction] = useState(false);
  const [authStatusLatest, setAuthStatusLatest] = useState(null);

  /**
   *
   * @param {*} actionType: 2 is confirm, 3 is reject
   * @returns
   */
  const handleRequestNotifAction = (authId, cardId, actionType) => async () => {
    if (isPendingAction) return;

    setIsPendingAction(true);

    try {
      const res = await axiosService.post("api/visaCard/transactionAuth", {
        auth_id: Number(authId),
        card_id: cardId,
        auth_result: Number(actionType),
      });

      message.success(res.data.message);
      setIsPendingAction(false);

      if (typeof callbackAfter === "function") {
        callbackAfter();
      }
    } catch (error) {
      setIsPendingAction(false);
      message.error(error?.response?.data?.message);
    }
  };

  const handleGetAuthStatus = async () => {
    try {
      const res = await axiosService.post(
        "api/visaCard/transactionAuthStatus",
        {
          auth_id: authId,
          card_id: cardId,
        }
      );

      if (res?.data?.data?.data) {
        setAuthStatusLatest(res?.data?.data?.data?.auth_result);
      }
    } catch (error) {}
  };

  useEffect(() => {
    handleGetAuthStatus();
  }, []);

  return {
    isPendingAction,
    authStatusLatest,
    handleRequestNotifAction,
    handleGetAuthStatus,
  };
};
