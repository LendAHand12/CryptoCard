import "./CardPage.scss";
import { ListAllCard } from "./components/ListAllCard/ListAllCard";
import { ListCardCreation } from "./components/ListCardCreation/ListCardCreation";
import { ListCardOperation } from "./components/ListCardOperation/ListCardOperation";
import NoPermision from "src/components/admin/no-permision";
import { adminFunction } from "src/components/admin/sidebar";
import { usePermissionAdmin } from "src/hooks/usePermissionAdmin";

export const CardPage = () => {
  const { isNoPermission, isOnlyView } = usePermissionAdmin(adminFunction.card);
  if (isNoPermission) {
    return <NoPermision />;
  }

  return (
    <div
      className="CardPage"
      style={{ display: "flex", flexDirection: "column", gap: "52px" }}
    >
      <ListCardCreation />
      <ListAllCard />
      <ListCardOperation />
    </div>
  );
};
