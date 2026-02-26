import { Table } from "src/components/NewVersion/Table/Table";
import { useHistoryUpdateWalletInUserDetail } from "./hooks/useHistoryUpdateWalletInUserDetail";
import { Input, message } from "antd";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { roundedDown } from "src/util/roundNumber";
import "./HistoryUpdateWallet.scss";
import NoPermision from "../no-permision";
import { usePermissionAdmin } from "src/hooks/usePermissionAdmin";
import { adminFunction } from "../sidebar";

export const HistoryUpdateWalletInUserDetail = ({ userId }) => {
  const {
    data,
    isLoading,
    page,
    limit,
    total,
    symbol,
    handleChangeSymbol,
    handleChangePage,
    handleClickClear,
    coinSelected,
    coins,
  } = useHistoryUpdateWalletInUserDetail(userId);

  const { isNoPermission } = usePermissionAdmin(adminFunction.updateWallet);

  const columns = [
    {
      title: "User ID",
      render: (_, record) => {
        return (
          <div>
            <span>{record.userid} </span>
          </div>
        );
      },
    },
    {
      title: "Email",
      render: (_, record) => {
        return (
          <div>
            <span>{record.email} </span>
          </div>
        );
      },
    },
    {
      title: "Amount",
      render: (_, record) => {
        return (
          <div>
            <span>{roundedDown(record.amount)} </span>
            <span>{record.symbol}</span>
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
        value={symbol}
        onChange={handleChangeSymbol}
        placeholder="Search symbol coin..."
      /> */}
    </div>
  );

  if (isNoPermission) {
    return <NoPermision />;
  }

  return (
    <div className="HistoryRegisterCardAdmin">
      <h2 style={{ marginBottom: "8px", color: "#fff" }}>
        History Update Wallet
      </h2>

      <>
        <div className="coins">
          {coins}

          <>
            <div className={`coin`} onClick={handleClickClear}>
              <div>CLEAR</div>
            </div>
          </>
        </div>
      </>

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
