import { roundedUp } from "./roundNumber";

export const calculateEurToUsd = (rateEurToUsd, amountEur) => {
  if (!rateEurToUsd) return null;

  // return Number(Number(amountEur / rateEurToUsd).toFixed(2));

  return roundedUp(Number(amountEur / rateEurToUsd), 2);
};
