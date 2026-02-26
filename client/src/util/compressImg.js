import imageCompression from "browser-image-compression";

export const compressImg = async (
  file,
  sizeNotNeedCheck = 2,
  maxSizeMB = 2,
  useWebWorker = true
) => {
  if (!(file instanceof File)) {
    return;
  }

  if (file.size * 10 ** -6 <= sizeNotNeedCheck) {
    
    return file;
  }

  

  const newFileCompress = await imageCompression(file, {
    maxSizeMB: maxSizeMB,
    useWebWorker: useWebWorker,
  });

  

  return newFileCompress;
};
