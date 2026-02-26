import { DepositAMC } from "./components/DepositAMC/DepositAMC";
import { DepositHEWE } from "./components/DepositHEWE/DepositHEWE";
import "./WalletDepositHistoryV3.scss";

export const WalletDepositHistoryV3 = () => {
  return (
    <div className="containerV3">
      <div className="WalletDepositHistoryV3">
        <DepositAMC />

        <DepositHEWE />
      </div>
    </div>
  );
};
