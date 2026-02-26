import { Table } from "src/components/NewVersion/Table/Table";
import { useListHistoryDepositCoin } from "./hooks/useListHistoryDepositCoin";
import { Input, message } from "antd";
import { Link } from "react-router-dom/cjs/react-router-dom";

export const ListHistoryDepositCoin = ({ userId }) => {
  const {
    data,
    limit,
    total,
    page,
    isLoading,
    handleChangePage,
    handleGetListData,
  } = useListHistoryDepositCoin({ userId: userId });

  const columns = [
    {
      title: "Amount",
      render: (_, record) => {
        return (
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <span>{record.amount}</span>{" "}
            <span>{record.coin_key?.toUpperCase()}</span>
          </div>
        );
      },
    },
    {
      title: "Description",
      render: (_, record) => {
        return <div>{record.message}</div>;
      },
    },
    {
      title: "Hash",
      render: (_, record) => {
        return (
          <div
            onClick={() => {
              navigator.clipboard.writeText(record.hash);
              message.info("Copied");
            }}
            style={{ maxWidth: "300px", lineHeight: "1.2" }}
          >
            {record.hash} <i class="fa-solid fa-copy"></i>
          </div>
        );
      },
    },

    {
      title: "Address",
      render: (_, record) => {
        return (
          <div
            onClick={() => {
              navigator.clipboard.writeText(record.to_address);
              message.info("Copied");
            }}
            style={{ maxWidth: "300px", lineHeight: "1.2" }}
          >
            {record.to_address} <i class="fa-solid fa-copy"></i>
          </div>
        );
      },
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

      <Table columns={columns} rowKey="id" data={data} />
    </div>
  );
};
