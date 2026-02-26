import { Descriptions } from "antd";
import "./CardApplicationDetail.scss";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

export const CardApplicationDetail = () => {
  const history = useHistory();

  return (
    <div className="cardApplicationDetailContainer">
      <div className="top">
        <div
          className="topLeft"
          onClick={() => history.push("/card-application")}
        >
          <i class="fa-solid fa-arrow-left"></i>
          <div>Back</div>
        </div>

        <div className="topRight">Application details</div>
      </div>

      <div className="sectionUse">
        <Descriptions
          labelStyle={{
            maxWidth: "80px",
            fontWeight: 600,
            backgroundColor: "transparent",
          }}
          column={1}
          size={window.innerWidth < 600 ? "small" : "default"}
          bordered
        >
          <Descriptions.Item label="Bin">555474</Descriptions.Item>
          <Descriptions.Item label="Annual fee">$12</Descriptions.Item>
          <Descriptions.Item label="Limited Qty">$100.000</Descriptions.Item>
          <Descriptions.Item label="Assoc">Master</Descriptions.Item>
          <Descriptions.Item label="KYC fee">$0</Descriptions.Item>
          <Descriptions.Item label="Deposit fee">2%</Descriptions.Item>
          <Descriptions.Item label="Deposit cap">$100.000</Descriptions.Item>
          <Descriptions.Item label="EEA Comsumption Fee">0</Descriptions.Item>
          <Descriptions.Item label="Non-EEA Comsumption Fee">
            1% Min Fee $0.5
          </Descriptions.Item>
          <Descriptions.Item label="Dormancy fee">$0</Descriptions.Item>
          <Descriptions.Item label="Expiration fee">$0</Descriptions.Item>
          <Descriptions.Item label="Expiration fee">$0</Descriptions.Item>
          <Descriptions.Item label="Logout fee">$0</Descriptions.Item>
          <Descriptions.Item label="Trading survey">$0</Descriptions.Item>
          <Descriptions.Item label="Request certificate">$0</Descriptions.Item>
          <Descriptions.Item label="Exception fix">$0</Descriptions.Item>
          <Descriptions.Item label="ATM withdraw">
            2% (not less than $3)
          </Descriptions.Item>
          <Descriptions.Item label="ATM Balance Inquiry Fee">
            $0.7
          </Descriptions.Item>
          <Descriptions.Item label="ATM Minimum Withdrawal Amount">
            $10
          </Descriptions.Item>
          <Descriptions.Item label="ATM withdraw quota">
            $100.000
          </Descriptions.Item>
          <Descriptions.Item label="POS check">$0</Descriptions.Item>
          <Descriptions.Item label="POS expense">$0</Descriptions.Item>
          <Descriptions.Item label="New Card">149 USDT</Descriptions.Item>
          <Descriptions.Item label="Card Type">DEBIT</Descriptions.Item>
          <Descriptions.Item label="Iso Country Name">
            Lithuania
          </Descriptions.Item>
          <Descriptions.Item label="Partially supported platforms">
            paypal/amz/alipay/eBay/indesi
          </Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  );
};
