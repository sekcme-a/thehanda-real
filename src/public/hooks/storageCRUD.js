import { storage } from "firebase/firebase";
import { v4 as uuidv4 } from 'uuid';

//모든 업로드 파일이 uuid를 이용해 각각 고유의 id를 이름으로 가지게 한다.
export const STORAGE = {
  upload_file: async (file, path) => {
    try{
      const pathWithUUID = `${path}/${uuidv4()}`
      const fileRef = storage.ref().child(pathWithUUID);
      await fileRef.put(file);
      const url = await fileRef.getDownloadURL();
      return {url: url, path: pathWithUUID};
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("파일을 업로드하는 도중 에러가 발생했습니다. 관리자에게 문의하세요.")
    }
  }, 

  delete_file: async (path) => {
    try {
      console.log(path)
      const fileRef = storage.ref().child(path);
      if(fileRef)
        await fileRef.delete();
      else console.error("파일이 존재하지 않습니다.")
    } catch (error) {
      console.error("Error deleting file:", error);
      // throw error;
    }
  },

  delete_folder: async (folderPath) => {
    try {
      const folderRef = storage.ref().child(folderPath);

      // 폴더 내의 모든 파일 목록 가져오기
      const files = await folderRef.listAll();

      // 각 파일을 순회하면서 삭제
      const deleteFilePromises = files.items.map(async (file) => {
        await file.delete();
      });

      // 파일 삭제가 모두 완료될 때까지 대기
      await Promise.all(deleteFilePromises);

      // 폴더 자체 삭제
      // await folderRef.delete();

      console.log(`Folder at path ${folderPath} and its contents deleted successfully`);
    } catch (error) {
      console.error("Error deleting folder and its contents:", error);
    }
  }

};
