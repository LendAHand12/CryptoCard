import { Table } from "src/components/NewVersion/Table/Table";
import { useHistoryUpdateWallet } from "./hooks/useHistoryUpdateWallet";
import { Input, message } from "antd";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { roundedDown } from "src/util/roundNumber";
import "./HistoryUpdateWallet.scss";
import { usePermissionAdmin } from "src/hooks/usePermissionAdmin";
import NoPermision from "../no-permision";
import { adminFunction } from "../sidebar";

export const HistoryUpdateWallet = () => {
  const {
    coins,
    data,
    isLoading,
    page,
    limit,
    total,
    searchNameOrEmail,
    handleChangePage,
    handleChangeSearchNameOrEmail,
    handleClickClear,
  } = useHistoryUpdateWallet();
  const { isNoPermission } = usePermissionAdmin(adminFunction.updateWallet);

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
      render: (_, record) => {
        return (
          <div>
            <span>{record.userName}</span>
          </div>
        );
      },
    },
    {
      title: "User Email",
      render: (_, record) => {
        return (
          <div>
            <span>{record.email}</span>
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
      <Input
        style={{ width: "100%", maxWidth: "350px" }}
        value={searchNameOrEmail}
        onChange={handleChangeSearchNameOrEmail}
        placeholder="Search by email or username..."
      />
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
