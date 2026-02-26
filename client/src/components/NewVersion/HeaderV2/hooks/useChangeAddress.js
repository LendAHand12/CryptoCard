import { useEffect, useState } from "react";
import { axiosService } from "src/util/service";
import { useAccount } from "wagmi";

export const useChangeAddress = () => {
  const { address } = useAccount();
  const [addressFromProfile, setAddressFromProfile] = useState(null);

  const handleChangeAddress = async (newAddress) => {
    try {
      const res = await axiosService.post("api/visaCard/walletConnect", {
        address: newAddress,
      });

      const profile = await axiosService.post("api/user/getProfile");

      setAddressFromProfile(profile.data.data.walletConnect);
    } catch (error) {}
  };

  useEffect(() => {
    if (address) {
      handleChangeAddress(address);
    }
  }, [address]);

  return { addressFromProfile };
};
