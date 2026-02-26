import { useState } from "react";

export const usePagination = (initPage = 1, initTotal = 0, initLimit = 10) => {
  const [page, setPage] = useState(initPage);
  const [total, setTotal] = useState(initTotal);
  const [limit, setLimit] = useState(initLimit);

  const handleChangePage = (p) => {
    setPage(p);
  };

  const handleChangeTotal = (t) => {
    setTotal(t);
  };

  const handleChangeLimit = (l) => {
    setLimit(l);
  };

  return {
    page,
    limit,
    total,
    handleChangeLimit,
    handleChangePage,
    handleChangeTotal,
  };
};
