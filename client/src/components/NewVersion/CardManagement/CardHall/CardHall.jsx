import { Select } from "antd";
import "./CardHall.scss";
import { useState } from "react";
import { CardItem } from "./CardItem";

export const CardHall = () => {
  const [cardHallOption, setCardHallOption] = useState("");

  const handleChangeCardHallOption = (value) => {
    setCardHallOption(value);
  };

  return (
    <div className="cardHallContainer">
      <div className="sectionIntro">
        <div className="titleInside">Card introduction</div>
        <div>
          Norpay is a comprehensive consumer card that integrates cross-border
          payment, consumption, asset storage, and fast exchange. It can be used
          in more than 176 countries, over 50 million merchants in the world by
          connecting crypto currency with fiat currency. Norpay provides you
          with perfect and smooth payment experience for shopping,
          entertainment, travel and other consumption around the world. Norpay
          is easy to apply for, and can get rid of card frozen. Crypto currency
          can be converted to fiat currency in real time after being deposited
          to Norpay, eliminating cumbersome processes and the inconvenience of
          paying cash. The safety of payment is guaranteed, and consumer privacy
          is protected by law. Norpay creates a new scenario of financial
          payment that is easy to use, convenient, flexible, and highly secure.
        </div>
      </div>

      <div className="sectionAdvantages">
        <div className="titleInside">Norpay Advantages</div>
        <div className="items">
          <div className="item">
            <div className="itemIcon">
              <i class="fa-solid fa-chart-simple"></i>
            </div>

            <div className="itemLabel">High limit</div>
          </div>

          <div className="item">
            <div className="itemIcon">
              <i class="fa-brands fa-cc-visa"></i>
            </div>

            <div className="itemLabel">VISA integration</div>
          </div>

          <div className="item">
            <div className="itemIcon">
              <i class="fa-solid fa-earth-americas"></i>
            </div>
            <div className="itemLabel">Global support</div>
          </div>

          <div className="item">
            <div className="itemIcon">
              <i class="fa-solid fa-temperature-arrow-down"></i>
            </div>
            <div className="itemLabel">Lowest fees</div>
          </div>

          <div className="item">
            <div className="itemIcon">
              <i class="fa-solid fa-truck-fast"></i>
            </div>
            <div className="itemLabel">Fast transactions</div>
          </div>

          <div className="item">
            <div className="itemIcon">
              <i class="fa-solid fa-person-breastfeeding"></i>
            </div>
            <div className="itemLabel">Easy to apply</div>
          </div>
        </div>
      </div>

      <div className="sectionSelect">
        <div className="titleInside">Card Hall</div>
        <Select
          value={cardHallOption}
          onChange={handleChangeCardHallOption}
          style={{ width: "100%", maxWidth: "200px" }}
          placeholder="All currencies"
          options={[
            {
              value: "EUR",
              label: "EUR",
            },
            {
              value: "USD",
              label: "USD",
            },
          ]}
        />
      </div>

      <div className="sectionCards">
        <CardItem />
      </div>
    </div>
  );
};
