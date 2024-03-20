import { firestore as db } from "firebase/firebase"

export const FUNCTION = {
  give_authority: async (teamId, uid) => {
    const batch = db.batch()
    const userDoc = await db.collection("user").doc(uid).get()
    const doc = await db.collection("team").doc(teamId).get()
    batch.update(db.collection("team").doc(teamId), {adminUsers: [...(doc.data().adminUsers || []), uid]})
    if(userDoc.data().roles)
      batch.update(db.collection("user").doc(uid), {roles: [...userDoc.data().roles, `${teamId}_admin`]})
    else
      batch.update(db.collection("user").doc(uid), {roles: [`${teamId}_admin`]})
    batch.delete(db.collection("team").doc(teamId).collection("application").doc(uid))
    batch.commit()
  },
  
  decline_authority: async (teamId, uid) => {
    await db.collection("team").doc(teamId).collection("application").doc(uid).delete()
  }
}