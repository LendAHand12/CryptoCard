import ReLogin from "src/components/reLogin";
import { FooterV2, HeaderV2 } from "..";
import {
  Section1,
  Section2,
  Section3,
  Section4,
  Section5,
  Section6,
  Section7,
} from "./components";
import { Section8 } from "./components/Section8/Section8";
import { FloatMessage } from "../FloatMessage/FloatMessage";
import { Form4Fields } from "../Form4Fields/Form4Fields";
import { useAccount } from "wagmi";

export const HomeV2 = () => {
  const { address } = useAccount();

  // 
  return (
    <div className="homeV2Container">
      <HeaderV2 />
      <div style={{ width: "calc(100vw - 10px)", overflowX: "hidden" }}>
        <Section1 />
        {/* <Section2 /> */}
        {/* <Section3 /> */}
        <Section4 />
        {/* <Section5 /> */}
        {/* <Section6 /> */}
        <Section7 />
        <Section8 />
      </div>
      {/* <FooterV2 /> */}

      <ReLogin />
      <FloatMessage />
    </div>
  );
};
