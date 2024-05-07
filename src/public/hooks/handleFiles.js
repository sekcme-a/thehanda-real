

/*
설명: 파일 선택 창을 열고 선택한 파일의 데이터를 return
리턴: [File, File,...] || []

[[mode]]
undefined : 모든 파일 accept
"onlyImage" : 이미지 파이만 accept

[[multiple]]
undefined : 단일 선택
"multipleSelect" : 여러개 선택
*/
export const getFilesData = (mode, select) => {
  return new Promise((resolve, reject) => {
    // 파일 선택 창 열기
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    if (mode === "onlyImage")
      inputElement.accept = 'image/*'; // 이미지 파일만 선택할 수 있도록 제한 (선택 사항)
    if (select === "multipleSelect")
      inputElement.multiple = true; //다중 선택 (선택 사항)

    // 파일이 선택되었을 때의 이벤트 처리
    inputElement.addEventListener('change', (event) => {
      const files = event.target.files;

      if (files.length > 0) 
        resolve(Array.from(files));
      else
        reject("No files selected");
    });

    // 파일 선택 창 열기
    inputElement.click();
  });
};




/*
설명: 이미지들 중 용량 초과한 이미지가 있다면 용량 압축 진행 후 이미지들 리턴
리턴: [File, File, ...] || []

[[imageList]]
배열

[[maxSizeMB]]
최대 허가 MB 사이즈

*/
import imageCompression from 'browser-image-compression';

export const compressImages = async (imageList, maxSizeMB) => {
  const options = {
    maxSizeMB: maxSizeMB,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  const list = await Promise.all(imageList.map(async(image) => {
    const compressedFile = await imageCompression(image, options)
    return compressedFile
  }))
  
  return list
}



/*
설명: 파일들 firebase storage 로 저장 후 저장된 url 리턴
주의! 저장할 위치에 파일 순서대로 위치/1, 위치/2, ... 로 저장되며, 해당 위치에 있던 파일들은 모두 삭제됨.
리턴: [url,url,url]

[[fileList]]
배열

[[path]]
저장할 위치
*/
import { storage } from 'firebase/firebase';

// export const uploadFilesToStorage = async (fileList, path) => {
//   try {
//     // Delete existing files in the path
//     const deleteFileRef = storage.ref().child(path);
//     const result = await deleteFileRef.listAll();

//     const deletePromises = result.items.map((item) => item.delete());
//     await Promise.all(deletePromises);

//     // Upload new files and get their download URLs
//     const uploadPromises = fileList.map(async (file, index) => {
//       const fileRef = storage.ref().child(`${path}/${index}`);
//       await fileRef.put(file);
//       const url = await fileRef.getDownloadURL();
//       return url;
//     });

//     const uploadResults = await Promise.all(uploadPromises);

//     return uploadResults;
//   } catch (error) {
//     console.error('Error uploading files:', error);
//     throw error; // Rethrow the error to propagate it to the caller
//   }
// };
export const uploadMultipleFilesAndGetDownloadURLs = async (files, path) => {
  return await Promise.all(files.map(async (file, index) => {
    const storageRef = storage.ref().child( `${path}/${file.name}`);
    await storageRef.put(file)
    const url = await storageRef.getDownloadURL()
    return {
      url: url,
      path: `${path}/${file.name}`
    }
  }));
};



export const uploadFilesToStorage = async (fileList, path) => {
  try {
    // Upload new files and get their download URLs
    const uploadPromises = fileList.map(async (file, index) => {
      //base64url 이라면 blob로 변환 후 저장
      if(/^data:.*?;base64,/.test(file)){
        const response = await fetch(file);
        const blob = await response.blob();

        const fileRef = storage.ref().child(`${path}/${Date.now()}_${index}`);
        await fileRef.put(blob);
        const url = await fileRef.getDownloadURL();
        return url;
      } else {
        // const fileRef = storage.ref().child(`${path}/${index}`);
        // await fileRef.put(file);
        // const url = await fileRef.getDownloadURL();
        console.log(file)
        return file;
      }
    });

    const uploadResults = await Promise.all(uploadPromises);

    return uploadResults;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error; // Rethrow the error to propagate it to the caller
  }
};




/*
file object 를 base64URL 로 변환 (<img src /> 로 사용하기 위함)


*/
export const readImageAsDataURL = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      resolve(e.target.result);
    };

    reader.readAsDataURL(file);
  });
};
