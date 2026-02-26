import { Table } from "src/components/NewVersion/Table/Table";
import { useListCardCreation } from "./hooks/useListCardCreation";
import "./ListCardCreation.scss";
import { Input } from "antd";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { usePermissionAdmin } from "src/hooks/usePermissionAdmin";
import NoPermision from "src/components/admin/no-permision";
import { adminFunction } from "src/components/admin/sidebar";

export const ListCardCreation = ({
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
  } = useListCardCreation(searchModeInit, searchUserIdInit);
  const { isNoPermission } = usePermissionAdmin(adminFunction.card);

  const columns = [
    {
      title: "User ID",
      dataIndex: "userid",
      render: (value) => (
        <Link to={`/admin/user-detail/${value}`}>{value}</Link>
      ),
    },
    {
      title: "Card Type ID",
      dataIndex: "card_type_id",
    },
    {
      title: "Apply Type",
      dataIndex: "apply_type",
      render: (value) => value || "-",
    },
    {
      title: "User Name",
      dataIndex: "userName",
    },
    {
      title: "First Name",
      dataIndex: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
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
    <div className="ListCardCreation">
      <h2 style={{ marginBottom: "8px", color: "#fff" }}>List Card Creation</h2>

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
