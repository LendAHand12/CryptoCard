import { useRef, useState } from "react";
import "./KYCV3.scss";
import i36 from "src/assets/v3/i36.png";
import i37 from "src/assets/v3/i37.png";
import i38 from "src/assets/v3/i38.png";
import i39 from "src/assets/v3/i39.png";
import i40 from "src/assets/v3/i40.png";
import i41 from "src/assets/v3/i41.png";
import i42 from "src/assets/v3/i42.png";
import i43 from "src/assets/v3/i43.png";
import i45 from "src/assets/v3/i45.png";
import { useTranslation } from "react-i18next";

export const KYCV3 = () => {
  const [currentItem, setCurrentItem] = useState("1");
  const [listFaqOpen, setListFaqOpen] = useState([]);
  const kycRef = useRef(null);
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);
  const whyRef = useRef(null);
  const faqRef = useRef(null);
  const helpRef = useRef(null);
  const topRef = useRef(null);
  const { t } = useTranslation();

  const handleScrollTop = () => {
    topRef?.current?.scrollIntoView({ behaviour: "smooth" });
  };

  const handleSelectItem = (i) => () => {
    setCurrentItem(i);

    switch (i) {
      case "1":
        kycRef?.current?.scrollIntoView({ behaviour: "smooth" });
        break;

      case "2":
        step1Ref?.current?.scrollIntoView({ behaviour: "smooth" });
        break;

      case "3":
        step2Ref?.current?.scrollIntoView({ behaviour: "smooth" });
        break;

      case "4":
        step3Ref?.current?.scrollIntoView({ behaviour: "smooth" });
        break;

      case "5":
        step4Ref?.current?.scrollIntoView({ behaviour: "smooth" });
        break;

      case "6":
        whyRef?.current?.scrollIntoView({ behaviour: "smooth" });
        break;

      case "7":
        faqRef?.current?.scrollIntoView({ behaviour: "smooth" });
        break;

      case "8":
        helpRef?.current?.scrollIntoView({ behaviour: "smooth" });
        break;

      default:
        break;
    }
  };

  const handleToggleFaq = (v) => () => {
    let newList;

    if (listFaqOpen.includes(v)) {
      newList = listFaqOpen.filter((f) => f.value === v);
    } else {
      newList = [...listFaqOpen, v];
    }

    setListFaqOpen(newList);
  };

  const faqs = [
    {
      value: "1",
      label: t("kycV3.t1"),
      answer: t("kycV3.t2"),
    },
    {
      value: "2",
      label: t("kycV3.t3"),
      answer: t("kycV3.t49"),
    },
    { value: "3", label: t("kycV3.t4"), answer: t("kycV3.t50") },
    {
      value: "4",
      label: t("kycV3.t5"),
      answer: t("kycV3.t51"),
    },
    {
      value: "5",
      label: t("kycV3.t6"),
      answer: t("kycV3.t52"),
    },
    { value: "6", label: t("kycV3.t7"), answer: t("kycV3.t53") },
    {
      value: "7",
      label: t("kycV3.t8"),
      answer: t("kycV3.t54"),
    },
  ].map((f, idx) => {
    const isOpen = listFaqOpen.includes(f.value);

    return (
      <div className="faqItem" key={idx}>
        <div className="label" onClick={handleToggleFaq(f.value)}>
          <div className="title">{f.label}</div>
          <div className="icon">
            {!isOpen ? (
              <i class="fa-solid fa-plus"></i>
            ) : (
              <i class="fa-solid fa-minus"></i>
            )}
          </div>
        </div>

        <div className={`content ${isOpen ? "opened" : ""}`}>{f.answer}</div>
      </div>
    );
  });

  const items = [
    { value: "1", label: "KYC" },
    { value: "2", label: t("kycV3.t9") },
    { value: "3", label: t("kycV3.t10") },
    { value: "4", label: t("kycV3.t11") },
    { value: "5", label: t("kycV3.t12") },
    { value: "6", label: t("kycV3.t13") },
    { value: "7", label: "FAQ" },
    { value: "8", label: t("kycV3.t14") },
  ].map((i, idx) => {
    const isSelected = i.value === currentItem;

    return (
      <div className="selectItem" key={idx} onClick={handleSelectItem(i.value)}>
        <i
          className={`fa-solid fa-arrow-right-long iconRight ${
            isSelected ? "selected" : ""
          } `}
        ></i>
        {i.label}
      </div>
    );
  });

  return (
    <div className="containerV3" style={{ overflow: "hidden" }}>
      <img
        src={i45}
        style={{
          position: "absolute",
          top: "0",
          left: "50%",
          transform: "translate(-40%, -80%)",
        }}
      />

      <div className="KYCV3" ref={topRef}>
        <div className="sectionSelect">{items}</div>

        <div className="sectionContent">
          <div className="sectionKYC" ref={kycRef}>
            <div className="heading">
              <div className="titleHeading">
                <img src={i43} className="line" />
                KYC
              </div>
              <div className="imgIcon">
                <img src={i37} />
              </div>
            </div>

            <div className="content">
              <div className="titleContent">
                <img src={i36} className="flag" />
                {t("kycV3.t15")}
              </div>
              <div className="textContent">{t("kycV3.t16")}</div>
            </div>
          </div>

          <div className="sectionStep">
            <div className="heading">
              <div className="titleHeading">
                <img src={i43} className="line" />
                {t("kycV3.t17")}
              </div>
              <div className="imgIcon">
                <img src={i38} />
              </div>
            </div>

            {/* STEP 1 */}
            <div
              className="content"
              style={{ marginBottom: "30px" }}
              ref={step1Ref}
            >
              <div className="titleContent">
                <img src={i36} className="flag" />
                {t("kycV3.t18")}
              </div>
              <div className="textContent">
                <div>{t("kycV3.t19")}</div>
                <ul>
                  <li>{t("kycV3.t20")}</li>
                  <li>{t("kycV3.t21")}</li>
                  <li>{t("kycV3.t22")}</li>
                  <li>{t("kycV3.t23")}</li>
                  <li>{t("kycV3.t24")}</li>
                  <li>{t("kycV3.t25")}</li>
                  <li>{t("kycV3.t26")}</li>
                </ul>
                <div>{t("kycV3.t27")}</div>
              </div>
            </div>

            {/* STEP WHAT HAPPEN */}
            <div className="content">
              <div className="titleContent" style={{ marginBottom: "10px" }}>
                {t("kycV3.t28")}
              </div>
              <div className="textContent">
                <div>{t("kycV3.t29")}</div>
                <ol>
                  <li>{t("kycV3.t30")}</li>
                  <li>{t("kycV3.t31")}</li>
                  <li>{t("kycV3.t32")} </li>
                  <li>{t("kycV3.t33")}</li>
                </ol>
                <div>{t("kycV3.t34")}</div>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="content" ref={step2Ref}>
              <div className="titleContent">
                <img src={i36} className="flag" />
                {t("kycV3.t35")}
              </div>
              <div className="textContent">
                <div>{t("kycV3.t36")}</div>
                <ul>
                  <li>{t("kycV3.t37")}</li>
                  <li>{t("kycV3.t38")}</li>
                </ul>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="content" ref={step3Ref}>
              <div className="titleContent">
                <img src={i36} className="flag" />
                {t("kycV3.t39")}
              </div>
              <div className="textContent hasImg">
                <div>{t("kycV3.t40")}</div>
                <div>
                  <img src={i39} />
                </div>
              </div>
            </div>

            {/* STEP 4 */}
            <div className="content" ref={step4Ref}>
              <div className="titleContent">
                <img src={i36} className="flag" />
                {t("kycV3.t41")}
              </div>
              <div className="textContent">
                <div>{t("kycV3.t42")}</div>
              </div>
            </div>
          </div>

          <div className="sectionWhy" ref={whyRef}>
            <div className="heading">
              <div className="titleHeading">
                <img src={i43} className="line" />
                {t("kycV3.t43")}
              </div>
              <div className="imgIcon">
                <img src={i40} />
              </div>
            </div>

            <div className="content">
              <div className="textContent">
                <ol>
                  <li>{t("kycV3.t44")}</li>
                  <li>{t("kycV3.t45")}</li>
                  <li>{t("kycV3.t46")}</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="sectionFaqs" ref={faqRef}>
            <div className="heading">
              <div className="titleHeading">
                <img src={i43} className="line" />
                FAQs
              </div>
              <div className="imgIcon">
                <img src={i41} />
              </div>
            </div>

            <div className="content">
              <div className="collapsed">{faqs}</div>
            </div>
          </div>

          <div className="sectionHelp" ref={helpRef}>
            <div className="heading">
              <div className="titleHeading">
                <img src={i43} className="line" />
                {t("kycV3.t47")}
              </div>
              <div className="imgIcon">
                <img src={i42} />
              </div>
            </div>

            <div className="content">
              <div className="textContent">{t("kycV3.t48")}</div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: "40px",
          right: "40px",
          height: "40px",
          width: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#fbcb5c",
          color: "#000",
          cursor: "pointer",
          borderRadius: "50%",
          zIndex: 1000,
        }}
        onClick={handleScrollTop}
      >
        <i class="fa-solid fa-arrow-up"></i>
      </div>
    </div>
  );
};
