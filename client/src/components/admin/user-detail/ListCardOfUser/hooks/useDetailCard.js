import { useHistory } from "react-router-dom/cjs/react-router-dom";

export const useDetailCard = () => {
  const history = useHistory();

  const handleRedirectDetail =
    (
      mcTrade,
      cardTypeId,
      fname,
      lname,
      phone,
      phoneCode,
      email,
      idAPI,
      minDeposit,
      applyType
    ) =>
    () => {
      history.push(
        `/card-visa-detail?mcTradeNo=${mcTrade}&cardTypeId=${cardTypeId}&id=${idAPI}&fname=${fname}&lname=${lname}&phone=${phone}&phoneCode=${phoneCode}&email=${email}&viewAll=1&applyType=${applyType}`
      );
    };

  return { handleRedirectDetail };
};
