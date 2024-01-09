import { firestore as db} from "firebase/firebase"

export const FUNCTION = {
  deletePost: async (id, type, postId) => {
    const batch = db.batch()

    batch.delete(db.collection("team").doc(id).collection(type).doc(postId))
    
    batch.delete(db.collection("team").doc(id).collection(`${type}_thumbnail`).doc(postId))

    batch.delete(db.collection("team_admin").doc(id).collection("result").doc(postId))

    await batch.commit()

    return true
  },

  copyPost: async (id, type, postId) => {
    const postDoc = await db.collection("team").doc(id).collection(type).doc(postId).get()
    if(postDoc.exists){
      const thumbnailDoc = await db.collection("team").doc(id).collection(`${type}_thumbnail`).doc(postId).get()
      const tempId = await db.collection("team").doc(id).collection(type).doc().id

      const batch = db.batch()
      batch.set(db.collection("team").doc(id).collection(type).doc(tempId), {
        ...postDoc.data(),
        title: `${postDoc.data().title}_복사본`,
        condition:"unconfirm",
        savedAt: new Date(),
      })
      if(thumbnailDoc.exists){
      
        batch.set(db.collection("team").doc(id).collection(`${type}_thumbnail`).doc(tempId), {
          ...thumbnailDoc.data(),
          title: `${thumbnailDoc.data().title}_복사본`,
          condition:"unconfirm",
          savedAt: new Date(),
        })
        await batch.commit()
        return true
      }
        await batch.commit()
        return true
    }
    return false
    
  }
}