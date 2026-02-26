import { useState } from "react";
import { usePagination } from "src/hooks/V3/usePagination";

const MOCK = [
  {
    cardTypeId: "220011",
    cardNumber: "882251",
    feesUSDT: "20 USDT",
    status: "Active",
    dateTime: "Oct 26 2024 12:39 PM",
  },
  {
    cardTypeId: "220011",
    cardNumber: "882251",
    feesUSDT: "40 USDT",
    status: "Freeze",
    dateTime: "Oct 26 2024 12:39 PM",
  },
  {
    cardTypeId: "220011",
    cardNumber: "882251",
    feesUSDT: "40 USDT",
    status: "Canceled",
    dateTime: "Oct 26 2024 12:39 PM",
  },
  {
    cardTypeId: "220011",
    cardNumber: "882251",
    feesUSDT: "40 USDT",
    status: "Active",
    dateTime: "Oct 26 2024 12:39 PM",
  },
  {
    cardTypeId: "220011",
    cardNumber: "882251",
    feesUSDT: "15 USDT",
    status: "Active",
    dateTime: "Oct 25 2024 10:00 AM",
  },
  {
    cardTypeId: "220011",
    cardNumber: "882251",
    feesUSDT: "30 USDT",
    status: "Freeze",
    dateTime: "Oct 25 2024 09:45 AM",
  },
  {
    cardTypeId: "220011",
    cardNumber: "882251",
    feesUSDT: "25 USDT",
    status: "Canceled",
    dateTime: "Oct 25 2024 03:20 PM",
  },
  {
    cardTypeId: "220011",
    cardNumber: "882251",
    feesUSDT: "35 USDT",
    status: "Active",
    dateTime: "Oct 24 2024 02:05 PM",
  },
  {
    cardTypeId: "220011",
    cardNumber: "882251",
    feesUSDT: "50 USDT",
    status: "Freeze",
    dateTime: "Oct 24 2024 08:30 PM",
  },
  {
    cardTypeId: "220011",
    cardNumber: "882251",
    feesUSDT: "10 USDT",
    status: "Canceled",
    dateTime: "Oct 23 2024 11:15 AM",
  },
  {
    cardTypeId: "220011",
    cardNumber: "882251",
    feesUSDT: "20 USDT",
    status: "Active",
    dateTime: "Oct 23 2024 07:00 PM",
  },
];

export const useRegisterCardHistoryV3 = () => {
  const [data, setData] = useState(MOCK);
  const { page, limit, total, handleChangePage, handleChangeTotal } =
    usePagination();

  return {
    data,
    page,
    limit,
    total,
    handleChangePage,
  };
};
