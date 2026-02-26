import {
  BACK_CARD_PHYSIC,
  BACK_CARD_TYPE03,
  BACK_CARD_VIRTUAL,
  FRONT_CARD_PHYSIC,
  FRONT_CARD_TYPE03,
  FRONT_CARD_VIRTUAL,
  ID_CARD_TYPE_4_PRODUCTION,
  ID_CARD_TYPE_4_TEST,
  BACK_CARD_TYPE04,
  FRONT_CARD_TYPE04,
} from "src/components/NewVersion";

export const renderFrontCardImgByCardTypeId = (cardTypeId) => {
  switch (cardTypeId.toString()) {
    case "88990001":
      return FRONT_CARD_VIRTUAL;

    case "88990003":
      return FRONT_CARD_TYPE03;

    case "90000007":
      return FRONT_CARD_PHYSIC;

    case ID_CARD_TYPE_4_TEST:
    case ID_CARD_TYPE_4_PRODUCTION:
      return FRONT_CARD_PHYSIC;

    default:
      return "";
  }
};

// applyType 2 là 88990001
//           1 là 88990003
//           3 là 90000007, ID_CARD_TYPE_4_TEST, ID_CARD_TYPE_4_PRODUCTION
export const renderFrontCardImgByCardApplyType = (applyType, cardTypeId) => {
  switch (applyType.toString()) {
    case "2":
      return FRONT_CARD_VIRTUAL;

    case "1":
      if (cardTypeId === "72000001") {
        return FRONT_CARD_TYPE04;
      }
      return FRONT_CARD_TYPE03;

    case "3":
      return FRONT_CARD_PHYSIC;

    default:
      return "";
  }
};

export const renderBackCardImgByCardTypeId = (cardTypeId) => {
  switch (cardTypeId?.toString()) {
    case "88990001":
      return BACK_CARD_VIRTUAL;

    case "88990003":
      return BACK_CARD_TYPE03;

    case "90000007":
      return BACK_CARD_PHYSIC;

    case ID_CARD_TYPE_4_TEST:
    case ID_CARD_TYPE_4_PRODUCTION:
      return BACK_CARD_PHYSIC;

    default:
      return "";
  }
};

// applyType 2 là 88990001
//           1 là 88990003
//           3 là 90000007, ID_CARD_TYPE_4_TEST, ID_CARD_TYPE_4_PRODUCTION
export const renderBackCardImgByCardApplyType = (applyType, cardTypeId) => {
  switch (applyType?.toString()) {
    case "2":
      return BACK_CARD_VIRTUAL;

    case "1":
      if (cardTypeId === "72000001") {
        return BACK_CARD_TYPE04;
      }
      return BACK_CARD_TYPE03;

    case "3":
      return BACK_CARD_PHYSIC;

    default:
      return "";
  }
};
