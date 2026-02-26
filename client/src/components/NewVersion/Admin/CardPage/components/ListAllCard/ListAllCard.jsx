import { Input } from "antd";
import { useListAllCard } from "./hooks/useListAllCard";
import "./ListAllCard.scss";
import { Table } from "src/components/NewVersion/Table/Table";
import { Link } from "react-router-dom/cjs/react-router-dom";

export const ListAllCard = ({
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
  } = useListAllCard(searchModeInit, searchUserIdInit);

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

  return (
    <div className="ListAllCard">
      <h2 style={{ marginBottom: "8px", color: "#fff" }}>List All Card</h2>

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
