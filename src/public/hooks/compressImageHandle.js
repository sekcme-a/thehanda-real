import imageCompression from 'browser-image-compression';


export const IMAGEHANDLE = {
  checkIsImage : (imgData) => {
    const pathpoint = imgData.name.lastIndexOf('.')
    const filepoint = imgData.name.substring(pathpoint+1,imgData.name.length)
    const filetype = filepoint.toLowerCase();
    if (filetype == 'jpg' || filetype == 'png' || filetype == 'git' || filetype == 'jpeg' || filetype == 'bmp') {
      return true;
    }
    else {
      // alert("이미지 파일만 선택할 수 있습니다.\n (.jpg .gif .png .jpeg .bmp)")
      return false;
    }
  },
  checkImageMaxSize : (img, maxMB) => {
    const maxSize = maxMB * 1024 * 1024; //1MB
    console.log(img.size)
    console.log(maxSize)
    if (img.size > maxSize) {
      return false;
    }
    else
      return true
  },
  compressImage : async (img) => {
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
}