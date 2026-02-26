import { useParams } from "react-router-dom";
import css from "./user-detail.module.scss";
import UserWallet from "./user-wallet";
import TransferHistory from "./transfer-history";
import WithdrawHistory from "./withdraw-history";
import { useEffect, useState } from "react";
import ListWallet from "./list-wallet";
import { getUserToId } from "src/util/adminCallApi";
import { DrillContext } from "src/context/drill";
import { useHistory, useLocation } from "react-router-dom";
import { adminPermision, url, urlParams } from "src/constant";
import { adminFunction } from "../sidebar";
import { getAdminPermision } from "src/redux/reducers/admin-permision.slice";
import { analysisAdminPermision } from "src/util/common";
import { useSelector } from "react-redux";
import NoPermision from "../no-permision";
import socket from "src/util/socket";
import { callToastError } from "src/function/toast/callToast";
import { ListCardCreation } from "src/components/NewVersion/Admin/CardPage/components/ListCardCreation/ListCardCreation";
import { ListAllCard } from "src/components/NewVersion/Admin/CardPage/components/ListAllCard/ListAllCard";
import { ListCardOperation } from "src/components/NewVersion/Admin/CardPage/components/ListCardOperation/ListCardOperation";
import { AdminCommission } from "../adminCommission/AdminCommission";
import { TreeData } from "src/components/profile/TreeData/TreeData";
import { UserInfo } from "./UserInfo/UserInfo";
import { Tabs } from "antd";
import { ListCardOfUserAdmin } from "./ListCardOfUser/ListCardOfUserAdmin";
import queryString from "query-string";
import { ListChangeWallet } from "./ListChangeWallet/ListChangeWallet";
import { ListProductUser } from "./ListProductUser/ListProductUser";
import { ListHistoryDepositCoin } from "./ListHistoryDepositCoin/ListHistoryDepositCoin";
import { HistoryBuyAmcInUserDetail } from "../HistoryBuyHeweAmc/HistoryBuyAmcInUserDetail";
import { HistoryBuyHeweInUserDetail } from "../HistoryBuyHeweAmc/HistoryBuyHeweInUserDetail";
import { HistoryUpdateWalletInUserDetail } from "../HistoryUpdateWallet/HistoryUpdateWalletInUserDetail";

function UserDetail() {
  const tabKeyURL = localStorage.getItem("tabKey") || "deposit";
  const history = useHistory();
  const location = useLocation();

  const [tabKey, setTabKey] = useState(tabKeyURL);

  const handleChangeTabKey = (key) => {
    setTabKey(key);
    localStorage.setItem("tabKey", key);
  };

  const { userid } = useParams();

  // fetch list coin
  const [listCoin, setListCoin] = useState();
  const fetchListCoin = () => {
    return new Promise((resolve, reject) => {
      try {
        socket.once("listCoin", (resp) => {
          setListCoin(resp);
          resolve(resp);
        });
      } catch (error) {
        reject(`error`);
      }
    });
  };

  // phần kiểm tra quyền của admin
  const { permision } = useSelector(getAdminPermision);
  const currentPagePermision = analysisAdminPermision(
    adminFunction.user,
    permision
  );

  // force reload
  const [key, setKey] = useState(userid);
  const forceReload = (item) => {
    history.push(url.admin_userDetail.replace(urlParams.userId, item.id));
    fetchUserDetail(item.id);
    setKey(item.id);
  };
  useEffect(() => {
    const newId = location?.pathname?.split("/")?.at(-1);
    setKey(newId);
    fetchUserDetail(newId);
  }, [location]);

  // lấy thông tin của user hiện tại
  const [userInfo, setUserInfo] = useState({});
  const fetchUserDetail = async (userId) => {
    try {
      setUserInfo({});
      const resp = await getUserToId({
        userid: userId,
      });
      setUserInfo(resp?.data?.data?.at(0));
    } catch (error) {
      const mess = error?.response?.data?.message;
      callToastError(mess);
    }
  };

  // nếu email có ý nghĩa thì render nó lên
  const renderEmail = (email) => {
    switch (email) {
      case null:
      case undefined:
      case "null":
        return "--";

      default:
        return email;
    }
  };

  // nếu nickname có ý nghĩa thì render nó lên
  const renderNickname = (nickName) => {
    switch (nickName) {
      case null:
      case undefined:
      case "null":
        return "--";

      default:
        return nickName;
    }
  };

  // hàm để truyền xuống context, hàm render title
  const renderTitle = (profile) => {
    if (profile?.nickName) {
      return (
        <span className={css[`userDetail--nickname`]}>
          {`- ${profile.nickName}`}{" "}
          <span className={css[`userDetail--username`]}>
            ({`${profile.username}`})
          </span>
        </span>
      );
    } else {
      return (
        <span className={css[`userDetail--nickname`]}>
          {" "}
          {`- ${profile.username}`}
        </span>
      );
    }
  };

  // useEffect
  useEffect(() => {
    fetchUserDetail(userid);
    fetchListCoin();
  }, []);

  if (currentPagePermision === adminPermision.noPermision) {
    return <NoPermision />;
  }

  return (
    <div key={key} className={css.userDetail}>
      <div className={css.userDetail__image}>
        <div className={css.userDetail__image__left}>
          <i className="fa-solid fa-circle-user"></i>
        </div>

        <div className={css.userDetail__image__right}>
          <div className={css.userDetail__image__right__name}>
            {userInfo?.username}
          </div>
          <div className={css.userDetail__image__right__email}>
            {renderEmail(userInfo?.email)}
          </div>
        </div>
      </div>
      <div className={css.userDetail__table}>
        <div className={css.userDetail__record}>
          <div className={`${css.userDetail__cell} ${css.header}`}>
            User name:
          </div>
          <div className={`${css.userDetail__cell}`}>{userInfo?.username}</div>
        </div>
        <div className={css.userDetail__record}>
          <div className={`${css.userDetail__cell} ${css.header}`}>
            Nick name:
          </div>
          <div className={`${css.userDetail__cell}`}>
            {renderNickname(userInfo?.nickName)}
          </div>
        </div>
        <div className={css.userDetail__record}>
          <div className={`${css.userDetail__cell} ${css.header} bb-0`}>
            Email:
          </div>
          <div className={`${css.userDetail__cell} bb-0`}>
            {renderEmail(userInfo?.email)}
          </div>
        </div>
      </div>
      <DrillContext.Provider value={[userInfo, renderTitle, listCoin]}>
        {/* <ListWallet forceReload={forceReload} /> */}

        <UserWallet />

        <Tabs
          activeKey={tabKey}
          onChange={handleChangeTabKey}
          items={[
            {
              label: `Transfer`,
              key: "deposit",
              children: <TransferHistory />,
            },
            {
              label: `Withdraw`,
              key: "withdraw",
              children: <WithdrawHistory />,
            },
            {
              label: `Card Creation`,
              key: "create",
              children: (
                <ListCardCreation
                  searchModeInit="userId"
                  searchUserIdInit={userid}
                  isShowSearch={false}
                />
              ),
            },
            {
              label: `All Card`,
              key: "all",
              children: (
                // <ListAllCard
                //   searchModeInit="userId"
                //   searchUserIdInit={userid}
                //   isShowSearch={false}
                // />
                <ListCardOfUserAdmin userId={userid} />
              ),
            },
            {
              label: `Card Operation`,
              key: "operation",
              children: (
                <ListCardOperation
                  searchModeInit="userId"
                  searchUserIdInit={userid}
                  isShowSearch={false}
                />
              ),
            },
            {
              label: `Commission`,
              key: "commission",
              children: (
                <AdminCommission
                  searchModeInit="userId"
                  searchUserIdInit={userid}
                  isShowSearch={false}
                />
              ),
            },
            {
              label: `History Register`,
              key: "register",
              children: <UserInfo userId={userid} />,
            },
            {
              label: `Wallet Change`,
              key: "walletChange",
              children: <ListChangeWallet userId={userid} />,
            },
            // ẨN ĐI VÌ GIAO DIỆN ĐÃ BỊ ĐỔI MỚI, NẾU SỬA THÌ CLONE 1 CÁI ProductV3 ra
            {
              label: `Product`,
              key: "product",
              children: <ListProductUser userId={userid} />,
            },
            {
              label: `History Deposit Coin`,
              key: "historyDepositCoin",
              children: <ListHistoryDepositCoin userId={userid} />,
            },
            {
              label: `History Buy AMC`,
              key: "historyBuyAmc",
              children: <HistoryBuyAmcInUserDetail userId={userid} />,
            },
            {
              label: `History Buy HEWE`,
              key: "historyBuyHewe",
              children: <HistoryBuyHeweInUserDetail userId={userid} />,
            },
            {
              label: `History Update Wallet`,
              key: "historyUpdateWallet",
              children: <HistoryUpdateWalletInUserDetail userId={userid} />,
            },
          ]}
        />

        {/* <TransferHistory /> */}
        {/* <WithdrawHistory /> */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "50px",
            marginTop: "50px",
            marginBottom: "50px",
          }}
        >
          {/* <ListCardCreation
            searchModeInit="userId"
            searchUserIdInit={userid}
            isShowSearch={false}
          />
          <ListAllCard
            searchModeInit="userId"
            searchUserIdInit={userid}
            isShowSearch={false}
          />
          <ListCardOperation
            searchModeInit="userId"
            searchUserIdInit={userid}
            isShowSearch={false}
          />
          <AdminCommission
            searchModeInit="userId"
            searchUserIdInit={userid}
            isShowSearch={false}
          />

          <UserInfo userId={userid} /> */}

          <TreeData userId={userid} isRenderByAdmin={true} />
        </div>
      </DrillContext.Provider>
    </div>
  );
}

export default UserDetail;
