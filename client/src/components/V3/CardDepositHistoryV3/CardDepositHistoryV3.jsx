import { renderTag, tagsStatus } from "src/util/V3/renderTag";
import { TableV3 } from "../TableV3/TableV3";
import "./CardDepositHistoryV3.scss";
import { useCardDepositHistoryV3 } from "./hooks/useCardDepositHistoryV3";
import { useEffect, useState } from "react";
import { useFadedIn } from "src/hooks/useFadedIn";
import { useTranslation } from "react-i18next";
import { axiosService, DOMAIN } from "src/util/service";
import { message } from "antd";
import { roundedDown } from "src/util/roundNumber";
import {
  renderStatusDeposit,
  renderSymbolImgStr,
} from "src/components/NewVersion/CardManagement/CardHistoryDepositDetail/CardHistoryDepositDetail";

const LIMIT = 10;

export const CardDepositHistoryV3 = () => {
  // const { data, page, limit, total, handleChangePage } =
  //   useCardDepositHistoryV3();

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
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

  useEffect(() => {
    handleGetCardDetail();
  }, []);

  useEffect(() => {
    handleGetData();
  }, [page]);

  const columns = [
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
    {
      dataIndex: "userName",
      title: t("cardHistoryDeposit.t4"),
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
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {roundedDown(record.amountCoin)}
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
            {roundedDown(record.amountUsd)}{" "}
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
  ];

  return (
    <div className="containerV3">
      <div className="CardDepositHistoryV3">
        <div className="title">{t("v3.t16")}</div>

        <TableV3
          isLoading={isLoading}
          scrollX={1000}
          data={data}
          columns={columns}
          page={page}
          totalItem={total}
          pageSize={LIMIT}
          handleChangePage={(p) => setPage(p)}
        />
      </div>
    </div>
  );
};
