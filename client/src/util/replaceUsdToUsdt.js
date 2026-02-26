export const replaceUsdToUsdt = (currency) => {
  try {
    switch (currency.toString()) {
      case "usd":
      case "USD":
        return "USDT";

      default:
        return currency;
    }
  } catch (error) {
    return currency;
  }
};
