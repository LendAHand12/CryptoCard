import { useEffect, useState } from "react";
import "./CardHistoryCreate.scss";
import { message, Modal, Pagination } from "antd";
import { axiosService } from "src/util/service";
import { useFadedIn } from "src/hooks/useFadedIn";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { useRedirectHomeIfNotLogin } from "src/hooks/useRedirectHomeIfNotLogin";

const LIMIT = 10;

export const CardHistoryCreate = () => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const { domRef } = useFadedIn();
  const [currentCardFocus, setCurrentCardFocus] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { isLogin } = useRedirectHomeIfNotLogin();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetData = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await axiosService.post(
        "api/visaCard/getTransactionCreateCard",
        { limit: LIMIT, page: page }
      );

      setData(res.data.data.array);
      setTotal(res.data.data.total);

      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    } catch (error) {
      setIsLoading(false);
      message.error(error.response.data.message);
    }
  };

  const handleViewDetail = (cardData) => () => {
    setCurrentCardFocus(cardData);
    setIsOpenModal(true);
  };

  const renderData = data.map((d, idx) => {
    return (
      <tr key={idx}>
        <td>{d.card_type_id}</td>
        <td>{d.first_name}</td>
        <td>{d.last_name}</td>
        <td>+{d.mobile_code}</td>
        <td>+{d.mobile}</td>
        <td>{Number(d.recharge_fee).toFixed(3)}</td>
        <td>{d.created_at}</td>
        <td onClick={handleViewDetail(d)}>
          <Link
            to={`/card-visa-detail?mcTradeNo=${d.mc_trade_no}&cardTypeId=${d.card_type_id}`}
          >
            Detail
          </Link>
          {/* <Link to={`#`}>Detail</Link> */}
        </td>
      </tr>
    );
  });

  useEffect(() => {
    handleGetData();
  }, [page]);

  if (!isLogin) {
    return null;
  }

  return (
    <div className="containerV2">
      <div className="cardHistoryCreateContainer" ref={domRef}>
        <div className="titleV2">History Create VISA Card </div>

        <div className="tableContainerV2 needCenterContent">
          <table>
            <tr>
              <th>Card Type ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Phone Code</th>
              <th>Phone</th>
              <th>Deposit Fee</th>
              <th>Time</th>
              <th></th>
            </tr>

            {isLoading && (
              <tr>
                <td colSpan={11}>Loading...</td>
              </tr>
            )}

            {!isLoading && data.length !== 0 && renderData}

            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan={11}>No data</td>
              </tr>
            )}
          </table>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            current={page}
            total={total}
            onChange={(p) => setPage(p)}
            pageSize={LIMIT}
            showLessItems={true}
            showQuickJumper={false}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
};
