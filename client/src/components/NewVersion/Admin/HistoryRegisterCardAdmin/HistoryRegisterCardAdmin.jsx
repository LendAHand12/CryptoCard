import { Button, Input } from "antd";
import { useHistoryRegisterCardAdmin } from "./hooks/useHistoryRegisterCardAdmin";
import "./HistoryRegisterCardAdmin.scss";
import { Table } from "src/components/NewVersion/Table/Table";
import { renderOperationType } from "src/components/NewVersion/CardManagement";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { roundedUp } from "src/util/roundNumber";
import { ButtonExportToExcel } from "../../ButtonExportToExcel/ButtonExportToExcel";
import { usePermissionAdmin } from "src/hooks/usePermissionAdmin";
import NoPermision from "src/components/admin/no-permision";
import { adminFunction } from "src/components/admin/sidebar";

export const HistoryRegisterCardAdmin = () => {
  const {
    data,
    page,
    isLoading,
    total,
    limit,
    search,
    isPendingExportToExcel,
    handleClickExportBtn,
    handleChangeSearch,
    handleChangePage,
    handleConfirm,
  } = useHistoryRegisterCardAdmin();
  const { t } = useTranslation();

  const { isNoPermission, isOnlyView } = usePermissionAdmin(
    adminFunction.registerCard
  );

  const columns = [
    {
      title: "User ID",
      dataIndex: "userid",
      render: (value) => (
        <Link to={`/admin/user-detail/${value}`}>{value}</Link>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "User Name",
      dataIndex: "fullName",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Payment",
      dataIndex: "paymentCoin",
      render: (_, record) => {
        return (
          <div>
            <div style={{ whiteSpace: "nowrap", lineHeight: "1.5" }}>
              {roundedUp(record.amountCoin)} {record.paymentCoin}
            </div>
            <div style={{ whiteSpace: "nowrap", lineHeight: "1.5" }}>
              Price: {record.rate}
            </div>
            <div style={{ whiteSpace: "nowrap", lineHeight: "1.5" }}>
              USDT:{" "}
              {record.paymentCoin === "USDT"
                ? roundedUp(record.amountCoin)
                : roundedUp(record.rate * record.amountCoin)}
            </div>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) =>
        value == "2" ? (
          <div style={{ color: "yellow" }}>Pending</div>
        ) : (
          <div style={{ color: "#0dc90d" }}>Done</div>
        ),
    },
    {
      title: "Time",
      dataIndex: "created_at",
      render: (value) => value,
    },
    {
      title: "",
      render: (_, record) => {
        if (isOnlyView) return null;

        if (record.status == 2) {
          return <Button onClick={handleConfirm(record.id)}>Confirm</Button>;
        }

        return null;
      },
    },
  ];

  const extendTools = (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        flexDirection: "column",
        gap: "8px",
        marginBottom: "8px",
      }}
    >
      <ButtonExportToExcel
        loading={isPendingExportToExcel}
        onExport={handleClickExportBtn}
      />
      <Input
        style={{ width: "100%", maxWidth: "350px" }}
        value={search}
        onChange={handleChangeSearch}
        placeholder="Search by email..."
      />
    </div>
  );

  if (isNoPermission) {
    return <NoPermision />;
  }

  return (
    <div className="HistoryRegisterCardAdmin">
      <h2 style={{ marginBottom: "8px", color: "#fff" }}>
        History Register Card
      </h2>

      <>{extendTools}</>

      <Table
        columns={columns}
        rowKey="id"
        data={data}
        totalItems={total}
        limit={limit}
        currentPage={page}
        onChangePage={handleChangePage}
      />
    </div>
  );
};
