import { useTranslation } from "react-i18next";

export const FooterV2 = () => {
  const { t } = useTranslation();

  return (
    <div className="footerV2Container">
      {/* <div className="containerV2 containerInside">
        <div className="left">
          <div className="top">
            <img className="logo" src={"/img/newVersion/logo.png"} />
          </div>

          <div className="center" style={{ fontSize: "24px" }}>
            {t("footerV2.t1")}
          </div>

          <div className="bottom">
            <div>{t("footerV2.t2")}</div>
            <div>{t("footerV2.t3")}</div>
          </div>
        </div>

        <div className="center">
          <div className="top">{t("footerV2.t4")}</div>
          <div className="bottom">
            <div>{t("footerV2.t5")}</div>
            <div>{t("footerV2.t6")}</div>
            <div>{t("footerV2.t7")}</div>
            <div>{t("footerV2.t8")}</div>
            <div>{t("footerV2.t9")}</div>
          </div>
        </div>

        <div className="right">
          <div className="top">{t("footerV2.t10")}</div>
          <div className="bottom">
            <div>{t("footerV2.t11")}</div>
            <div>{t("footerV2.t12")}</div>
            <div>{t("footerV2.t13")}</div>
            <div>{t("footerV2.t14")}</div>
            <div>{t("footerV2.t15")}</div>
            <div>{t("footerV2.t16")}</div>
            <div>{t("footerV2.t17")}</div>
          </div>
        </div>
      </div> */}

      <div
        className="containerV2 containerInside2"
        style={{ paddingBottom: "50px", paddingTop: "50px" }}
      >
        <div className="left">
          <div className="leftInside">© 2024 AmChain</div>
          <div className="rightInside">
            <div>{t("footerV2.t18")}</div>
            <div>{t("footerV2.t19")}</div>
            <div>{t("footerV2.t20")}</div>
          </div>
        </div>

        <div className="right">
          <div>
            <i class="fa-brands fa-telegram"></i>
          </div>
          <div>
            <i class="fa-brands fa-twitter"></i>
          </div>
          <div>
            <i class="fa-brands fa-instagram"></i>
          </div>
          <div>
            <i class="fa-regular fa-file-lines"></i>
          </div>
        </div>
      </div>
    </div>
  );
};
