import { useEffect, useState } from "react";
import "./CardHistoryDepositDetail.scss";
import { message, Modal, Pagination } from "antd";
import { axiosService, DOMAIN } from "src/util/service";
import { useFadedIn } from "src/hooks/useFadedIn";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { useRedirectHomeIfNotLogin } from "src/hooks/useRedirectHomeIfNotLogin";
import { useTranslation } from "react-i18next";
import { roundedUp } from "src/util/roundNumber";
import { TableV3 } from "src/components/V3/TableV3/TableV3";

const LIMIT = 10;

export const renderSymbolImgStr = (symbol) => {
  try {
    const symbolConvert = symbol?.toUpperCase();

    switch (symbolConvert) {
      case "USDT":
        return "images/USDT.png";

      case "ETH":
        return "images/ETH.png";

      case "BTC":
        return "images/BTC.png";

      case "BCH":
        return "images/BCH.png";

      case "AMC":
        return "images/AMC.png";

      case "HEWE":
        return "images/HEWE.png";

      case "BNB":
        return "images/BNB.png";

      default:
        break;
    }
  } catch (error) {
    return null;
  }
};

export const renderStatusDeposit = (status) => {
  try {
    switch (status.toString()) {
      case "1":
      case 1:
        return "Success";

      case "2":
      case 2:
        return "Pending";

      case "0":
      case 0:
        return "Fail";

      default:
        return null;
    }
  } catch (error) {
    return null;
  }
};

export const CardHistoryDepositDetail = ({
  cardTypeId,
  cardId,
  cardCoin = null,
}) => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const { domRef } = useFadedIn();
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

  useEffect(() => {
    handleGetCardDetail();
  }, []);

  const handleGetData = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await axiosService.post(
        "api/visaCard/getHistoryDepositToCard",
        {
          limit: LIMIT,
          page: page,
          card_id: cardId,
          card_type_id: cardTypeId,
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

  useEffect(() => {
    handleGetData();
  }, [page]);

  if (!isLogin) {
    return null;
  }

  return (
    <div className="CardHistoryDepositDetail" ref={domRef}>
      <TableV3
        isLoading={isLoading}
        scrollX={900}
        data={data}
        columns={[
          {
            dataIndex: "card_type_id",
            title: t("cardHistoryDeposit.t1"),
          },
          {
            dataIndex: "card_id",
            title: t("cardHistoryDeposit.t2"),
          },
          {
            dataIndex: "email",
            title: t("cardHistoryDeposit.t3"),
          },
          // {
          //   dataIndex: "first_name",
          //   title: t("cardHistoryDeposit.t5"),
          // },
          // {
          //   dataIndex: "last_name",
          //   title: t("cardHistoryDeposit.t6"),
          // },
          {
            dataIndex: "mobile",
            title: t("cardHistoryDeposit.t7"),
          },
          // {
          //   dataIndex: "mobile_code",
          //   title: t("cardHistoryDeposit.t8"),
          // },
          {
            title: t("cardHistoryDeposit.t9"),
            render: (_, record) => {
              return (
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  {roundedUp(record.amountCoin, 4)}
                  <img
                    style={{ width: "20px", height: "20px" }}
                    src={DOMAIN + renderSymbolImgStr(record.symbolDeposit)}
                  />
                </div>
              );
            },
          },
          {
            title: t("cardHistoryDeposit.t10"),
            render: (_, record) => {
              return (
                <span>
                  {" "}
                  {roundedUp(record.amountUsd, 4)}{" "}
                  {handleFindCurr(record.card_type_id)}
                </span>
              );
            },
          },
          {
            title: t("cardHistoryDeposit.t11"),
            render: (_, record) => {
              return <span>{renderStatusDeposit(record.statusDeposit)}</span>;
            },
          },
          {
            dataIndex: "created_at",
            title: t("cardHistoryDeposit.t12"),
          },
        ]}
        page={page}
        totalItem={total}
        pageSize={LIMIT}
        handleChangePage={(p) => setPage(p)}
      />
    </div>
  );
};
