import { message, Pagination } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFadedIn } from "src/hooks/useFadedIn";
import { useRedirectHomeIfNotLogin } from "src/hooks/useRedirectHomeIfNotLogin";
import { roundedUp } from "src/util/roundNumber";
import { axiosService } from "src/util/service";

const LIMIT = 10;

export const HistoryRegisterCard = () => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const { domRef } = useFadedIn();
  const [currentCardFocus, setCurrentCardFocus] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { isLogin } = useRedirectHomeIfNotLogin();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleGetData = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await axiosService.post(
        "api/visaCard/historySignUpCardUser",
        {
          limit: LIMIT,
          page: page,
        }
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

  const renderData = data.map((d, idx) => {
    return (
      <tr key={idx}>
        <td>{d.fullName}</td>
        <td>{d.phone}</td>
        <td>{d.address}</td>
        <td>
          {roundedUp(d.amountCoin)} {d.paymentCoin}
        </td>
        <td>{d.status == 2 ? t("registerCard.t8") : t("registerCard.t9")}</td>
        <td>{d.created_at}</td>
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
      <div className="CardHistoryDeposit" ref={domRef}>
        <div className="titleV2">{t("registerCard.t1")}</div>

        <div className="tableContainerV2 needCenterContent">
          <table>
            <tr>
              <th>{t("registerCard.t4")}</th>
              <th>{t("registerCard.t5")}</th>
              <th>{t("registerCard.t6")}</th>
              <th>{t("registerCard.t2")}</th>
              <th>{t("registerCard.t7")}</th>
              <th>{t("registerCard.t3")}</th>
            </tr>

            {isLoading && (
              <tr>
                <td colSpan={12}>{t("cardHistoryDeposit.t13")}</td>
              </tr>
            )}

            {!isLoading && data.length !== 0 && renderData}

            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan={12}>{t("cardHistoryDeposit.t14")}</td>
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
