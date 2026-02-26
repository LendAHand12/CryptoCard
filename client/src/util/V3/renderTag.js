import { Tag } from "antd";

export const tagsStatus = {
  pending: "pending",
  confirmed: "confirmed",
  active: "active",
  freeze: "freeze",
  canceled: "canceled",
};

export const renderTag = (t) => {
  switch (t) {
    case tagsStatus.active:
    case tagsStatus.confirmed:
      return (
        <Tag color="#39D98A" className="customAntd">
          {t}
        </Tag>
      );

    case tagsStatus.canceled:
    case tagsStatus.pending:
      return (
        <Tag color="#FF5353" className="customAntd">
          {t}
        </Tag>
      );

    case tagsStatus.freeze:
      return (
        <Tag color="#FBCB5C" className="customAntd">
          {t}
        </Tag>
      );

    default:
      return null;
  }
};
