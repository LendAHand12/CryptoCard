import {
  renderBackCardImgByCardApplyType,
  renderBackCardImgByCardTypeId,
  renderFrontCardImgByCardApplyType,
} from "src/util/renderCardImg";
import { BACK_CARD_VIRTUAL } from "..";
import { useDetailCard } from "../CardCreatedSuccess/hooks/useDetailCard";
import "./CardItemVirtualBack.scss";
import { handlePreprocessCardNumber } from "./CardItemVirtualFront";
import { useModalToolsCardVirtual } from "./hooks/useModalToolsCardVirtual";
import { ModalToolsCardVirtual } from "./ModalToolsCardVirtual";

export const CardItemVirtualBack = ({
  data,
  cardInfo,
  imgStyle = {},
  isNotNeedClick = false,
  applyType = "",
}) => {
  const { handleRedirectDetail } = useDetailCard();

  const preprocessCardNumber = handlePreprocessCardNumber(
    cardInfo ? cardInfo?.card_number : data?.card_number_hiden
  );

  const { isOpenModalTools, handleOpenModalTools, handleCloseModalTools } =
    useModalToolsCardVirtual();

  return (
    <>
      <div
        style={imgStyle}
        className="CardItemVirtualBack"
        onClick={() => {
          if (isNotNeedClick) return;

          handleRedirectDetail(
            data.mc_trade_no,
            data.card_type_id,
            data.first_name,
            data.last_name,
            data.mobile,
            data.mobile_code,
            data.email,
            data.id,
            data.min_single_recharge_amount,
            applyType,
            data.isRenderByAdmin
          )();
        }}
      >
        <img
          src={renderBackCardImgByCardApplyType(applyType, data?.card_type_id)}
          className="cardBg"
        />

        <div className="cardContent" style={{ userSelect: "none" }}>
          <div className="cardNumber">{preprocessCardNumber}</div>

          <div className="cardName">
            {data.first_name} {data.last_name}
          </div>

          <div className="cvvType01">{cardInfo ? cardInfo?.cvv : "•••"}</div>
          <div className="dayUntil">
            {cardInfo ? cardInfo?.expire : "••/••"}
          </div>
        </div>
      </div>
    </>
  );
};
