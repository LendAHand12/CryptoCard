import { useEffect, useState } from "react";
import "./CardHistoryOperation.scss";
import { message } from "antd";
import { axiosService } from "src/util/service";
import { useFadedIn } from "src/hooks/useFadedIn";
import { useRedirectHomeIfNotLogin } from "src/hooks/useRedirectHomeIfNotLogin";
import { useTranslation } from "react-i18next";
import { renderOperationType } from "..";
import { TableV3 } from "src/components/V3/TableV3/TableV3";

const LIMIT = 10;

export const CardHistoryOperation = ({ idApi }) => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const { domRef } = useFadedIn();
  const { isLogin } = useRedirectHomeIfNotLogin();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleGetData = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await axiosService.post(
        "api/visaCard/getHistoryOperationCard",
        {
          limit: LIMIT,
          page: page,
          id: Number(idApi),
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

  const renderStatusOperation = (status) => {
    switch (Number(status)) {
      case 0:
        return t("historyOperation.t2");

      case 1:
        return t("historyOperation.t3");

      case 2:
        return t("historyOperation.t4");

      case 50:
        return t("historyOperation.t11");

      case 98:
        return t("historyOperation.t5");

      case 99:
        return t("historyOperation.t6");

      default:
        return null;
    }
  };

  useEffect(() => {
    handleGetData();
  }, [page]);

  if (!isLogin) {
    return null;
  }

  return (
    <div className="CardHistoryOperation" ref={domRef}>
      <TableV3
        isLoading={isLoading}
        data={data}
        columns={[
          {
            dataIndex: "card_id",
            title: t("historyOperation.t7"),
          },
          {
            title: t("historyOperation.t8"),
            render: (_, record) => {
              return renderOperationType(record.type);
            },
          },
          {
            title: t("historyOperation.t9"),
            render: (_, record) => {
              return renderStatusOperation(record.operate_status);
            },
          },
          {
            dataIndex: "created_at",
            title: t("historyOperation.t10"),
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
