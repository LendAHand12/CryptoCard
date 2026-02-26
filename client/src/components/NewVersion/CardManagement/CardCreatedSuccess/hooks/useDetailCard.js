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
      applyType,
      isRenderByAdmin = false
    ) =>
    () => {
      // history.push(
      //   `/card-visa-detail?mcTradeNo=${mcTrade}&cardTypeId=${cardTypeId}&id=${idAPI}&fname=${fname}&lname=${lname}&phone=${phone}&phoneCode=${phoneCode}&email=${email}&viewAll=1&applyType=${applyType}${
      //     isRenderByAdmin ? `&isRenderByAdmin=true` : ""
      //   }`
      // );
      history.push(
        `/card-detail-v3?mcTradeNo=${mcTrade}&cardTypeId=${cardTypeId}&id=${idAPI}&fname=${fname}&lname=${lname}&phone=${phone}&phoneCode=${phoneCode}&email=${email}&viewAll=1&applyType=${applyType}${
          isRenderByAdmin ? `&isRenderByAdmin=true` : ""
        }`
      );
    };

  return { handleRedirectDetail };
};
