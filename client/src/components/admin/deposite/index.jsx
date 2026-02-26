import { Input, Pagination, Spin } from "antd";
import css from "./deposite.module.scss";
import React, { useEffect } from "react";
import { Button } from "src/components/Common/Button";
import { EmptyCustom } from "src/components/Common/Empty";
import { useState, useRef } from "react";
import { adminPermision, api_status } from "src/constant";
import {
  getHistoryDepositAdmin,
  getHistoryDepositAdminAllExcel,
} from "src/util/adminCallApi";
import {
  analysisAdminPermision,
  exportExcel,
  formatNumber,
  shortenHash,
} from "src/util/common";
import {
  availableLanguage,
  availableLanguageCodeMapper,
} from "src/translation/i18n";
import CopyButton from "src/components/Common/copy-button";
import NoPermision from "../no-permision";
import { getAdminPermision } from "src/redux/reducers/admin-permision.slice";
import { adminFunction } from "../sidebar";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { axiosService } from "src/util/service";

function Deposite() {
  const history = useHistory();

  // phần kiểm tra quyền của admin
  const { permision } = useSelector(getAdminPermision);
  const currentPagePermision = analysisAdminPermision(
    adminFunction.deposit,
    permision
  );

  // phần phân trang
  const [toggleSearch, setToggleSearch] = useState(false);
  const [keyWork, setKeyWork] = useState("");
  const [page, setPage] = useState(1);
  const [totalItem, setTotalItem] = useState(1);
  const limit = useRef(10);
  const pageChangeHandle = function (page) {
    // fetApiGetHistoryDepositAdmin(page);
    setPage(page);
  };

  const handleChangeSearch = (e) => {
    setKeyWork(e.target.value);
  };

  const handleClickSearch = () => {
    setPage(1);
    setToggleSearch(!toggleSearch);
  };

  const getHistoryDepositAdminBySearch = function ({ limit, page, keyWork }) {
    
    try {
      if (keyWork.trim() !== "") {
        return axiosService.post("api/adminv2/sreachDepositToAdmin", {
          limit,
          page,
          keyWork,
        });
      } else {
        return axiosService.post("api/adminv2/getHistoryDepositAdmin", {
          limit,
          page,
        });
      }
    } catch (error) {}
  };

  // phần main data
  const [mainData, setMainData] = useState();
  const [loadMainDataStatus, setLoadMainDataStatus] = useState(
    api_status.pending
  );
  const fetApiGetHistoryDepositAdmin = async function (page = 1, keyWork = "") {
    try {
      if (loadMainDataStatus === api_status.fetching) return;
      setLoadMainDataStatus(() => api_status.fetching);
      const resp = await getHistoryDepositAdminBySearch({
        limit: limit.current,
        page,
        keyWork: keyWork,
      });
      const { array, total } = resp.data.data;
      setMainData(() => array);
      setTotalItem(() => total);
      setLoadMainDataStatus(() => api_status.fulfilled);
      setPage(() => page);
      return { array, total };
    } catch (error) {
      setLoadMainDataStatus(() => api_status.rejected);
    }
  };

  const navigateUserDetail = (userId) => () => {
    history.push(`/admin/user-detail/${userId}`);
  };

  // phần render table
  const renderTable = function () {
    if (!mainData || mainData.length <= 0) return;
    return mainData.map((item, index) => (
      <tr key={index}>
        <td>{item.coin_key}</td>
        <td>{item.created_at}</td>
        <td>{item.message}</td>
        <td>{formatNumber(item.amount, availableLanguage.en, -1)}</td>
        <td>
          {item.hash && (
            <div className="d-flex alignItem-c gap-1">
              {shortenHash(item.hash)}
              <CopyButton value={item.hash} />
            </div>
          )}
        </td>
        <td>
          {item.address && (
            <div className="d-flex alignItem-c gap-1">
              <span onClick={navigateUserDetail(item.user_id)}>
                {shortenHash(item.address)}
              </span>
              <CopyButton value={item.address} />
            </div>
          )}
        </td>
        <td onClick={navigateUserDetail(item.user_id)}>{item.userName}</td>
        <td onClick={navigateUserDetail(item.user_id)}>{item.email}</td>
        <td>{item.before_amount}</td>
        <td>{item.after_amount}</td>
        <td>{item.price}</td>
      </tr>
    ));
  };
  const renderClassSpinComponent = function () {
    return loadMainDataStatus === api_status.fetching ? "" : "--d-none";
  };
  const renderClassEmptyComponent = function () {
    return loadMainDataStatus !== api_status.fetching &&
      (!mainData || mainData.length <= 0)
      ? ""
      : "--d-none";
  };
  const renderClassDataTable = function () {
    return loadMainDataStatus !== api_status.fetching &&
      mainData &&
      mainData.length > 0
      ? ""
      : "--d-none";
  };

  // phần xuất excel
  const [callApiExcelStatus, setCallApiExcelStatus] = useState(
    api_status.pending
  );
  const fetchTransferExcel = async function () {
    try {
      const resp = await getHistoryDepositAdminAllExcel();

      const newData = resp.data.data.map((d) => ({
        ...d,
        created_at: new Date(d.created_at * 1000).toLocaleString("vi-VN"),
      }));
      // return resp.data.data;

      return newData;
    } catch (error) {
      throw error;
    }
  };
  const exportExcelClickHandle = async function () {
    try {
      if (callApiExcelStatus === api_status.fetching) return;
      setCallApiExcelStatus(() => api_status.fetching);
      const resp = await fetchTransferExcel();
      await exportExcel(resp, "Transfer", "Transfer");
      setCallApiExcelStatus(() => api_status.fulfilled);
    } catch (error) {
      setCallApiExcelStatus(() => api_status.rejected);
    }
  };

  // useEffect
  useEffect(() => {
    fetApiGetHistoryDepositAdmin(page, keyWork);
  }, [page, toggleSearch]);

  if (currentPagePermision === adminPermision.noPermision) {
    return <NoPermision />;
  }

  return (
    <div className={css["deposit"]}>
      <div className={css["deposit__header"]}>
        <div className={css["deposit__title"]}>Deposit</div>
        <div
          style={{
            marginBottom: "8px",
            marginTop: "8px",

            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <Input
              style={{ maxWidth: "350px" }}
              placeholder="Search..."
              onChange={handleChangeSearch}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f4e096",
                color: "#000",
                borderRadius: "8px",
                cursor: "pointer",
                padding: "0 16px",
              }}
              onClick={handleClickSearch}
            >
              <i class="fa-solid fa-magnifying-glass"></i>
            </div>
          </div>
        </div>
        <div className={`row ${css["deposit__filter"]}`}>
          <div className={`col-md-12 col-6 pl-0`}>
            <Button
              loading={callApiExcelStatus === api_status.fetching}
              onClick={exportExcelClickHandle}
            >
              <i className="fa-solid fa-download"></i>
              Export Excel
            </Button>
          </div>
          <div className={`col-md-12 col-6 ${css["deposit__paging"]}`}>
            <Pagination
              current={page}
              onChange={pageChangeHandle}
              total={totalItem}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
      <div className={css["deposit__content"]}>
        <table>
          <thead>
            <tr>
              <th>Coin Key</th>
              <th>Create At</th>
              <th>Message</th>
              <th>Amount</th>
              <th>Hash</th>
              <th>Address</th>
              <th>UserName</th>
              <th>Email</th>
              <th>Amount Before</th>
              <th>Amount After</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody className={renderClassDataTable()}>{renderTable()}</tbody>
          <tbody className={renderClassSpinComponent()}>
            <tr>
              <td colSpan={8}>
                <div className="spin-container">
                  <Spin />
                </div>
              </td>
            </tr>
          </tbody>
          <tbody className={renderClassEmptyComponent()}>
            <tr>
              <td colSpan={8}>
                <div className="spin-container">
                  <EmptyCustom />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Deposite;
