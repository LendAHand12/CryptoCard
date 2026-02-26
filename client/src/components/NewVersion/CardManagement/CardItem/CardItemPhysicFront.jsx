import { useState } from "react";
import { FRONT_CARD_PHYSIC, FRONT_CARD_VIRTUAL } from "..";
import "./CardItemPhysicFront.scss";
import { Button, Modal } from "antd";
import { useDepositCard } from "../CardCreatedSuccess/hooks/useDepositCard";
import { useDetailCard } from "../CardCreatedSuccess/hooks/useDetailCard";
import { useOperations } from "../CardCreatedSuccess/hooks/useOperations";
import { useModalToolsCardVirtual } from "./hooks/useModalToolsCardVirtual";
import { ModalToolsCardVirtual } from "./ModalToolsCardVirtual";

export const handlePreprocessCardNumber = (cardNumber) => {
  return `${cardNumber.slice(0, 4)} ${cardNumber.slice(
    4,
    8
  )} ${cardNumber.slice(8, 12)} ${cardNumber.slice(
    12,
    cardNumber.length
  )}`.replaceAll("*", "•");
};

// FOR CARD VIRTUAL
export const CardItemPhysicFront = ({
  data,
  imgStyle = {},
  isNotNeedClick = false,
  applyType = "",
}) => {
  const { handleRedirectDetail } = useDetailCard();

  const preprocessCardNumber = handlePreprocessCardNumber(
    data.card_number_hiden
  );

  const { isOpenModalTools, handleOpenModalTools, handleCloseModalTools } =
    useModalToolsCardVirtual();

  return (
    <>
      <div
        style={imgStyle}
        className="CardItemPhysicFront"
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
        <img src={FRONT_CARD_PHYSIC} className="cardBg" />

        {/* <div className="cardContent">
          <div className="cardNumber">{preprocessCardNumber}</div>

          <div className="cardName">
            {data.first_name} {data.last_name}
          </div>

          <div className="cardID">
            <div>ID CARD</div>
            <div className="id">{data.card_id}</div>
          </div>
        </div> */}
      </div>
    </>
  );
};
