import { message } from "antd";
import {  useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import { coinUserWallet } from "src/redux/actions/coin.action";
import { roundDownDecimalValues } from "src/util/common";
import { axiosService } from "src/util/service";
import { getBase64 } from '../../../NewVersion/CardManagement/CardKYC/hooks/useStep2.js';

export const useStep2 = (formData, handleNextStep, isCardPhysic, goToStep, userID, cardTypeId) => {
  const dispatch = useDispatch();
  const [isPendingRequest, setIsPendingRequest] = useState(false);
  const { search } = useLocation();
  const [formDataImgs, setFormDataImgs] = useState({
    frontDoc: null,
    backDoc: null,
    mixDoc: null,
    signImg: null,
  });
  const signatureRef = useRef(null);
  const isDisabledBtnStep2 =
    !formDataImgs.frontDoc ||
    !formDataImgs.backDoc ||
    !formDataImgs.mixDoc ||
    isPendingRequest;
  const { listCoinRealTime } = useSelector(
    (state) => state.listCoinRealTimeReducer
  );
  const { userWallet } = useSelector((state) => state.coinReducer);
  const history = useHistory();


  const handleGetWallet = async () => {
    try {
      const res = await axiosService.post("api/user/getWallet");

      const apiResp = res.data.data;
      const result = {};
      for (const [name, value] of Object.entries(apiResp)) {
        let price =
          listCoinRealTime.filter(
            (item) => item.name === name.replace("_balance", "").toUpperCase()
          )[0]?.price ?? 0;
        result[name] = roundDownDecimalValues(value, price);
      }
      if (Object.keys(result)) {
        userWallet.current = result;
        dispatch(coinUserWallet(result));
      }
    } catch (error) {}
  };

  const handleRequestKYC = async () => {
    if (isPendingRequest) {
      return;
    }

    setIsPendingRequest(true);
    try {

      const res = await axiosService.post("api/visaCard/bindingKYCCardUserToAdmin", {
        userid: userID,
        card_type_id: cardTypeId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        mobile: formData.phone,
        mobile_code: formData.phoneCode,
        doc_no: formData.docNo,
        address: formData.address,
        birthday: formData.birthday.format("YYYY-MM-DD"),
        city: formData.city,
        gender: Number(formData.gender),
        country_id: Number(formData.countryId),
        emergency_contact: formData.emergencyContact,
        nationality_id: Number(formData.nationalityId),
        state: formData.state,
        zip_code: formData.zipCode,
        front_doc: formDataImgs.frontDoc.split("base64,")[1],
        back_doc: formDataImgs.backDoc.split("base64,")[1],
        mix_doc: formDataImgs.mixDoc.split("base64,")[1],
        sign_img: signatureRef.current.toDataURL().split("base64,")[1],
      });

      message.success(res.data.message);
      setIsPendingRequest(false);

      history.push('/admin/user')
    } catch (error) {
      setIsPendingRequest(false);
      message.error(error?.response.data.message);
    }
  };

  const handleSetSign = () => {
    setFormDataImgs({
      ...formDataImgs,
      signImg: signatureRef.current.toDataURL().split("base64,")[1],
    });
  };

  const handleChangeImgField = (field) => (info) => {
    if (info.file.status !== "uploading") {
      getBase64(info.file, (url) => {
        setFormDataImgs({ ...formDataImgs, [field]: url });
      });
    }
  };

  const handleRemoveImg = (field) => () => {
    setFormDataImgs({ ...formDataImgs, [field]: null });
  };

  const handleClearSign = () => {
    signatureRef.current.clear();
  };

  const handleCheckIsEmptySign = () => {
    return signatureRef.current.isEmpty();
  };

  return {
    formDataImgs,
    isDisabledBtnStep2,
    signatureRef,
    isPendingRequest,
    handleChangeImgField,
    handleRemoveImg,
    handleClearSign,
    handleCheckIsEmptySign,
    handleSetSign,
    handleRequestKYC,
  };
};
