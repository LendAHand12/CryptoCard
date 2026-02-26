import {
  Badge,
  Collapse,
  Drawer,
  Popover,
  Select,
  Spin,
  Typography,
} from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { url } from "src/constant";
import { callToastSuccess } from "src/function/toast/callToast";
import useLogout from "src/hooks/logout";
import { availableLanguage } from "src/translation/i18n";
import { axiosService } from "src/util/service";
import socket from "src/util/socket";
import { Notification } from "../Notification/Notification";
import { Button } from "src/components/Common/Button";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { useChangeAddress } from "./hooks/useChangeAddress";
const { Text } = Typography;

const { Panel } = Collapse;

const styleLang = { display: "flex", alignItems: "center" };

export const preprocessingAddress = (address) => {
  if (!address) return "";

  return address
    ? address.slice(0, 4) +
        "..." +
        address.slice(address.length - 4, address.length)
    : "";
};

export const LANGUAGUS = [
  {
    value: "vi-VN",
    label: (
      <div style={styleLang}>
        <img
          style={{ width: "20px", height: "20px", marginRight: "8px" }}
          src={process.env.PUBLIC_URL + `/img/iconvi.png`}
        />
        <span>Vietnamese</span>
      </div>
    ),
  },
  {
    value: "en-US",
    label: (
      <div style={styleLang}>
        <img
          style={{ width: "20px", height: "20px", marginRight: "8px" }}
          src={process.env.PUBLIC_URL + `/img/iconen.png`}
        />
        <span>English</span>
      </div>
    ),
  },
  {
    value: "ko-KR",
    label: (
      <div style={styleLang}>
        <img
          style={{ width: "20px", height: "20px", marginRight: "8px" }}
          src={process.env.PUBLIC_URL + `/img/iconko.png`}
        />
        <span>Korean</span>
      </div>
    ),
  },
  {
    value: "ja-JP",
    label: (
      <div style={styleLang}>
        <img
          style={{ width: "20px", height: "20px", marginRight: "8px" }}
          src={process.env.PUBLIC_URL + `/img/iconja.png`}
        />
        <span>Japanese</span>
      </div>
    ),
  },
  {
    value: "zh-CN",
    label: (
      <div style={styleLang}>
        <img
          style={{ width: "20px", height: "20px", marginRight: "8px" }}
          src={process.env.PUBLIC_URL + `/img/iconzh.png`}
        />
        <span>Chinese</span>
      </div>
    ),
  },
  // {
  //   value: "th-TH",
  //   label: (
  //     <div style={styleLang}>
  //       <img
  //         style={{ width: "20px", height: "20px", marginRight: "8px" }}
  //         src={process.env.PUBLIC_URL + `/img/iconth.png`}
  //       />
  //       <span>Thai</span>
  //     </div>
  //   ),
  // },
  // {
  //   value: "km-KH",
  //   label: (
  //     <div style={styleLang}>
  //       <img
  //         style={{ width: "20px", height: "20px", marginRight: "8px" }}
  //         src={process.env.PUBLIC_URL + `/img/iconkm.png`}
  //       />
  //       <span>Cambodian</span>
  //     </div>
  //   ),
  // },
  // {
  //   value: "lo-LA",
  //   label: (
  //     <div style={styleLang}>
  //       <img
  //         style={{ width: "20px", height: "20px", marginRight: "8px" }}
  //         src={process.env.PUBLIC_URL + `/img/iconlo.png`}
  //       />
  //       <span>Lao</span>
  //     </div>
  //   ),
  // },
  // {
  //   value: "id-ID",
  //   label: (
  //     <div style={styleLang}>
  //       <img
  //         style={{ width: "20px", height: "20px", marginRight: "8px" }}
  //         src={process.env.PUBLIC_URL + `/img/iconid.png`}
  //       />
  //       <span>Indonesian</span>
  //     </div>
  //   ),
  // },
  // {
  //   value: "fr-FR",
  //   label: (
  //     <div style={styleLang}>
  //       <img
  //         style={{ width: "20px", height: "20px", marginRight: "8px" }}
  //         src={process.env.PUBLIC_URL + `/img/iconfr.png`}
  //       />
  //       <span>French</span>
  //     </div>
  //   ),
  // },
  // {
  //   value: "es-ES",
  //   label: (
  //     <div style={styleLang}>
  //       <img
  //         style={{ width: "20px", height: "20px", marginRight: "8px" }}
  //         src={process.env.PUBLIC_URL + `/img/icones.png`}
  //       />
  //       <span>Spanish</span>
  //     </div>
  //   ),
  // },
  // {
  //   value: "it-IT",
  //   label: (
  //     <div style={styleLang}>
  //       <img
  //         style={{ width: "20px", height: "20px", marginRight: "8px" }}
  //         src={process.env.PUBLIC_URL + `/img/iconit.png`}
  //       />
  //       <span>Italian</span>
  //     </div>
  //   ),
  // },
  // {
  //   value: "de-DE",
  //   label: (
  //     <div style={styleLang}>
  //       <img
  //         style={{ width: "20px", height: "20px", marginRight: "8px" }}
  //         src={process.env.PUBLIC_URL + `/img/iconde.png`}
  //       />
  //       <span>German</span>
  //     </div>
  //   ),
  // },
  // {
  //   value: "pt-PT",
  //   label: (
  //     <div style={styleLang}>
  //       <img
  //         style={{ width: "20px", height: "20px", marginRight: "8px" }}
  //         src={process.env.PUBLIC_URL + `/img/iconpt.png`}
  //       />
  //       <span>Portuguese</span>
  //     </div>
  //   ),
  // },
  // {
  //   value: "tr-TR",
  //   label: (
  //     <div style={styleLang}>
  //       <img
  //         style={{ width: "20px", height: "20px", marginRight: "8px" }}
  //         src={process.env.PUBLIC_URL + `/img/icontr.png`}
  //       />
  //       <span>Turkish</span>
  //     </div>
  //   ),
  // },
  // {
  //   value: "ru-RU",
  //   label: (
  //     <div style={styleLang}>
  //       <img
  //         style={{ width: "20px", height: "20px", marginRight: "8px" }}
  //         src={process.env.PUBLIC_URL + `/img/iconru.png`}
  //       />
  //       <span>Russian</span>
  //     </div>
  //   ),
  // },
  // {
  //   value: "nl-NL",
  //   label: (
  //     <div style={styleLang}>
  //       <img
  //         style={{ width: "20px", height: "20px", marginRight: "8px" }}
  //         src={process.env.PUBLIC_URL + `/img/iconnl.png`}
  //       />
  //       <span>Dutch</span>
  //     </div>
  //   ),
  // },
  // {
  //   value: "ms-MY",
  //   label: (
  //     <div style={styleLang}>
  //       <img
  //         style={{ width: "20px", height: "20px", marginRight: "8px" }}
  //         src={process.env.PUBLIC_URL + `/img/iconms.png`}
  //       />
  //       <span>Malaysian</span>
  //     </div>
  //   ),
  // },
  // {
  //   value: "ar-SA",
  //   label: (
  //     <div style={styleLang}>
  //       <img
  //         style={{ width: "20px", height: "20px", marginRight: "8px" }}
  //         src={process.env.PUBLIC_URL + `/img/iconar.png`}
  //       />
  //       <span>Arabic</span>
  //     </div>
  //   ),
  // },
  // {
  //   value: "he-IL",
  //   label: (
  //     <div style={styleLang}>
  //       <img
  //         style={{ width: "20px", height: "20px", marginRight: "8px" }}
  //         src={process.env.PUBLIC_URL + `/img/iconhe.png`}
  //       />
  //       <span>Hebrew</span>
  //     </div>
  //   ),
  // },
  // {
  //   value: "el-GR",
  //   label: (
  //     <div style={styleLang}>
  //       <img
  //         style={{ width: "20px", height: "20px", marginRight: "8px" }}
  //         src={process.env.PUBLIC_URL + `/img/iconel.png`}
  //       />
  //       <span>Greek</span>
  //     </div>
  //   ),
  // },
  // {
  //   value: "pl-PL",
  //   label: (
  //     <div style={styleLang}>
  //       <img
  //         style={{ width: "20px", height: "20px", marginRight: "8px" }}
  //         src={process.env.PUBLIC_URL + `/img/iconpl.png`}
  //       />
  //       <span>Polish</span>
  //     </div>
  //   ),
  // },
  {
    value: "hi-IN",
    label: (
      <div style={styleLang}>
        <img
          style={{ width: "20px", height: "20px", marginRight: "8px" }}
          src={process.env.PUBLIC_URL + `/img/iconhi.png`}
        />
        <span>Hindi</span>
      </div>
    ),
  },
];

export const HeaderV2 = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const history = useHistory();
  const isLogin = useSelector((state) => state.loginReducer.isLogin);
  const logoutAction = useLogout();
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en-US");
  const { open } = useWeb3Modal();

  const { address } = useAccount();

  const { addressFromProfile } = useChangeAddress();

  // 

  const handleChangeLang = (lang) => {
    // i18n.changeLanguage('en-US');
    i18n.changeLanguage(lang);
    setLang(lang);
    localStorage.setItem("lang", lang);
  };

  const handleOpenDrawer = () => {
    setIsOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
  };

  const logout = () => {
    logoutAction();
    const tem = t("logOut");
    const temTitle = t("success");
    history.push(url.home);
    callToastSuccess(tem, temTitle);
  };

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
    <div className="headerV2Container">
      <div className="containerInside">
        <div className="left" onClick={() => history.push("/")}>
          <img className="logo" src={"/img/newVersion/logo.png"} />
          {/* <div className="brandName">Serepay</div> */}
        </div>

        <div className="right desktopV2">
          {
            <div className="menuItem" onClick={() => history.push("/product")}>
              {t("headerV2.h1")}
            </div>
          }
          {/* {isLogin && (
            <div className="menuItem" onClick={() => history.push("/swap")}>
              {t("headerV2.h2")}
            </div>
          )} */}
          {isLogin && (
            <div className="menuItem" onClick={() => history.push("/wallet-2")}>
              {t("headerV2.h3")}
            </div>
          )}
          {isLogin && (
            <div className="menuItem" onClick={() => history.push("/profile")}>
              {t("headerV2.h4")}
            </div>
          )}
          {isLogin && (
            <Popover
              content={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {/* <div
                    onClick={() => history.push("/management-card")}
                    style={{ cursor: "pointer", fontWeight: "500" }}
                  >
                    {t("headerV2.h8")}
                  </div> */}

                  <div
                    onClick={() => history.push("/card-created-success")}
                    style={{ cursor: "pointer", fontWeight: "500" }}
                  >
                    {t("headerV2.h11")}
                  </div>

                  <div
                    onClick={() => history.push("/history-deposit-card")}
                    style={{ cursor: "pointer", fontWeight: "500" }}
                  >
                    {t("headerV2.h12")}
                  </div>
                  <div
                    onClick={() => history.push("/history-register-card")}
                    style={{ cursor: "pointer", fontWeight: "500" }}
                  >
                    {t("registerCard.t1")}
                  </div>
                </div>
              }
              className="customPopoverAntd"
              placement="bottomRight"
            >
              <div className="menuItem">{t("headerV2.h5")}</div>
            </Popover>
          )}
          {isLogin && (
            <div className="menuItem" onClick={logout}>
              {t("headerV2.h6")}
            </div>
          )}
          {!isLogin && (
            <div className="menuItem" onClick={() => history.push("/login")}>
              {t("headerV2.h7")}
            </div>
          )}
          <div
            className="menuItem"
            style={{ width: "100%", minWidth: "150px" }}
          >
            <Select
              style={{ width: "100%" }}
              value={lang}
              onChange={handleChangeLang}
              options={LANGUAGUS}
            />
          </div>

          {isLogin && (
            <div className="menuItem">
              <Notification />
            </div>
          )}

          {!isLogin && (
            <div className="menuItem">
              <div
                className="btnInside"
                onClick={() => history.push("/signup")}
              >
                {t("register")}
              </div>
            </div>
          )}

          {isLogin && (
            <div className="menuItem">
              <div className="btnInside" onClick={() => open()}>
                {address ? (
                  <Text
                    ellipsis={true}
                    style={{
                      color: "#000",
                      maxWidth: window.innerWidth > 768 ? "200px" : "250px",
                    }}
                  >
                    {preprocessingAddress(addressFromProfile)}
                  </Text>
                ) : (
                  t("connectWallet")
                )}
              </div>
            </div>
          )}
        </div>

        <div className="right mobileV2">
          {!isLogin && (
            <span
              onClick={() => {
                history.push("/login");
                handleCloseDrawer();
              }}
            >
              {t("headerV2.h7")}
            </span>
          )}

          <Notification />

          <i
            style={{ marginLeft: "16px" }}
            class="fa-solid fa-bars"
            onClick={handleOpenDrawer}
          ></i>
        </div>
      </div>

      {/* navbar */}
      <Drawer
        placement="right"
        className="customDrawerV2"
        onClose={handleCloseDrawer}
        open={isOpenDrawer}
      >
        <div
          className="menuItem"
          style={{ marginBottom: "16px" }}
          onClick={() => {
            handleCloseDrawer();
            history.push("/product");
          }}
        >
          {t("headerV2.h1")}
        </div>
        {isLogin && (
          <div
            className="menuItem"
            style={{ marginBottom: "16px" }}
            onClick={() => {
              history.push("/wallet-2");
              handleCloseDrawer();
            }}
          >
            {t("headerV2.h3")}
          </div>
        )}
        {isLogin && (
          <div
            className="menuItem"
            style={{ marginBottom: "16px" }}
            onClick={() => {
              history.push("/profile");
              handleCloseDrawer();
            }}
          >
            {t("headerV2.h4")}
          </div>
        )}
        {isLogin && (
          <div
            className="menuItem"
            style={{ marginBottom: "16px" }}
            onClick={() => {
              history.push("/card-created-success");
              handleCloseDrawer();
            }}
          >
            {t("headerV2.h11")}
          </div>
        )}
        {isLogin && (
          <div
            className="menuItem"
            style={{ marginBottom: "16px" }}
            onClick={() => {
              history.push("/history-deposit-card");
              handleCloseDrawer();
            }}
          >
            {t("headerV2.h12")}
          </div>
        )}
        {isLogin && (
          <div
            className="menuItem"
            style={{ marginBottom: "16px" }}
            onClick={() => {
              history.push("/history-register-card");
              handleCloseDrawer();
            }}
          >
            {t("registerCard.t1")}
          </div>
        )}

        {isLogin && (
          <div
            className="menuItem"
            style={{ marginBottom: "16px" }}
            onClick={() => {
              logout();
              handleCloseDrawer();
            }}
          >
            {t("headerV2.h6")}
          </div>
        )}

        {!isLogin && (
          <div
            className="menuItem"
            style={{ marginBottom: "16px" }}
            onClick={() => {
              history.push("/login");
              handleCloseDrawer();
            }}
          >
            {t("headerV2.h7")}
          </div>
        )}

        {!isLogin && (
          <div className="menuItem" style={{ marginBottom: "16px" }}>
            <div
              className="btnInside"
              onClick={() => {
                history.push("/signup");
                handleCloseDrawer();
              }}
            >
              {t("register")}
            </div>
          </div>
        )}

        {isLogin && (
          <div className="menuItem">
            <div
              className="btnInside"
              onClick={() => {
                handleCloseDrawer();
                open();
              }}
              style={{
                backgroundColor: "#f4e096",
                color: "#000",
                textAlign: "center",
                padding: "4px",
                borderRadius: "4px",
                marginBottom: "16px",
              }}
            >
              {address ? (
                <Text
                  ellipsis={true}
                  style={{
                    color: "#000",
                    maxWidth: window.innerWidth > 768 ? "200px" : "250px",
                  }}
                >
                  {preprocessingAddress(addressFromProfile)}
                </Text>
              ) : (
                t("connectWallet")
              )}
            </div>
          </div>
        )}

        <div className="menuItem" style={{ width: "100%", minWidth: "150px" }}>
          <Select
            style={{ width: "100%" }}
            value={lang}
            onChange={handleChangeLang}
            options={LANGUAGUS}
          />
        </div>
      </Drawer>
    </div>
  );
};
