import { useState } from "react";

export const useModalV3 = (initIsOpenModal = false) => {
  const [isOpenModal, setIsOpenModal] = useState(initIsOpenModal);

  const handleOpenModal = (callback) => {
    setIsOpenModal(true);

    if (typeof callback === "function") {
      callback();
    }
  };

  const handleCloseModal = (callback) => {
    setIsOpenModal(false);

    if (typeof callback === "function") {
      callback();
    }
  };

  return {
    isOpenModal,
    handleCloseModal,
    handleOpenModal,
  };
};
