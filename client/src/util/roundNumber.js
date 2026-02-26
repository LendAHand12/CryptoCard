export const roundNumber = (num, numFixed = 3) => {
  return Number(Number(num).toFixed(numFixed));
};

export const roundedDown = (number, digit = 4) => {
  try {
    const numberDegit = Math.pow(10, Number(digit));
    const parseNum = Number(number);

    if (Number.isInteger(parseNum)) {
      return parseNum;
    }

    return Math.floor(numberDegit * parseNum) / numberDegit;
  } catch (error) {
    return number;
  }
};

export const roundedUp = (number, digit = 4) => {
  try {
    const numberDegit = Math.pow(10, Number(digit));
    const parseNum = Number(number);

    if (Number.isInteger(parseNum)) {
      return parseNum;
    }

    return Math.ceil(numberDegit * parseNum) / numberDegit;
  } catch (error) {
    return number;
  }
};
