import { renderTag, tagsStatus } from "src/util/V3/renderTag";
import { TableV3 } from "../TableV3/TableV3";
import "./RegisterCardHistoryV3.scss";
import { useRegisterCardHistoryV3 } from "./hooks/useRegisterCardHistoryV3";
import { useEffect, useState } from "react";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import { axiosService } from "src/util/service";
import { useFadedIn } from "src/hooks/useFadedIn";
import { roundedUp } from "src/util/roundNumber";

const LIMIT = 10;

export const RegisterCardHistoryV3 = () => {
  // const { data, page, limit, total, handleChangePage } =
  //   useRegisterCardHistoryV3();

  // đang handle loading

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const { domRef } = useFadedIn();
  const [currentCardFocus, setCurrentCardFocus] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
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

  useEffect(() => {
    handleGetData();
  }, [page]);

  const columns = [
    {
      dataIndex: "fullName",
      title: t("registerCard.t4"),
    },
    {
      dataIndex: "phone",
      title: t("registerCard.t5"),
    },
    {
      dataIndex: "address",
      title: t("registerCard.t6"),
    },
    {
      title: t("registerCard.t2"),
      render: (_, record) => {
        return (
          <span>
            {roundedUp(record.amountCoin)} {record.paymentCoin}
          </span>
        );
      },
    },
    {
      title: t("registerCard.t7"),
      render: (_, record) => {
        return (
          <span>
            {record.status == 2 ? t("registerCard.t8") : t("registerCard.t9")}
          </span>
        );
      },
    },
    {
      dataIndex: "created_at",
      title: t("registerCard.t3"),
    },
  ];

  return (
    <div className="containerV3">
      <div className="RegisterCardHistoryV3">
        <div className="title">{t("v3.t17")}</div>

        <TableV3
          isLoading={isLoading}
          // scrollX={900}
          data={data}
          columns={columns}
          page={page}
          totalItem={total}
          pageSize={LIMIT}
          handleChangePage={(p) => setPage(p)}
        />
      </div>
    </div>
  );
};
