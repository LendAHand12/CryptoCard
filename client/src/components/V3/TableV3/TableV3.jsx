import { Pagination } from "antd";
import "./TableV3.scss";

/**
 *
 * @param columns has fields:
 * - title (title of col)
 * - dataIndex (field in api need to show)
 * - render (function that accept 2 param @param value and @param record)
 *      @description: if typeof @param render is "function", it will execute that func "render". If
 *                    not, it will get field by "dataIndex" by default
 *      @example: (value, record) => {}
 *
 * @param data is array
 * @param scrollX is min width of table
 *
 * @returns
 */

export const TableV3 = ({
  page,
  totalItem,
  pageSize,
  handleChangePage,
  isLoading,
  isShowPagination = true,
  data = [],
  columns = [],
  scrollX = 768,
}) => {
  const colHeads = columns.map((c, idx) => {
    return (
      <div className="cHead" key={idx}>
        {c?.title || null}
      </div>
    );
  });

  const renderColBodys = (rowData) => {
    return columns.map((c, idx) => {
      const isValidRenderFunc = !!c?.render && typeof c?.render === "function";
      const isHasFieldDataIndex =
        !!c?.dataIndex && rowData[c?.dataIndex] !== undefined;

      const dataRenderByDataIndex = isHasFieldDataIndex
        ? rowData[c?.dataIndex]
        : null;

      const colRenderUI = isValidRenderFunc
        ? c.render(dataRenderByDataIndex, rowData)
        : dataRenderByDataIndex;

      return (
        <div className="cBody" key={idx}>
          {colRenderUI}
        </div>
      );
    });
  };

  const rowBodys = data.map((d, idx) => {
    return (
      <div className={`rowBody cInside-${columns.length}`} key={idx}>
        {renderColBodys(d)}
      </div>
    );
  });

  if (data.length === 0) {
    return (
      <div style={{ textAlign: "center", fontWeight: "600" }}>No Data</div>
    );
  }

  return (
    <div className={`wrapped ${isLoading ? "isLoading" : ""}`}>
      <div className="TableV3">
        <div className="tableContainer" style={{ minWidth: scrollX }}>
          <div className={`rowHead cInside-${columns.length}`}>{colHeads}</div>

          <>{rowBodys}</>
        </div>
      </div>

      {isShowPagination && totalItem > pageSize && (
        <div className="paginationInside">
          <Pagination
            current={page}
            total={totalItem}
            pageSize={pageSize}
            onChange={handleChangePage}
            showLessItems={true}
            showQuickJumper={false}
            showSizeChanger={false}
          />
        </div>
      )}

      {isLoading && <div className="mask"></div>}
    </div>
  );
};
