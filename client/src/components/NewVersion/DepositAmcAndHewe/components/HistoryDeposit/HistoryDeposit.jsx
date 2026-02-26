import { useEffect, useState } from "react";
import "./HistoryDeposit.scss";
import { useTranslation } from "react-i18next";
import { axiosService } from "src/util/service";
import { message, Pagination } from "antd";

const LIMIT = 5;

export const HistoryDeposit = ({ token }) => {
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
        symbol: token,
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

  const renderData = data.map((rowData, index) => {
    return (
      <div
        key={index}
        style={{
          width: "100%",
          backgroundColor: "rgb(43 43 43)",
          borderRadius: "8px",
          padding: "12px",
          marginBottom: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ fontWeight: 500 }}>{t("amount")}:</div>
          <div>
            {rowData.amount} {token}
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ fontWeight: 500 }}>Hash:</div>
          <div style={{ wordBreak: "break-all" }}>
            {rowData.hash}{" "}
            <i
              class="fa-solid fa-copy"
              style={{ cursor: "pointer", marginLeft: "4px" }}
              onClick={handleCopy(rowData.hash)}
            ></i>
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ fontWeight: 500 }}>{t("time")}:</div>
          <div>{rowData.created_at}</div>
        </div>
      </div>
    );
  });

  useEffect(() => {
    handleGetData({ p: page });
  }, [page]);

  return (
    <div className="HistoryDeposit">
      <div className="titleInside">
        {t("depositBtcHistory").replace("BTC", token)}
      </div>

      <div style={{ marginTop: "24px" }}>
        {data.length !== 0 ? (
          renderData
        ) : (
          <div style={{ textAlign: "center" }}>No Data</div>
        )}
      </div>

      {data.length !== 0 && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            size={window.innerWidth < 600 ? "small" : "default"}
            current={page}
            total={total}
            pageSize={LIMIT}
            onChange={handleChangePage}
          />
        </div>
      )}
    </div>
  );
};
