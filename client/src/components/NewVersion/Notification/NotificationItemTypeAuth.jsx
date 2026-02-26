import { Spin } from "antd";
import { useNotifActionAuth } from "./hooks/useNotifActionAuth";
import { renderAuthResult } from "./Notification";
import { useTranslation } from "react-i18next";

export const NotificationItemTypeAuth = ({
  notifItemData,
  notifClasses,
  timeClasses,
  isNotRead,
  callbackAfter,
}) => {
  const { isPendingAction, authStatusLatest, handleRequestNotifAction } =
    useNotifActionAuth(
      callbackAfter,
      notifItemData.auth_id,
      notifItemData.card_id
    );

  const isShowActions = authStatusLatest
    ? authStatusLatest == 1 && notifItemData.expired_time > Date.now() / 1000
    : false;
  const { t } = useTranslation();

  return (
    <div className={notifClasses} key={notifItemData.id}>
      <div>
        Card ID <span className="highlight">{notifItemData.card_id} </span>
        {t("notifV2.t15")}{" "}
        <span className="highlight">
          {notifItemData.txn_amount} {notifItemData.txn_currency}
        </span>
      </div>
      <div style={{ marginTop: "8px" }}>
        - {t("notifV2.t16")}{" "}
        <span className="highlight">{notifItemData.auth_id}</span>
      </div>
      <div>
        - {t("notifV2.t17")}{" "}
        <span className="highlight">
          {notifItemData.card_acceptor_merchant_name}
        </span>
      </div>
      <div>
        - {t("notifV2.t18")}{" "}
        <span className="highlight">
          {/* {renderAuthResult(notifItemData.auth_result)} */}
          {authStatusLatest ? renderAuthResult(authStatusLatest) : "Loading..."}
        </span>
      </div>
      <div style={{ marginBottom: "8px" }}>
        - {t("notifV2.t19")}{" "}
        <span className="highlight">
          {new Date(notifItemData.expired_time * 1000).toLocaleString("vi-VN")}
        </span>
      </div>

      {isShowActions && (
        <div className="btnsActionNotif">
          <button
            className="btnInside outline"
            onClick={handleRequestNotifAction(
              notifItemData.auth_id,
              notifItemData.card_id,
              "3"
            )}
          >
            {isPendingAction ? <Spin /> : t("notifV2.t20")}
          </button>
          <button
            className="btnInside"
            onClick={handleRequestNotifAction(
              notifItemData.auth_id,
              notifItemData.card_id,
              "2"
            )}
          >
            {isPendingAction ? <Spin /> : t("notifV2.t21")}
          </button>
        </div>
      )}

      <div className={timeClasses}>{notifItemData.created_at}</div>

      {isNotRead && <div className="circleNotRead"></div>}
    </div>
  );
};
