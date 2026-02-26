import { useState } from "react";
import "./CardItem.scss";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const MOCK = [
  { value: "1", label1: "Physical card", label2: "Card type" },
  { value: "2", label1: "EUR", label2: "Currency" },
  { value: "3", label1: "$99", label2: "Fee" },
  { value: "4", label1: "2.0%", label2: "Fiat exhange fee" },
];

export const CardItem = () => {
  const [currentOption, setCurrentOption] = useState(null);
  const history = useHistory();

  const handleNavigate = () => {
    history.push("/card-register");
  };

  const handleChangeCurrentOption = (value) => () => {
    setCurrentOption(value);
  };

  const options = MOCK.map((op) => {
    const classes = `option ${op.value === currentOption ? "selected" : ""}`;

    return (
      <div
        className={classes}
        key={op.value}
        onClick={handleChangeCurrentOption(op.value)}
      >
        <div className="titleOption">{op.label1}</div>
        <div className="descOption">{op.label2}</div>
      </div>
    );
  });

  return (
    <div className="cardItem cardItemContainer">
      <div className="left">
        <div className="cardImg">
          <img src="/img/newVersion/s12.png" />
        </div>

        <div className="cardContent">
          <div className="cardTitle">Regular Physical Card</div>
          <div className="cardDesc">
            Suitable For EEA Region fast Delivery $10000/Day
          </div>
          <div className="cardOptions">{options}</div>
          <div className="cardNote">Saving Card</div>
        </div>
      </div>

      <div className="right">
        <div className="note">2.9010000 Applied Already</div>
        <div className="buttonInside" onClick={handleNavigate}>
          Apply Now
        </div>
      </div>
    </div>
  );
};
