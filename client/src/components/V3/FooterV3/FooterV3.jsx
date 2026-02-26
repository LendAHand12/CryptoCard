import { useTranslation } from "react-i18next";
import "./FooterV3.scss";

export const FooterV3 = () => {
  const { t } = useTranslation();

  return (
    <div style={{ backgroundColor: "rgba(40,52,48,0.24)" }}>
      <div className="containerV3">
        <div className="FooterV3">
          <div className="row1">
            <div className="left">
              <div className="logo">
                <img className="logo" src={"/img/newVersion/logo.png"} />
              </div>
              <div className="desc">{t("footerV3.t1")}</div>
            </div>

            <div className="right">
              <div className="items">
                <div
                  className="item"
                  onClick={() => {
                    location.href = "/product-v3";
                  }}
                >
                  {t("footerV3.t2")}
                </div>
                <div
                  className="item"
                  onClick={() => {
                    location.href = "/my-card-v3";
                  }}
                >
                  {t("footerV3.t3")}
                </div>
                <div
                  className="item"
                  onClick={() => {
                    location.href = "/wallet-v3";
                  }}
                >
                  {t("footerV3.t4")}
                </div>
                <div
                  className="item"
                  onClick={() => {
                    window.open(
                      "https://drive.google.com/file/d/12fOovmhHYRCQPvbskWv8xU5LnOSNLsp2/view",
                      "_blank"
                    );
                  }}
                >
                  {t("footerV3.t5")}
                </div>
                <div className="item">{t("footerV3.t6")}</div>
                <div
                  className="item"
                  onClick={() => {
                    window.open("https://hewe.io/contactus", "_blank");
                  }}
                >
                  {t("footerV3.t7")}
                </div>
                <div
                  className="item"
                  onClick={() => {
                    window.open("https://hewe.io/privacy", "_blank");
                  }}
                >
                  {t("footerV3.t8")}
                </div>
                <div
                  className="item"
                  onClick={() => {
                    location.href = "/term-of-service";
                  }}
                >
                  {t("footerV3.t9")}
                </div>
              </div>
            </div>
          </div>

          <div className="row2">
            <div className="left">{t("footerV3.t10")}</div>

            <div className="right">{t("footerV3.t11")}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
