import { firestore as db } from "firebase/firebase"
import { filterObjByValueFromArrayOfObj } from "src/public/function/filter"

export const FUNCTION = {
  
  read_story: async (teamId) => {
    const snapShot = await db.collection("team").doc(teamId).collection("story").orderBy("savedAt", "desc").get()
    
    if(!snapShot.empty){
      const storys = snapShot.docs.map(doc => ({...doc.data(), id: doc.id}))
      return storys
    } else return []
  },

}