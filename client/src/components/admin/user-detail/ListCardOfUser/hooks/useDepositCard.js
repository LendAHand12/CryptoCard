import { message } from "antd";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

export const useDepositCard = () => {
  const history = useHistory();

  const handleRedirectDepositPage =
    (idAPI, minDeposit, rechargeFee, currency) => () => {
      if (
        minDeposit == null ||
        minDeposit == undefined ||
        rechargeFee == null ||
        rechargeFee == undefined ||
        currency === null ||
        currency === undefined
      ) {
        message.info("Please wait a minute");
        return;
      }

      history.push(
        `/card-deposit?id=${idAPI}&minDeposit=${Number(
          minDeposit
        )}&rechargeFee=${Number(rechargeFee)}&cardCurr=${currency}`
      );
    };

  return { handleRedirectDepositPage };
};
