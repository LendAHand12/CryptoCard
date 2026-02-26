import { Table } from "src/components/NewVersion/Table/Table";
import { useListChangeWallet } from "./hooks/useListChangeWallet";
import "./ListChangeWallet.scss";
import { Input } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";

export const ListChangeWallet = ({
  userId,
  searchModeInit = "default",
  searchUserIdInit = "",
  isShowSearch = true,
}) => {
  const [page, setPage] = useState(1);
  const { data } = useListChangeWallet({ userId: userId });

  const columns = [
    {
      title: "User ID",
      dataIndex: "userid",
      render: (value) => (
        <Link to={`/admin/user-detail/${value}`}>{value}</Link>
      ),
    },

    {
      title: "Address",
      dataIndex: "address",
      render: (value) => value,
    },
    {
      title: "Time",
      dataIndex: "created_at",
      render: (value) => new Date(value).toLocaleString("vi"),
    },
  ];

  return (
    <div className="ListChangeWallet">
      <h2 style={{ marginBottom: "8px", color: "#fff" }}>
        History Change Wallet
      </h2>

      <Table
        data={data}
        rowKey="id"
        columns={columns}
        currentPage={page}
        onChangePage={setPage}
      />
    </div>
  );
};
