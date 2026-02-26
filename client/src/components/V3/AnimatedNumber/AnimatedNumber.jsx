import { useEffect, useRef } from "react";
import "./AnimatedNumber.scss";

export const AnimatedNumber = ({ listNumber = [], scrollStyle = {} }) => {
  const defaultNumRef = useRef(null);
  const scrollRef = useRef(null);

  const numberItems = listNumber.map((n, idx) => {
    return (
      <div className="number" key={idx}>
        {n}
      </div>
    );
  });

  useEffect(() => {
    if (scrollRef.current && defaultNumRef.current) {
      scrollRef.current.style.transform = `translateY(calc(100% - ${
        defaultNumRef.current.getBoundingClientRect().height
      }px))`;
    }
  }, []);

  return (
    <div className="AnimatedNumber">
      <div className="numbers">
        <div className="numDefault" ref={defaultNumRef}>
          {numberItems[numberItems.length - 1]}
        </div>
        <div className="numScroll" ref={scrollRef} style={scrollStyle}>
          {numberItems}
        </div>
      </div>
    </div>
  );
};
