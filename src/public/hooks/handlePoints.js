import useData from "context/data"
import { firestore as db } from "firebase/firebase"

const POINT_PER_MESSAGE=7

//count는 알림 갯수
export const checkIsValidPoint = async (teamId, count) => {

  const doc = await db.collection("team_admin").doc(teamId).collection("points").doc("data").get()
  if(doc.exists){
    if(doc.data().remainPoint< count*POINT_PER_MESSAGE) return false
    else return true
  }else {
    return false
  }
}

const getYYYYMM = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // JavaScript months are 0-indexed, so we add 1
  const day = today.getDate();

  const formattedDate = `${year}${month.toString().padStart(2, '0')}`;
  return formattedDate
}

export const usePoint = async (teamId, title, author, count) => {

  const pointDoc = await db.collection("team_admin").doc(teamId).collection("points").doc("data").get()
  const YYYYMM = getYYYYMM()
  const historyDoc = await db.collection("team_admin").doc(teamId).collection("points").doc(YYYYMM).get()
  const batch = db.batch()
  if(!historyDoc.exists){
    batch.set(db.collection("team_admin").doc(teamId).collection("points").doc(YYYYMM),{
      history: [
        {
          title: title,
          author: author,
          date: new Date(),
          point: `-${count*POINT_PER_MESSAGE}`
        }
      ]
    })
  }else {
    batch.update(db.collection("team_admin").doc(teamId).collection("points").doc(YYYYMM),{
      history: [
        {
          title: title,
          author: author,
          date: new Date(),
          point: `-${count*POINT_PER_MESSAGE}`
        },
        ...historyDoc.data().history
      ]
    })
  }
  batch.set(db.collection("team_admin").doc(teamId).collection("points").doc("data"), {
    remainPoint: pointDoc.data().remainPoint-(count*POINT_PER_MESSAGE)
  })

  await batch.commit()
}