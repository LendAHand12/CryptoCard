const { renderPercentRechargeFee } = require("./renderPercentRechargeFee");

export const calculateCreationFee = (
  minRecharge,
  feeRechage,
  feeCard,
  isCardPhysic = false
) => {
  // nếu là card physic thì chỉ cần lấy field card issuing fee
  if (isCardPhysic) {
    return Number(feeCard);
  }

  const percentRechargeFee = renderPercentRechargeFee(feeRechage);

  const minRechargeNumber = Number(minRecharge);
  const totalMinRechargePlusFee =
    minRechargeNumber + (minRechargeNumber * percentRechargeFee) / 100;

  // return Number(minRecharge) + Number(feeRechage) + Number(feeCard); // logic cũ
  return totalMinRechargePlusFee + Number(feeCard);
};
