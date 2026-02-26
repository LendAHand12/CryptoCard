import { Drawer, Select } from "antd";
import { ButtonV3 } from "../ButtonV3/ButtonV3";
import "./HeaderV3.scss";
import { useHeaderV3 } from "./hooks/useHeaderV3";
import { useLoginV3 } from "../LoginV3/hooks/useLoginV3";
import { useRegisterV3 } from "../RegisterV3/hooks/useRegisterV3";
import { useCheckLoggedIn } from "src/hooks/V3/useCheckLoggedIn";
import useLogout from "src/hooks/logout";
import { useHandleLogout } from "./hooks/useHandleLogout";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { Notification } from "src/components/NewVersion/Notification/Notification";
import { LANGUAGUS } from "src/components/NewVersion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ButtonV32 } from "../ButtonV32/ButtonV32";

export const HeaderV3 = () => {
  const { isShowDrawer, handleNavigate, handleShowDrawer, handleHideDrawer } =
    useHeaderV3();
  const { handleOpenModalLogin } = useLoginV3();
  const { handleOpenModalRegister } = useRegisterV3();
  const { isLogin } = useCheckLoggedIn();
  // const isLogin = false;
  const logoutAction = useLogout();
  const { handleClickBtnLogout } = useHandleLogout();
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en-US");

  const handleChangeLang = (lang) => {
    // i18n.changeLanguage('en-US');
    i18n.changeLanguage(lang);
    setLang(lang);
    localStorage.setItem("lang", lang);
  };

  const MENUS = [
    {
      isPublic: true,
      link: "/kyc-v3",
      label: t("headerV3.t8"),
      isOnlyBeforeLogin: true,
    },
    {
      isPublic: true,
      link: "/product-v3",
      label: t("headerV3.t1"),
    },
    {
      isPublic: true,
      isOnlyBeforeLogin: true,
      label: t("headerV3.t10"),
      link: "https://drive.google.com/file/d/12fOovmhHYRCQPvbskWv8xU5LnOSNLsp2/view?usp=drivesdk",
    },
    {
      isPublic: true,
      isOnlyBeforeLogin: true,
      label: t("headerV3.t11"),
      link: "https://hewe.io/contactus",
    },

    { link: "/my-card-v3", label: t("headerV3.t2"), isPublic: false },
    { link: "/wallet-v3", label: t("headerV3.t3"), isPublic: false },
    { link: "/referral-v3", label: t("headerV3.t12"), isPublic: false },
    // {
    //   link: "/card-deposit-history-v3",
    //   label: "Deposit",
    //   isPublic: false,
    // },
    // {
    //   link: "/register-card-history-v3",
    //   label: "Register",
    //   isPublic: false,
    // },
    {
      link: "/profile-v3",
      label: t("headerV3.t4"),
      isPublic: false,
    },
  ];

  const PREPROCESS_MENU = MENUS.filter((m) => {
    // if (!isLogin) {
    //   return m.isPublic === true;
    // }
    // return true;

    if (m.isOnlyBeforeLogin) {
      return !isLogin;
    }

    if (!isLogin) {
      return m.isPublic === true;
    }

    return true;
  });

  const menus = PREPROCESS_MENU.map((m, idx) => {
    return (
      <div className={`menu`} key={idx} onClick={() => handleNavigate(m.link)}>
        {m.label}
      </div>
    );
  });

  useEffect(() => {
    const langFromLS = localStorage.getItem("lang");

    if (!langFromLS) {
      localStorage.setItem("lang", lang);
    } else {
      try {
        const founded = LANGUAGUS.find((l) => l.value === langFromLS);

        if (!founded) {
          localStorage.setItem("lang", "en-US");
          i18n.changeLanguage("en-US");
          setLang("en-US");
          return;
        }

        i18n.changeLanguage(langFromLS);
      } catch (error) {}
    }
  }, [lang]);

  return (
    <div className="HeaderV3">
      <div className="containerV3 headerV3Container">
        <div className="left">
          <img
            className="logo"
            src={"/img/newVersion/logo.png"}
            onClick={() => history.push("/")}
          />
        </div>
        <div className="center">
          <div className="menus">{menus}</div>
        </div>
        <div className="right">
          <div className="buttons">
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Select
                style={{ width: "100%", minWidth: "160px" }}
                value={lang}
                onChange={handleChangeLang}
                options={LANGUAGUS}
                className="selectCustom"
              />

              {isLogin && (
                <div className="menuItem">
                  <Notification />
                </div>
              )}
            </div>

            {!isLogin ? (
              <>
                <ButtonV32 onClick={handleOpenModalRegister}>
                  {t("headerV3.t5")}
                </ButtonV32>
                <ButtonV32 onClick={handleOpenModalLogin}>
                  {t("headerV3.t6")}
                </ButtonV32>
              </>
            ) : (
              <>
                <ButtonV32 onClick={handleClickBtnLogout}>
                  {t("headerV3.t7")}
                </ButtonV32>
              </>
            )}
          </div>
        </div>

        <div className="mobile">
          {isLogin && (
            <div className="menuItem">
              <Notification />
            </div>
          )}
          <i class="fa-solid fa-bars" onClick={handleShowDrawer}></i>
        </div>
      </div>

      <Drawer
        placement="right"
        className="customDrawerV2"
        onClose={handleHideDrawer}
        open={isShowDrawer}
      >
        <div className="menusOutside">
          <>{menus}</>

          <Select
            style={{ width: "100%" }}
            value={lang}
            onChange={handleChangeLang}
            options={LANGUAGUS}
            className="selectCustom"
          />

          {!isLogin ? (
            <>
              <ButtonV3
                isFullWidth={true}
                onClick={() => {
                  handleHideDrawer();
                  handleOpenModalRegister();
                }}
              >
                {t("headerV3.t5")}
              </ButtonV3>
              <ButtonV3
                isFullWidth={true}
                onClick={() => {
                  handleHideDrawer();
                  handleOpenModalLogin();
                }}
              >
                {t("headerV3.t6")}
              </ButtonV3>
            </>
          ) : (
            <>
              <ButtonV3
                isFullWidth={true}
                onClick={() => {
                  handleClickBtnLogout();
                  handleHideDrawer();
                }}
              >
                {t("headerV3.t7")}
              </ButtonV3>
            </>
          )}
        </div>
      </Drawer>
    </div>
  );
};
