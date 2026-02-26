import { useState } from "react";
import { usePagination } from "src/hooks/V3/usePagination";

const MOCK = [
  {
    cardTypeId: "220081",
    cardId: "PC : 25612",
    amountCoin: 7423,
    depositedEuro: "€ 45,23",
    status: "Pending",
    dateTime: "Oct 21 2024 03:15 PM",
  },
  {
    cardTypeId: "220034",
    cardId: "PC : 25148",
    amountCoin: 5849,
    depositedEuro: "€ 63,45",
    status: "Confirmed",
    dateTime: "Oct 22 2024 10:40 AM",
  },
  {
    cardTypeId: "220099",
    cardId: "PC : 25874",
    amountCoin: 3291,
    depositedEuro: "€ 35,12",
    status: "Confirmed",
    dateTime: "Oct 23 2024 01:22 PM",
  },
  {
    cardTypeId: "220045",
    cardId: "PC : 25309",
    amountCoin: 9187,
    depositedEuro: "€ 90,78",
    status: "Pending",
    dateTime: "Oct 24 2024 08:00 AM",
  },
  {
    cardTypeId: "220067",
    cardId: "PC : 25741",
    amountCoin: 4521,
    depositedEuro: "€ 47,99",
    status: "Confirmed",
    dateTime: "Oct 25 2024 06:35 PM",
  },
  {
    cardTypeId: "220022",
    cardId: "PC : 25098",
    amountCoin: 7516,
    depositedEuro: "€ 62,45",
    status: "Pending",
    dateTime: "Oct 26 2024 04:50 PM",
  },
  {
    cardTypeId: "220089",
    cardId: "PC : 25937",
    amountCoin: 3992,
    depositedEuro: "€ 30,21",
    status: "Confirmed",
    dateTime: "Oct 27 2024 09:10 AM",
  },
  {
    cardTypeId: "220056",
    cardId: "PC : 25514",
    amountCoin: 6700,
    depositedEuro: "€ 54,36",
    status: "Confirmed",
    dateTime: "Oct 28 2024 12:30 PM",
  },
  {
    cardTypeId: "220073",
    cardId: "PC : 25267",
    amountCoin: 5211,
    depositedEuro: "€ 47,88",
    status: "Pending",
    dateTime: "Oct 29 2024 11:25 AM",
  },
  {
    cardTypeId: "220038",
    cardId: "PC : 25700",
    amountCoin: 8032,
    depositedEuro: "€ 79,11",
    status: "Confirmed",
    dateTime: "Oct 30 2024 02:40 PM",
  },
  {
    cardTypeId: "220090",
    cardId: "PC : 25852",
    amountCoin: 2375,
    depositedEuro: "€ 23,58",
    status: "Confirmed",
    dateTime: "Oct 31 2024 05:15 PM",
  },
];

export const useCardDepositHistoryV3 = () => {
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
