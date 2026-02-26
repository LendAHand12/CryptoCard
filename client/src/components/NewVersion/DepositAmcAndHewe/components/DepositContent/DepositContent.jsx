import { useEffect, useState } from "react";
import "./DepositContent.scss";
import { message, Spin } from "antd";
import { axiosService, DOMAIN } from "src/util/service";
import QRCode from "react-qr-code";
import { useTranslation } from "react-i18next";
import { Input } from "src/components/Common/Input";

export const DepositContent = ({ token }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const [network, setNetwork] = useState("AMC20");
  const [coin, setCoin] = useState(token);

  const handleGetWallet = async () => {
    try {
      const symbol = token === "AMC" ? "AMC.AMC20" : "HEWE.AMC20";

      const res = await axiosService.post("api/blockico/createWalletBEP20", {
        symbol,
      });
      setWalletAddress(res.data.data.address);
      setIsLoading(false);
    } catch (error) {
      if (error?.response?.data?.errors?.address) {
        setWalletAddress(error.response.data.errors.address);
      }
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    message.info("Copied");
  };

  useEffect(() => {
    handleGetWallet();
  }, []);

  if (isLoading || !walletAddress) {
    return (
      <div className="DepositContent">{isLoading ? <Spin /> : "Try again"}</div>
    );
  }

  return (
    <div className="DepositContent">
      <div className="item">
        <div>Coin</div>

        <div className="content-selected">
          <img src={`${DOMAIN}images/${token}.png`} alt="name" />
          <span className="content">{token}</span>
        </div>
      </div>

      <div className="item">
        <div>Network</div>

        <div className="content-selected">
          <span className="content">{network}</span>
        </div>
      </div>

      <div className="qrAddress">
        <QRCode value={walletAddress} size="200" />
      </div>

      <div className="walletString">
        {walletAddress}{" "}
        <i
          class="fa-solid fa-copy"
          style={{ cursor: "pointer", marginLeft: "4px" }}
          onClick={handleCopy}
        ></i>
      </div>

      <div className="notes">
        <div className="note">
          <i class="fa-solid fa-circle-info" style={{ marginRight: "4px" }}></i>
          {t(
            "youHaveToDepositAtLeast5UsdtToBeCreditedAnyDepositThatIsLessThan5UsdtWillNotBeRefunded"
          ).replaceAll("USDT", token)}
        </div>
        <div className="note">
          <i class="fa-solid fa-circle-info" style={{ marginRight: "4px" }}></i>
          {t(
            "thisDepositAddressOnlyAcceptsUSDTDoNotSendOtherCoinsToIt"
          ).replaceAll("USDT", token)}
        </div>
      </div>
    </div>
  );
};
