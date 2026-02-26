import { Button, DatePicker, Image, Select, Table } from "antd";
import "./CardTransactionRecharge.scss";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom";
import moment from "moment";

const MOCK = [
  {
    cardName: "Regular Physical Card",
    type: "Sign up",
    cardType: "Virtual card",
    currency: "EUR",
    assoc: "MasterCard",
    time: "2023-07-27 13:08:05",
    fee: "49.00",
    email: "rex@legend.tech",
    state: "To be paid",
  },
];

export const CardTransactionRecharge = () => {
  const [data, setData] = useState(MOCK);
  const history = useHistory();
  const [cardTypeName, setCardTypeName] = useState("");
  const [cardType, setCardType] = useState("");
  const [rangeDate, setRangeDate] = useState({ timeStart: "", timeEnd: "" });
  const handleGetData = async () => {};

  const columns = [
    {
      title: "Card name",
      dataIndex: "cardName",
      render: (_, record) => {
        return (
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Image
              src={"/img/newVersion/s12.png"}
              style={{ width: "100px", height: "60px" }}
            />
            <div>{record.cardName}</div>
          </div>
        );
      },
    },
    {
      title: "Application type",
      dataIndex: "type",
    },
    {
      title: "Card type",
      dataIndex: "cardType",
    },
    {
      title: "Currency",
      dataIndex: "currency",
    },
    {
      title: "Card assoc",
      dataIndex: "assoc",
    },
    {
      title: "Application time",
      dataIndex: "time",
    },
    {
      title: "Fee",
      dataIndex: "fee",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Details",
      render: () => {
        return <Link to="/card-application-detail">Details</Link>;
      },
    },
    {
      title: "State",
      dataIndex: "state",
    },
    {
      title: "Operation",
      render: (_, record) => {
        return (
          <div style={{ display: "flex", gap: "16px" }}>
            <Button
              type="primary"
              onClick={() => history.push("/card-register")}
            >
              Pay
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    handleGetData();
  }, [cardTypeName, cardType, rangeDate]);

  return (
    <div className="cardTransactionRechargeContainer">
      <div className="tools">
        <Select value={"Card type name"} />
        <Select value={"Card type"} />
        <DatePicker.RangePicker />
        <Button type="primary">Search</Button>
        <Button>Export</Button>
      </div>

      <Table
        rowKey={"cardName"}
        dataSource={data}
        columns={columns}
        pagination={false}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};
