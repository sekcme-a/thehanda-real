import React from 'react';
import imageCompression from 'browser-image-compression';

//상위버전 compressImageHandle
export const compressImage = async (img) => {
  const options = {
    maxSizeMB: 0.7,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  return new Promise(async function (resolve, reject) {
    try {
    const compressedFile = await imageCompression(img, options)
    resolve(compressedFile)
    } catch(e) {console.log(e)}

  })
}