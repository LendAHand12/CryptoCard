import "./ProductV3.scss";
import i26 from "src/assets/v3/i26.png";
import i14 from "src/assets/v3/i14.png";
import { Section8V3 } from "../HomeV3/components/Section8V3/Section8V3";
import { useProductV3 } from "./hooks/useProductV3";
import { Drawer, Modal, Spin } from "antd";
import { CardInfoDetail } from "./components/CardInfoDetail/CardInfoDetail";
import { ModalV3 } from "../ModalV3/ModalV3";
import { ModalLinkToCard } from "./components/ModalLinkToCard/ModalLinkToCard";
import { useTranslation } from "react-i18next";
import { Form4Fields } from "src/components/NewVersion/Form4Fields/Form4Fields";
import { renderFrontCardImgByCardApplyType } from "src/util/renderCardImg";
import { renderCardType, renderDocType } from "src/components/NewVersion";
import { renderCurrency } from "src/util/renderCurrency";
import { calculateEurToUsd } from "src/util/calculateEurToUsd";

export const ProductV3 = () => {
  const {
    data,
    currentCardFocus,
    isOpenModal,
    isOpenModalLinked,

    togglePwd,
    setTogglePwd,

    isDisabledBtn,

    isOpenModalRegister,
    cardFee,

    handleCloseModalRegister,

    handleChangeInputField,
    handleRequestLinkToCard,
    renderBtnApplyVirtualCard,
    renderBtnApplyPhysicCard,
    renderBtnRegisterOfPhysicCard,

    setIsOpenModal,
    setCurrentCardFocus,
    handleCloseModalLinked,
    formDataLinked,
    isPendingLink,
    handleOpenModalRegister,

    eurToUsdRate,
    handleViewDetail,
    renderCardImgFront,
    renderTotalFee,
  } = useProductV3();
  const { t } = useTranslation();

  // có thêm loại thẻ thứ 4 là card_type_id = 6000005 , logic tạo thẻ tương tự thẻ thứ 3 .
  // Ở môi trường test thẻ thứ 4 sẽ có  card_type_id = 6000005 sau này lên production thì  card_type_id = 71000003
  const renderCardItem = data.map((d, idx) => {
    if (
      d.card_type_id == "52500001" ||
      d.card_type_id == "71000002" ||
      d.card_type_id == "71000003"
    ) {
      return null;
    }

    const titleCard =
      d.card_type_id == "52500001" || d.card_type_id === "52500002" ? (
        <div>{renderCardType(d.card_type)} Card (Apple Pay)</div>
      ) : d.card_type_id == "72000001" ? (
        <div className="titleInside">
          {renderCardType(d.card_type)} Card (Google Pay)
        </div>
      ) : d.card_type_id == "72000002" ? (
        <div className="titleInside">
          {renderCardType(d.card_type)} Card (HeWe MasterCard)
        </div>
      ) : (
        <div>{renderCardType(d.card_type)} Card</div>
      );

    const btnApplyVirtual = renderBtnApplyVirtualCard(d);
    const btnApplyPhysic = renderBtnApplyPhysicCard(d);
    const btnRegisterPhysic = renderBtnRegisterOfPhysicCard(d);

    let countBtn = 0;

    countBtn = btnApplyVirtual !== null ? countBtn + 1 : countBtn;
    countBtn = btnApplyPhysic !== null ? countBtn + 1 : countBtn;
    countBtn = btnRegisterPhysic !== null ? countBtn + 1 : countBtn;

    return (
      <div className="cardContainer" key={idx}>
        <div className="cardImg">
          <img
            src={renderFrontCardImgByCardApplyType(
              d.apply_type,
              d.card_type_id
            )}
          />
        </div>

        <div className="cardContent">
          <div className="cardTitle">{titleCard}</div>

          <div className="cardInfo">
            <div className="infoRow">
              <div className="leftInside">
                <img src={i14} />
                <span>{t("productV3.t1")}</span>
              </div>
              <div className="rightInside">{renderDocType(d.doc_type)}</div>
            </div>
            <div className="infoRow">
              <div className="leftInside">
                <img src={i14} />
                <span>{t("createVisaCard.t7")}</span>
              </div>
              <div className="rightInside">
                {renderCurrency(d.card_coin.toUpperCase())}
              </div>
            </div>
            <div className="infoRow">
              <div className="leftInside">
                <img src={i14} />
                <span>{t("cardKYC.t43")}</span>
              </div>
              {/* <div className="rightInside">
                <span>{Number(Number(d.card_fee).toFixed(3))} </span>
                <span>{renderCurrency(d.card_coin.toUpperCase())} </span>
                <span>
                  {d.card_coin === "eur" && eurToUsdRate
                    ? `- ${calculateEurToUsd(eurToUsdRate, d.card_fee)} USDT`
                    : ""}
                </span>
              </div> */}
              <div className="rightInside">{renderTotalFee(d)}</div>
            </div>
          </div>

          <div className="cardActions">
            <div
              className="cardReadMore text-gradient-t-b"
              onClick={handleViewDetail(d)}
            >
              {t("productV3.t2")}
            </div>

            {/* <div className={`btns ${countBtn >= 2 ? "grid-2" : "grid-1"} `}> */}
              {/* virtual card */}
              {/* {btnApplyVirtual} */}

              {/* btn register for card physic */}
              {/* {btnRegisterPhysic} */}

              {/* physic card */}
              {/* {btnApplyPhysic} */}
            {/* </div> */}
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="containerV3">
      <div className="ProductV3">
        <div className="cardGrid">
          <img src={i26} />
        </div>

        <div className="sectionIntro">
          <div className="title">2024 AmChain</div>
          <div className="desc">{t("productV3.t3")}</div>
        </div>

        <div className="sectionCards">{renderCardItem}</div>
      </div>

      <Section8V3 />

      <Drawer
        className="DrawerV3"
        open={isOpenModal}
        placement={window.innerWidth < 380 ? "bottom" : "right"}
        onClose={() => {
          setIsOpenModal(false);
          setCurrentCardFocus(null);
        }}
        title={t("product.t88")}
      >
        {currentCardFocus && (
          <CardInfoDetail
            eurToUsdRate={eurToUsdRate}
            cardInfoData={currentCardFocus}
            renderCardImgFront={renderCardImgFront}
          />
        )}
      </Drawer>

      <ModalV3
        isOpenModal={isOpenModalLinked}
        handleCloseModal={handleCloseModalLinked}
      >
        <ModalLinkToCard
          formDataLinked={formDataLinked}
          handleChangeInputField={handleChangeInputField}
          isPendingLink={isPendingLink}
          isDisabledBtn={isDisabledBtn}
          handleRequestLinkToCard={handleRequestLinkToCard}
        />
      </ModalV3>

      {/* <Modal
        title={t("product.t89")}
        open={isOpenModalLinked}
        footer={false}
        onCancel={handleCloseModalLinked}
      >
        <div
          style={{
            color: "#fff",
            maxHeight: "calc(100vh - 300px)",
            overflowY: "auto",
            padding: "16px",
          }}
        >
          <div className="linkedCardContainer">
            <div className="item">
              <div className="label">{t("product.t90")}</div>
              <input
                value={formDataLinked.card_no}
                onChange={handleChangeInputField("card_no")}
                className="inputInside"
              />
            </div>

            <div className="item">
              <div className="label">Envelope</div>
              <input
                type={togglePwd ? "password" : "text"}
                value={formDataLinked.envelope_no}
                onChange={handleChangeInputField("envelope_no")}
                className="inputInside"
              />

              <i
                className="fa-regular fa-eye eyePwd"
                onClick={() => setTogglePwd(!togglePwd)}
              ></i>
            </div>

            <button
              disabled={isDisabledBtn}
              onClick={handleRequestLinkToCard}
              className="btnInside"
            >
              {isPendingLink ? <Spin /> : t("product.t92")}
            </button>
          </div>
        </div>
      </Modal> */}

      <Form4Fields
        isOpenModal={isOpenModalRegister}
        handleCloseModal={handleCloseModalRegister}
        handleOpenModal={handleOpenModalRegister}
        cardFee={cardFee}
      />
    </div>
  );
};
