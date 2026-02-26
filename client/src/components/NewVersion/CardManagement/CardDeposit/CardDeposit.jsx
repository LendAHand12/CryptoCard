import { useFadedIn } from "src/hooks/useFadedIn";
import "./CardDeposit.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { axiosService, DOMAIN } from "src/util/service";
import { useRedirectHomeIfNotLogin } from "src/hooks/useRedirectHomeIfNotLogin";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import queryString from "query-string";
import { message, Spin } from "antd";
import { coinUserWallet } from "src/redux/actions/coin.action";
import { roundDownDecimalValues } from "src/util/common";
import { useTranslation } from "react-i18next";
import { roundedUp } from "src/util/roundNumber";
import { renderPercentRechargeFee } from "src/util/renderPercentRechargeFee";

const calculateAmount = (
  cardCurr,
  priceOfCoinSelected,
  rechargeFee,
  token,
  eur,
  usdt,
  eurToUsdRate
) => {
  if (Number(token) !== 0 && priceOfCoinSelected !== 0) {
    return roundedUp(
      token * priceOfCoinSelected -
        rechargeFee * (cardCurr.toUpperCase() == "eur" ? eurToUsdRate : 1)
    );
  }

  return 0;
};

export const CardDeposit = () => {
  const { search } = useLocation();
  const queryValues = queryString.parse(search);
  const { isLogin } = useRedirectHomeIfNotLogin();
  const { domRef } = useFadedIn();
  const { listCoinRealTime } = useSelector(
    (state) => state.listCoinRealTimeReducer
  );
  const { userWallet } = useSelector((state) => state.coinReducer);
  const [isPendingDeposit, setIsPendingDeposit] = useState(false);
  const [coinSelected, setCoinSelected] = useState("USDT");
  const [formData, setFormData] = useState({
    amountToken: "",
    amountUsdt: "",
    amountEur: "",
  });

  const [focusOnField, setFocusOnField] = useState(null);
  const priceOfCoinSelected = useMemo(
    () =>
      listCoinRealTime
        ? listCoinRealTime.find((coin) => coin.name === coinSelected).price
        : 0,
    [listCoinRealTime]
  );
  const { t } = useTranslation();

  const renderBalanceValue = useMemo(() => {
    if (userWallet?.length === 0) {
      return 0;
    }

    const balanceValue =
      userWallet[`${coinSelected.toLowerCase()}_balance`] || 0;

    return balanceValue;
  }, [coinSelected, userWallet]);

  const dispatch = useDispatch();
  const history = useHistory();

  const { eurToUsdRate } = useSelector((state) => state.globalReducer);
  const rechargeFeePercent = renderPercentRechargeFee(queryValues.rechargeFee);
  const minDepositPlusFee =
    (Number(queryValues.minDeposit) * rechargeFeePercent) / 100 +
    Number(queryValues.minDeposit);
  const minDepositUsdOrEur =
    queryValues.cardCurr?.toUpperCase() === "USD"
      ? minDepositPlusFee
      : roundedUp(minDepositPlusFee / eurToUsdRate);

  const calculateReceivedByUsdt = (amountUsdt) => {
    const num = Number(amountUsdt);
    return roundedUp((num - (num * rechargeFeePercent) / 100) * eurToUsdRate);
  };

  // const amountReceived =
  //   queryValues.cardCurr.toUpperCase() === "USD"
  //     ? formData.amountUsdt
  //     : formData.amountEur;

  const amountReceived =
    queryValues.cardCurr.toUpperCase() === "USD"
      ? formData.amountUsdt
      : calculateReceivedByUsdt(formData.amountUsdt);

  let temp = roundedUp(formData.amountUsdt * eurToUsdRate);

  const isDisabledBtn =
    formData.amountToken === "" ||
    formData.amountUsdt === "" ||
    formData.amountEur === "" ||
    Number(formData.amountToken) === 0 ||
    Number(formData.amountUsdt) === 0 ||
    Number(formData.amountEur) === 0 ||
    renderBalanceValue === 0 ||
    formData.amountToken > renderBalanceValue ||
    formData.amountUsdt < minDepositUsdOrEur ||
    isPendingDeposit;

  const handleResetFieldInputs = () => {
    setFormData({ amountToken: "", amountUsdt: "", amountEur: "" });
  };

  const handleSelectCoin = (coin) => () => {
    setCoinSelected(coin);
    handleResetFieldInputs();
  };

  const calculateUsdtToEur = (amountUsdt) => {
    return roundedUp(Number(amountUsdt) / eurToUsdRate);
  };

  const calculateEurToUsdt = (amountEur) => {
    return roundedUp(Number(amountEur) * eurToUsdRate);
  };

  const calculateEurByUsdt = (amountUsdt) => {
    const num = Number(amountUsdt);
    // return roundedUp((num - (num * rechargeFeePercent) / 100) * eurToUsdRate);

    return roundedUp(num * eurToUsdRate);
  };

  const calculateUsdtByEur = (amountEur) => {
    // return roundedUp(
    //   (100 * amountEur) / eurToUsdRate / (100 - rechargeFeePercent)
    // );

    return roundedUp(Number(amountEur) / eurToUsdRate);
  };

  const calculateTokenByEur = (amountEur) => {
    const amountUsdt = calculateUsdtByEur(amountEur);

    return roundedUp(amountUsdt / priceOfCoinSelected);
  };

  const handleGetWallet = async () => {
    try {
      const res = await axiosService.post("api/user/getWallet");

      const apiResp = res.data.data;
      const result = {};
      for (const [name, value] of Object.entries(apiResp)) {
        let price =
          listCoinRealTime.filter(
            (item) => item.name === name.replace("_balance", "").toUpperCase()
          )[0]?.price ?? 0;
        result[name] = roundDownDecimalValues(value, price);
      }
      if (Object.keys(result)) {
        userWallet.current = result;

        dispatch(coinUserWallet(result));
      }
    } catch (error) {}
  };

  const handleChangeInputField = (field) => (e) => {
    const value = e.target.value;

    if (!listCoinRealTime) {
      return;
    }

    switch (field) {
      case "coin":
        handleChangeInputCoin(field, value);
        break;

      case "usd":
        handleChangeInputUSD(field, value);
        break;

      case "eur":
        handleChangeInputEUR(field, value);
        break;

      default:
        break;
    }
  };

  const isNumberWithDot = (value) => {
    const regex = /^\d+(\.\d*)?$/;

    return regex.test(value);
  };

  const formatNumber = (value) => {
    return Number(Number(value).toFixed(4));
  };

  const handleChangeInputCoin = (field, value) => {
    if (value === "") {
      setFormData({ amountToken: "", amountUsdt: "", amountEur: "" });
      return;
    }

    if (!isNumberWithDot(value)) {
      return;
    }

    const amountUsdt = formatNumber(Number(value) * priceOfCoinSelected);
    const amountEur = calculateEurByUsdt(amountUsdt);

    setFormData({
      amountToken: value,
      amountUsdt: amountUsdt,
      amountEur: amountEur,
    });
  };

  const handleChangeInputUSD = (field, value) => {
    if (value === "") {
      setFormData({ amountToken: "", amountUsdt: "", amountEur: "" });
      return;
    }

    if (!isNumberWithDot(value)) {
      return;
    }

    const amountToken = formatNumber(Number(value) / priceOfCoinSelected);
    const amountEur = calculateEurByUsdt(Number(value));

    setFormData({
      amountUsdt: value,
      amountToken: amountToken,
      amountEur: amountEur,
    });
  };

  const handleChangeInputEUR = (field, value) => {
    if (value === "") {
      setFormData({ amountToken: "", amountUsdt: "", amountEur: "" });
      return;
    }

    if (!isNumberWithDot(value)) {
      return;
    }

    const amountUsdt = calculateUsdtByEur(Number(value));

    const amountToken = formatNumber(Number(amountUsdt) / priceOfCoinSelected);

    setFormData({
      amountEur: value,
      amountUsdt: amountUsdt,
      amountToken: amountToken,
    });
  };

  const handleFocusInput = (field) => () => {
    setFocusOnField(field);
  };

  const handleUpdateFields = () => {
    let amountUsdt;
    let amountEur;
    let amountToken;
    switch (focusOnField) {
      case "coin":
        amountUsdt = formatNumber(
          Number(formData.amountToken) * priceOfCoinSelected
        );
        amountEur = calculateEurByUsdt(amountUsdt);

        setFormData({
          ...formData,
          amountUsdt: amountUsdt,
          amountEur: amountEur,
        });
        break;

      case "usd":
        amountToken = formatNumber(
          Number(formData.amountUsdt) / priceOfCoinSelected
        );
        amountEur = calculateEurByUsdt(formData.amountUsdt);

        setFormData({
          ...formData,
          amountToken: amountToken,
          amountEur: amountEur,
        });
        break;

      case "eur":
        amountUsdt = calculateUsdtByEur(formData.amountEur);
        amountToken = formatNumber(Number(amountUsdt) / priceOfCoinSelected);

        setFormData({
          ...formData,
          amountUsdt: amountUsdt,
          amountToken: amountToken,
        });
        break;

      default:
        break;
    }
  };

  const handleClickMax = (e) => {
    e.stopPropagation();

    setFocusOnField("coin");
    setFormData({
      amountToken: renderBalanceValue,
      amountUsdt: formatNumber(
        Number(renderBalanceValue) * priceOfCoinSelected
      ),
    });
  };

  const handleRequestDeposit = async () => {
    if (isPendingDeposit) return;

    setIsPendingDeposit(true);

    try {
      const res = await axiosService.post("api/visaCard/depositToCard", {
        id: queryValues.id,
        symbol: coinSelected,
        amount: formData.amountToken.toString(),
      });

      await handleGetWallet();
      message.success(res.data.message);
      setIsPendingDeposit(false);
      handleResetFieldInputs();
    } catch (error) {
      setIsPendingDeposit(false);

      // trường hợp người dùng chỉnh sai số minDeposit trên url
      if (
        error?.response?.data?.message.includes(
          "Less than the minimum recharge amount per day"
        )
      ) {
        message.error("Invalid deposit information");
        history.push("/product-v3");
      } else {
        message.error(error?.response?.data?.message);
      }
    }
  };

  const coins = listCoinRealTime
    ? listCoinRealTime.map((coin, idx) => {
        const isSelected = coinSelected === coin.name;

        const NAME_COINS_EXCLUDE = ["BTC", "ETH", "BNB"];

        const handleSelectCoinMdw = () => {
          if (NAME_COINS_EXCLUDE.includes(coin.name)) {
            return;
          }

          handleSelectCoin(coin.name)();
        };

        return (
          <div
            key={idx}
            className={`coin ${isSelected ? "selected" : ""}`}
            onClick={handleSelectCoinMdw}
          >
            <img src={DOMAIN + coin.image} />
            <div>{coin.name}</div>
          </div>
        );
      })
    : null;

  useEffect(() => {
    const regexCheckIsNumberGreaterThan0 =
      /^(?!0*(\.0+)?$)(\d+(\.\d+)?|0*\.\d+)$/;

    if (
      !queryValues.id ||
      queryValues.minDeposit === undefined ||
      queryValues.rechargeFee === undefined ||
      queryValues.cardCurr === undefined
    ) {
      history.push("/my-card-v3");
      return;
    }

    if (!regexCheckIsNumberGreaterThan0.test(queryValues.minDeposit)) {
      history.push("/my-card-v3");
      return;
    }

    if (isNaN(queryValues.rechargeFee)) {
      history.push("/my-card-v3");
      return;
    }
  }, []);

  useEffect(() => {
    if (
      focusOnField &&
      formData.amountToken !== "" &&
      formData.amountUsdt !== "" &&
      formData.amountEur !== "" &&
      priceOfCoinSelected !== 0
    ) {
      handleUpdateFields();
    }
  }, [
    focusOnField,
    formData.amountToken,
    formData.amountUsdt,
    formData.amountEur,
    priceOfCoinSelected,
  ]);

  if (!isLogin || !eurToUsdRate) {
    return null;
  }

  return (
    <div className="containerV2">
      <div className="cardDepositContainer" ref={domRef}>
        <div className="titleV2">{t("depositCard.t1")}</div>

        <div className="formDeposit">
          <div className="sectionCoins">
            <div className="titleInside">{t("depositCard.t2")}</div>

            <div className="coins">{coins}</div>
          </div>

          <div className="sectionDeposit">
            {!listCoinRealTime && (
              <div style={{ color: "#fff", textAlign: "center" }}>
                {t("depositCard.t3")}
              </div>
            )}
            {/* {coinSelected === "HEWE" ? (
              <>{t("maintained")}</>
            ) : ( */}
            {listCoinRealTime && (
              <>
                <div className="walletItem">
                  <div>{t("depositCard.t4")} </div>
                  <div>
                    {renderBalanceValue} {coinSelected}
                  </div>
                </div>

                <div className="rate">
                  1 {coinSelected} = {priceOfCoinSelected} USDT
                </div>

                <div className="item">
                  <div className="label">
                    {t("depositCard.t5").replace("coin", coinSelected)}
                  </div>
                  <div style={{ flex: "1", position: "relative" }}>
                    <input
                      style={{ width: "100%" }}
                      value={formData.amountToken}
                      onChange={handleChangeInputField("coin")}
                      className="inputInside"
                      placeholder={t("depositCard.t6")}
                      onFocus={handleFocusInput("coin")}
                    />

                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                      onClick={handleClickMax}
                    >
                      Max
                    </div>
                  </div>
                </div>

                <div className="item">
                  <div className="label">{t("depositCard.t7")}</div>
                  <input
                    value={formData.amountUsdt}
                    onChange={handleChangeInputField("usd")}
                    className="inputInside"
                    placeholder={t("depositCard.t8")}
                    onFocus={handleFocusInput("usd")}
                  />
                </div>

                <div className="item">
                  <div className="label">
                    {t("depositCard.t7").replace("USDT", "EUR")}
                  </div>
                  <input
                    value={formData.amountEur}
                    onChange={handleChangeInputField("eur")}
                    // readOnly
                    // value={temp}
                    className="inputInside"
                    placeholder={t("depositCard.t8").replace("USDT", "EUR")}
                    onFocus={handleFocusInput("eur")}
                  />
                </div>

                <div className="item">
                  <div className="label">
                    {/* {t("depositCard.t7").replace("USDT", "EUR")} */}
                    Card received
                  </div>
                  <input value={amountReceived} className="inputInside" />
                </div>

                <div style={{ color: "#f4e096", fontStyle: "italic" }}>
                  *{t("depositCard.t10")} {minDepositPlusFee}{" "}
                  {queryValues.cardCurr?.toUpperCase()}{" "}
                  {queryValues.cardCurr?.toUpperCase() === "EUR" ? (
                    <>
                      ({roundedUp(Number(minDepositPlusFee) / eurToUsdRate)}{" "}
                      USDT)
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <div style={{ color: "#f4e096", fontStyle: "italic" }}>
                  *{t("depositCard.t11")}{" "}
                  {renderPercentRechargeFee(queryValues.rechargeFee)} %
                </div>

                <button
                  onClick={handleRequestDeposit}
                  className="btnDeposit"
                  disabled={isDisabledBtn}
                >
                  {isPendingDeposit ? <Spin /> : t("depositCard.t9")}
                </button>
              </>
            )}
            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  );
};
