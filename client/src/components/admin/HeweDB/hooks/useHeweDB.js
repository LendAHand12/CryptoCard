import { message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useExportExcel } from "src/hooks/useExportExcel";
import { roundedUp } from "src/util/roundNumber";
import { axiosService } from "src/util/service";

export const useHeweDB = () => {
  const limit = 10;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isConfirm, setIsConfirm] = useState(false);
  const [search, setSearch] = useState("");
  const isSearchMode = useRef(false);

  const handleGetAllData = async () => {
    return await axiosService.post("api/visaCard/getAllHeweDB");
  };

  const { isLoading: isPendingExportToExcel, handleExportFileExcel } =
    useExportExcel({
      serviceGetData: handleGetAllData,
      paramsPayload: {},
    });

  const handleClickExportBtn = () => {
    handleExportFileExcel({
      sheetName: "List register card",
      headers: [
        { colName: "User ID" },
        { colName: "Email" },
        { colName: "User Name" },
        { colName: "Time" },
        { colName: "Status" },
      ],
      onlyGetFieldData: ["userid", "email", "userName", "created_at", "status"],
      preprocessColumnsData: {
        status: (record) => (record.status == "2" ? "Pending" : "Done"),
        created_at: (record) =>
          new Date(record.created_at).toLocaleString("vi-VN"),
      },
    });
  };

  const handleChangeSearch = (e) => {
    const value = e.target.value;

    isSearchMode.current = value.trim() !== "";
    setSearch(value);
    setPage(1);
  };

  const handleConfirm = (id) => async () => {
    if (isConfirm) return;

    setIsConfirm(true);
    try {
      const res = await axiosService.post("api/visaCard/comfirmHeweDB", { id });

      setIsLoading(false);
      handleGetData();
      message.success(res.data.message);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleChangePage = (p) => {
    setPage(p);
  };

  const handleGetData = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await axiosService.post("api/visaCard/listUserHeweDB", {
        page: page,
        limit: limit,
      });

      setData(res.data.data.array);
      setTotal(res.data.data.total);
      setIsLoading(false);
    } catch (error) {
      message.error(error?.response?.data?.message);
    }
  };

  const handleGetDataBySearch = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const query = `POSITION('${search}' IN email)`;
      const res = await axiosService.post(
        "api/visaCard/getHeweDBToAdminSreach",
        { limit: limit, page: page, query }
      );

      setData(res.data.data.array);
      setTotal(res.data.data.total);
      setIsLoading(false);
    } catch (error) {
      message.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    if (isSearchMode.current) return;

    handleGetData();
  }, [page, search]);

  useEffect(() => {
    if (!isSearchMode.current) return;

    const timeout = setTimeout(() => {
      handleGetDataBySearch();
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [page, search]);

  return {
    data,
    isLoading,
    page,
    total,
    limit,
    search,
    isPendingExportToExcel,
    handleClickExportBtn,
    handleChangeSearch,
    handleChangePage,
    handleConfirm,
  };
};
