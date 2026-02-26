import React, { useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { api_status, url } from "src/constant";
import { callToastSuccess } from "src/function/toast/callToast";
import useLogout from "src/hooks/logout";
import useAsync from "src/hooks/call-api";
import { checkAdmin } from "src/util/adminCallApi";
import {
  getReloadSideBar,
  setAdminPermision,
  setAuthenticationStatus,
} from "src/redux/reducers/admin-permision.slice";
import { useState } from "react";

export const adminFunction = {
  user: "user",
  // ads: "ads",
  // exchange: "exchange",
  // widthdraw: "widthdraw",
  config: "config",
  // transfer: "transfer",
  // swap: "swap",
  deposit: "deposit",
  // p2p: "p2p",
  admin: "admin",

  // new
  card: "card",
  commission: "commission",
  registerCard: "registerCard",
  buyToken: "buyToken",
  updateWallet: "updateWallet",
  heweDB: "heweDB",
  depositCard: "depositCard",
};

function Sidebar() {
  const history = useHistory();
  const location = useLocation();
  const logoutAction = useLogout();
  const dispatch = useDispatch();
  const isLoaded = useRef(false);
  const reloadSideBar = useSelector(getReloadSideBar);

  // phần hiển thị chức năng theo quyền của admin
  const [showFunction, setShowFunction] = useState({});
  const setShowFunctionState = (name, data) => {
    setShowFunction((state) => {
      return {
        ...state,
        [name]: data,
      };
    });
  };
  const fetchCheckAdmin = async () => {
    return await checkAdmin();
  };
  const [checkAdminData, , checkAdminStatus] = useAsync(fetchCheckAdmin);
  useEffect(() => {
    if (checkAdminStatus === api_status.rejected) {
      dispatch(setAuthenticationStatus(false));
    }
    if (checkAdminStatus === api_status.fulfilled && !isLoaded.current) {
      isLoaded.current = true;
      const respData = checkAdminData?.data?.data;
      dispatch(setAdminPermision(respData));
      const {
        user,
        ads,
        exchange,
        widthdraw,
        config,
        transfer,
        swap,
        deposit,
        p2p,
        admin,
        card,
        commission,
        registerCard,
        buyToken,
        updateWallet,
        heweDB,
        depositCard,
      } = respData;
      setShowFunctionState(adminFunction.user, user);
      setShowFunctionState(adminFunction.config, config);
      setShowFunctionState(adminFunction.ads, ads);
      setShowFunctionState(adminFunction.exchange, exchange);
      setShowFunctionState(adminFunction.config, config);
      setShowFunctionState(adminFunction.transfer, transfer);
      setShowFunctionState(adminFunction.swap, swap);
      setShowFunctionState(adminFunction.deposit, deposit);
      setShowFunctionState(adminFunction.p2p, p2p);
      setShowFunctionState(adminFunction.widthdraw, widthdraw);
      setShowFunctionState(adminFunction.admin, admin);
      setShowFunctionState(adminFunction.card, card);
      setShowFunctionState(adminFunction.commission, commission);
      setShowFunctionState(adminFunction.registerCard, registerCard);
      setShowFunctionState(adminFunction.heweDB, heweDB);
      setShowFunctionState(adminFunction.buyToken, buyToken);
      setShowFunctionState(adminFunction.updateWallet, updateWallet);
      setShowFunctionState(adminFunction.depositCard, depositCard);
    }
  }, [checkAdminData, checkAdminStatus]);

  // phần chuyển trang
  const redirectPage = (page) => {
    history.push(page);
  };

  // setactive cho item
  const setActive = (page) => {
    const arrayPathname = location.pathname.split("/");

    if (page === url.user) {
      if (
        arrayPathname?.at(-1) === "user" ||
        arrayPathname?.at(-2) === "user-detail"
      ) {
        return "active";
      } else return "";
    } else if (page !== url.user) {
      if (location.pathname === page) return "active";
      else return "";
    }
  };

  const logout = () => {
    logoutAction();
    history.push(url.home);
    callToastSuccess("Logged out");
  };

  return (
    <div key={reloadSideBar} className="admin-sidebar show">
      <ul>
        {showFunction[adminFunction.user] === 1 && (
          <li
            className={setActive(url.user)}
            onClick={redirectPage.bind(null, url.admin_user)}
          >
            <span className="admin-sidebar__icon">
              <i className="fa-solid fa-user"></i>
            </span>
            <span className="admin-sidebar__item">Users</span>
          </li>
        )}
        {/*<li onClick={redirectKyc} id="kyc">*/}
        {/*  <span className="admin-sidebar__icon">*/}
        {/*    <i className="fa-solid fa-user-shield"></i>*/}
        {/*  </span>*/}
        {/*  <span className="admin-sidebar__item">KYC</span>*/}
        {/*</li>*/}
        {/* {
          showFunction[adminFunction.config] === 1 && <li className={setActive(url.admin_exchangeRateDisparity)} onClick={redirectPage.bind(null, url.admin_exchangeRateDisparity)}>
            <span className="admin-sidebar__icon">
              <i className="fa-solid fa-percent"></i>
            </span>
            <span className="admin-sidebar__item">Exchange Rate Disparity</span>
          </li>
        } */}
        {/* {
          showFunction[adminFunction.ads] === 1 && <li className={setActive(url.admin_ads)} onClick={redirectPage.bind(null, url.admin_ads)}>
            <span className="admin-sidebar__icon">
              <i className="fa-solid fa-rectangle-ad"></i>
            </span>
            <span className="admin-sidebar__item">Advertise</span>
          </li>
        } */}
        {/* {
          showFunction[adminFunction.exchange] === 1 && <li className={setActive(url.admin_exchange)} onClick={redirectPage.bind(null, url.admin_exchange)}>
            <span className="admin-sidebar__icon">
              <i className="fa-solid fa-money-bill-transfer"></i>
            </span>
            <span className="admin-sidebar__item">Exchange</span>
          </li>
        } */}
        {/* {showFunction[adminFunction.widthdraw] === 1 && (
          <li
            className={setActive(url.admin_widthdraw)}
            onClick={redirectPage.bind(null, url.admin_widthdraw)}
          >
            <span className="admin-sidebar__icon">
              <i className="fa-solid fa-money-bill"></i>
            </span>
            <span className="admin-sidebar__item">Widthdraw</span>
          </li>
        )} */}
        {showFunction[adminFunction.config] === 1 && (
          <li
            className={setActive(url.admin_configData)}
            onClick={redirectPage.bind(null, url.admin_configData)}
          >
            <span className="admin-sidebar__icon">
              <i className="fa-solid fa-database"></i>
            </span>
            <span className="admin-sidebar__item">Config Data</span>
          </li>
        )}
        {/* {
          showFunction[adminFunction.transfer] === 1 && <li className={setActive(url.admin_transfer)} onClick={redirectPage.bind(null, url.admin_transfer)}>
            <span className="admin-sidebar__icon">
              <i className="fa-solid fa-arrow-right-arrow-left"></i>
            </span>
            <span className="admin-sidebar__item">Transfer</span>
          </li> */}

        {/* {
          showFunction[adminFunction.swap] === 1 && <li className={setActive(url.admin_swap)} onClick={redirectPage.bind(null, url.admin_swap)}>
            <span className="admin-sidebar__icon">
              <i className="fa-solid fa-rotate"></i>
            </span>
            <span className="admin-sidebar__item">Swap</span>
          </li>
        } */}
        {showFunction[adminFunction.deposit] === 1 && (
          <li
            className={setActive(url.admin_deposit)}
            onClick={redirectPage.bind(null, url.admin_deposit)}
          >
            <span className="admin-sidebar__icon">
              <i className="fa-solid fa-file-invoice"></i>
            </span>
            <span className="admin-sidebar__item">Deposit</span>
          </li>
        )}
        {/* {
          showFunction[adminFunction.p2p] === 1 && <li className={setActive(url.admin_p2p)} onClick={redirectPage.bind(null, url.admin_p2p)}>
            <span className="admin-sidebar__icon">
              <i className="fa-solid fa-file-lines"></i>
            </span>
            <span className="admin-sidebar__item">P2P</span>
          </li>
        } */}
        {showFunction[adminFunction.admin] === 1 && (
          <li
            className={setActive(url.admin_adminManagement)}
            onClick={redirectPage.bind(null, url.admin_adminManagement)}
          >
            <span className="admin-sidebar__icon">
              <i className="fa-solid fa-user-tie"></i>
            </span>
            <span className="admin-sidebar__item">Admin</span>
          </li>
        )}

        {showFunction[adminFunction.card] === 1 && (
          <li
            className={setActive(url.admin_card)}
            onClick={redirectPage.bind(null, url.admin_card)}
          >
            <span className="admin-sidebar__icon">
              <i className="fa-solid fa-user-tie"></i>
            </span>
            <span className="admin-sidebar__item">Card</span>
          </li>
        )}

        {showFunction[adminFunction.commission] === 1 && (
          <li
            className={setActive(url.admin_commission)}
            onClick={redirectPage.bind(null, url.admin_commission)}
          >
            <span className="admin-sidebar__icon">
              <i class="fa-solid fa-hand-holding-dollar"></i>
            </span>
            <span className="admin-sidebar__item">Commission</span>
          </li>
        )}

        {showFunction[adminFunction.registerCard] === 1 && (
          <li
            className={setActive(url.admin_registerCard)}
            onClick={redirectPage.bind(null, url.admin_registerCard)}
          >
            <span className="admin-sidebar__icon">
              <i class="fa-solid fa-hand-holding-dollar"></i>
            </span>
            <span className="admin-sidebar__item">History Register Card</span>
          </li>
        )}

        {showFunction[adminFunction.buyToken] === 1 && (
          <li
            className={setActive(url.admin_history_buy_hewe_amc)}
            onClick={redirectPage.bind(null, url.admin_history_buy_hewe_amc)}
          >
            <span className="admin-sidebar__icon">
              <i class="fa-solid fa-hand-holding-dollar"></i>
            </span>
            <span className="admin-sidebar__item">History Buy Token</span>
          </li>
        )}

        {showFunction[adminFunction.updateWallet] === 1 && (
          <li
            className={setActive(url.admin_update_wallet)}
            onClick={redirectPage.bind(null, url.admin_update_wallet)}
          >
            <span className="admin-sidebar__icon">
              <i class="fa-solid fa-hand-holding-dollar"></i>
            </span>
            <span className="admin-sidebar__item">History Update Wallet</span>
          </li>
        )}

        {showFunction[adminFunction.heweDB] === 1 && (
          <li
            className={setActive(url.admin_hewedb)}
            onClick={redirectPage.bind(null, url.admin_hewedb)}
          >
            <span className="admin-sidebar__icon">
              <i class="fa-solid fa-database"></i>
            </span>
            <span className="admin-sidebar__item">Hewe DB</span>
          </li>
        )}

        {showFunction[adminFunction.depositCard] === 1 && (
          <li
            className={setActive(url.admin_history_deposit_crypto_to_card)}
            onClick={redirectPage.bind(
              null,
              url.admin_history_deposit_crypto_to_card
            )}
          >
            <span className="admin-sidebar__icon">
              <i class="fa-solid fa-database"></i>
            </span>
            <span className="admin-sidebar__item">History Deposit Crypto</span>
          </li>
        )}

        <li onClick={logout}>
          <span className="admin-sidebar__icon">
            <i className="fa-solid fa-right-from-bracket"></i>
          </span>
          <span className="admin-sidebar__item">Log out</span>
        </li>
      </ul>
    </div>
  );
}
export default Sidebar;
