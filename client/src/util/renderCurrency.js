export const renderCurrency = (currency) => {
  try {
    switch (currency.toLowerCase()) {
      case "usd":
        return "USDT";

      default:
        return currency;
    }
  } catch (error) {
    return currency;
  }
};
