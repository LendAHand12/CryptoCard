import "./ProfileV3.scss";
import i34 from "src/assets/v3/i34.png";
import i30 from "src/assets/v3/i30.png";
import { useProfile } from "src/hooks/useProfile";
import { DOMAIN } from "src/util/service";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import { HistoryCommissionUser } from "src/components/profile/HistoryCommissionUser/HistoryCommissionUser";
import { HeweDBBonus } from "src/components/NewVersion/HeweDBBonus/HeweDBBonus";
import { TreeData } from "src/components/profile/TreeData/TreeData";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { ButtonV3 } from "../ButtonV3/ButtonV3";
import i45 from "src/assets/v3/i45.png";

export const ProfileV3 = () => {
  const { profile } = useProfile();
  const { t } = useTranslation();
  const history = useHistory();

  if (!profile) return null;

  return (
    <div className="containerV3">
      <div className="ProfileV3">
        <img
          src={i45}
          style={{
            position: "absolute",
            top: "0",
            left: "50%",
            transform: "translate(-30%, -80%)",
          }}
        />

        <div className="sectionActions">
          <ButtonV3
            isFullWidth={window.innerWidth < 768 ? true : false}
            onClick={() => history.push("/referral-v3")}
          >
            {t("profileV3.t4")}
          </ButtonV3>
          <ButtonV3
            isFullWidth={window.innerWidth < 768 ? true : false}
            onClick={() => history.push("/wallet-deposit-history-v3")}
          >
            {t("profileV3.t1")}
          </ButtonV3>
          <ButtonV3
            isFullWidth={window.innerWidth < 768 ? true : false}
            onClick={() => history.push("/card-deposit-history-v3")}
          >
            {t("v3.t16")}
          </ButtonV3>
          <ButtonV3
            isFullWidth={window.innerWidth < 768 ? true : false}
            onClick={() => history.push("/register-card-history-v3")}
          >
            {t("v3.t17")}
          </ButtonV3>
        </div>

        <div className="sectionInfo">
          <img
            src={i45}
            style={{
              position: "absolute",
              top: "0",
              left: "50%",
              transform: "translate(-70%, -65%)",
            }}
          />

          <div className="title">{t("profileV3.t2")}</div>
          <div className="content">
            <div className="avatar">
              <img src={i34} />
            </div>
            <div className="info">
              <div className="infoItem">
                <div className="label">{t("profileV3.t3")}</div>

                <div className="value">{profile.username}</div>
              </div>

              <div className="infoItem">
                <div className="label">Email</div>

                <div className="value">{profile.email}</div>
              </div>

              <div className="infoItem">
                <div className="label">{t("profileV3.t4")}</div>

                <div className="value">
                  <span>
                    {DOMAIN}?ref={profile?.unique_code || ""}
                  </span>
                  <i
                    class="fa-regular fa-copy"
                    style={{ marginLeft: "8px", cursor: "pointer" }}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${DOMAIN}?ref=${profile?.unique_code || ""}`
                      );
                      message.info(t("copySuccess"));
                    }}
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sectionBonus">
          <img src={i30} />
          <div className="content">
            <div className="title">{t("profileV3.t5")}</div>
            <div className="desc">{t("profileV3.t6")}</div>
          </div>
        </div>

        {/* <HistoryCommissionUser /> */}

        <HeweDBBonus />

        {profile && <TreeData userId={profile.id} />}
      </div>
    </div>
  );
};
