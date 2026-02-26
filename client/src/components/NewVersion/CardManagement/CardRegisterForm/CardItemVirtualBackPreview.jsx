import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { BACK_CARD_TYPE03, BACK_CARD_VIRTUAL } from "..";
import "./CardItemVirtualBackPreview.scss";
import queryString from "query-string";
import { useEffect } from "react";

export const CardItemVirtualBackPreview = ({ data }) => {
  const { search } = useLocation();
  const queryValues = queryString.parse(search);

  useEffect(() => {
    if (!queryValues.applyType) {
      history.push("/product");
    }
  }, []);

  return (
    <>
      <div className="CardItemVirtualBackPreview">
        <img
          src={
            queryValues.applyType === "2" ? BACK_CARD_VIRTUAL : BACK_CARD_TYPE03
          }
          className="cardBg"
        />

        <div className="cardContent">
          <div className="cardNumber">{"**** **** **** ****"}</div>

          <div className="cardName">
            {data?.first_name} {data?.last_name}
          </div>
        </div>
      </div>
    </>
  );
};
