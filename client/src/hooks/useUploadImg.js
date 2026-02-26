import { useState } from "react";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

export const useUploadImage = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [fileUpload, setFileUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const handleChangeImageUrl = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        handleSetFileUpload(info.file.originFileObj);
        setLoading(false);
        handleSetImageUrl(url);
        handleSetValid(true);
      });
    }
  };

  const handleSetImageUrl = (url) => {
    setImageUrl(url);
  };

  const handleSetFileUpload = (file) => {
    setFileUpload(file);
  };

  const handleSetValid = (valid) => {
    setIsValid(valid);
  };

  return {
    isValid,
    imageUrl,
    loading,
    fileUpload,
    handleChangeImageUrl,
    handleSetImageUrl,
    handleSetValid,
    handleSetFileUpload,
  };
};
