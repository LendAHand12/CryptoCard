import { useEffect, useState } from "react";
import "./CardHistoryDeposit.scss";
import { message, Modal, Pagination } from "antd";
import { axiosService, DOMAIN } from "src/util/service";
import { useFadedIn } from "src/hooks/useFadedIn";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { useRedirectHomeIfNotLogin } from "src/hooks/useRedirectHomeIfNotLogin";
import {
  renderStatusDeposit,
  renderSymbolImgStr,
} from "../CardHistoryDepositDetail/CardHistoryDepositDetail";
import { useTranslation } from "react-i18next";
import { roundedDown } from "src/util/roundNumber";

const LIMIT = 10;

export const CardHistoryDeposit = () => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const { domRef } = useFadedIn();
  const [currentCardFocus, setCurrentCardFocus] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { isLogin } = useRedirectHomeIfNotLogin();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const [cardsCurrency, setCardsCurrency] = useState(null);

  const handleGetCardDetail = async () => {
    try {
      const res = await axiosService.post("api/visaCard/listCardToken");

      const listCardCurrency = res.data.data.data.map((card) => {
        return { cardTypeId: card.card_type_id, cardCurr: card.card_coin };
      });

      setCardsCurrency(listCardCurrency);
    } catch (error) {
      
    }
  };

  const handleFindCurr = (cardTypeId) => {
    if (!cardsCurrency) return null;

    return cardsCurrency
      .find((c) => c.cardTypeId == cardTypeId)
      .cardCurr?.toUpperCase();
  };

  const handleGetData = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await axiosService.post(
        "api/visaCard/getTransactionDepositCard",
        {
          limit: LIMIT,
          page: page,
        }
      );

      setData(res.data.data.array);
      setTotal(res.data.data.total);

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

  const renderData = data.map((d, idx) => {
    return (
      <tr key={idx}>
        <td>{d.card_type_id}</td>
        <td>{d.card_id}</td>
        <td>{d.email}</td>
        <td>{d.userName}</td>
        <td>{d.first_name}</td>
        <td>{d.last_name}</td>
        <td>{d.mobile}</td>
        <td>+{d.mobile_code}</td>
        <td>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {roundedDown(d.amountCoin)}
            <img
              style={{ width: "20px", height: "20px" }}
              src={DOMAIN + renderSymbolImgStr(d.symbolDeposit)}
            />
          </div>
        </td>
        <td style={{ whiteSpace: "nowrap" }}>
          {roundedDown(d.amountUsd)} {handleFindCurr(d.card_type_id)}
        </td>
        <td>{renderStatusDeposit(d.statusDeposit)}</td>
        <td>{d.created_at}</td>
      </tr>
    );
  });

  useEffect(() => {
    handleGetCardDetail();
  }, []);

  useEffect(() => {
    handleGetData();
  }, [page]);

  if (!isLogin || !cardsCurrency) {
    return null;
  }

  return (
    <div className="containerV2">
      <div className="CardHistoryDeposit" ref={domRef}>
        <div className="titleV2">{t("headerV2.h12")}</div>

        <div className="tableContainerV2 needCenterContent">
          <table>
            <tr>
              <th>{t("cardHistoryDeposit.t1")}</th>
              <th>{t("cardHistoryDeposit.t2")}</th>
              <th>{t("cardHistoryDeposit.t3")}</th>
              <th>{t("cardHistoryDeposit.t4")}</th>
              <th>{t("cardHistoryDeposit.t5")}</th>
              <th>{t("cardHistoryDeposit.t6")}</th>
              <th>{t("cardHistoryDeposit.t7")}</th>
              <th>{t("cardHistoryDeposit.t8")}</th>
              <th>{t("cardHistoryDeposit.t9")}</th>
              <th>{t("cardHistoryDeposit.t10")}</th>
              <th>{t("cardHistoryDeposit.t11")}</th>
              <th>{t("cardHistoryDeposit.t12")}</th>
            </tr>

            {isLoading && (
              <tr>
                <td colSpan={12}>{t("cardHistoryDeposit.t13")}</td>
              </tr>
            )}

            {!isLoading && data.length !== 0 && renderData}

            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan={12}>{t("cardHistoryDeposit.t14")}</td>
              </tr>
            )}
          </table>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            current={page}
            total={total}
            onChange={(p) => setPage(p)}
            pageSize={LIMIT}
            showLessItems={true}
            showQuickJumper={false}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
};
