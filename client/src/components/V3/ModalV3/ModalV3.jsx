import { useEffect } from "react";
import "./ModalV3.scss";

export const ModalV3 = ({ isOpenModal, handleCloseModal, children }) => {
  useEffect(() => {
    if (isOpenModal) {
      document.body.classList.add("preventBodyScroll");
    } else {
      document.body.classList.remove("preventBodyScroll");
    }
  }, [isOpenModal]);

  if (!isOpenModal) {
    return null;
  }

  return (
    <div className="ModalV3">
      <div className="overlay" onClick={handleCloseModal}></div>

      <div className="modalContainer">
        <div className="closeIcon" onClick={handleCloseModal}>
          <i class="fa-solid fa-xmark"></i>
        </div>

        <div className="modalContent">{children}</div>
      </div>
    </div>
  );
};
