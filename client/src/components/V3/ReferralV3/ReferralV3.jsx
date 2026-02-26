import QRCode from "react-qr-code";
import {
  ButtonV3Primary,
  buttonV3PrimarySizes,
} from "../ButtonV3/ButtonV3Primary";
import "./ReferralV3.scss";
import i35 from "src/assets/v3/i35.png";
import { useState } from "react";
import { TableV3 } from "../TableV3/TableV3";
import { useProfile } from "src/hooks/useProfile";
import { DOMAIN } from "src/util/service";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import i45 from "src/assets/v3/i45.png";
import { TreeData } from "./TreeData";
import { HistoryCommissionUser } from "src/components/profile/HistoryCommissionUser/HistoryCommissionUser";

const MOCK = [
  {
    username: "ayank@pc",
    mcTradeNo: "9912346767",
    referralCommission: "3%",
    loadingCommission: "3%",
    dateTime: "Oct 26 2024 12:30 PM",
  },
  {
    username: "ayank@pc",
    mcTradeNo: "9912346767",
    referralCommission: "3%",
    loadingCommission: "3%",
    dateTime: "Oct 26 2024 12:30 PM",
  },
  {
    username: "ayank@pc",
    mcTradeNo: "9912346767",
    referralCommission: "3%",
    loadingCommission: "3%",
    dateTime: "Oct 26 2024 12:30 PM",
  },
  {
    username: "ayank@pc",
    mcTradeNo: "9912346767",
    referralCommission: "3%",
    loadingCommission: "3%",
    dateTime: "Oct 26 2024 12:30 PM",
  },
  {
    username: "ayank@pc",
    mcTradeNo: "9912346767",
    referralCommission: "3%",
    loadingCommission: "3%",
    dateTime: "Oct 26 2024 12:30 PM",
  },
  {
    username: "ayank@pc",
    mcTradeNo: "9912346767",
    referralCommission: "3%",
    loadingCommission: "3%",
    dateTime: "Oct 26 2024 12:30 PM",
  },
  {
    username: "ayank@pc",
    mcTradeNo: "9912346767",
    referralCommission: "3%",
    loadingCommission: "3%",
    dateTime: "Oct 26 2024 12:30 PM",
  },
  {
    username: "ayank@pc",
    mcTradeNo: "9912346767",
    referralCommission: "3%",
    loadingCommission: "3%",
    dateTime: "Oct 26 2024 12:30 PM",
  },
  {
    username: "ayank@pc",
    mcTradeNo: "9912346767",
    referralCommission: "3%",
    loadingCommission: "3%",
    dateTime: "Oct 26 2024 12:30 PM",
  },
  {
    username: "ayank@pc",
    mcTradeNo: "9912346767",
    referralCommission: "3%",
    loadingCommission: "3%",
    dateTime: "Oct 26 2024 12:30 PM",
  },
  {
    username: "ayank@pc",
    mcTradeNo: "9912346767",
    referralCommission: "3%",
    loadingCommission: "3%",
    dateTime: "Oct 26 2024 12:30 PM",
  },
];

const MOCK1 = [
  { username: "ayank@pc", email: "ayanku@gmail.com" },
  { username: "ayank@pc", email: "ayanku@gmail.com" },
  { username: "ayank@pc", email: "ayanku@gmail.com" },
  { username: "ayank@pc", email: "ayanku@gmail.com" },
  { username: "ayank@pc", email: "ayanku@gmail.com" },
  { username: "ayank@pc", email: "ayanku@gmail.com" },
  { username: "ayank@pc", email: "ayanku@gmail.com" },
  { username: "ayank@pc", email: "ayanku@gmail.com" },
  { username: "ayank@pc", email: "ayanku@gmail.com" },
  { username: "ayank@pc", email: "ayanku@gmail.com" },
  { username: "ayank@pc", email: "ayanku@gmail.com" },
];

const TABS = [
  { value: "1", label: "Referral Commissions" },
  { value: "2", label: "Referrals" },
];

export const ReferralV3 = () => {
  const [currentTab, setCurrentTab] = useState("1");
  const { profile } = useProfile();
  const { t } = useTranslation();

  const handleClickTab = (t) => () => {
    setCurrentTab(t);
  };

  const tabItems = TABS.map((t, idx) => {
    const isSelected = currentTab == t.value;

    return (
      <div
        key={idx}
        className={`tabInside ${isSelected ? "selected" : ""}`}
        onClick={handleClickTab(t.value)}
      >
        {t.label}
      </div>
    );
  });

  const columns = [
    {
      title: "User Name",
      dataIndex: "username",
    },
    {
      title: "MC Trade No",
      dataIndex: "mcTradeNo",
    },
    {
      title: "Referral Commission",
      dataIndex: "referralCommission",
    },
    {
      title: "Loading Commission",
      dataIndex: "loadingCommission",
    },
    {
      title: "Time",
      dataIndex: "dateTime",
    },
  ];

  const columns1 = [
    {
      title: "User Name",
      dataIndex: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
  ];

  const renderTabs = () => {
    switch (currentTab) {
      case "1":
        return (
          // <TableV3
          //   data={[]}
          //   columns={columns}
          //   pageSize={10}
          //   totalItem={0}
          //   page={1}
          //   handleChangePage={() => {}}
          // />
          <HistoryCommissionUser />
        );

      case "2":
        return (
          // <TableV3
          //   data={[]}
          //   columns={columns1}
          //   pageSize={10}
          //   totalItem={0}
          //   page={1}
          //   handleChangePage={() => {}}
          // />
          profile && <TreeData userId={profile.id} />
        );

      default:
        break;
    }
  };

  return (
    <div className="containerV3">
      <div className="ReferralV3">
        <div className="sectionRef">
          <img
            src={i45}
            className="layerBlur"
            style={{
              position: "absolute",
              top: "0",
              left: "50%",
              transform: "translate(-70%, -70%)",
            }}
          />

          <img src={i35} className="bgImg" />

          <div className="content">
            <div className="title1">{t("referralV3.t1")}</div>
            <div className="title2">{t("referralV3.t2")}</div>
            <div className="desc">
              <span>
                {t("referralV3.t7")}
                <span className="text-gradient-t-b"> 5% </span>
                {t("referralV3.t8")}
                <span className="text-gradient-t-b"> 0.3% </span>
                {t("referralV3.t9")}
                <span className="text-gradient-t-b"> 0.1% </span>
                {t("referralV3.t10")}
              </span>
            </div>
            <ButtonV3Primary size={buttonV3PrimarySizes.lg}>
              {t("referralV3.t6")}
            </ButtonV3Primary>
          </div>

          <div className="qrContent">
            <div className="boxQr">
              <div className="qr">
                <div
                  style={{
                    background: "#fff",
                    padding: "8px",
                    width: "fit-content",
                    height: "fit-content",
                    paddingBottom: "0px",
                  }}
                >
                  <QRCode
                    value={`${DOMAIN}?ref=${profile?.unique_code || ""}`}
                    size={92}
                  />
                </div>
              </div>
              <div className="title">QR Link</div>
              <div className="linkQr">
                {DOMAIN}?ref={profile?.unique_code || ""}
              </div>
              <div
                style={{ cursor: "pointer" }}
                className="copy text-gradient-t-b"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${DOMAIN}?ref=${profile?.unique_code || ""}`
                  );
                  message.info(t("copySuccess"));
                }}
              >
                <span>Copy </span>
                <span>
                  <i class="fa-regular fa-copy"></i>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="sectionChooseTab">
          <div className="tabs">{tabItems}</div>
        </div>

        <div className="sectionData">{renderTabs()}</div>
      </div>
    </div>
  );
};
