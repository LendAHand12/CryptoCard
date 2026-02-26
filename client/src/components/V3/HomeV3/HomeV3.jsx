import "./HomeV3.scss";
import { LoginV3 } from "../LoginV3/LoginV3";
import i47 from "../../../assets/v3/i47.jpg";
import ReLogin from "src/components/reLogin";
import { FooterV3 } from "../FooterV3/FooterV3";
import { HeaderV3 } from "../HeaderV3/HeaderV3";
import { RegisterV3 } from "../RegisterV3/RegisterV3";
import { Section1V3 } from "./components/Section1V3/Section1V3";
import { Section2V3 } from "./components/Section2V3/Section2V3";
import { Section3V3 } from "./components/Section3V3/Section3V3";
import { Section4V3 } from "./components/Section4V3/Section4V3";
import { Section5V3 } from "./components/Section5V3/Section5V3";
import { Section6V3 } from "./components/Section6V3/Section6V3";
import { Section7V3 } from "./components/Section7V3/Section7V3";
import { Section8V3 } from "./components/Section8V3/Section8V3";
import { Section9V3 } from "./components/Section9V3/Section9V3";
import { FloatMessage } from "src/components/NewVersion/FloatMessage/FloatMessage";

export const HomeV3 = () => {
  return (
    <>
      <div className="HomeV3">
        <HeaderV3 />
        {/* <img src={i47} alt="banner" className="banner" /> */}
        <>
          <Section1V3 />
          {/* <Section2V3 /> */}
          <Section9V3 />
          <Section3V3 />
          <Section4V3 />
          <Section5V3 />
          <Section6V3 />
          {/* <Section7V3 /> */}
          <Section8V3 />
        </>

        <FooterV3 />
      </div>

      <LoginV3 />
      <RegisterV3 />

      <ReLogin />
      <FloatMessage />
    </>
  );
};
