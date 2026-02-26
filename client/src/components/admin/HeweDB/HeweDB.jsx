import { Button, Input } from "antd";
import { useHeweDB } from "./hooks/useHeweDB";
import "./HeweDB.scss";
import { Table } from "src/components/NewVersion/Table/Table";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { roundedUp } from "src/util/roundNumber";
import { ButtonExportToExcel } from "src/components/NewVersion/ButtonExportToExcel/ButtonExportToExcel";
import { usePermissionAdmin } from "src/hooks/usePermissionAdmin";
import { adminFunction } from "../sidebar";
import NoPermision from "../no-permision";

export const HeweDB = () => {
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
  } = useHeweDB();
  const { t } = useTranslation();

  const { isNoPermission, isOnlyView } = usePermissionAdmin(
    adminFunction.heweDB
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
      dataIndex: "userName",
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
    <div className="HeweDB">
      <h2 style={{ marginBottom: "8px", color: "#fff" }}>Hewe DB </h2>

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
