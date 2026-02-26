import { CardItem } from "./components/CardItem/CardItem";
import { useMyCardV3 } from "./hooks/useMyCardV3";
import "./MyCardV3.scss";
import i45 from "src/assets/v3/i45.png";

export const MyCardV3 = () => {
  const { data, domRef, t } = useMyCardV3();

  const cardItems = data.map((card, idx) => {
    return <CardItem key={idx} cardData={card} />;
  });

  return (
    <div className="containerV3">
      <div className="MyCardV3">
        <img
          src={i45}
          className="layerBlur"
          style={{
            position: "absolute",
            top: "0",
            left: "50%",
            transform: "translate(-40%, -80%)",
          }}
        />
        <div className="sectionIntro">
          <div className="title">{t("myCardV3.t1")}</div>
          <div className="desc">{t("myCardV3.t2")}</div>
        </div>

        <div className="sectionCards" ref={domRef}>
          {cardItems}
        </div>
      </div>
    </div>
  );
};
