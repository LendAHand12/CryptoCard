import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

export const useHeaderV3 = () => {
  const [isShowDrawer, setIsShowDrawer] = useState(false);
  const history = useHistory();

  const handleNavigate = (link) => {
    if (isShowDrawer) {
      handleHideDrawer();
    }

    // history.push(link);
    if (link.startsWith("http")) {
      window.open(link, "_blank");
    } else {
      history.push(link);
    }
  };

  const handleShowDrawer = () => {
    setIsShowDrawer(true);
  };

  const handleHideDrawer = () => {
    setIsShowDrawer(false);
  };

  return { isShowDrawer, handleNavigate, handleShowDrawer, handleHideDrawer };
};
