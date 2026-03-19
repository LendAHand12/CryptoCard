import {
  ButtonV3Primary,
  buttonV3PrimarySizes,
} from "../ButtonV3/ButtonV3Primary";
import "./WalletV3.scss";
import i30 from "src/assets/v3/i30.png";
import i31 from "src/assets/v3/i31.png";
import i32 from "src/assets/v3/i32.png";
import { formatRoundedBalance, useWalletV3 } from "./hooks/useWalletV3";
import { useWalletUsdtAndEur } from "./hooks/useWalletUsdtAndEur";
import { TableV3 } from "../TableV3/TableV3";
import { Table } from "./components/Table";
import { ButtonV3 } from "../ButtonV3/ButtonV3";
import { DOMAIN } from "src/util/service";
import { useTranslation } from "react-i18next";
import { message, Spin, Input } from "antd";
import { preprocessingAddress } from "src/components/NewVersion";
import i45 from "src/assets/v3/i45.png";

export const WalletV3 = () => {
  const {
    dataCoins,
    currentCoinDeposit,
    isOpenDeposit,
    handleClickBtnDeposit,
    topRef,
    handleClickBtnSwap,
    currentNetwork,
    isConnectedWallet,
    address,
    open,
    addressFromProfile,
    // new deposit
    adminWalletAddress,
    depositAmount,
    setDepositAmount,
    isDepositing,
    handleDeposit,
  } = useWalletV3();
  const { t } = useTranslation();

  const { totalUSDTFormatted, totalEURFormatted } = useWalletUsdtAndEur();

  return (
    <div className="containerV3">
      <div className="WalletV3">
        <img
          src={i45}
          style={{
            position: "absolute",
            top: "0",
            left: "50%",
            transform: "translate(-30%, -70%)",
          }}
        />

        <div className="sectionConnectWallet">
          <div className="icon">
            <img src={i30} />
          </div>
          <div className="content">
            <div className="title">{t("walletV3.t1")}</div>
            <div className="desc">{t("walletV3.t2")}</div>
          </div>
          <div className="btnConnect">
            <ButtonV3Primary
              size={buttonV3PrimarySizes.lg}
              onClick={() => open()}
            >
              {isConnectedWallet
                ? preprocessingAddress(addressFromProfile)
                : t("walletV3.t18")}
            </ButtonV3Primary>
          </div>
        </div>

        <div
          className={`wrappedSection ${isOpenDeposit ? "isOpenDeposit" : ""}`}
          ref={topRef}
        >
          <div className="sectionTotalBalance">
            <div className="totalBalance usdt">
              <div className="title">{t("walletV3.t3")}</div>
              <div className="amount">{totalUSDTFormatted} USDT</div>
              <div className="bgImg">
                <img src={i31} />
              </div>
            </div>

            <div className="totalBalance eur">
              <div className="title">{t("walletV3.t3")}</div>
              <div className="amount">{totalEURFormatted} EUR</div>
              <div className="bgImg">
                <img src={i32} />
              </div>
            </div>
          </div>

          {/* ── Deposit Section (new: direct transfer to admin wallet) ── */}
          <div className="sectionDeposit">
            <div className="depositInfo">
              <div className="infoItem">
                <div className="label">{t("walletV3.t4")}</div>
                <div className="value">{currentCoinDeposit}</div>
              </div>

              <div className="infoItem">
                <div className="label">{t("walletV3.t5")}</div>
                <div className="value">{currentNetwork}</div>
              </div>
            </div>

            <div className="depositContent">
              <div className="left">
                {/* Admin wallet address (destination) */}
                <div className="title" style={{ marginBottom: 8 }}>
                  {t("walletV3.t6")}
                </div>
                <div
                  className="linkQr"
                  style={{
                    wordBreak: "break-all",
                    fontSize: 13,
                    marginBottom: 8,
                  }}
                >
                  {adminWalletAddress || "..."}
                </div>
                <div
                  className="copy text-gradient-t-b"
                  style={{ marginBottom: 16, cursor: "pointer" }}
                  onClick={() => {
                    navigator.clipboard.writeText(adminWalletAddress || "");
                    message.success(t("copySuccess"));
                  }}
                >
                  <span>{t("walletV3.t7")} </span>
                  <span>
                    <i className="fa-regular fa-copy"></i>
                  </span>
                </div>

                {/* Amount input */}
                <div style={{ marginBottom: 12 }}>
                  <Input
                    type="number"
                    min={0}
                    placeholder={`${t("walletV3.t19")} ${currentCoinDeposit || "USDT"}`}
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    style={{
                      borderRadius: 8,
                      height: 44,
                      fontSize: 16,
                    }}
                    suffix={
                      <span style={{ fontWeight: 700, opacity: 0.7 }}>
                        {currentCoinDeposit || "USDT"}
                      </span>
                    }
                    disabled={isDepositing}
                  />
                </div>
 
                {/* Deposit button */}
                {isConnectedWallet ? (
                  <ButtonV3Primary
                    size={buttonV3PrimarySizes.lg}
                    onClick={handleDeposit}
                    disabled={isDepositing || !depositAmount}
                  >
                    {isDepositing ? (
                      <span>
                        <Spin size="small" style={{ marginRight: 8 }} />
                        {t("walletV3.t20")}
                      </span>
                    ) : (
                      `${t("walletV3.t17")} ${currentCoinDeposit || "USDT"}`
                    )}
                  </ButtonV3Primary>
                ) : (
                  <ButtonV3Primary
                    size={buttonV3PrimarySizes.lg}
                    onClick={() => open()}
                  >
                    {t("walletV3.t18")}
                  </ButtonV3Primary>
                )}
              </div>

              <div className="right">
                <div className="note">
                  <div className="icon">
                    <i className="fa-solid fa-circle-info"></i>
                  </div>
                  <div className="desc">
                    <span>{t("walletV3.t8")} </span>
                    <span>{currentCoinDeposit} </span>
                    <span>{t("walletV3.t9")}</span>
                    <span> {currentCoinDeposit} </span>
                    <span>{t("walletV3.t10")}</span>
                  </div>
                </div>
                <div className="note">
                  <div className="icon">
                    <i className="fa-solid fa-circle-info"></i>
                  </div>
                  <div className="desc">
                    <span>{t("walletV3.t11")} </span>
                    <span>{currentCoinDeposit}.</span>
                    <span> {t("walletV3.t12")}</span>
                  </div>
                </div>
                <div className="note">
                  <div className="icon">
                    <i className="fa-solid fa-circle-info"></i>
                  </div>
                  <div className="desc">
                    <span>
                      {t("walletV3.t21")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sectionCoins">
          <Table
            scrollX={"unset"}
            data={dataCoins}
            columns={[
              {
                title: "Token",
                render: (_, record) => {
                  return (
                    <span
                      style={{
                        gap: "8px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={DOMAIN + record.image}
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                        }}
                      />
                      <span style={{ fontWeight: 700, fontSize: "16px" }}>
                        {record.name}
                      </span>
                      <span>{record.token_key}</span>
                    </span>
                  );
                },
              },
              {
                dataIndex: "price",
                title: t("walletV3.t13"),
                render: (value) => {
                  return (
                    <div style={{ fontWeight: 700 }}>
                      <span style={{ marginRight: "2px" }}>$</span>
                      {value}
                    </div>
                  );
                },
              },
              {
                title: t("walletV3.t14"),
                render: (_, record) => {
                  return (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>
                        {formatRoundedBalance(record.name, record.balance)}
                      </span>

                      <img
                        src={DOMAIN + record.image}
                        style={{
                          width: "20px",
                          height: "20px",
                          objectFit: "cover",
                        }}
                      />
                    </span>
                  );
                },
              },
              {
                title: "",
                render: (_, record) => {
                  const buttonBuyAmc = record.name === "AMC" && (
                    <ButtonV3Primary>
                      {t("maintained")}
                    </ButtonV3Primary>
                  );

                  const buttonBuyHewe = record.name === "HEWE" && (
                    <ButtonV3Primary>
                      {t("maintained")}
                    </ButtonV3Primary>
                  );

                  const buttonDepositHEWE =
                    record.name === "HEWE" &&
                    isConnectedWallet && (
                      <ButtonV3Primary
                        onClick={handleClickBtnDeposit(record.name, "AMC20")}
                      >
                        {t("walletV3.t17")}
                      </ButtonV3Primary>
                    );

                  const buttonDepositAMC =
                    record.name === "AMC" &&
                    isConnectedWallet && (
                      <ButtonV3Primary
                        onClick={handleClickBtnDeposit(record.name, "AMC20")}
                      >
                        {t("walletV3.t17")}
                      </ButtonV3Primary>
                    );

                  const buttonDepositUSDT = record.name === "USDT" && (
                    <ButtonV3Primary
                      onClick={handleClickBtnDeposit(record.name, "BEP20")}
                    >
                      {t("walletV3.t17")}
                    </ButtonV3Primary>
                  );

                  return (
                    <div style={{ display: "flex", gap: "16px" }}>
                      {/* {buttonDepositAMC} */}
                      {buttonBuyAmc}

                      {/* {buttonDepositHEWE} */}
                      {buttonBuyHewe}

                      {buttonDepositUSDT}
                    </div>
                  );
                },
              },
            ]}
            isShowPagination={false}
          />
        </div>
      </div>
    </div>
  );
};
