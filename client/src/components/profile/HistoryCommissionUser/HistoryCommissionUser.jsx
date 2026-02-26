import { Pagination } from "antd";
import "./HistoryCommissionUser.scss";
import { useHistoryCommissionUser } from "./hooks/useHistoryCommissionUser";
import { useTranslation } from "react-i18next";
import { image_domain } from "src/constant";
import { DOMAIN } from "src/util/service";
import { TableV3 } from "src/components/V3/TableV3/TableV3";
import { roundedUp } from "src/util/roundNumber";

export const HistoryCommissionUser = () => {
  const { isLoading, data, total, page, handleChangePage, limit } =
    useHistoryCommissionUser();
  const { t } = useTranslation();

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
          <div style={{ fontWeight: 500 }}>{t("userName")}:</div>
          <div>{rowData.userNameParent}</div>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ fontWeight: 500 }}>MC Trade No:</div>
          <div>{rowData.mc_trade_no}</div>
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ fontWeight: 500 }}>{t("amount")}:</div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span>{rowData.amountReceived}</span>
            <img
              src={`${DOMAIN}images/${rowData.symbol}.png`}
              style={{ width: "20px", height: "20px", objectFit: "cover" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ fontWeight: 500 }}>{t("outsideComponent.t73")}:</div>
          <div>{rowData.note}</div>
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ fontWeight: 500 }}>{t("time")}:</div>
          <div>{rowData.created_at}</div>
        </div>
      </div>
    );
  });

  const columns = [
    {
      dataIndex: "userNameParent",
      title: t("userName"),
    },
    {
      dataIndex: "mc_trade_no",
      title: "MC Trade No",
    },
    {
      title: t("amount"),
      render: (_, record) => {
        return (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span>{roundedUp(record.amountReceived)}</span>
            <img
              src={`${DOMAIN}images/${record.symbol}.png`}
              style={{ width: "20px", height: "20px", objectFit: "cover" }}
            />
          </div>
        );
      },
    },
    {
      dataIndex: "note",
      title: t("outsideComponent.t73"),
    },
    {
      dataIndex: "created_at",
      title: t("time"),
    },
  ];

  return (
    <div className="HistoryCommissionUser">
      <div className="containerInside">
        <div
          className="titleInside"
          style={{
            marginBottom: "30px",
            borderBottom: "1px solid #4f4f4f",
            paddingBottom: "10px",
          }}
        >
          {t("outsideComponent.t74")}
        </div>

        <TableV3
          isLoading={isLoading}
          scrollX={1000}
          data={data}
          columns={columns}
          page={page}
          totalItem={total}
          pageSize={limit}
          handleChangePage={handleChangePage}
        />

        {/* <div style={{ marginTop: "24px" }}>
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
              pageSize={limit}
              onChange={handleChangePage}
            />
          </div>
        )} */}
      </div>
    </div>
  );
};
