import { EyeAndSlashEye } from "src/components/V3/EyeAndSlashEye/EyeAndSlashEye";
import "./ModalLinkToCard.scss";
import { useTogglePassword } from "src/hooks/V3/useTogglePassword";
import { useTranslation } from "react-i18next";
import { Spin } from "antd";

export const ModalLinkToCard = ({
  formDataLinked,
  handleChangeInputField,
  isPendingLink,
  isDisabledBtn,
  handleRequestLinkToCard,
}) => {
  const { isShow, handleTogglePassword } = useTogglePassword();
  const { t } = useTranslation();

  return (
    <div className="ModalLinkToCard">
      <div className="title">{t("product.t89")}</div>

      <div className="content">
        <div className="formItem">
          <div className="label">{t("product.t90")}</div>
          <div className="inputContainer ">
            <div className="cardIcon">
              <i class="fa-regular fa-credit-card text-gradient-t-b"></i>
            </div>

            <input
              className="inputInside specificInput"
              value={formDataLinked.card_no}
              onChange={handleChangeInputField("card_no")}
            />
          </div>
        </div>

        <div className="formItem">
          <div className="label">Envelope</div>
          <div className="inputContainer">
            <input
              className="inputInside"
              placeholder="Envelope"
              type={isShow ? "text" : "password"}
              value={formDataLinked.envelope_no}
              onChange={handleChangeInputField("envelope_no")}
            />

            <div className="eyeBtn">
              <EyeAndSlashEye
                isShow={isShow}
                handleClickEye={handleTogglePassword}
              />
            </div>
          </div>
        </div>

        <button
          className="btnInside"
          disabled={isDisabledBtn}
          onClick={handleRequestLinkToCard}
        >
          {isPendingLink ? <Spin /> : t("product.t92")}
        </button>
      </div>
    </div>
  );
};
