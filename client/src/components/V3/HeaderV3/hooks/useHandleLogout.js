import { t } from "i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { url } from "src/constant";
import { callToastSuccess } from "src/function/toast/callToast";
import useLogout from "src/hooks/logout";

export const useHandleLogout = () => {
  const logoutAction = useLogout();
  const history = useHistory();

  const handleClickBtnLogout = () => {
    logoutAction();
    const tem = t("logOut");
    const temTitle = t("success");
    history.push(url.home);
    callToastSuccess(tem, temTitle);
  };

  return { handleClickBtnLogout };
};
