import { Tree } from "antd";
import { useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { axiosService } from "src/util/service";
import "./TreeData.scss";
import { useTranslation } from "react-i18next";

const LIMIT = 100000000;

const preprocessTreeData = (data) => {
  return data.map((d) => {
    return {
      title: (
        <div>
          <span style={{ fontWeight: 600, marginRight: "8px" }}>{d.email}</span>
          <span>- {d.username}</span>
        </div>
      ),
      nodeId: d.id,
      key: `${Math.random()}${d.id}`,
      isLeaf: d.hasChild == false,
    };
  });
};

export const TreeData = ({ userId, style, isRenderByAdmin = false }) => {
  const [data, setData] = useState([]);
  const address = userId;
  const { t } = useTranslation();

  const handleGetTreeChild = async (nodeId) => {
    return axiosService.post(`api/user/parentF1`, {
      page: 1,
      limit: LIMIT,
      userid: nodeId,
    });
  };

  const handleFindAndUpdateTree = (rootTreeData, key, treeData, nodeId) => {
    const newData = rootTreeData.map((d) => {
      if (d.key === key) {
        return {
          ...d,
          children: treeData,
        };
      }

      if (d.children) {
        return {
          ...d,
          children: handleFindAndUpdateTree(d.children, key, treeData, nodeId),
        };
      }

      return d;
    });

    return newData;
  };

  const handleLoadData = ({ key, children, nodeId }) => {
    return new Promise(async (resolve) => {
      if (children) {
        resolve();

        return;
      }

      try {
        const response = await handleGetTreeChild(nodeId);
        const treeData = preprocessTreeData(response.data.data.array);
        const newData = handleFindAndUpdateTree(data, key, treeData, nodeId);

        setData(newData);
        resolve();
      } catch (error) {
        resolve();
      }
    });
  };

  const handleGetTreeInit = async () => {
    try {
      const res = await axiosService.post(`api/user/parentF1`, {
        page: 1,
        limit: LIMIT,
        userid: userId,
      });

      const dataTree = preprocessTreeData(res.data.data.array);

      setData(dataTree);
    } catch (error) {}
  };

  useEffect(() => {
    handleGetTreeInit();
  }, []);

  return (
    <div className={`TreeData2 ${isRenderByAdmin ? "admin" : ""}`}>
      <div className="containerInside">
        <div
          className="titleInside"
          style={{
            marginBottom: "30px",
            borderBottom: "1px solid #4f4f4f",
            paddingBottom: "10px",
          }}
        >
          {t("profileV3.t7")}
        </div>

        <Tree
          showLine
          switcherIcon={<DownOutlined />}
          treeData={data}
          loadData={handleLoadData}
        />
      </div>
    </div>
  );
};
