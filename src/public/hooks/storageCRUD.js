import { storage } from "firebase/firebase";
import { v4 as uuidv4 } from 'uuid';
import { IMAGEHANDLE } from "./compressImageHandle";

//모든 업로드 파일이 uuid를 이용해 각각 고유의 id를 이름으로 가지게 한다.


export const STORAGE = {
  //path = "folder/folder"
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


  //path = uuid 없이: "folder/folder/filename"
  //uuid 생성: "folder/folder" (folder/folder/uuid 형식으로 저장됨.)
  //uuid="pathWithUuid" || "pathWithoutUuid"  가독성때매 걍넣음
  //compression="compress" || "noCompress"   가독성때매 걍넣음
  //maxMB=number||undefined 이 MB 이상의 파일은 압축
  upload_file_v2: (file, path, uuid, compression, maxMB) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!(file instanceof File)) {
                reject("올바른 파일 형식이 아닙니다.");
                console.error("file 형식이 잘못됬습니다.")
                return;
            }

            let newFile = file;
            if (compression === "compress") {
                if (!maxMB) {
                    console.error("압축하려면 maxMB를 작성해주세요.");
                    return;
                }
                // 이미지 사이즈가 maxMB보다 크다면 압축진행
                else if (!IMAGEHANDLE.checkImageMaxSize(newFile, maxMB)) {
                    newFile = await IMAGEHANDLE.compressImage(newFile);
                }
            }

            let newPath = path;
            if (uuid === "pathWithUuid") {
                newPath = `${path}/${uuidv4()}`;
            }

            const fileRef = storage.ref().child(newPath);
            await fileRef.put(newFile);
            const url = await fileRef.getDownloadURL();
            resolve({ url: url, path: newPath });
        } catch (error) {
            console.error("Error uploading files:", error);
            reject("파일을 업로드하는 도중 에러가 발생했습니다. 관리자에게 문의하세요.");
        }
    });
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

  delete_files: async (paths) => {
    try{
      await Promise.all(paths.map(async (path) => {
        const fileRef = storage.ref().child(path)
        if(fileRef)
          await fileRef.delete();
        else console.error(`파일이 존재하지 않습니다: ${path}`)
      }))
    }catch(e){
      console.error("Error deleting files:", error)
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
  },

  deleteFolderAndChildFolder: async (folderPath) => {
    try {
      const folderRef = storage.ref().child(folderPath);
      const files = await folderRef.list()
  
      // Function to recursively delete folders
      const deleteFolderRecursive = async (folderRef) => {
        // List all items (files and subfolders) in the current folder
        const files = await folderRef.listAll()
  
        // Delete all files in the folder
        const deleteFilePromises = files.items?.map(async (file) => {
          await file.delete();
        });
  
        // Delete all subfolders recursively
        const deleteFolderPromises = files.prefixes?.map(async (subfolderRef) => {
          await deleteFolderRecursive(subfolderRef);
        });
  
        // Wait for all file and subfolder deletions to complete
        if(deleteFilePromises)
          await Promise.all([...deleteFilePromises]);
        if(deleteFolderPromises)
          await Promise.all([...deleteFolderPromises])
      };
  
      // Start the recursive deletion process
      await deleteFolderRecursive(folderRef);
  
      // Finally, delete the top-level folder itself
      await folderRef.delete();
  
      console.log(`Folder at path ${folderPath} and its contents deleted successfully`);
    } catch (error) {
      console.error("Error deleting folder and its contents:", error);
    }
  }
  

};
