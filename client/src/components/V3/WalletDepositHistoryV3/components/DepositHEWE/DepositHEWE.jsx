import { message } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TableV3 } from "src/components/V3/TableV3/TableV3";
import { axiosService } from "src/util/service";

const LIMIT = 5;

export const DepositHEWE = () => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetData = async ({ p }) => {
    try {
      setIsLoading(true);

      const res = await axiosService.post("/api/blockico/getblocks", {
        limit: LIMIT,
        page: p,
        symbol: "HEWE",
      });

      setData(res.data.data.array);
      setTotal(res.data.data.total);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleChangePage = (p) => {
    if (isLoading) return;

    setPage(p);
  };

  const handleCopy = (data) => () => {
    navigator.clipboard.writeText(data);
    message.info("Copied");
  };

  const columns = [
    {
      title: "Hash",
      render: (_, record) => {
        return (
          <div>
            <span>{record.hash} </span>
            <i
              class="fa-solid fa-copy"
              style={{ cursor: "pointer", marginLeft: "4px" }}
              onClick={handleCopy(record.hash)}
            ></i>
          </div>
        );
      },
    },
    {
      title: t("depositAMC.t1"),
      render: (_, record) => {
        return (
          <div>
            <span>{record.message} </span>
          </div>
        );
      },
    },
    {
      title: t("amount"),
      render: (_, record) => {
        return (
          <span>
            <span>{record.amount} </span>
            <span>HEWE</span>
          </span>
        );
      },
    },

    {
      dataIndex: "created_at",
      title: t("time"),
    },
  ];

  useEffect(() => {
    handleGetData({ p: page });
  }, [page]);

  return (
    <div>
      <div className="title">{t("depositAMC.t3")}</div>

      <TableV3
        isLoading={isLoading}
        // scrollX={900}
        data={data}
        columns={columns}
        page={page}
        totalItem={total}
        pageSize={LIMIT}
        handleChangePage={(p) => setPage(p)}
      />
    </div>
  );
};
