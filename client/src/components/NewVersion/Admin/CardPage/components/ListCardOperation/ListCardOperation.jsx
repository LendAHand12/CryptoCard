import { Input } from "antd";
import { useListCardOperation } from "./hooks/useListCardOperation";
import "./ListCardOperation.scss";
import { Table } from "src/components/NewVersion/Table/Table";
import { renderOperationType } from "src/components/NewVersion/CardManagement";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { usePermissionAdmin } from "src/hooks/usePermissionAdmin";
import { adminFunction } from "src/components/admin/sidebar";
import NoPermision from "src/components/admin/no-permision";

export const ListCardOperation = ({
  searchModeInit = "default",
  searchUserIdInit = "",
  isShowSearch = true,
}) => {
  const {
    data,
    page,
    isLoading,
    total,
    limit,
    searchEmail,
    searchUserId,
    handleChangeSearchEmail,
    handleChangeSearchUserId,
    handleChangePage,
  } = useListCardOperation(searchModeInit, searchUserIdInit);
  const { t } = useTranslation();
  const { isNoPermission } = usePermissionAdmin(adminFunction.card);

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

  const columns = [
    {
      title: "User ID",
      dataIndex: "userid",
      render: (value) => (
        <Link to={`/admin/user-detail/${value}`}>{value}</Link>
      ),
    },
    {
      title: "User Name",
      dataIndex: "userName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Card ID",
      dataIndex: "idCardData",
    },
    {
      title: "Operation",
      dataIndex: "type",
      render: (value) => renderOperationType(value),
    },
    {
      title: "Status",
      dataIndex: "operate_status",
      render: (value) => renderStatusOperation(value),
    },
    {
      title: "Time",
      dataIndex: "created_at",
      render: (value) => value,
    },
  ];

  const extendTools = isShowSearch && (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        flexDirection: "column",
        gap: "8px",
        marginBottom: "8px",
      }}
    >
      <Input
        style={{ width: "100%", maxWidth: "350px" }}
        value={searchEmail}
        onChange={handleChangeSearchEmail}
        placeholder="Search by email..."
      />
      <Input
        style={{ width: "100%", maxWidth: "350px" }}
        value={searchUserId}
        onChange={handleChangeSearchUserId}
        placeholder="Search by user ID..."
      />
    </div>
  );

  if (isNoPermission) {
    return <NoPermision />;
  }

  return (
    <div className="ListCardOperation">
      <h2 style={{ marginBottom: "8px", color: "#fff" }}>
        List Card Operation
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
