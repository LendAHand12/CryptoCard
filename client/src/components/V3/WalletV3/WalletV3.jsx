import QRCode from "react-qr-code";
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
import { message, Spin } from "antd";
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
    addressWalletDeposit,
    isPendingCreateWallet,
    isConnectedWallet,
    address,
    open,
    addressFromProfile,
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
              {isPendingCreateWallet ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Spin />
                </div>
              ) : (
                <div className="left">
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
                      <QRCode value={addressWalletDeposit || ""} size={145} />
                    </div>
                  </div>
                  <div className="title">{t("walletV3.t6")}</div>
                  <div className="linkQr">{addressWalletDeposit}</div>
                  <div
                    className="copy text-gradient-t-b"
                    onClick={() => {
                      navigator.clipboard.writeText(addressWalletDeposit || "");
                      message.success(t("copySuccess"));
                    }}
                  >
                    <span>{t("walletV3.t7")} </span>
                    <span>
                      <i class="fa-regular fa-copy"></i>
                    </span>
                  </div>
                </div>
              )}

              <div className="right">
                <div className="note">
                  <div className="icon">
                    <i class="fa-solid fa-circle-info"></i>
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
                    <i class="fa-solid fa-circle-info"></i>
                  </div>
                  <div className="desc">
                    <span>{t("walletV3.t11")} </span>
                    <span>{currentCoinDeposit}.</span>
                    <span> {t("walletV3.t12")}</span>
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
                    <ButtonV3Primary
                      // onClick={handleClickBtnSwap(record.name.toLowerCase())}
                    >
                      {/* {t("walletV3.t15")} */}
                      {t("maintained")}
                    </ButtonV3Primary>
                  );

                  const buttonBuyHewe = record.name === "HEWE" && (
                    <ButtonV3Primary
                      // onClick={handleClickBtnSwap(record.name.toLowerCase())}
                    >
                      {/* {t("walletV3.t16")} */}
                      {t("maintained")}
                    </ButtonV3Primary>
                  );

                  const buttonDepositHEWE = record.name === "HEWE" &&
                    isConnectedWallet && (
                      <ButtonV3Primary
                        onClick={handleClickBtnDeposit(record.name, "AMC20")}
                      >
                        {t("walletV3.t17")}
                      </ButtonV3Primary>
                    );

                  const buttonDepositAMC = record.name === "AMC" &&
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
                      {buttonDepositAMC}
                      {buttonBuyAmc}

                      {buttonDepositHEWE}
                      {buttonBuyHewe}

                      {/* {buttonDepositUSDT} */}
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
