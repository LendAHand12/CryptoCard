import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { FRONT_CARD_TYPE03, FRONT_CARD_VIRTUAL } from "..";
import "./CardItemVirtualFrontPreview.scss";
import { Button, Modal } from "antd";
import queryString from "query-string";
import { useEffect } from "react";

// FOR CARD VIRTUAL
export const CardItemVirtualFrontPreview = ({ data }) => {
  const { search } = useLocation();
  const queryValues = queryString.parse(search);

  useEffect(() => {
    if (!queryValues.applyType) {
      history.push("/product");
    }
  }, []);

  return (
    <>
      <div className="CardItemVirtualFrontPreview">
        <img
          src={
            queryValues.applyType === "2"
              ? FRONT_CARD_VIRTUAL
              : FRONT_CARD_TYPE03
          }
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
