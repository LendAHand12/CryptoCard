import { useState } from "react";
import { FRONT_CARD_VIRTUAL } from "..";
import "./CardItemVirtualFront.scss";
import { Button, Modal } from "antd";
import { useDepositCard } from "../CardCreatedSuccess/hooks/useDepositCard";
import { useDetailCard } from "../CardCreatedSuccess/hooks/useDetailCard";
import { useOperations } from "../CardCreatedSuccess/hooks/useOperations";
import { useModalToolsCardVirtual } from "./hooks/useModalToolsCardVirtual";
import { ModalToolsCardVirtual } from "./ModalToolsCardVirtual";
import {
  renderFrontCardImgByCardApplyType,
  renderFrontCardImgByCardTypeId,
} from "src/util/renderCardImg";

export const handlePreprocessCardNumber = (cardNumber) => {
  try {
    const convertToStr = cardNumber.toString();

    // return convertToStr;

    if (convertToStr.length === 16) {
      return `${convertToStr.slice(0, 4)} ${convertToStr.slice(
        4,
        8
      )} ${convertToStr.slice(8, 12)} ${convertToStr.slice(
        12,
        convertToStr.length
      )}`.replaceAll("*", "•");
    } else if (convertToStr.length === 12) {
      return `${convertToStr.slice(0, 4)} ${convertToStr.slice(
        4,
        8
      )} ${convertToStr.slice(8, 12)}`.replaceAll("*", "•");
    } else {
      return cardNumber;
    }
  } catch (error) {
    return "";
  }
};

// FOR CARD VIRTUAL
export const CardItemVirtualFront = ({
  data,
  imgStyle = {},
  isNotNeedClick = false,
  applyType = "",
}) => {
  const { handleRedirectDetail } = useDetailCard();

  // const preprocessCardNumber = handlePreprocessCardNumber(
  //   data.card_number_hiden
  // );

  // const { isOpenModalTools, handleOpenModalTools, handleCloseModalTools } =
  //   useModalToolsCardVirtual();

  return (
    <>
      <div
        style={imgStyle}
        className="CardItemVirtualFront"
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
          src={renderFrontCardImgByCardApplyType(applyType, data?.card_type_id)}
          className="cardBg"
        />

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
