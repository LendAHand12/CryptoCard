import { Table } from "src/components/NewVersion/Table/Table";
import { message } from "antd";
import { roundedDown } from "src/util/roundNumber";
import { useHistoryBuyHeweInUserDetail } from "./hooks/useHistoryBuyHeweInUserDetail";
import NoPermision from "../no-permision";
import { usePermissionAdmin } from "src/hooks/usePermissionAdmin";
import { adminFunction } from "../sidebar";

export const HistoryBuyHeweInUserDetail = ({ userId }) => {
  const { data, isLoading, page, limit, total, handleChangePage } =
    useHistoryBuyHeweInUserDetail(userId);

  const { isNoPermission } = usePermissionAdmin(adminFunction.buyToken);

  const columns = [
    {
      title: "Amount USDT",
      render: (_, record) => {
        return (
          <div>
            <span>{roundedDown(record.amount)} </span>
            <span>USDT</span>
          </div>
        );
      },
    },
    {
      title: "Amount Token",
      render: (_, record) => {
        return (
          <div>
            <span>{roundedDown(record.totalCoin, 7)} </span>
            <span>{record.symbol}</span>
          </div>
        );
      },
    },
    {
      title: "Bonus",
      render: (_, record) => {
        return (
          <div>
            <span>{record.bonus} </span>
            <span>{record.symbol}</span>
          </div>
        );
      },
    },
    {
      title: "Description",
      render: (_, record) => {
        return (
          <div>
            <span>{record.message}</span>
          </div>
        );
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
              navigator.clipboard.writeText(record.addressTo);
              message.info("Copied");
            }}
            style={{ maxWidth: "300px", lineHeight: "1.2" }}
          >
            {record.addressTo} <i class="fa-solid fa-copy"></i>
          </div>
        );
      },
    },
    {
      title: "Time",
      dataIndex: "created_at",
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
      {/* <Input
        style={{ width: "100%", maxWidth: "350px" }}
        value={searchNameOrEmail}
        onChange={handleChangeSearchNameOrEmail}
        placeholder="Search by email..."
      /> */}
    </div>
  );

  if (isNoPermission) {
    return <NoPermision />;
  }

  return (
    <div className="HistoryRegisterCardAdmin">
      <h2 style={{ marginBottom: "8px", color: "#fff" }}>History Buy HEWE</h2>

      <>{extendTools}</>

      <Table
        isLoading={isLoading}
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
