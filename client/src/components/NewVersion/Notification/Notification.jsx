import { Badge, Popover, Spin } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { axiosService } from "src/util/service";
import socket from "src/util/socket";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { NotificationItemTypeAuth } from "./NotificationItemTypeAuth";
import i18n from "src/translation/i18n";

export const renderAuthResult = (authResult) => {
  switch (authResult) {
    case 1:
      return i18n.t("outsideComponent.t69");

    case 2:
      return i18n.t("outsideComponent.t70");

    case 3:
      return i18n.t("outsideComponent.t71");

    case 4:
      return i18n.t("outsideComponent.t72");

    default:
      return null;
  }
};

export const Notification = () => {
  const isLogin = useSelector((state) => state.loginReducer.isLogin);
  const { t } = useTranslation();
  const [notif, setNotif] = useState([]);
  const [currentPageNotif, setCurrentPageNotif] = useState(1);
  const [totalNotif, setTotalNotif] = useState(0);
  const [watchedNotif, setWatchedNotif] = useState(0);
  const [isPendingGetNotf, setIsPendingGetNotif] = useState(false);
  const [isPendingMarkRead, setIsPendingMarkRead] = useState(false);
  const PAGE_SIZE_NOTIF = 10;
  const isShowBtnViewMoreNotif =
    currentPageNotif * PAGE_SIZE_NOTIF <= totalNotif;
  const [toggleOpenNotif, setToggleOpenNotif] = useState(false);
  const overlayRef = useRef(null);
  const bellRef = useRef(null);
  const history = useHistory();

  const handleGetNotif = async ({ page, initGetNotif = false }) => {
    if (isPendingGetNotf) return;

    setIsPendingGetNotif(true);
    try {
      const res = await axiosService.post("hc_sync/getListNotification", {
        limit: 10,
        page: page,
      });

      // chỉ cần cập nhật số lượng notif mới
      if (initGetNotif) {
        setTotalNotif(res.data.data.total);
        setWatchedNotif(res.data.data.watched);
        setIsPendingGetNotif(false);
        return;
      }

      const newListNotif = [...notif, ...res.data.data.array];

      setNotif(newListNotif);
      setTotalNotif(res.data.data.total);
      setWatchedNotif(res.data.data.watched);
      setIsPendingGetNotif(false);
    } catch (error) {
      setIsPendingGetNotif(false);
    }
  };

  const handleClickViewMoreNotif = () => {
    const nextPage = currentPageNotif + 1;
    setCurrentPageNotif(nextPage);
    handleGetNotif({ page: nextPage });
  };

  const handleActionAfterConfirmRejectTypeAuth = () => {
    setTimeout(() => {
      bellRef?.current.click();
      overlayRef?.current.click();
    }, 0);
  };

  const triggerClickBellIconAgain = () => {
    setTimeout(() => {
      bellRef?.current.click();
      overlayRef?.current.click();
    }, 0);
  };

  const renderNotif = () => {
    return notif.map((n, idx) => {
      const isNotRead = n.watched === 0;
      const notReadClasses = isNotRead ? "notRead" : "";
      const notifClasses = `notifItem ${notReadClasses}`;
      const timeClasses = "timeNotif";

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
          <div className={notifClasses} key={n.id}>
            {/* <div>
                  Deposit to card ID <span className="highlight">{n.card_id} </span>
                  successful
                </div> */}
            <div>
              Card ID <span className="highlight">{n.card_id} </span>
              {t("notifV2.t1")} {renderStatusOperation()}
            </div>
            <div className={timeClasses}>{n.created_at}</div>

            {isNotRead && <div className="circleNotRead"></div>}
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
          <div
            className={notifClasses}
            key={n.id}
            onClick={() => {
              history.push("/register-card-history-v3");
              triggerClickBellIconAgain();
            }}
          >
            <div>
              {t("notifV2.t2")} <span className="highlight">{n.email} </span>
              {t("notifV2.t3")}
              <span className="highlight">{n.userName} </span>
              {renderStatusOperation()}
            </div>
            <div className={timeClasses}>{n.created_at}</div>

            {isNotRead && <div className="circleNotRead"></div>}
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
          <div className={notifClasses} key={n.id}>
            <div>
              Card ID <span className="highlight">{n.card_id} </span>
              {renderStatusOperation()}
            </div>
            <div className={timeClasses}>{n.created_at}</div>

            {isNotRead && <div className="circleNotRead"></div>}
          </div>
        );
      }

      if (n.notify_type === "CONSUME") {
        const handleRedirect = () => {
          history.push(`/card-deposit-history-v3?cardId=${n.card_id}`); // TODO còn trang history-payment-card?cardId=${n?.card_id}

          setTimeout(() => {
            bellRef?.current.click();
            overlayRef?.current.click();
          }, 0);
        };

        return (
          <div className={notifClasses} key={n.id} onClick={handleRedirect}>
            <div>
              Card ID <span className="highlight">{n.card_id} </span>
              {t("notifV2.t22")}
            </div>
            <div className={timeClasses}>{n.created_at}</div>

            {isNotRead && <div className="circleNotRead"></div>}
          </div>
        );
      }

      if (n.notify_type === "AUTH_3DS") {
        return (
          <NotificationItemTypeAuth
            key={n.id}
            notifItemData={n}
            notifClasses={notifClasses}
            timeClasses={timeClasses}
            isNotRead={isNotRead}
            callbackAfter={handleActionAfterConfirmRejectTypeAuth}
          />
        );
      }

      return (
        <div className={notifClasses} key={n.id}>
          {n.detail}

          {isNotRead && <div className="circleNotRead"></div>}
        </div>
      );
    });
  };

  const handleOpenDrawerNotif = async () => {
    setToggleOpenNotif(!toggleOpenNotif);
  };

  const renderNotifElements = useMemo(() => {
    return (
      <div
        className="notificationsContainer"
        style={{ opacity: toggleOpenNotif ? "1" : "0" }}
      >
        <div className="titleInside">{t("notifV2.t10")}</div>

        {notif.length === 0 && <div>{t("notifV2.t11")}</div>}

        <div className="notifications">{renderNotif()}</div>

        {isShowBtnViewMoreNotif && (
          <div className="btnViewMore" onClick={handleClickViewMoreNotif}>
            {isPendingGetNotf ? <Spin /> : t("notifV2.t12")}
          </div>
        )}
      </div>
    );
  }, [notif]);

  const handleMarkAllRead = async () => {
    setIsPendingMarkRead(true);
    try {
      await axiosService.post("hc_sync/clickAllNotification");

      // handleUpdateAllCurrentNotif();
      setIsPendingMarkRead(false);
    } catch (error) {
      setIsPendingMarkRead(false);
    }
  };

  const handleClearNotif = () => {
    setNotif([]);
    setCurrentPageNotif(1);
  };

  useEffect(() => {
    if (toggleOpenNotif) {
      handleGetNotif({ page: 1 });
      handleMarkAllRead();
    } else {
      handleClearNotif();
    }
  }, [toggleOpenNotif]);

  useEffect(() => {
    if (isLogin) {
      socket.on(`notification`, (res) => {
        handleGetNotif({ page: 1, initGetNotif: true });
      });
    }
  }, [isLogin]);

  useEffect(() => {
    handleGetNotif({ page: 1, initGetNotif: true });
  }, []);

  if (!isLogin) {
    return null;
  }

  return (
    <>
      <Popover
        trigger="click"
        content={renderNotifElements}
        className="customAntdPopover"
        placement="bottomLeft"
      >
        <Badge
          count={totalNotif - watchedNotif}
          // dot={watchedNotif !== totalNotif}
          size={"small"}
          onClick={handleOpenDrawerNotif}
        >
          <i
            ref={bellRef}
            class="fa-solid fa-bell"
            style={{
              cursor: "pointer",
              color: "#fff",
              padding: "6px",
            }}
          ></i>
        </Badge>
      </Popover>

      <div
        ref={overlayRef}
        onClick={() => setToggleOpenNotif(!toggleOpenNotif)}
        className="layoutTogglePopover"
        style={{ display: toggleOpenNotif ? "block" : "none" }}
      ></div>
    </>
  );
};
