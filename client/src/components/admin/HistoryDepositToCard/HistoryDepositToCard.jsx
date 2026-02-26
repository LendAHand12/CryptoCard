import { Table } from "src/components/NewVersion/Table/Table";
import { useHistoryDepositToCard } from "./hooks/useHistoryDepositToCard";
import { DatePicker, Image, Input, message } from "antd";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { roundedDown, roundedUp } from "src/util/roundNumber";
import { ButtonExportToExcel } from "src/components/NewVersion/ButtonExportToExcel/ButtonExportToExcel";
import { DOMAIN } from "src/util/service";
import {
  renderStatusDeposit,
  renderSymbolImgStr,
} from "src/components/NewVersion/CardManagement/CardHistoryDepositDetail/CardHistoryDepositDetail";
import { renderFrontCardImgByCardApplyType } from "src/util/renderCardImg";
import { usePermissionAdmin } from "src/hooks/usePermissionAdmin";
import { adminFunction } from "../sidebar";
import NoPermision from "../no-permision";

export const HistoryDepositToCard = () => {
  const {
    cardsCurrency,
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
  } = useHistoryDepositToCard();

  const { isNoPermission, isOnlyView } = usePermissionAdmin(
    adminFunction.depositCard
  );

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
      title: "Amount Coin",
      render: (_, record) => {
        return (
          <div>
            <span>{roundedUp(record.amountCoin, 4)} </span>
            <span>
              <img
                style={{ width: "20px", height: "20px" }}
                src={DOMAIN + renderSymbolImgStr(record?.symbolDeposit)}
              />
            </span>
          </div>
        );
      },
    },
    {
      title: "Amount",
      render: (_, record) => {
        let curr = null;

        try {
          curr = cardsCurrency[record.card_type_id]?.coin?.toUpperCase();
        } catch (error) {}

        return (
          <div style={{ whiteSpace: "nowrap" }}>
            <span>{roundedUp(record.amountUsd, 4)} </span>
            <span>{curr}</span>
          </div>
        );
      },
    },
    {
      title: "Status",
      render: (_, record) => {
        return (
          <div>
            <span>{renderStatusDeposit(record?.statusDeposit)}</span>
          </div>
        );
      },
    },
    {
      title: "Card Type ID",
      render: (_, record) => {
        let src = null;

        try {
          src = cardsCurrency[record.card_type_id]?.applyType?.toString();
        } catch (error) {}

        return (
          <div>
            <span>
              <Image
                style={{ width: "125px" }}
                src={renderFrontCardImgByCardApplyType(src)}
              />
            </span>
          </div>
        );
      },
    },
    {
      title: "Card ID",
      render: (_, record) => {
        return (
          <div>
            <span>{record.card_id}</span>
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
      <DatePicker.RangePicker
        allowClear={false}
        value={[times.timeStart, times.timeEnd]}
        onChange={handleChangeDates}
        style={{ width: "100%", maxWidth: "350px" }}
      ></DatePicker.RangePicker>
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
          style={{ width: "100%", maxWidth: "350px" }}
        ></DatePicker.RangePicker>
        <ButtonExportToExcel
          loading={isPendingExportToExcel}
          onExport={handleClickExportBtn}
        />
      </div>
      <h2 style={{ marginBottom: "8px", color: "#fff" }}>
        History Deposit Crypto To Card
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
