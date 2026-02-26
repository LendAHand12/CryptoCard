import { Modal } from "antd";
import { useDepositCard } from "../CardCreatedSuccess/hooks/useDepositCard";
import { useDetailCard } from "../CardCreatedSuccess/hooks/useDetailCard";
import { useOperations } from "../CardCreatedSuccess/hooks/useOperations";

export const ModalToolsCardVirtual = ({
  data,
  isOpenModalTools,
  handleCloseModalTools,
}) => {
  const { handleRedirectDepositPage } = useDepositCard();
  const { handleRedirectDetail } = useDetailCard();
  const { handleRequestAction } = useOperations();

  return (
    <Modal
      title="Operations"
      open={isOpenModalTools}
      footer={false}
      onCancel={handleCloseModalTools}
    >
      {/* Freeze, Unfreeze, Reset password, Card re-issue, Cancel Card, Resend PIN
       */}

      <div className="modalCardItemVisaContainer">
        <div className="btnInside" onClick={handleRedirectDepositPage(data.id)}>
          Deposit
        </div>
        <div
          className="btnInside"
          onClick={handleRedirectDetail(
            data.mc_trade_no,
            data.card_type_id,
            data.first_name,
            data.last_name,
            data.mobile,
            data.mobile_code,
            data.email,
            data.id
          )}
        >
          Detail
        </div>
        <div className="btnInside" onClick={handleRequestAction(data.id, 1)}>
          Freeze
        </div>
        <div className="btnInside" onClick={handleRequestAction(data.id, 2)}>
          Unfreeze
        </div>
        <div className="btnInside" onClick={handleRequestAction(data.id, 4)}>
          Reset password
        </div>
        <div className="btnInside" onClick={handleRequestAction(data.id, 5)}>
          Card re-issue
        </div>
        <div className="btnInside" onClick={handleRequestAction(data.id, 9)}>
          Cancel card
        </div>
        <div className="btnInside" onClick={handleRequestAction(data.id, 6)}>
          Resend PIN
        </div>
      </div>
    </Modal>
  );
};
