import { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "src/util/common";
import { axiosService } from "src/util/service";
const permissionEnum = {
  noPermission: "noPermission",
  fullPermission: "fullPermission",
  onlyView: "onlyView",
};
const getPermission = (data, fieldName) => {
  if (!data || !fieldName) {
    return permissionEnum.noPermission;
  }
  const isCanEdit = data["edit" + capitalizeFirstLetter(fieldName)] == 1;
  const isCanView = data[fieldName] == 1;
  if (!isCanView) {
    return permissionEnum.noPermission;
  }
  if (!isCanEdit) {
    return permissionEnum.onlyView;
  }
  return permissionEnum.fullPermission;
};
export const usePermissionAdmin = (fieldName) => {
  const [data, setData] = useState(null);
  
  const permission = getPermission(data, fieldName);
  const isNoPermission = permission === permissionEnum.noPermission;
  const isOnlyView = permission === permissionEnum.onlyView;
  const isFullPermission = permission === permissionEnum.fullPermission;
  const handleGetData = async () => {
    try {
      const res = await axiosService.post("api/adminv2/checkAdmin");
      setData(res.data.data);
    } catch (error) {}
  };
  useEffect(() => {
    handleGetData();
  }, []);
  return {
    data,
    permission,
    handleGetData,
    isNoPermission,
    isOnlyView,
    isFullPermission,
  };
};
