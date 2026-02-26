import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

export const useRedirectHomeIfNotLogin = () => {
  const history = useHistory();
  const isLogin = useSelector((state) => state.loginReducer.isLogin);

  // useEffect(() => {
  //   if (!isLogin) {
  //     history.push("/");
  //   }
  // }, [isLogin]);

  return { isLogin };
};
