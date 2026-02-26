import { Button, Input, InputNumber, message, Spin } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { adminPermision, api_status, commontString } from "src/constant";
import { getConfigAdmin, updateConfigAdmin } from "src/util/adminCallApi";
import Row from "./row";
import NoPermision from "../no-permision";
import { getAdminPermision } from "src/redux/reducers/admin-permision.slice";
import { useDispatch, useSelector } from "react-redux";
import { analysisAdminPermision } from "src/util/common";
import { adminFunction } from "../sidebar";
import { callToastError } from "src/function/toast/callToast";
import { axiosService } from "src/util/service";
import { useConfigFee } from "./hooks/useConfigFee";
import { useConfigDepositFee } from "./hooks/useConfigDepositFee";
import { renderFrontCardImgByCardApplyType } from "src/util/renderCardImg";
import { useConfigCommisionCreateCard } from "./hooks/useConfigCommisionCreateCard";
import { useConfigCommisionDeposit } from "./hooks/useConfigCommisionDeposit";
import { usePermissionAdmin } from "src/hooks/usePermissionAdmin";

function ConfigData() {
  // phần kiểm tra quyền của admin
  const { permision } = useSelector(getAdminPermision);
  const currentPagePermision = analysisAdminPermision(
    adminFunction.config,
    permision
  );

  const [loadMainDataStatus, setLoadMainDataStatus] = useState(
    api_status.pending
  );
  const [mainData, setMainData] = useState([]);
  const [rateEUR, setRateEUR] = useState(null);
  const [isPendingUpdateRate, setIsPendingUpdateRate] = useState(false);
  const { eurToUsdRate } = useSelector((state) => state.globalReducer);
  const dispatch = useDispatch();

  const { isOnlyView } = usePermissionAdmin(adminFunction.config);

  const {
    isLoading: isLoadingConfigCommissionCreateCard,
    data: dataConfigCommissionCreateCard,
    handleChangeInput: handleChangeInputConfigCommissionCreateCard,
    handleRequestUpdateData: handleRequestUpdateDataConfigCommissionCreateCard,
  } = useConfigCommisionCreateCard();
  const {
    isLoading: isLoadingConfigCommissionDeposit,
    data: dataConfigCommissionDeposit,
    handleChangeInput: handleChangeInputConfigCommissionDeposit,
    handleRequestUpdateData: handleRequestUpdateDataConfigCommissionDeposit,
  } = useConfigCommisionDeposit();

  const handleChangeRateEUR = (value) => {
    setRateEUR(value);
  };

  const handleRequestUpdateRate = async (value) => {
    if (isPendingUpdateRate) return;

    setIsPendingUpdateRate(true);
    try {
      const res = await axiosService.post("api/p2pBank/updateConfig", {
        name: "EURTOUSD",
        value: rateEUR,
      });

      setIsPendingUpdateRate(false);
      message.success("Success");
    } catch (error) {
      message.error(error.response.data.message);
      setIsPendingUpdateRate(false);
    }
  };

  useEffect(() => {
    if (!rateEUR && eurToUsdRate !== 0) {
      setRateEUR(eurToUsdRate);
    }
  }, [eurToUsdRate]);

  const listKey = useRef([
    "privateKeyBNB",
    "addressBNB",
    "addressUSDT",
    "privateKeyTransferUSDT",
    "addressTransferUSDT",
  ]);

  const renderClassShowMainData = function () {
    return loadMainDataStatus === api_status.fetching ? "--d-none" : "";
  };
  const renderClassSpinTable = function () {
    return loadMainDataStatus === api_status.fetching ? "" : "--d-none";
  };
  const fetchApiLoadMainData = function () {
    return new Promise((resolve, reject) => {
      if (loadMainDataStatus === api_status.fetching) resolve(true);
      setLoadMainDataStatus(() => api_status.fetching);
      getConfigAdmin()
        .then((resp) => {
          const listData = resp.data.data.filter(
            (item) =>
              item.name === listKey.current.at(0) ||
              item.name === listKey.current.at(1) ||
              item.name === listKey.current.at(2) ||
              item.name === listKey.current.at(3) ||
              item.name === listKey.current.at(4)
          );
          const result = listData.map((item) => ({
            ...item,
            ["fetching"]: false,
          }));
          setMainData(() => result);
          setLoadMainDataStatus(() => api_status.fulfilled);
        })
        .catch(() => {
          setLoadMainDataStatus(() => api_status.rejected);
        });
    });
  };
  const renderTable = function () {
    if (!mainData || mainData.length <= 0) return;
    return mainData.map((item) => (
      <Row key={item.name} name={item.name} note={item.note} />
    ));
  };

  // config fee
  const {
    feeValue: feeValue1,
    note: note1,
    isPendingConfigFee: isPendingConfigFee1,
    handleRequestConfigFee: handleRequestConfigFee1,
    handleChangeFeeValue: handleChangeFeeValue1,
  } = useConfigFee({ applyType: "1" });
  const {
    feeValue: feeValue2,
    note: note2,
    isPendingConfigFee: isPendingConfigFee2,
    handleRequestConfigFee: handleRequestConfigFee2,
    handleChangeFeeValue: handleChangeFeeValue2,
  } = useConfigFee({ applyType: "2" });
  const {
    feeValue: feeValue3,
    note: note3,
    isPendingConfigFee: isPendingConfigFee3,
    handleRequestConfigFee: handleRequestConfigFee3,
    handleChangeFeeValue: handleChangeFeeValue3,
  } = useConfigFee({ applyType: "3" });
  const {
    feeValue: feeValue4,
    note: note4,
    isPendingConfigFee: isPendingConfigFee4,
    handleRequestConfigFee: handleRequestConfigFee4,
    handleChangeFeeValue: handleChangeFeeValue4,
  } = useConfigFee({ applyType: "4" });
  const {
    feeValue: feeValue5,
    note: note5,
    isPendingConfigFee: isPendingConfigFee5,
    handleRequestConfigFee: handleRequestConfigFee5,
    handleChangeFeeValue: handleChangeFeeValue5,
  } = useConfigFee({ applyType: "5" });

  // config deposit fee
  const {
    feeValue: feeValueDeposit1,
    note: noteDeposit1,
    isPendingConfigFee: isPendingConfigFeeDeposit1,
    handleRequestConfigFee: handleRequestConfigFeeDeposit1,
    handleChangeFeeValue: handleChangeFeeValueDeposit1,
  } = useConfigDepositFee({ applyType: "1" });
  const {
    feeValue: feeValueDeposit2,
    note: noteDeposit2,
    isPendingConfigFee: isPendingConfigFeeDeposit2,
    handleRequestConfigFee: handleRequestConfigFeeDeposit2,
    handleChangeFeeValue: handleChangeFeeValueDeposit2,
  } = useConfigDepositFee({ applyType: "2" });
  const {
    feeValue: feeValueDeposit3,
    note: noteDeposit3,
    isPendingConfigFee: isPendingConfigFeeDeposit3,
    handleRequestConfigFee: handleRequestConfigFeeDeposit3,
    handleChangeFeeValue: handleChangeFeeValueDeposit3,
  } = useConfigDepositFee({ applyType: "3" });
  const {
    feeValue: feeValueDeposit4,
    note: noteDeposit4,
    isPendingConfigFee: isPendingConfigFeeDeposit4,
    handleRequestConfigFee: handleRequestConfigFeeDeposit4,
    handleChangeFeeValue: handleChangeFeeValueDeposit4,
  } = useConfigDepositFee({ applyType: "4" });
  const {
    feeValue: feeValueDeposit5,
    note: noteDeposit5,
    isPendingConfigFee: isPendingConfigFeeDeposit5,
    handleRequestConfigFee: handleRequestConfigFeeDeposit5,
    handleChangeFeeValue: handleChangeFeeValueDeposit5,
  } = useConfigDepositFee({ applyType: "5" });

  const renderFeeDepositConfigEl = (applyType) => {
    switch (applyType) {
      case 1:
        return (
          <div style={{ marginBottom: "12px" }}>
            <div style={{ marginBottom: "4px" }}>Fee deposit</div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <InputNumber
                style={{ maxWidth: "350px", width: "100%" }}
                value={feeValueDeposit1}
                onChange={handleChangeFeeValueDeposit1}
              />
              {/* <Button onClick={handleRequestConfigFeeDeposit1}>Update</Button> */}
              {!isOnlyView && (
                <Button onClick={handleRequestConfigFeeDeposit1}>Update</Button>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div style={{ marginBottom: "12px" }}>
            <div style={{ marginBottom: "4px" }}>Fee deposit</div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <InputNumber
                style={{ maxWidth: "350px", width: "100%" }}
                value={feeValueDeposit2}
                onChange={handleChangeFeeValueDeposit2}
              />
              {/* <Button onClick={handleRequestConfigFeeDeposit2}>Update</Button> */}
              {!isOnlyView && (
                <Button onClick={handleRequestConfigFeeDeposit2}>Update</Button>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div style={{ marginBottom: "12px" }}>
            <div style={{ marginBottom: "4px" }}>Fee deposit</div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <InputNumber
                style={{ maxWidth: "350px", width: "100%" }}
                value={feeValueDeposit3}
                onChange={handleChangeFeeValueDeposit3}
              />
              {/* <Button onClick={handleRequestConfigFeeDeposit3}>Update</Button> */}
              {!isOnlyView && (
                <Button onClick={handleRequestConfigFeeDeposit3}>Update</Button>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div style={{ marginBottom: "12px" }}>
            <div style={{ marginBottom: "4px" }}>Fee deposit</div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <InputNumber
                style={{ maxWidth: "350px", width: "100%" }}
                value={feeValueDeposit4}
                onChange={handleChangeFeeValueDeposit4}
              />
              {/* <Button onClick={handleRequestConfigFeeDeposit4}>Update</Button> */}
              {!isOnlyView && (
                <Button onClick={handleRequestConfigFeeDeposit4}>Update</Button>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div style={{ marginBottom: "12px" }}>
            <div style={{ marginBottom: "4px" }}>Fee deposit</div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <InputNumber
                style={{ maxWidth: "350px", width: "100%" }}
                value={feeValueDeposit5}
                onChange={handleChangeFeeValueDeposit5}
              />
              {/* <Button onClick={handleRequestConfigFeeDeposit5}>Update</Button> */}
              {!isOnlyView && (
                <Button onClick={handleRequestConfigFeeDeposit5}>Update</Button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderFeeCardConfigEl = (applyType) => {
    switch (applyType) {
      case 1:
        return (
          <div style={{ marginBottom: "12px" }}>
            <div style={{ marginBottom: "4px" }}>Fee create card</div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <InputNumber
                style={{ maxWidth: "350px", width: "100%" }}
                value={feeValue1}
                onChange={handleChangeFeeValue1}
              />
              {/* <Button onClick={handleRequestConfigFee1}>Update</Button> */}
              {!isOnlyView && (
                <Button onClick={handleRequestConfigFee1}>Update</Button>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div style={{ marginBottom: "12px" }}>
            <div style={{ marginBottom: "4px" }}>Fee create card</div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <InputNumber
                style={{ maxWidth: "350px", width: "100%" }}
                value={feeValue2}
                onChange={handleChangeFeeValue2}
              />
              {/* <Button onClick={handleRequestConfigFee2}>Update</Button> */}
              {!isOnlyView && (
                <Button onClick={handleRequestConfigFee2}>Update</Button>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div style={{ marginBottom: "12px" }}>
            <div style={{ marginBottom: "4px" }}>Fee create card</div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <InputNumber
                style={{ maxWidth: "350px", width: "100%" }}
                value={feeValue3}
                onChange={handleChangeFeeValue3}
              />
              {/* <Button onClick={handleRequestConfigFee3}>Update</Button> */}
              {!isOnlyView && (
                <Button onClick={handleRequestConfigFee3}>Update</Button>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div style={{ marginBottom: "12px" }}>
            <div style={{ marginBottom: "4px" }}>Fee create card</div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <InputNumber
                style={{ maxWidth: "350px", width: "100%" }}
                value={feeValue4}
                onChange={handleChangeFeeValue4}
              />
              {/* <Button onClick={handleRequestConfigFee4}>Update</Button> */}
              {!isOnlyView && (
                <Button onClick={handleRequestConfigFee4}>Update</Button>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div style={{ marginBottom: "12px" }}>
            <div style={{ marginBottom: "4px" }}>Fee create card</div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <InputNumber
                style={{ maxWidth: "350px", width: "100%" }}
                value={feeValue5}
                onChange={handleChangeFeeValue5}
              />
              {/* <Button onClick={handleRequestConfigFee5}>Update</Button> */}
              {!isOnlyView && (
                <Button onClick={handleRequestConfigFee5}>Update</Button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    fetchApiLoadMainData();
  }, []);

  if (currentPagePermision === adminPermision.noPermision) {
    return <NoPermision />;
  }

  return (
    <div className="configData">
      <div className="configData__header">
        <div className="configData__title">Config data</div>
      </div>
      <div className="configData__content">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Note</th>
              {currentPagePermision === adminPermision.edit && <th>Action</th>}
            </tr>
          </thead>
          <tbody className={renderClassShowMainData()}>{renderTable()}</tbody>
          <tbody className={renderClassSpinTable()}>
            <tr>
              <td colSpan={3}>
                <div className="spin-container">
                  <Spin />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* CONFIG RATE USD/EUR */}
      <div style={{ marginTop: "24px" }}>
        <div style={{ fontWeight: "500", marginBottom: "8px" }}>
          CONFIG EUR/USD
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <InputNumber
            style={{ maxWidth: "350px", width: "100%" }}
            value={rateEUR}
            onChange={handleChangeRateEUR}
          />
          {/* <Button onClick={handleRequestUpdateRate}>Update</Button> */}
          {!isOnlyView && (
            <Button onClick={handleRequestUpdateRate}>Update</Button>
          )}
        </div>
      </div>

      {/* CONFIG COMMISION CREATE CARD  */}
      <div style={{ marginTop: "24px" }}>
        <div style={{ fontWeight: "500", marginBottom: "8px" }}>
          CONFIG COMMISSION CREATE CARD (%)
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <InputNumber
            style={{ maxWidth: "350px", width: "100%" }}
            value={dataConfigCommissionCreateCard}
            onChange={handleChangeInputConfigCommissionCreateCard}
          />
          {/* <Button onClick={handleRequestUpdateDataConfigCommissionCreateCard}>
            Update
          </Button> */}
          {!isOnlyView && (
            <Button onClick={handleRequestUpdateDataConfigCommissionCreateCard}>
              Update
            </Button>
          )}
        </div>
      </div>

      {/* CONFIG COMMISSION DEPOSIT */}
      <div style={{ marginTop: "24px" }}>
        <div style={{ fontWeight: "500", marginBottom: "8px" }}>
          CONFIG COMMISSION DEPOSIT (%)
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <InputNumber
            style={{ maxWidth: "350px", width: "100%" }}
            value={dataConfigCommissionDeposit}
            onChange={handleChangeInputConfigCommissionDeposit}
          />
          {/* <Button onClick={handleRequestUpdateDataConfigCommissionDeposit}>
            Update
          </Button> */}
          {!isOnlyView && (
            <Button onClick={handleRequestUpdateDataConfigCommissionDeposit}>
              Update
            </Button>
          )}
        </div>
      </div>

      {/* CONFIG FEE */}
      <div style={{ marginTop: "48px" }}>
        <div style={{ fontWeight: "500", marginBottom: "8px" }}>CONFIG FEE</div>

        <div style={{ marginTop: "24px" }}>
          <div style={{ color: "#f4e096", fontStyle: "italic" }}>*{note1}</div>
          <img
            src={renderFrontCardImgByCardApplyType(1)}
            style={{ width: "200px", marginBottom: "8px" }}
          />

          {renderFeeCardConfigEl(1)}
          {renderFeeDepositConfigEl(1)}
        </div>

        <div style={{ marginTop: "48px" }}>
          <div style={{ color: "#f4e096", fontStyle: "italic" }}>*{note2}</div>
          <img
            src={renderFrontCardImgByCardApplyType(2)}
            style={{ width: "200px", marginBottom: "8px" }}
          />

          {renderFeeCardConfigEl(2)}
          {renderFeeDepositConfigEl(2)}
        </div>

        <div style={{ marginTop: "48px" }}>
          <div style={{ color: "#f4e096", fontStyle: "italic" }}>*{note3}</div>
          <img
            src={renderFrontCardImgByCardApplyType(3)}
            style={{ width: "200px", marginBottom: "8px" }}
          />

          {renderFeeCardConfigEl(3)}
          {renderFeeDepositConfigEl(3)}
        </div>

        <div style={{ marginTop: "48px" }}>
          <div style={{ color: "#f4e096", fontStyle: "italic" }}>*{note4}</div>
          <img
            src={renderFrontCardImgByCardApplyType(4)}
            style={{ width: "200px", marginBottom: "8px" }}
          />

          {renderFeeCardConfigEl(4)}
          {renderFeeDepositConfigEl(4)}
        </div>

        <div style={{ marginTop: "48px" }}>
          <div style={{ color: "#f4e096", fontStyle: "italic" }}>*{note5}</div>
          <img
            src={renderFrontCardImgByCardApplyType(5)}
            style={{ width: "200px", marginBottom: "8px" }}
          />

          {renderFeeCardConfigEl(5)}
          {renderFeeDepositConfigEl(5)}
        </div>
      </div>
    </div>
  );
}

export default ConfigData;
