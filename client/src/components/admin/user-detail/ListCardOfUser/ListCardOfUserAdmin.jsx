import { useEffect, useState } from "react";
import "./ListCardOfUserAdmin.scss";
import { message, Spin } from "antd";
import { axiosService } from "src/util/service";
import { useFadedIn } from "src/hooks/useFadedIn";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { useRedirectHomeIfNotLogin } from "src/hooks/useRedirectHomeIfNotLogin";
import { useTranslation } from "react-i18next";
import { CardItemVirtualFront } from "src/components/NewVersion/CardManagement/CardItem/CardItemVirtualFront";
import { CardItemVirtualBack } from "src/components/NewVersion/CardManagement/CardItem/CardItemVirtualBack";
import { CardItemPhysicFront } from "src/components/NewVersion/CardManagement/CardItem/CardItemPhysicFront";
import { CardItemPhysicBack } from "src/components/NewVersion/CardManagement/CardItem/CardItemPhysicBack";
import { adminFunction } from "../../sidebar";
import { usePermissionAdmin } from "src/hooks/usePermissionAdmin";
import NoPermision from "../../no-permision";

export const ListCardOfUserAdmin = ({ userId }) => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const { domRef } = useFadedIn();
  const [currentCardFocus, setCurrentCardFocus] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { isLogin } = useRedirectHomeIfNotLogin();
  const [isLoading, setIsLoading] = useState(false);
  const LIMIT = 100;
  const { t } = useTranslation();

  const { isNoPermission } = usePermissionAdmin(adminFunction.card);

  

  const handleGetData = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // đoạn này gọi để lấy được field apply type, xong rồi gắn vào api bên dưới
      const cards = await axiosService.post("api/visaCard/listCardToken");

      const query = `userid=${userId}`;

      const mappingCardTypeIdToApplyType = {};

      cards.data.data.data.forEach((t) => {
        if (
          !(t.card_type_id in mappingCardTypeIdToApplyType) ||
          t.card_type_id != null
        ) {
          mappingCardTypeIdToApplyType[t.card_type_id] = t.apply_type;
        }
      });

      const res = await axiosService.post("api/visaCard/getCardUserToAdmin", {
        page: page,
        limit: LIMIT,
        query: query,
      });

      const listDataMappingApplyType = res.data.data.array.map((d) => {
        return {
          ...d,
          apply_type: mappingCardTypeIdToApplyType[d.card_type_id],
        };
      });

      setData(listDataMappingApplyType);

      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    } catch (error) {
      
      setIsLoading(false);
      message.error(error.response.data.message);
    }
  };

  const handleViewDetail = (cardData) => () => {
    setCurrentCardFocus(cardData);
    setIsOpenModal(true);
  };

  const cardItems = data.map((card, idx) => {
    // if (!card.cardUser) return null;
    const cardUser = {
      card_number_hiden: card.card_number_hiden,
      mc_trade_no: card.mc_trade_no,
      first_name: card.first_name,
      last_name: card.last_name,
      mobile: card.mobile,
      mobile_code: card.mobile_code,
      email: card.email,
      id: card.id,
      min_single_recharge_amount: null,
      apply_type: card.apply_type,
      card_type_id: card.card_type_id,
      isRenderByAdmin: true,
    };

    // if (card.card_type_id === "88990001" || card.card_type_id === "88990003") {
    if (card.apply_type == "1" || card.apply_type == "2") {
      return (
        <div className="wrappedCard" key={idx}>
          <div>
            <div className="titleInside">{t("myVisaCard.t2")}</div>
            <CardItemVirtualFront
              key={idx}
              data={cardUser || {}}
              applyType={card.apply_type}
            />
          </div>

          <div>
            <div className="titleInside">{t("myVisaCard.t3")}</div>
            <CardItemVirtualBack
              key={idx}
              data={cardUser || {}}
              applyType={card.apply_type}
            />
          </div>
        </div>
      );
    }

    // if (
    //   card.card_type_id === "90000007" ||
    //   card.card_type_id === ID_CARD_TYPE_4_TEST ||
    //   card.card_type_id === ID_CARD_TYPE_4_PRODUCTION
    // ) {
    if (card.apply_type == "3") {
      return (
        <div className="wrappedCard" key={idx}>
          <div>
            <div className="titleInside">{t("myVisaCard.t2")}</div>
            <CardItemPhysicFront
              key={idx}
              data={cardUser}
              applyType={card.apply_type}
            />
          </div>

          <div>
            <div className="titleInside">{t("myVisaCard.t3")}</div>
            <CardItemPhysicBack
              key={idx}
              data={cardUser}
              applyType={card.apply_type}
            />
          </div>
        </div>
      );
    }

    return null;
  });

  useEffect(() => {
    handleGetData();
  }, [page]);

  if (isNoPermission) {
    return <NoPermision />;
  }

  if (!isLogin) {
    return null;
  }

  return (
    // <div className="containerV2">
    <div
      className="ListCardOfUserAdmin"
      ref={domRef}
      style={{ maxWidth: "1000px" }}
    >
      {/* <div className="titleV2">{t("myVisaCard.t1")}</div> */}

      <div className="cardItems">
        {cardItems}

        {!isLoading && cardItems.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#fff",
              fontSize: "18px",
              fontWeight: 300,
            }}
          >
            {t("myVisaCard.t4")}
          </div>
        )}

        {isLoading && (
          <div className="overlayLoading">
            <Spin />
          </div>
        )}
      </div>
    </div>
    // </div>
  );
};
