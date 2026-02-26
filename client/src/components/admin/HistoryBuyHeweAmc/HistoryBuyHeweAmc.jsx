import { Table } from "src/components/NewVersion/Table/Table";
import { useHistoryBuyHeweAmc } from "./hooks/useHistoryBuyHeweAmc";
import { DatePicker, Input, message } from "antd";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { roundedDown } from "src/util/roundNumber";
import { ButtonExportToExcel } from "src/components/NewVersion/ButtonExportToExcel/ButtonExportToExcel";
import { usePermissionAdmin } from "src/hooks/usePermissionAdmin";
import NoPermision from "../no-permision";
import { adminFunction } from "../sidebar";

export const HistoryBuyHeweAmc = () => {
  const {
    data,
    isLoading,
    page,
    limit,
    total,
    searchNameOrEmail,
    handleChangePage,
    handleChangeSearchNameOrEmail,
    times,
    handleChangeDates,
    handleClickExportBtn,
    isPendingExportToExcel,
  } = useHistoryBuyHeweAmc();
  const { isNoPermission } = usePermissionAdmin(adminFunction.buyToken);

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
            <span>{roundedDown(record.totalCoin)} </span>
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
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <DatePicker.RangePicker
          allowClear={false}
          value={[times.timeStart, times.timeEnd]}
          onChange={handleChangeDates}
        ></DatePicker.RangePicker>
        <ButtonExportToExcel
          loading={isPendingExportToExcel}
          onExport={handleClickExportBtn}
        />
      </div>

      <h2 style={{ marginBottom: "8px", color: "#fff" }}>
        History Buy HEWE and AMC
      </h2>

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
