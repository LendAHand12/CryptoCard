import { message } from "antd";
import { useEffect, useState } from "react";
import { axiosService } from "src/util/service";

export const useAdminCommission = (
  searchModeInit = "default",
  searchUserIdInit = ""
) => {
  const limit = 10;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchMode, setSearchMode] = useState(searchModeInit); // default, email, userId
  const [searchEmail, setSearchEmail] = useState("");
  const [searchUserId, setSearchUserId] = useState(searchUserIdInit);

  const handleResetToDefaultSearchMode = () => {
    setTotal(0);
    setData([]);
    setPage(1);
    setSearchMode("default");
  };

  const handleResetWhenSearch = () => {
    setTotal(0);
    setData([]);
    setPage(1);
  };

  const handleChangePage = (p) => {
    setPage(p);
  };

  const handleChangeSearchEmail = (e) => {
    const value = e.target.value;

    if (value.trim() === "") {
      setSearchEmail("");
      handleResetToDefaultSearchMode();
      return;
    }

    setSearchMode("email");
    setSearchEmail(value);
    setSearchUserId("");
    handleResetWhenSearch();
  };

  const handleChangeSearchUserId = (e) => {
    const value = e.target.value;

    if (value.trim() === "") {
      setSearchUserId("");
      handleResetToDefaultSearchMode();
      return;
    }

    setSearchMode("userId");
    setSearchUserId(value);
    setSearchEmail("");
    handleResetWhenSearch();
  };

  const handleGetDataNoSearch = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await axiosService.post("api/visaCard/commissionUserAdmin", {
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
      const query =
        searchMode === "email"
          ? `POSITION('${searchEmail.trim()}' IN email)`
          : `userid=${searchUserId.trim()}`;
      const res = await axiosService.post("api/visaCard/commissionUserAdmin", {
        page: page,
        limit: limit,
        where: query,
      });

      setData(res.data.data.array);
      setTotal(res.data.data.total);
      setIsLoading(false);
    } catch (error) {
      message.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    if (searchMode === "default") {
      handleGetDataNoSearch();
    }
  }, [page, searchMode]);

  useEffect(() => {
    if (searchMode === "email") {
      const timeout = setTimeout(() => {
        handleGetDataBySearch();
      }, 500);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [page, searchEmail, searchMode]);

  useEffect(() => {
    if (searchMode === "userId") {
      const timeout = setTimeout(() => {
        handleGetDataBySearch();
      }, 500);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [page, searchUserId, searchMode]);

  return {
    data,
    isLoading,
    page,
    total,
    limit,
    searchEmail,
    searchUserId,
    handleChangeSearchEmail,
    handleChangeSearchUserId,
    handleChangePage,
  };
};
