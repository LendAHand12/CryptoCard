import { BACK_CARD_PHYSIC, BACK_CARD_VIRTUAL } from "..";
import { useDetailCard } from "../CardCreatedSuccess/hooks/useDetailCard";
import "./CardItemPhysicBack.scss";
import { handlePreprocessCardNumber } from "./CardItemVirtualFront";
import { useModalToolsCardVirtual } from "./hooks/useModalToolsCardVirtual";
import { ModalToolsCardVirtual } from "./ModalToolsCardVirtual";

export const CardItemPhysicBack = ({
  data,
  cardInfo,
  imgStyle = {},
  isNotNeedClick = false,
  applyType = "",
}) => {
  const { handleRedirectDetail } = useDetailCard();

  const preprocessCardNumber = handlePreprocessCardNumber(
    cardInfo
      ? cardInfo?.card_number
        ? cardInfo?.card_number
        : data?.card_number_hiden || ""
      : data?.card_number_hiden
  );

  const { isOpenModalTools, handleOpenModalTools, handleCloseModalTools } =
    useModalToolsCardVirtual();

  return (
    <>
      <div
        style={imgStyle}
        className="CardItemPhysicBack"
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
        <img src={BACK_CARD_PHYSIC} className="cardBg" />

        <div className="cardContent" style={{ userSelect: "none" }}>
          <div className="cardNumber">{preprocessCardNumber}</div>

          <div className="cardName" style={{ textTransform: "uppercase" }}>
            {data.first_name} {data.last_name}
            {/* {"NGUYEN"} {"DUNG"} */}
          </div>

          {/* <div className="cvv"></div> */}
        </div>
      </div>
    </>
  );
};
