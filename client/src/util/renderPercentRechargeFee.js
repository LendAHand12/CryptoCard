export const renderPercentRechargeFee = (rechargeFee) => {
  const value = Number(rechargeFee);

  if (isNaN(value)) return 0;

  if (value > 1) {
    return value.toFixed(4);
  } else {
    return Number((value * 100).toFixed(4));
  }
};
