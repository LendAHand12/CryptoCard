import "./Section9V3.scss";
import { useTranslation } from "react-i18next";
import { axiosService } from "src/util/service";
import React, { useEffect, useState } from "react";

export const Section9V3 = () => {
  const { t } = useTranslation();
  const [totalBurned, setTotalBurned] = useState(0);
  const [lastedBurned, setLastedBurned] = useState(0);
  const [midnightFlame, setMidnightFlame] = useState(0);

  const getMidNightFlame = async () => {
    try {
      const res = await axiosService.post("api/p2pBank/getConfig", {
        name: "MIDNIGHTFLAME",
      });
      setMidnightFlame(res.data.data[0].value);
    } catch (error) {}
  };

  const getLastBurned = async () => {
    try {
      const res = await axiosService.post("api/p2pBank/getConfig", {
        name: "LASTBURNED",
      });
      setLastedBurned(res.data.data[0].value);
    } catch (error) {}
  };

  const getTotalBurned = async () => {
    try {
      const res = await axiosService.post("api/p2pBank/getConfig", {
        name: "TOTALBURNED",
      });
      setTotalBurned(res.data.data[0].value);
    } catch (error) {}
  };

  useEffect(() => {
    getLastBurned();
    getTotalBurned();
    getMidNightFlame();
  }, []);

  return (
    <div className="containerV3">
      <div className="Section9V3Container">
        <div className="Section9V3">
          <div className="rowInside">
            <span className="title">{t("homeV3.t35")}</span>
            <span className="content">{parseInt(midnightFlame)} HEWE</span>
          </div>
        </div>
        <div className="Section9V3">
          <div className="rowInside">
            <span className="title">{t("homeV3.t36")}</span>
            <span className="content">{parseInt(lastedBurned)} HEWE</span>
          </div>
        </div>
        <div className="Section9V3">
          <div className="rowInside">
            <span className="title">{t("homeV3.t37")}</span>
            <span className="content">{parseInt(totalBurned)} HEWE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
