import { useEffect, useState } from "react";
import { axiosService } from "src/util/service";

export const useProfile = (callInit = true) => {
  const [profile, setProfile] = useState(null);

  const handleGetProfile = async () => {
    try {
      const res = await axiosService.post("api/user/getProfile");

      setProfile(res.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    if (callInit) {
      handleGetProfile();
    }
  }, []);

  return { profile, handleGetProfile };
};
