import { Pagination } from "antd";
import "./HeweDBBonus.scss";
import { useHeweDBBonues } from "./hooks/useHeweDBBonues";
import { useTranslation } from "react-i18next";
import { image_domain } from "src/constant";
import { TableV3 } from "src/components/V3/TableV3/TableV3";

export const HeweDBBonus = () => {
  const { isLoading, data, total, page, handleChangePage, limit } =
    useHeweDBBonues();
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
          <div>{rowData.userName}</div>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ fontWeight: 500 }}>Email:</div>
          <div>{rowData.email}</div>
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ fontWeight: 500 }}>{t("registerCard.t7")}:</div>
          <div>
            {rowData.status == "2" ? (
              <div style={{ color: "yellow" }}>{t("registerCard.t8")}</div>
            ) : (
              <div style={{ color: "#0dc90d" }}>{t("registerCard.t9")}</div>
            )}
          </div>
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
      dataIndex: "userName",
      title: t("userName"),
    },
    {
      dataIndex: "email",
      title: "Email",
    },
    {
      title: t("registerCard.t7"),
      render: (_, record) => {
        return (
          <div>
            {record.status == "2" ? (
              <div style={{ color: "yellow" }}>{t("registerCard.t8")}</div>
            ) : (
              <div style={{ color: "#0dc90d" }}>{t("registerCard.t9")}</div>
            )}
          </div>
        );
      },
    },
    {
      dataIndex: "created_at",
      title: t("time"),
    },
  ];

  return (
    <div className="HeweDBBonus">
      <div className="containerInside">
        <div
          className="titleInside"
          style={{
            marginBottom: "30px",
            borderBottom: "1px solid #4f4f4f",
            paddingBottom: "10px",
          }}
        >
          {t("outsideComponent.t84")}
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
