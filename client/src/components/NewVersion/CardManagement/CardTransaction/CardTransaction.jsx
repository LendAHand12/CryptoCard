import { Tabs } from "antd";
import "./CardTransaction.scss";
import { CardTransactionConsume } from "./CardTransactionConsume";
import { CardTransactionRecharge } from "./CardTransactionRecharge";

export const CardTransaction = () => {
  return (
    <div className="cardTransactionContainer">
      <div className="titleInside">Transaction record</div>
      <Tabs>
        <Tabs.TabPane tab="Recharge" key="item-1">
          <CardTransactionRecharge />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Consume" key="item-2">
          <CardTransactionConsume />
        </Tabs.TabPane>
      </Tabs>
      ;
    </div>
  );
};
