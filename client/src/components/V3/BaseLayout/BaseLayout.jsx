import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { FooterV3 } from "../FooterV3/FooterV3";
import { HeaderV3 } from "../HeaderV3/HeaderV3";
import "./BaseLayout.scss";
import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginV3 } from "../LoginV3/LoginV3";
import { RegisterV3 } from "../RegisterV3/RegisterV3";
import ReLogin from "src/components/reLogin";
import { FloatMessage } from "src/components/NewVersion/FloatMessage/FloatMessage";
import { useCheckLoggedIn } from "src/hooks/V3/useCheckLoggedIn";

export const BaseLayout = (props) => {
  const isNeedLogin = props?.isNeedLogin === true;
  const history = useHistory();
  const { isLogin } = useCheckLoggedIn();

  // nếu route này k public và user chưa login thì chặn lại
  const isCanNotAccessRoute = isNeedLogin && !isLogin;

  useEffect(() => {
    if (isCanNotAccessRoute) {
      toast.info("Please login first");
      history.push("/");
    }
  }, []);

  if (isCanNotAccessRoute) {
    return null;
  }

  return (
    <>
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
};
