import { firestore as db } from "firebase/firebase"
import { IMAGEHANDLE } from "src/public/hooks/compressImageHandle"
import { STORAGE } from "src/public/hooks/storageCRUD"

export const FUNCTION = {

  read_story_from_docId: async (teamId, docId) => {
    const doc = await db.collection("team").doc(teamId).collection("story").doc(docId).get()
    if(doc.exists) return doc.data()
    else return false
  },

  has_title_and_has_at_least_one_image : (files, title) => {
    if(files.length>0 && title && title!=="" && title!==" ") return true
    else return false
  },

  is_all_element_image_data_or_url_data : (files) => {
    let result = true
    files.map(file => {
      if(!file.url)
        if(!IMAGEHANDLE.checkIsImage(file.data)) result = false
    })
    if(result) return true
    else{
      alert("이미지 파일만 선택할 수 있습니다.\n (.jpg .gif .png .jpeg .bmp)")
      return false
    }
  },

  check_img_max_size_and_compress: async (files, maxMB) => {
    const result = await Promise.all(files.map(async (file) => {
      if (!file.url) {
        if (IMAGEHANDLE.checkImageMaxSize(file.data, maxMB)) {
          return file;
        } else {
          // 이미지 용량이 maxMB보다 크다면 압축
          const compressedImg = await IMAGEHANDLE.compressImage(file.data);
          return { ...file, data: compressedImg };
        }
      } else {
        return file;
      }
    }));
  
    return result;
  },

  upload_images_to_storage: async (files, path) => {
    const imgURLs = await Promise.all(files.map(async (file) => {
      if(file.url) return file //이미 storage에 있는 파일들은 그냥 빼기
      else {
        const result = await STORAGE.upload_file(file.data, path)
        return result
      }
    }))
    return imgURLs
  },

  upload_story_to_firestore: async (data, teamId, docId) => {
    await db.collection("team").doc(teamId).collection("story").doc(docId).set({
      ...data,
      savedAt: new Date(),
    })
  },

  delete_deleted_images_from_storage: async (deletedFiles) => {
    if(deletedFiles.length>0){
      console.log(deletedFiles)
      await Promise.all(deletedFiles.map(async(file) => {
        await STORAGE.delete_file(file)
      }))
    }
  },






  publish_story: async (teamId, docId) => {
    await db.collection("team").doc(teamId).collection("story").doc(docId).update({
      condition:"게재중",
      publishedAt: new Date(),
    })
    return true
  },

  unpublish_story: async (teamId, docId) => {
    await db.collection("team").doc(teamId).collection("story").doc(docId).update({
      condition:"미게재"
    })
    return true
  },

  delete_images_from_storage: async (teamId, docId) => {
    await STORAGE.delete_folder(`${teamId}/story/${docId}`)
  },
  delete_story: async (teamId, docId) => {
    await db.collection("team").doc(teamId).collection("story").doc(docId).delete()
  },
  
}