import { firestore as db } from "firebase/firebase"

export const FUNCTION = {
  fetch_post_data : async(teamId,type,  docId) => {
    const doc = await db.collection("team").doc(teamId).collection(type).doc(docId).get()
    if(doc.exists) return {
      ...doc.data(),
      startAt: doc.data().startAt?.toDate(),
      endAt: doc.data().endAt?.toDate(),
      programStartAt: doc.data().programStartAt?.toDate()
    }
    else return null
  }
}