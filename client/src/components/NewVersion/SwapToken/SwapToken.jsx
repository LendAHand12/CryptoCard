import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { useFadedIn } from "src/hooks/useFadedIn";
import { useRedirectHomeIfNotLogin } from "src/hooks/useRedirectHomeIfNotLogin";
import { getListCoinRealTime } from "src/redux/constant/listCoinRealTime.constant";
import "./SwapToken.scss";
import { message, Modal, Radio, Spin } from "antd";
import { roundedDown } from "src/util/roundNumber";
import { axiosService, DOMAIN } from "src/util/service";
import { useProfile } from "src/hooks/useProfile";
import QRCode from "react-qr-code";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const PERCENT_BONUS = 0.02; // 2%
const MIN_USDT_BONUS = 1000;

const checkIsBonus = (profile, inputUsdt, token) => {
  if (!profile || Number(inputUsdt) < MIN_USDT_BONUS) {
    return false;
  }

  return token == "hewe" ? profile.bonusHewe == 1 : profile.bonusAmc == 1;
};

const calculateBonus = (tokenPrice, isBonus) => {
  if (!isBonus) return 0;

  const bonusTokenOfOnly1000USDT =
    (MIN_USDT_BONUS / tokenPrice) * PERCENT_BONUS;

  return bonusTokenOfOnly1000USDT;
};

export const SwapToken = () => {
  const { t } = useTranslation();
  const [isOpenQr, setIsOpenQr] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const { usdtBalance } = useSelector((state) => state.globalReducer);
  const [inputUsdt, setInputUsdt] = useState("");
  const { isLogin } = useRedirectHomeIfNotLogin();
  const { domRef } = useFadedIn();
  const allCoin = useSelector(getListCoinRealTime);
  const { profile } = useProfile();
  const history = useHistory();

  const isHasRealtimeData = allCoin !== null;
  const amcPrice = isHasRealtimeData
    ? allCoin.find((coin) => coin.name == "AMC")?.price
    : 0;
  const hewePrice = isHasRealtimeData
    ? allCoin.find((coin) => coin.name == "HEWE")?.price
    : 0;
  const { pathname } = useLocation();
  const token = pathname.split("-")[1];
  const tokenPrice = token == "hewe" ? hewePrice : amcPrice;

  const isBonus = checkIsBonus(profile, inputUsdt, token);

  const amountTokenReceived =
    tokenPrice !== 0 ? Number(inputUsdt) / tokenPrice : 0;

  // const amountTokenBonus = isBonus ? amountTokenReceived * PERCENT_BONUS : 0;
  const amountTokenBonus = calculateBonus(tokenPrice, isBonus);

  // const isEnoughBalance = Number(inputUsdt) < usdtBalance;
  // const isDisabledBtn = !isEnoughBalance || Number(inputUsdt) < MIN_SWAP;
  const isDisabledBtn = false;

  const handleOpenQr = () => {
    setIsOpenQr(true);
  };

  const handleCloseQr = () => {
    setIsOpenQr(false);
  };

  const isNumberWithDot = (value) => {
    const regex = /^\d+(\.\d*)?$/;

    return regex.test(value);
  };

  const handleChangeInputCoin = (e) => {
    const value = e.target.value;

    if (value.trim() === "") {
      
      setInputUsdt("");
      return;
    }

    if (!isNumberWithDot(value)) {
      return;
    }

    setInputUsdt(value);
  };

  const handleGetQrWallet = async () => {
    try {
      const res = await axiosService.post("api/blockico/createWalletBEP20", {
        symbol: `${token.toUpperCase()}.AMC20`,
        swap: true,
      });

      setWalletAddress(res?.data?.data?.address || null);
    } catch (error) {
      setWalletAddress(error?.response?.data?.errors?.address || null);
    }
  };

  useEffect(() => {
    if (isLogin && isHasRealtimeData) {
      handleGetQrWallet();
    }
  }, [isLogin, isHasRealtimeData]);

  if (!isLogin || !isHasRealtimeData) {
    return null;
  }

  return (
    <div className="containerV2 SwapToken">
      <div className="SwapToken" ref={domRef}>
        <div
          style={{
            display: "flex",
            marginBottom: 40,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            onClick={() => history.push("/wallet-v3")}
            style={{ cursor: "pointer" }}
          >
            <i class="fa-solid fa-arrow-left" style={{ fontSize: 16 }}></i>
          </div>

          <div className="titleV2" style={{ marginBottom: 0 }}>
            {t("buy")} {token.toUpperCase()}
          </div>

          <div></div>
        </div>
        <div className="formSwap">
          <div className="formItem">
            <div className="labelInside">
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <img
                  style={{ width: "20px" }}
                  src={DOMAIN + "images/USDT.png"}
                  alt="usdt"
                />{" "}
                USDT
              </div>
              {/* <div>Available: {roundedDown(usdtBalance, 2)}</div> */}

              <div></div>
            </div>
            <div>
              <input
                value={inputUsdt}
                className="inputInside"
                onChange={handleChangeInputCoin}
              />
            </div>
          </div>

          <div className="stats">
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div className="label">Network USDT:</div>
              <Radio.Group value="bep20">
                <Radio value="bep20">
                  <span style={{ color: "#fff" }}>BEP20</span>
                </Radio>
              </Radio.Group>
            </div>

            <div className="statsRow">
              <div className="label">{t("swapToken.t2")} USDT</div>
              <div className="value">{roundedDown(inputUsdt, 2)}</div>
            </div>

            <div className="statsRow">
              <div className="label">
                {t("swapToken.t2")} {token.toUpperCase()}
              </div>
              <div className="value">
                {roundedDown(amountTokenReceived, token == "hewe" ? 7 : 4)}
              </div>
            </div>

            <div className="statsRow">
              <div className="label">
                {t("swapToken.t3")} {token.toUpperCase()}
              </div>
              <div className="value">
                {roundedDown(tokenPrice, token == "hewe" ? 7 : 4)}
              </div>
            </div>

            <div className="statsRow">
              <div className="label">{t("swapToken.t4")}</div>
              <div className="value">
                {roundedDown(amountTokenBonus, token == "hewe" ? 7 : 4)}
                <span> {token.toUpperCase()}</span>
              </div>
            </div>

            <div>
              <div className="warning">{t("swapToken.t5")}</div>
              <div className="warning">
                {t("swapToken.t6").replace("{{token}}", token.toUpperCase())}
              </div>
            </div>

            <button
              // className="btnInside"
              className="ButtonV3Primary lg full"
              disabled={isDisabledBtn}
              onClick={handleOpenQr}
            >
              {t("buy")} {token.toUpperCase()}
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={isOpenQr}
        footer={null}
        title={`${t("buy")} ${token.toUpperCase()}`}
        onCancel={handleCloseQr}
      >
        {!walletAddress ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
            }}
          >
            <Spin />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              padding: "16px",
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "6px",
                width: "fit-content",
              }}
            >
              <QRCode value={walletAddress} />
            </div>

            <div>
              <div
                className="warning"
                style={{
                  color: "#f4e096",
                  textAlign: "center",
                  wordBreak: "break-all",
                  marginBottom: "8px",
                }}
              >
                {walletAddress}{" "}
                <i
                  class="fa-solid fa-copy"
                  onClick={() => {
                    navigator.clipboard.writeText(walletAddress);
                    message.info(t("copySuccess"));
                  }}
                ></i>
              </div>
              <div
                className="warning"
                style={{ color: "#f4e096", textAlign: "center" }}
              >
                {t("swapToken.t5")}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
