import { Input } from "antd";
import "./AdminCommission.scss";
import { Table } from "src/components/NewVersion/Table/Table";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { useAdminCommission } from "./hooks/useAdminCommission";
import { image_domain } from "src/constant";
import { DOMAIN } from "src/util/service";
import { roundedUp } from "src/util/roundNumber";
import { usePermissionAdmin } from "src/hooks/usePermissionAdmin";
import NoPermision from "../no-permision";
import { adminFunction } from "../sidebar";

export const AdminCommission = ({
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
  } = useAdminCommission(searchModeInit, searchUserIdInit);
  const { isNoPermission } = usePermissionAdmin(adminFunction.commission);

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
      dataIndex: "username",
    },
    {
      title: "Parent ID",
      dataIndex: "parent_id",
      render: (value) => (
        <Link to={`/admin/user-detail/${value}`}>{value}</Link>
      ),
    },
    {
      title: "User Name Parent",
      dataIndex: "userNameParent",
    },
    {
      title: "MC Trade No",
      dataIndex: "mc_trade_no",
    },
    {
      title: "Percent",
      dataIndex: "percent",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (value, record) => {
        return (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span>{roundedUp(value)}</span>
            <img
              // src={image_domain}
              src={`${DOMAIN}images/${record.symbol?.toUpperCase()}.png`}
              style={{ width: "20px", height: "20px", objectFit: "cover" }}
            />
          </div>
        );
      },
    },
    {
      title: "Amount Received",
      dataIndex: "amountReceived",
      render: (value, record) => {
        return (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span>{roundedUp(value)}</span>
            <img
              // src={image_domain}
              src={`${DOMAIN}images/${record.symbol?.toUpperCase()}.png`}
              style={{ width: "20px", height: "20px", objectFit: "cover" }}
            />
          </div>
        );
      },
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
      {/* <Input
        style={{ width: "100%", maxWidth: "350px" }}
        value={searchEmail}
        onChange={handleChangeSearchEmail}
        placeholder="Search by email..."
      /> */}
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
    <div className="ListAllCard">
      <h2 style={{ marginBottom: "8px", color: "#fff" }}>Commissions</h2>

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
