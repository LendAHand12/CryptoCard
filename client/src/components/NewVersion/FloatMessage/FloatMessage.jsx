import { useDispatch, useSelector } from "react-redux";
import "./FloatMessage.scss";
import {
  popNotifAction,
  pushNotifAction,
  removeNotifAction,
} from "src/redux/actions/floatNotifActions";
import { useEffect, useRef } from "react";
import { useRedirectHomeIfNotLogin } from "src/hooks/useRedirectHomeIfNotLogin";
import { useTranslation } from "react-i18next";
import { NotificationItemTypeAuth } from "../Notification/NotificationItemTypeAuth";
import { renderAuthResult } from "../Notification/Notification";

export const FloatMessage = () => {
  const { notifs } = useSelector((state) => state.floatNotifReducer);

  const dispatch = useDispatch();
  const { isLogin } = useRedirectHomeIfNotLogin();
  const { t } = useTranslation();

  const handleRemoveNotif = (key) => {
    dispatch(removeNotifAction(key));
  };

  const renderNotif = notifs.map((n, idx) => {
    const notifClasses = `notifItem moveToLeft`;
    const timeClasses = "timeNotif";
    const ID = <div>{n.key}</div>;

    const wrappedRemoveFn = () => {
      handleRemoveNotif(n.key);
    };

    if (n.notify_type === "RECHARGE") {
      const renderStatusOperation = () => {
        switch (n.result) {
          case 1:
            return t("notifV2.t14");

          case 2:
            return t("notifV2.t13");

          default:
            return null;
        }
      };

      return (
        <div className={notifClasses} key={n.key} onClick={wrappedRemoveFn}>
          {/* <div>
            Deposit to card ID <span className="highlight">{n.card_id} </span>
            successful
          </div> */}
          <div>
            Card ID <span className="highlight">{n.card_id} </span>
            {t("notifV2.t1")} {renderStatusOperation()}
          </div>
          <div className={timeClasses}>{n.created_at}</div>
        </div>
      );
    }

    if (n.notify_type === "OPEN_CARD") {
      const renderStatusOperation = () => {
        switch (n.result) {
          case 1:
            return t("notifV2.t4");

          case 2:
            return t("notifV2.t7");

          default:
            return null;
        }
      };

      return (
        <div className={notifClasses} key={n.key} onClick={wrappedRemoveFn}>
          <div>
            {t("notifV2.t2")} <span className="highlight">{n.email} </span>
            {t("notifV2.t3")} <span className="highlight">{n.userName} </span>
            {renderStatusOperation()}
          </div>
          <div className={timeClasses}>{n.created_at}</div>
        </div>
      );
    }

    if (n.notify_type === "OPERATION") {
      const renderStatusOperation = () => {
        switch (n.result) {
          case 0:
            return t("notifV2.t5");

          case 1:
            return t("notifV2.t6");

          case 2:
            return t("notifV2.t7");

          case 98:
            return t("notifV2.t8");

          case 99:
            return t("notifV2.t9");

          default:
            return null;
        }
      };

      return (
        <div className={notifClasses} key={n.key} onClick={wrappedRemoveFn}>
          <div>
            Card ID <span className="highlight">{n.card_id} </span>
            {renderStatusOperation()}
          </div>
          <div className={timeClasses}>{n.created_at}</div>
        </div>
      );
    }

    if (n.notify_type === "CONSUME") {
      const handleRedirect = () => {
        history.push(`/card-deposit-history-v3?cardId=${n?.card_id}`); // TODO còn trang history-payment-card?cardId=${n?.card_id}
      };

      return (
        <div className={notifClasses} key={n.key} onClick={handleRedirect}>
          <div>
            Card ID <span className="highlight">{n?.card_id} </span>
            {t("notifV2.t22")}
          </div>
          <div className={timeClasses}>{n?.created_at}</div>
        </div>
      );
    }

    if (n.notify_type === "AUTH_3DS") {
      return (
        <div className={notifClasses} key={n.key}>
          <div>
            Card ID <span className="highlight">{n.card_id} </span>
            {t("notifV2.t15")}{" "}
            <span className="highlight">
              {n.txn_amount} {n.txn_currency}
            </span>
          </div>
          <div style={{ marginTop: "8px" }}>
            - {t("notifV2.t16")} <span className="highlight">{n.auth_id}</span>
          </div>
          <div>
            - {t("notifV2.t17")}{" "}
            <span className="highlight">{n.card_acceptor_merchant_name}</span>
          </div>
          <div>
            - {t("notifV2.t18")}{" "}
            <span className="highlight">{renderAuthResult(n.auth_result)}</span>
          </div>
          <div style={{ marginBottom: "8px" }}>
            - {t("notifV2.t19")}{" "}
            <span className="highlight">
              {new Date(n.expired_time * 1000).toLocaleString("vi-VN")}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className={notifClasses} key={n.key} onClick={wrappedRemoveFn}>
        {n.detail}
      </div>
    );
  });

  if (!isLogin) {
    return null;
  }

  return (
    <div className="FloatMessage">
      <div className="notifItems">{renderNotif}</div>
    </div>
  );
};
