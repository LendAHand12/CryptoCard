import { useEffect, useState } from "react";
import "./CardCreatedSuccess.scss";
import { message, Modal, Pagination, Spin } from "antd";
import { axiosService } from "src/util/service";
import { useFadedIn } from "src/hooks/useFadedIn";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { useRedirectHomeIfNotLogin } from "src/hooks/useRedirectHomeIfNotLogin";
import { CardItemVirtualFront } from "../CardItem/CardItemVirtualFront";
import { CardItemVirtualBack } from "../CardItem/CardItemVirtualBack";
import { CardItemPhysicFront } from "../CardItem/CardItemPhysicFront";
import { CardItemPhysicBack } from "../CardItem/CardItemPhysicBack";
import { useTranslation } from "react-i18next";
import { ID_CARD_TYPE_4_PRODUCTION, ID_CARD_TYPE_4_TEST } from "../..";

export const CardCreatedSuccess = () => {
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

  const handleGetData = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // const res = await axiosService.post("api/visaCard/listCardToUser", {
      const res = await axiosService.post("api/visaCard/listCardToken", {
        limit: LIMIT,
        page: page,
      });

      // setData(res.data.data.array);
      // setTotal(res.data.data.total);

      setData(res.data.data.data);

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
    if (!card.cardUser) return null;

    // if (card.card_type_id === "88990001" || card.card_type_id === "88990003") {
    if (card.apply_type == "1" || card.apply_type == "2") {
      return (
        <div className="wrappedCard" key={idx}>
          <div>
            <div className="titleInside">{t("myVisaCard.t2")}</div>
            <CardItemVirtualFront
              key={idx}
              data={card.cardUser}
              applyType={card.apply_type}
            />
          </div>

          <div>
            <div className="titleInside">{t("myVisaCard.t3")}</div>
            <CardItemVirtualBack
              key={idx}
              data={card.cardUser}
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
              data={card.cardUser}
              applyType={card.apply_type}
            />
          </div>

          <div>
            <div className="titleInside">{t("myVisaCard.t3")}</div>
            <CardItemPhysicBack
              key={idx}
              data={card.cardUser}
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

  if (!isLogin) {
    return null;
  }

  return (
    <div className="containerV2">
      <div className="cardCreatedSuccessContainer" ref={domRef}>
        <div className="titleV2">{t("myVisaCard.t1")}</div>

        {/* <div className="tableContainerV2 needCenterContent">
          <table>
            <tr>
              <th>Card Type ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Phone Code</th>
              <th>Phone</th>
              <th>Time</th>
              <th></th>
            </tr>

            {isLoading && (
              <tr>
                <td colSpan={10}>Loading...</td>
              </tr>
            )}

            {!isLoading && data.length !== 0 && renderData}

            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan={10}>No data</td>
              </tr>
            )}
          </table>
        </div> */}

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

        {/* <div style={{ display: "flex", justifyContent: "center" }}>
          {data.length !== 0 && (
            <Pagination
              current={page}
              total={total}
              onChange={(p) => setPage(p)}
              pageSize={LIMIT}
              showLessItems={true}
              showQuickJumper={false}
              showSizeChanger={false}
              size={window.innerWidth < 600 ? "small" : "default"}
            />
          )}
        </div> */}
      </div>
    </div>
  );
};
