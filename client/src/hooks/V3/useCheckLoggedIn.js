import { useSelector } from "react-redux";

export const useCheckLoggedIn = () => {
  const isLogin = useSelector((state) => state.loginReducer.isLogin);

  return {
    isLogin,
  };
};
