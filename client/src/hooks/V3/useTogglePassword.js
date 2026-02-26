import { useState } from "react";

export const useTogglePassword = () => {
  const [isShow, setIsShow] = useState(false);

  const handleTogglePassword = () => {
    setIsShow(!isShow);
  };

  return { isShow, handleTogglePassword };
};
