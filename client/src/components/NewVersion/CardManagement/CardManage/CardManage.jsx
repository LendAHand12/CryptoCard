import { Button, Descriptions, Image, message, Modal, Spin, Table } from "antd";
import "./CardManage.scss";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { axiosService } from "src/util/service";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import { useFadedIn } from "src/hooks/useFadedIn";
import i18n from "../../../../translation/i18n";
import { ID_CARD_TYPE_4_PRODUCTION, ID_CARD_TYPE_4_TEST } from "../..";

const MOCK = [
  {
    imgSrc: "/img/newVersion/s12.png",
    cardName: "Regular Physical Card",
    method: "Saving card",
    currency: "EUR",
    fee: "99.0",
    fiatExchangeFee: "2.0%",
    quota: "100000.00 EUR/Day",
    advantages1: "Suitable for EEA region, fash delivery, $10000/day",
    advantages2: "2.9010000 applied already",
  },
];

export const FRONT_CARD_VIRTUAL = "/img/newVersion/fronthewe.png";
export const BACK_CARD_VIRTUAL = "/img/newVersion/backhewe.png";
export const FRONT_CARD_PHYSIC = "/img/newVersion/frontphysic.png";
export const BACK_CARD_PHYSIC = "/img/newVersion/backphysic.png";
export const FRONT_CARD_TYPE03 = "/img/newVersion/front03.png";
export const BACK_CARD_TYPE03 = "/img/newVersion/back03.png";
export const BACK_CARD_TYPE04 = "/img/newVersion/back04.png";
export const FRONT_CARD_TYPE04 = "/img/newVersion/front04.png";
 
export const renderCardType = (cardType) => {
  switch (cardType) {
    case 1:
      // return "Virtual";
      return i18n.t("outsideComponent.t3");

    case 2:
      // return "Physical";
      return i18n.t("outsideComponent.t4");

    default:
      return null;
  }
};

export const renderCardTypeId = (cardTypeId) => {
  switch (cardTypeId) {
    case "88990001":
    case "88990003":
      // return "Virtual";
      return i18n.t("outsideComponent.t3");

    case "90000007":
    case ID_CARD_TYPE_4_TEST:
    case ID_CARD_TYPE_4_PRODUCTION:
      // return "Physical";
      return i18n.t("outsideComponent.t4");

    default:
      return null;
  }
};

export const renderCardTypeByApplyType = (applyType) => {
  switch (applyType.toString()) {
    case "1":
    case "2":
      // return "Virtual";
      return i18n.t("outsideComponent.t3");

    case "3":
      // return "Physical";
      return i18n.t("outsideComponent.t4");

    default:
      return null;
  }
};

export const renderCardMaterial = (cardSubType) => {
  switch (cardSubType) {
    case 1:
      // return "Metal";
      return i18n.t("outsideComponent.t5");

    case 2:
      // return "Plastic";
      return i18n.t("outsideComponent.t6");

    default:
      return null;
  }
};

export const renderMethodOfActivation = (cardActivationType) => {
  switch (cardActivationType) {
    case 1:
      // return "Via API（need ID）";
      return i18n.t("outsideComponent.t7");

    case 2:
      // return "Via Email";
      return i18n.t("outsideComponent.t8");

    case 3:
      // return "Via API（no need ID）";
      return i18n.t("outsideComponent.t47");

    default:
      return null;
  }
};

export const renderAMLType = (cardAMLType) => {
  switch (cardAMLType) {
    case 1:
      // return "Merchant use";
      return i18n.t("outsideComponent.t9");

    case 2:
      // return "Hyper card automatically provided";
      return i18n.t("outsideComponent.t10");

    default:
      return null;
  }
};

export const renderApplyType = (cardApplyType) => {
  switch (cardApplyType) {
    case 1:
      // return "Default mode";
      return i18n.t("outsideComponent.t11");

    case 2:
      // return "Express mode";
      return i18n.t("outsideComponent.t12");

    case 3:
      // return "Binding mode";
      return i18n.t("outsideComponent.t13");

    case 4:
      // return "Billing mode";
      return i18n.t("outsideComponent.t14");

    case 5:
      // return "Online mode";
      return i18n.t("outsideComponent.t15");

    default:
      return null;
  }
};

export const renderBillingMode = (billingMode) => {
  switch (billingMode) {
    case 1:
      // return "All column need";
      return i18n.t("outsideComponent.t16");

    case 2:
      // return "Section column need";
      return i18n.t("outsideComponent.t17");

    default:
      return null;
  }
};

export const renderCanChangeBillingAddress = (canChangeBillingAddress) => {
  switch (canChangeBillingAddress) {
    case 1:
      // return "Allow";
      return i18n.t("outsideComponent.t18");

    case 2:
      // return "Not allow";
      return i18n.t("outsideComponent.t19");

    default:
      return null;
  }
};

export const renderCanRepeat = (canRepeat) => {
  switch (canRepeat) {
    case 1:
      // return "Can repeat";
      return i18n.t("outsideComponent.t20");

    case 2:
      // return "Can not repeat";
      return i18n.t("outsideComponent.t21");

    default:
      return null;
  }
};

export const renderObtainWay = (obtainWay) => {
  switch (obtainWay) {
    case 0:
      // return "Obtain through the API interface";
      return i18n.t("outsideComponent.t22");

    case 1:
      // return "Obtain by encryption";
      return i18n.t("outsideComponent.t23");

    case 2:
      // return "Obtain by Email";
      return i18n.t("outsideComponent.t24");

    default:
      return null;
  }
};

export const renderSupportRecharge = (canRecharge) => {
  switch (canRecharge) {
    case 1:
      // return "Support";
      return i18n.t("outsideComponent.t25");

    case 2:
      // return "Not support";
      return i18n.t("outsideComponent.t26");

    default:
      return null;
  }
};

export const renderMoreCard = (moreCard) => {
  switch (moreCard) {
    case 1:
      // return "Support";
      return i18n.t("outsideComponent.t25");

    case 2:
      // return "Not support";
      return i18n.t("outsideComponent.t26");

    default:
      return null;
  }
};

export const renderInitalDepositMandatory = (isMandatory) => {
  switch (isMandatory) {
    case 1:
      // return "Mandatory";
      return i18n.t("outsideComponent.t27");

    case 2:
      // return "Non mandatory";
      return i18n.t("outsideComponent.t28");

    default:
      return null;
  }
};

export const renderSupportPoaType = (poaType) => {
  const poaTypeMapping = {
    // 1: "Self-service provision",
    // 2: "Assist with certification",
    1: i18n.t("outsideComponent.t29"),
    2: i18n.t("outsideComponent.t30"),
  };

  if (poaType.includes(",")) {
    return poaType
      .split(",")
      .map((d) => poaTypeMapping[d.toString()])
      .join(", ");
  }

  return poaTypeMapping[poaType];
};

export const renderDocType = (docType) => {
  const docTypeMapping = {
    // 1: "Passport",
    // 2: "ID",
    // 3: "Driver license",
    1: i18n.t("outsideComponent.t31"),
    2: i18n.t("outsideComponent.t32"),
    3: i18n.t("outsideComponent.t33"),
  };

  if (docType.includes(",")) {
    return docType
      .split(",")
      .map((d) => docTypeMapping[d.toString()])
      .join(", ");
  }

  return docTypeMapping[docType];
};

export const renderCardOrganization = (cardOrg) => {
  switch (cardOrg) {
    case 1:
      // return "VISA";
      return i18n.t("outsideComponent.t34");

    case 2:
      // return "MasterCard";
      return i18n.t("outsideComponent.t35");

    case 3:
      // return "AE";
      return i18n.t("outsideComponent.t36");

    case 4:
      // return "UnionPay";
      return i18n.t("outsideComponent.t37");

    case 5:
      // return "Disconver";
      return i18n.t("outsideComponent.t38");

    case 6:
      // return "JCB";
      return i18n.t("outsideComponent.t39");

    default:
      return null;
  }
};

export const renderCardStatus = (cardStatus) => {
  switch (cardStatus) {
    case 1:
      // return "Enabled";
      return i18n.t("outsideComponent.t1");

    case 2:
      // return "Disabled";
      return i18n.t("outsideComponent.t2");

    default:
      return null;
  }
};

export const renderOperationType = (supportBusiness) => {
  switch (supportBusiness) {
    case 1:
      // return "Freeze";
      return i18n.t("outsideComponent.t40");

    case 2:
      // return "Unfreeze";
      return i18n.t("outsideComponent.t41");

    case 3:
      // return "Report loss";
      return i18n.t("outsideComponent.t42");

    case 4:
      // return "Reset password";
      return i18n.t("outsideComponent.t43");

    case 5:
      // return "Card re-issue";
      return i18n.t("outsideComponent.t44");

    case 6:
      // return "Resend PIN";
      return i18n.t("outsideComponent.t45");

    case 9:
      // return "Cancel Card";
      return i18n.t("outsideComponent.t46");

    default:
      return null;
  }
};

export const CardManage = () => {
  const isLogin = useSelector((state) => state.loginReducer.isLogin);
  const [data, setData] = useState([]);
  const history = useHistory();
  const [currentCardFocus, setCurrentCardFocus] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isPendingGetData, setIsPendingGetData] = useState(true);
  const { domRef } = useFadedIn();
  const [isOpenModalLinked, setIsOpenModalLinked] = useState(false);
  const [formDataLinked, setFormDataLinked] = useState({
    card_no: "",
    envelope_no: "",
    card_type_id: "",
  });
  const [isPendingLink, setIsPendingLink] = useState(false);
  const [togglePwd, setTogglePwd] = useState(true);
  const isDisabledBtn =
    formDataLinked.card_no === "" ||
    formDataLinked.envelope_no === "" ||
    formDataLinked.card_type_id === "" ||
    isPendingLink;

  const isNumber = (value) => {
    const regex = /^[0-9]+$/;

    return regex.test(value);
  };

  const handleChangeInputField = (field) => (e) => {
    const value = e.target.value;

    if (value === "") {
      setFormDataLinked({ ...formDataLinked, [field]: "" });
      return;
    }

    if (!isNumber(value)) {
      return;
    }

    setFormDataLinked({ ...formDataLinked, [field]: value });
  };

  const handleRequestLinkToCard = async () => {
    if (isPendingLink) return;

    setIsPendingLink(true);

    try {
      const res = await axiosService.post("api/visaCard/bindingVisa", {
        card_no: formDataLinked.card_no,
        envelope_no: formDataLinked.envelope_no,
        card_type_id: formDataLinked.card_type_id,
      });

      message.success(res.data.message);
      setIsPendingLink(false);
      handleCloseModalLinked();
    } catch (error) {
      setIsPendingLink(false);
      message.error(error.response.data.message);
    }
  };

  const handleOpenModalLinked = (record) => () => {
    setFormDataLinked({ ...formDataLinked, card_type_id: record.card_type_id });
    setIsOpenModalLinked(true);
  };

  const handleCloseModalLinked = () => {
    setIsOpenModalLinked(false);
    setCurrentCardFocus(null);
    setFormDataLinked({ card_no: "", envelope_no: "", card_type_id: "" });
  };

  const handleViewDetail = (cardData) => () => {
    setCurrentCardFocus(cardData);
    setIsOpenModal(true);
  };

  const handleGetData = async () => {
    try {
      const res = await axiosService.post(`api/visaCard/listCard`);

      setData(res.data.data.data);
      setIsPendingGetData(false);
    } catch (error) {
      message.error(error.response.data.message);
      setIsPendingGetData(false);
    }
  };

  const renderData = data.map((d, idx) => {
    return (
      <tr key={idx}>
        <td>{d.card_type_id}</td>
        <td>{renderCardType(d.card_type)}</td>
        <td>{renderCardMaterial(d.card_sub_type)}</td>
        {/* <td>-</td> */}
        <td style={{ display: "flex", gap: "8px" }}>
          <Image
            src={d.card_type === 1 ? FRONT_CARD_VIRTUAL : FRONT_CARD_PHYSIC}
            style={{ width: "100px" }}
          />
          <Image
            src={d.card_type === 1 ? BACK_CARD_VIRTUAL : BACK_CARD_PHYSIC}
            style={{ width: "100px" }}
          />
        </td>
        <td>{renderCardOrganization(d.card_org)}</td>
        <td>{Number(Number(d.card_fee).toFixed(3))}</td>
        <td>{Number(d.recharge_fee).toFixed(3)}</td>
        <td>{(d.card_coin || "").toUpperCase()}</td>
        <td>{renderCardStatus(d.status)}</td>
        <td>
          <div style={{ display: "flex", gap: "12px" }}>
            <div
              to="#"
              onClick={handleViewDetail(d)}
              style={{ cursor: "pointer", color: "#cb9950" }}
            >
              Detail
            </div>

            {/* virtual card */}
            {d.apply_type === 2 && !!d?.cardUser === false && (
              <Link
                to={`/create-visa-card?applyType=${d.apply_type}&cardTypeId=${d.card_type_id}&cardCurr=${d.card_coin}&cardType=${d.card_type}&cardName=Placeholder`}
                style={{ marginLeft: "8px" }}
              >
                Apply
              </Link>
            )}

            {/* physical card */}
            {d.apply_type === 3 && !!d?.cardUser === false && (
              <div
                onClick={handleOpenModalLinked(d)}
                style={{
                  marginLeft: "8px",
                  wordBreak: "keep-all",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  color: "#cb9950",
                }}
              >
                Apply
              </div>
            )}
          </div>
        </td>
      </tr>
    );
  });

  const renderDescCard = () => {
    const labelDesc = "labelInside";

    if (!currentCardFocus) {
      return [];
    }

    return (
      <>
        {/* Status */}
        <Descriptions.Item label={<div className="labelInsideV2">Status</div>}>
          <div className="contentInsideV2">
            {renderCardStatus(currentCardFocus.status)}
          </div>
        </Descriptions.Item>

        {/* Card Type ID */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Card Type ID</div>}
        >
          <div className="contentInsideV2">{currentCardFocus.card_type_id}</div>
        </Descriptions.Item>

        {/* Card Type */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Card Type</div>}
        >
          <div className="contentInsideV2">
            {renderCardType(currentCardFocus.card_type)}
          </div>
        </Descriptions.Item>

        {/* Card material */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Card Material</div>}
        >
          <div className="contentInsideV2">
            {renderCardMaterial(currentCardFocus.card_sub_type)}
          </div>
        </Descriptions.Item>

        {/* Card application mode */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Card Application Mode</div>}
        >
          <div className="contentInsideV2">
            {renderApplyType(currentCardFocus.apply_type)}
          </div>
        </Descriptions.Item>

        {/* Billing mode */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Billing Mode</div>}
        >
          <div className="contentInsideV2">
            {renderBillingMode(currentCardFocus.billing_kyc_column_limit)}
          </div>
        </Descriptions.Item>

        {/* Can change billing address */}
        <Descriptions.Item
          label={
            <div className="labelInsideV2">Can Change Billing Address</div>
          }
        >
          <div className="contentInsideV2">
            {renderCanChangeBillingAddress(
              currentCardFocus.can_change_billing_address
            )}
          </div>
        </Descriptions.Item>

        {/* Doc type */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Doc Type</div>}
        >
          <div className="contentInsideV2">
            {renderDocType(currentCardFocus.doc_type)}
          </div>
        </Descriptions.Item>

        {/* Card Curr */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Card Curr</div>}
        >
          <div className="contentInsideV2">
            {currentCardFocus.card_coin.toUpperCase()}
          </div>
        </Descriptions.Item>

        {/* Card Assoc */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Card Assoc</div>}
        >
          <div className="contentInsideV2">
            {renderCardOrganization(currentCardFocus.card_org)}
          </div>
        </Descriptions.Item>

        {/* Method of Activation */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Method of Activation</div>}
        >
          <div className="contentInsideV2">
            {renderMethodOfActivation(currentCardFocus.activate_type)}
          </div>
        </Descriptions.Item>

        {/* AML report Provide type */}
        <Descriptions.Item
          label={<div className="labelInsideV2">AML Report Provide Type</div>}
        >
          <div className="contentInsideV2">
            {renderAMLType(currentCardFocus.aml_type)}
          </div>
        </Descriptions.Item>

        {/* Support recharge */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Support Recharge</div>}
        >
          <div className="contentInsideV2">
            {renderSupportRecharge(currentCardFocus.can_recharge)}
          </div>
        </Descriptions.Item>

        {/* Allow repeat email or phone to apply same card */}
        <Descriptions.Item
          label={
            <div className="labelInsideV2">
              Allow Repeat Email or Phone to Apply Same Card
            </div>
          }
        >
          <div className="contentInsideV2">
            {renderCanRepeat(currentCardFocus.can_repeat)}
          </div>
        </Descriptions.Item>

        {/* Ways to obtain bank card */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Ways to Obtain Bank Card</div>}
        >
          <div className="contentInsideV2">
            {renderObtainWay(currentCardFocus.card_detail_obtain_way)}
          </div>
        </Descriptions.Item>

        {/* Country Limit */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Country Limit</div>}
        >
          <div className="contentInsideV2">
            {currentCardFocus.kyc_country_limit}
          </div>
        </Descriptions.Item>

        {/* Unsupported nationality id */}
        <Descriptions.Item
          label={
            <div className="labelInsideV2">Unsupported Nationality Id</div>
          }
        >
          <div className="contentInsideV2">
            {currentCardFocus.kyc_nationality_limit_id}
          </div>
        </Descriptions.Item>

        {/* Card Image */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Card Image</div>}
        >
          <div className="contentInsideV2">
            {/* <Image
              src="/img/newVersion/fronthewe.png"
              style={{ width: "350px" }}
            /> */}

            <Image
              src={
                currentCardFocus.card_type === 1
                  ? FRONT_CARD_VIRTUAL
                  : FRONT_CARD_PHYSIC
              }
              style={{ width: "350px" }}
            />
          </div>
        </Descriptions.Item>

        {/* Card Background */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Card Background</div>}
        >
          <div className="contentInsideV2">
            {/* <Image
              src="/img/newVersion/backhewe.png"
              style={{ width: "350px" }}
            /> */}

            <Image
              src={
                currentCardFocus.card_type === 1
                  ? BACK_CARD_VIRTUAL
                  : BACK_CARD_PHYSIC
              }
              style={{ width: "350px" }}
            />
          </div>
        </Descriptions.Item>

        {/* Minimum Card Fee */}
        {/* <Descriptions.Item
          label={<div className="labelInsideV2">Minimum Card Fee</div>}
        >
          <div className="contentInsideV2">
            {Number(Number(currentCardFocus.card_fee).toFixed(3))}{" "}
            {currentCardFocus.card_coin.toUpperCase()}
          </div>
        </Descriptions.Item> */}

        {/* Actual Card Fee */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Actual Card Fee</div>}
        >
          <div className="contentInsideV2">
            {Number(Number(currentCardFocus.card_fee).toFixed(3))}{" "}
            {currentCardFocus.card_coin.toUpperCase()}
          </div>
        </Descriptions.Item>

        {/* Minimum Deposit Fee */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Minimum Deposit Fee</div>}
        >
          <div className="contentInsideV2">
            {Number(currentCardFocus.recharge_fee).toFixed(3)}{" "}
            {currentCardFocus.card_coin.toUpperCase()}
          </div>
        </Descriptions.Item>

        {/* Deposit Fee */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Deposit Fee</div>}
        >
          <div className="contentInsideV2">
            {Number(currentCardFocus.recharge_fee).toFixed(3)}{" "}
            {currentCardFocus.card_coin.toUpperCase()}
          </div>
        </Descriptions.Item>

        {/* China Postage */}
        <Descriptions.Item
          label={<div className="labelInsideV2">China Postage</div>}
        >
          <div className="contentInsideV2">
            {Number(currentCardFocus.china_postage).toFixed(3)}{" "}
            {currentCardFocus.card_coin.toUpperCase()}
          </div>
        </Descriptions.Item>

        {/* Non-China Postage */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Non-China Postage</div>}
        >
          <div className="contentInsideV2">
            {Number(currentCardFocus.non_china_postage).toFixed(3)}{" "}
            {currentCardFocus.card_coin.toUpperCase()}
          </div>
        </Descriptions.Item>

        {/* Deposit Limit Per-day */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Deposit Limit Per-day</div>}
        >
          <div className="contentInsideV2">
            {Number(Number(currentCardFocus.max_recharge_amount).toFixed(3))}{" "}
            {currentCardFocus.card_coin.toUpperCase()}
          </div>
        </Descriptions.Item>

        {/* Minimum initial deposit amount */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Minimum Initial Deposit</div>}
        >
          <div className="contentInsideV2">
            {Number(
              Number(currentCardFocus.min_first_recharge_amount).toFixed(3)
            )}{" "}
            {currentCardFocus.card_coin.toUpperCase()}
          </div>
        </Descriptions.Item>

        {/* Minimum Deposit Limit */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Minimum Deposit Limit</div>}
        >
          <div className="contentInsideV2">
            {Number(
              Number(currentCardFocus.min_single_recharge_amount).toFixed(3)
            )}{" "}
            {currentCardFocus.card_coin.toUpperCase()}
          </div>
        </Descriptions.Item>

        {/* Maximum Single Deposit Limit */}
        <Descriptions.Item
          label={
            <div className="labelInsideV2">Maximum Single Deposit Limit</div>
          }
        >
          <div className="contentInsideV2">
            {Number(
              Number(currentCardFocus.max_single_recharge_amount).toFixed(3)
            )}{" "}
            {currentCardFocus.card_coin.toUpperCase()}
          </div>
        </Descriptions.Item>

        {/* initial deposit is mandatory */}
        <Descriptions.Item
          label={
            <div className="labelInsideV2">Initial Deposit Is Mandatory</div>
          }
        >
          <div className="contentInsideV2">
            {renderInitalDepositMandatory(currentCardFocus.need_first_recharge)}
          </div>
        </Descriptions.Item>

        {/* Apply Pay Coin */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Apply Pay Coin</div>}
        >
          <div className="contentInsideV2">
            {JSON.parse(currentCardFocus.apply_pay_coin)
              .map((coin) => coin.toUpperCase())
              .join(", ")}
          </div>
        </Descriptions.Item>

        {/* Recharge Pay Coin */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Recharge Pay Coin</div>}
        >
          <div className="contentInsideV2">
            {JSON.parse(currentCardFocus.recharge_pay_coin)
              .map((coin) => coin.toUpperCase())
              .join(", ")}
          </div>
        </Descriptions.Item>

        {/* More actions */}
        <Descriptions.Item
          label={<div className="labelInsideV2">More actions</div>}
        >
          <div className="contentInsideV2">
            {currentCardFocus.support_business
              .split(",")
              .map((businessValue) =>
                renderOperationType(Number(businessValue))
              )
              .join(", ")}
          </div>
        </Descriptions.Item>

        {/* Support Refund */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Support Refund</div>}
        >
          <div className="contentInsideV2">
            {currentCardFocus.support_refund === 1 ? "Yes" : "No"}
          </div>
        </Descriptions.Item>

        {/* support the same user to open multiple cards of the same card type */}
        <Descriptions.Item
          label={
            <div className="labelInsideV2">
              Support The Same User to Open Multiple Cards of The Same Card Type
            </div>
          }
        >
          <div className="contentInsideV2">
            {renderMoreCard(currentCardFocus.more_card)}
          </div>
        </Descriptions.Item>

        {/* AML report */}
        <Descriptions.Item
          label={<div className="labelInsideV2">AML report</div>}
        >
          <div className="contentInsideV2">
            {currentCardFocus.need_aml_report === 0 ? "No need" : "Need"}
          </div>
        </Descriptions.Item>

        {/* Proof of address */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Proof of address</div>}
        >
          <div className="contentInsideV2">
            {currentCardFocus.need_poa === 0 ? "No need" : "Need"}
          </div>
        </Descriptions.Item>

        {/* Support Poa supply Type */}
        <Descriptions.Item
          label={<div className="labelInsideV2">Support Poa Supply Type</div>}
        >
          <div className="contentInsideV2">
            {renderSupportPoaType(currentCardFocus.support_poa_type)}
          </div>
        </Descriptions.Item>
      </>
    );
  };

  useEffect(() => {
    handleGetData();
  }, []);

  // useEffect(() => {
  //   if (!isLogin) {
  //     history.push("/");
  //   }
  // }, [isLogin]);

  if (!isLogin) {
    return null;
  }

  return (
    <div className="containerV2 size-xl">
      <div className="cardManageContainer" ref={domRef}>
        <div className="titleV2">Card Management</div>

        <div className="tableContainerV2 needCenterContent">
          <table>
            <tr>
              <th>Card Type ID</th>
              <th>Card Type</th>
              <th>Card Meterial</th>
              {/* <th>Card Name</th> */}
              <th>Card Image</th>
              <th>Card Assoc</th>
              <th>Activation Fee (USDT)</th>
              <th>Deposit Fee</th>
              <th>Card Curr</th>
              <th>Status</th>
              <th>Operate</th>
            </tr>

            {data.length !== 0 ? (
              renderData
            ) : (
              <tr>
                <td colSpan={10}>
                  {isPendingGetData ? "Loading..." : "No data"}
                </td>
              </tr>
            )}
          </table>
        </div>
      </div>

      <Modal
        title="Card infomation detail"
        open={isOpenModal}
        footer={false}
        width={1000}
        onCancel={() => {
          setIsOpenModal(false);
          setCurrentCardFocus(null);
        }}
      >
        <div
          style={{
            color: "#fff",
            maxHeight: "calc(100vh - 300px)",
            overflowY: "auto",
            padding: "16px",
          }}
        >
          <Descriptions
            className="customAntdDesc"
            bordered
            style={{ color: "#fff" }}
            column={1}
            size={window.innerWidth < 768 ? "small" : "default"}
          >
            {renderDescCard()}
          </Descriptions>
        </div>
      </Modal>

      <Modal
        title="Link to card"
        open={isOpenModalLinked}
        footer={false}
        onCancel={handleCloseModalLinked}
      >
        <div
          style={{
            color: "#fff",
            maxHeight: "calc(100vh - 300px)",
            overflowY: "auto",
            padding: "16px",
          }}
        >
          <div className="linkedCardContainer">
            <div className="item">
              <div className="label">Card no</div>
              <input
                value={formDataLinked.card_no}
                onChange={handleChangeInputField("card_no")}
                className="inputInside"
              />
            </div>

            <div className="item">
              <div className="label">PIN</div>
              <input
                type={togglePwd ? "password" : "text"}
                value={formDataLinked.envelope_no}
                onChange={handleChangeInputField("envelope_no")}
                className="inputInside"
              />

              <i
                className="fa-regular fa-eye eyePwd"
                onClick={() => setTogglePwd(!togglePwd)}
              ></i>
            </div>

            <button
              disabled={isDisabledBtn}
              onClick={handleRequestLinkToCard}
              className="btnInside"
            >
              {isPendingLink ? <Spin /> : "Apply"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
