
import { firestore as db } from "firebase/firebase"

export const fetch_uid_list = async (teamId, docId) => {
  return new Promise (async(resolve, reject) => {
    try{
      const resultDoc = await db.collection("team_admin").doc(teamId).collection("program").doc(docId).collection("result").where("participated", "==", true).get()

      if(resultDoc.empty){
        resolve([])
      } else{
        const uidList = resultDoc.docs.map(doc=>doc.id)
        resolve(uidList)
      }
    }catch(e){
      console.log(e)
      reject(e.message)
    }
  })
}
