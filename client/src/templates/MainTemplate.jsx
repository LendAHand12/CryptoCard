import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import Footer from "src/components/Footer";
import Header2 from "src/components/header";
import { FooterV2, HeaderV2 } from "src/components/NewVersion";
import { FloatMessage } from "src/components/NewVersion/FloatMessage/FloatMessage";
import ReLogin from "src/components/reLogin";
import { BaseLayout } from "src/components/V3/BaseLayout/BaseLayout";
import { FooterV3 } from "src/components/V3/FooterV3/FooterV3";
import { HeaderV3 } from "src/components/V3/HeaderV3/HeaderV3";

import "../components/V3/BaseLayout/BaseLayout.scss";
import { LoginV3 } from "src/components/V3/LoginV3/LoginV3";
import { RegisterV3 } from "src/components/V3/RegisterV3/RegisterV3";

export default function MainTemplate(props) {
  return (
    <>
      {/* <Route
        exact
        path={props.path}
        render={(propsRoute) => {
          return (
            <div className="main-template">
              <div className="main-template__bg-3"></div>
              <HeaderV2 />
              <div style={{ minHeight: "100vh" }}>
                <props.component {...propsRoute} />
              </div>
              <FooterV2 />
            </div>
          );
        }}
      /> */}
      <Route
        exact
        path={props.path}
        render={(propsRoute) => {
          return (
            <div className="BaseLayout">
              <HeaderV3 />

              <main className="mainContainer">
                <props.component {...propsRoute} />
              </main>

              <FooterV3 />
            </div>
          );
        }}
      />

      <LoginV3 />
      <RegisterV3 />

      <ReLogin />
      <FloatMessage />
    </>
  );
}
