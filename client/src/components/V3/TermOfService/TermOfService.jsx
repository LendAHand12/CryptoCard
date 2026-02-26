import React from "react";
import "./TermOfService.scss";
import i43 from "src/assets/v3/i43.png";
import { useTranslation } from "react-i18next";

export default function TermOfService() {
  const { t } = useTranslation();
  return (
    <div className="containerV3" style={{ overflow: "hidden" }}>
      <div className="TermOfServiceV3">
        <div className="sectionContent">
          <div className="content1">
            <div className="heading">
              <div className="titleHeading">
                <img src={i43} className="line" />
                {t("termV3.t1")}
              </div>
            </div>
            <div className="content">
              <div className="textContent">{t("termV3.t2")}</div>
              <div className="textContent">{t("termV3.t3")}</div>
            </div>
          </div>
          <div className="content2">
            <div className="heading">
              <div className="titleHeading">
                <img src={i43} className="line" />
                {t("termV3.t4")}
              </div>
            </div>
            <div className="content">
              <div className="textContent">{t("termV3.t5")}</div>
            </div>
          </div>
          <div className="content3">
            <div className="heading">
              <div className="titleHeading">
                <img src={i43} className="line" />
                {t("termV3.t6")}
              </div>
            </div>
            <div className="content">
              <div className="textContent">{t("termV3.t7")}</div>
            </div>
          </div>
          <div className="content4">
            <div className="heading">
              <div className="titleHeading">
                <img src={i43} className="line" />
                {t("termV3.t8")}
              </div>
            </div>
            <div className="content">
              <div className="textContent">
                <div>{t("termV3.t9")}</div>
                <ul>
                  <li>{t("termV3.t10")}</li>
                  <li>{t("termV3.t11")}</li>
                  <li>{t("termV3.t12")}</li>
                </ul>
                <div>{t("termV3.t13")}</div>
                <ul>
                  <li>{t("termV3.t14")}</li>
                  <li>{t("termV3.t15")}</li>
                  <li>{t("termV3.t16")}</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="content5">
            <div className="heading">
              <div className="titleHeading">
                <img src={i43} className="line" />
                {t("termV3.t17")}
              </div>
            </div>
            <div className="content">
              <div className="textContent">
                <ul>
                  <li>{t("termV3.t18")}</li>
                  <li>{t("termV3.t19")}</li>
                  <li>{t("termV3.t20")}</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="content6">
            <div className="heading">
              <div className="titleHeading">
                <img src={i43} className="line" />
                {t("termV3.t21")}
              </div>
            </div>
            <div className="content">
              <div className="textContent">{t("termV3.t22")}</div>
            </div>
          </div>
          <div className="content6">
            <div className="heading">
              <div className="titleHeading">
                <img src={i43} className="line" />
                {t("termV3.t23")}
              </div>
            </div>
            <div className="content">
              <div className="textContent">{t("termV3.t24")}</div>
            </div>
          </div>
          <div className="content6">
            <div className="heading">
              <div className="titleHeading">
                <img src={i43} className="line" />
                {t("termV3.t25")}
              </div>
            </div>
            <div className="content">
              <div className="textContent">{t("termV3.t26")}</div>
            </div>
          </div>
          <div className="content6">
            <div className="heading">
              <div className="titleHeading">
                <img src={i43} className="line" />
                {t("termV3.t27")}
              </div>
            </div>
            <div className="content">
              <div className="textContent">{t("termV3.t28")}</div>
            </div>
          </div>
          <div className="content6">
            <div className="heading">
              <div className="titleHeading">
                <img src={i43} className="line" />
                {t("termV3.t29")}
              </div>
            </div>
            <div className="content">
              <div className="textContent">{t("termV3.t30")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
