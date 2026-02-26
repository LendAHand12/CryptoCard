import { useState } from "react";

export const useModalToolsCardVirtual = () => {
  const [isOpenModalTools, setIsOpenModalTools] = useState(false);

  const handleOpenModalTools = () => setIsOpenModalTools(true);
  const handleCloseModalTools = () => setIsOpenModalTools(false);

  return {
    isOpenModalTools,
    handleOpenModalTools,
    handleCloseModalTools,
  };
};
