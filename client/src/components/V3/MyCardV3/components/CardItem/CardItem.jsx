import { ButtonV3 } from "src/components/V3/ButtonV3/ButtonV3";
import i27 from "src/assets/v3/i27.png";
import i44 from "src/assets/v3/i44.png";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CardItemVirtualFront } from "src/components/NewVersion/CardManagement/CardItem/CardItemVirtualFront";
import { CardItemVirtualBack } from "src/components/NewVersion/CardManagement/CardItem/CardItemVirtualBack";
import { CardItemPhysicFront } from "src/components/NewVersion/CardManagement/CardItem/CardItemPhysicFront";
import { CardItemPhysicBack } from "src/components/NewVersion/CardManagement/CardItem/CardItemPhysicBack";
import { renderCardType } from "src/components/NewVersion";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

export const CardItem = ({ cardData }) => {
  const [toggleSideImg, setToggleSideImg] = useState(true);
  const { t } = useTranslation();
  const history = useHistory();

  const titleCard =
    cardData.card_type_id == "52500001" ||
    cardData.card_type_id === "52500002" ? (
      <div>{renderCardType(cardData.card_type)} Card (Apple Pay)</div>
    ) : cardData.card_type_id == "72000001" ? (
      <div className="titleInside">
        {renderCardType(cardData.card_type)} Card (Google Pay)
      </div>
    ) : (
      <div>{renderCardType(cardData.card_type)} Card</div>
    );

  const handleToggleSideImg = () => {
    setToggleSideImg(!toggleSideImg);
  };

  

  const renderImgCard = (data, side) => {
    if (!data.cardUser) return null;

    if (data.apply_type == "1" || data.apply_type == "2") {
      return (
        <div className="">
          {side === true ? (
            <div>
              <CardItemVirtualFront
                data={data.cardUser}
                applyType={data.apply_type}
              />
            </div>
          ) : (
            <div>
              <CardItemVirtualBack
                data={data.cardUser}
                applyType={data.apply_type}
              />
            </div>
          )}
        </div>
      );
    }

    if (data.apply_type == "3") {
      return (
        <div className="">
          {side === true ? (
            <div>
              <CardItemPhysicFront
                data={data.cardUser}
                applyType={data.apply_type}
              />
            </div>
          ) : (
            <div>
              <CardItemPhysicBack
                data={data.cardUser}
                applyType={data.apply_type}
              />
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  if (!cardData.cardUser) return null;

  return (
    <div className="cardContainer">
      <div className="cardImg">
        {/* <img src={i27} /> */}
        {renderImgCard(cardData, toggleSideImg)}
      </div>

      <div className="cardContent">
        <div className="btnView">
          <ButtonV3 onClick={handleToggleSideImg}>
            <span
              className="text-gradient-t-b btnViewInside"
              style={{ userSelect: "none" }}
            >
              <img src={i44} />
              <span>
                {t("myCardV3.t3")}{" "}
                {toggleSideImg === true ? t("myCardV3.t4") : t("myCardV3.t5")}
              </span>
            </span>
          </ButtonV3>
        </div>

        <div className="cardTitle">{titleCard}</div>

        <div className="cardInfo">{t("myCardV3.t7")}</div>

        <div className="cardActions">
          <div
            className="cardReadMore text-gradient-t-b"
            onClick={() => history.push("/kyc-v3")}
          >
            {t("myCardV3.t8")}
          </div>
        </div>
        <div className="cardActions2">
          <div className="cardReadMore text-gradient-t-b">
            {t("myCardV3.t9")}
          </div>
        </div>
      </div>
    </div>
  );
};
