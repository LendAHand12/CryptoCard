import { useEffect, useState } from "react";
import "./CardHistoryPayment.scss";
import { DatePicker, message, Pagination } from "antd";
import { axiosService } from "src/util/service";
import { useFadedIn } from "src/hooks/useFadedIn";
import { useRedirectHomeIfNotLogin } from "src/hooks/useRedirectHomeIfNotLogin";
import { useTranslation } from "react-i18next";
import { renderOperationType } from "..";
import moment from "moment";
import { TableV3 } from "src/components/V3/TableV3/TableV3";

const LIMIT = 10;

const MOCK_DATA = [
  {
    bank_tx_list: [
      {
        credit: 2.5,
        debit: 2.5,
        description: "MONTHLY FEE",
        fee: 0,
        posting_date: "1595497477",
        transaction_date: "1595497477",
        mc_trade_no: "48d2741747a4493223feb22",
        tx_amount: 2.5,
        tx_currency: "usd",
        tx_id: 54675678678,
        type: 1,
      },
      {
        credit: 3.5,
        debit: 3.5,
        description: "MONTHLY FEE",
        fee: 0,
        posting_date: "1595497477",
        transaction_date: "1595497477",
        mc_trade_no: "48d2741747a4493223feb22",
        tx_amount: 3.5,
        tx_currency: "usd",
        tx_id: 54675678678,
        type: 1,
      },
      {
        credit: 4.5,
        debit: 4.5,
        description: "MONTHLY FEE",
        fee: 0,
        posting_date: "1595497477",
        transaction_date: "1595497477",
        mc_trade_no: "48d2741747a4493223feb22",
        tx_amount: 4.5,
        tx_currency: "usd",
        tx_id: 54675678678,
        type: 1,
      },
    ],
    month_year: "022020",
    statement_cycle_date: "28/11/2019",
  },

  {
    bank_tx_list: [
      {
        credit: 5.5,
        debit: 5.5,
        description: "MONTHLY FEE",
        fee: 0,
        posting_date: "1595497477",
        transaction_date: "1595497477",
        mc_trade_no: "48d2741747a4493223feb22",
        tx_amount: 5.5,
        tx_currency: "usd",
        tx_id: 54675678678,
        type: 2,
      },
      {
        credit: 6.5,
        debit: 6.5,
        description: "MONTHLY FEE",
        fee: 0,
        posting_date: "1595497477",
        transaction_date: "1595497477",
        mc_trade_no: "48d2741747a4493223feb22",
        tx_amount: 6.5,
        tx_currency: "usd",
        tx_id: 54675678678,
        type: 1,
      },
      {
        credit: 7.5,
        debit: 7.5,
        description: "MONTHLY FEE",
        fee: 0,
        posting_date: "1595497477",
        transaction_date: "1595497477",
        mc_trade_no: "48d2741747a4493223feb22",
        tx_amount: 7.5,
        tx_currency: "usd",
        tx_id: 54675678678,
        type: 4,
      },
    ],
    month_year: "032020",
    statement_cycle_date: "28/11/2019",
  },
];

export const CardHistoryPayment = ({ cardId, cardCoin = null }) => {
  const [data, setData] = useState([]);
  const { domRef } = useFadedIn();
  const { isLogin } = useRedirectHomeIfNotLogin();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const [dates, setDates] = useState([moment().subtract(5, "M"), moment()]);
  const [value, setValue] = useState([moment().subtract(5, "M"), moment()]);

  const disabledDate = (current) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], "months") > 4;
    const tooEarly = dates[1] && dates[1].diff(current, "months") > 5;
    return !!tooEarly || !!tooLate;
  };

  const onOpenChange = (open) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };

  const formatMonthYear = (valueMoment) => {
    return valueMoment.format("MMYYYY");
  };

  const handlePreprocessData = (dataFromAPI) => {
    try {
      const newList = [];

      dataFromAPI.forEach((dOutside) => {
        let rowObj = {};

        rowObj.month_year = dOutside.month_year;
        rowObj.statement_cycle_date = dOutside.statement_cycle_date;

        dOutside.bank_tx_list.forEach((dInside) => {
          rowObj.credit = dInside.credit;
          rowObj.debit = dInside.debit;
          rowObj.description = dInside.description;
          rowObj.fee = dInside.fee;
          rowObj.posting_date = dInside.posting_date;
          rowObj.transaction_date = dInside.transaction_date;
          rowObj.mc_trade_no = dInside.mc_trade_no;
          rowObj.tx_amount = dInside.tx_amount;
          rowObj.tx_currency = dInside.tx_currency;
          rowObj.tx_id = dInside.tx_id;
          rowObj.type = dInside.type;

          newList.push(rowObj);
          rowObj = {};
        });
      });

      return newList;
    } catch (error) {
      return [];
    }
  };

  const handleGetData = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await axiosService.post("api/visaCard/queryRecordToCard", {
        start_time: formatMonthYear(value[0]),
        end_time: formatMonthYear(value[1]),
        card_id: cardId,
      });

      const dataPreprocess = handlePreprocessData(res.data.data.data);
      // const dataPreprocess = handlePreprocessData(MOCK_DATA);

      setData(dataPreprocess);

      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    } catch (error) {
      // setIsLoading(false);
      message.error(error.response.data.message);
    }
  };

  const renderTransactionType = (type) => {
    switch (type) {
      case 1:
        return t("historyPayment.t2");
      case 2:
        return t("historyPayment.t3");
      case 3:
        return t("historyPayment.t4");
      case 4:
        return t("historyPayment.t5");
      case 5:
        return t("historyPayment.t6");
      case 6:
        return t("historyPayment.t7");
      case 7:
        return t("historyPayment.t8");
      case 8:
        return t("historyPayment.t9");
      case 9:
        return t("historyPayment.t10");
      case 10:
        return t("historyPayment.t11");
      case 11:
        return t("historyPayment.t12");
      case 12:
        return t("historyPayment.t13");
      case 13:
        return t("historyPayment.t14");
      case 14:
        return t("historyPayment.t15");
      case 15:
        return t("historyPayment.t16");
      case 16:
        return t("historyPayment.t17");
      case 17:
        return t("historyPayment.t18");
      case 100:
        return t("historyPayment.t19");
      case 101:
        return t("historyPayment.t20");
      case 102:
        return t("historyPayment.t21");

      default:
        return null;
    }
  };

  useEffect(() => {
    handleGetData();
  }, [value]);

  if (!isLogin) {
    return null;
  }

  return (
    <div className="CardHistoryPayment" ref={domRef}>
      <div className="datePickerInside">
        <DatePicker.RangePicker
          style={{ width: "100%", maxWidth: "350px" }}
          className="customAntPicker"
          picker="month"
          value={dates || value}
          disabledDate={disabledDate}
          onCalendarChange={(val) => setDates(val)}
          onChange={(val) => setValue(val)}
          onOpenChange={onOpenChange}
          format={"MM-YYYY"}
          allowClear={false}
        />
      </div>

      <TableV3
        isLoading={isLoading}
        data={data}
        columns={[
          {
            title: t("historyPayment.t22"),
            render: (_, record) => {
              return (
                <span>
                  {Number(record.credit).toFixed(2)}{" "}
                  {record.tx_currency?.toUpperCase()}
                </span>
              );
            },
          },
          {
            title: t("historyPayment.t23"),
            render: (_, record) => {
              return (
                <span>
                  {Number(record.tx_amount).toFixed(2)}{" "}
                  {record.tx_currency?.toUpperCase()}
                </span>
              );
            },
          },
          {
            title: t("historyPayment.t24"),
            render: (_, record) => {
              return <span>{record.description || "-"}</span>;
            },
          },
          {
            title: t("historyPayment.t25"),
            render: (_, record) => {
              // nếu bấm từ notif đi vô thì sẽ k có card coin
              return (
                <span>
                  {Number(record.fee).toFixed(2)} {cardCoin?.toUpperCase()}
                </span>
              );
            },
          },
          {
            dataIndex: "mc_trade_no",
            title: t("historyPayment.t26"),
          },
          {
            title: t("historyPayment.t27"),
            render: (_, record) => {
              return <span>{record.tx_id}</span>;
            },
          },
          {
            title: t("historyPayment.t28"),
            render: (_, record) => {
              return <span>{renderTransactionType(record.type)}</span>;
            },
          },
          {
            title: t("historyPayment.t29"),
            render: (_, record) => {
              return (
                <span>
                  {new Date(record.transaction_date * 1000).toLocaleString(
                    "vi-VN"
                  )}
                </span>
              );
            },
          },
        ]}
        isShowPagination={false}
      />
    </div>
  );
};
