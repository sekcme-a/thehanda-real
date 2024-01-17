import useData from "context/data"
import { firestore as db } from "firebase/firebase"

const POINT_PER_MESSAGE = 8

//count는 알림 갯수
export const checkIsValidPoint = async (teamId, count) => {

  const doc = await db.collection("team_admin").doc(teamId).collection("points").doc("data").get()
  if(doc.exists){
    if(doc.data().remainPoint< count*POINT_PER_MESSAGE){
      alert(
`포인트가 부족합니다.
잔여 포인트: ${doc.data().remainPoint}
예상 포인트 차감: -${count*POINT_PER_MESSAGE}
필요 포인트: ${count*POINT_PER_MESSAGE-doc.data().remainPoint}
`
      )
      return "not enough points"
    }
    else if(!confirm(
      `잔여 포인트: ${doc.data().remainPoint}
예상 포인트 차감: -${count*POINT_PER_MESSAGE}
차감 후 예상 잔여 포인트: ${doc.data().remainPoint-count*POINT_PER_MESSAGE}
(실제 차감 포인트는 알림 발송 성공 수에 따라 달라지며, 해당 예상은 차감될 최대치입니다.)

알림을 보내시겠습니까?
      `
    )){
      return "denied"
    } else return "success"
  }else {
    return "no point data"
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
          point: `-${count*POINT_PER_MESSAGE}p`,
          remainPoint: (parseInt(pointDoc.data().remainPoint)-parseInt((count*POINT_PER_MESSAGE))).toString()+"p"
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
          point: `-${count*POINT_PER_MESSAGE}p`,
          remainPoint: (parseInt(pointDoc.data().remainPoint)-parseInt((count*POINT_PER_MESSAGE))).toString()+"p"
        },
        ...historyDoc.data().history
      ]
    })
  }
  batch.set(db.collection("team_admin").doc(teamId).collection("points").doc("data"), {
    remainPoint: pointDoc.data().remainPoint-(count*POINT_PER_MESSAGE)
  })

  await batch.commit()

  alert(
`총 ${count}명의 유저들에게 알림을 보냈습니다.
차감 포인트: -${count*POINT_PER_MESSAGE}
잔여 포인트: ${pointDoc.data().remainPoint-(count*POINT_PER_MESSAGE)}
`
  )
}


export const addPointUsingCoupon = async (teamId, couponId, title, author, point) => {
  const pointDoc = await db.collection("team_admin").doc(teamId).collection("points").doc("data").get()
  const YYYYMM = getYYYYMM()
  const historyDoc = await db.collection("team_admin").doc(teamId).collection("points").doc(YYYYMM).get()


  const HISTORY = {
    title: title,
    author: author,
    date: new Date(),
    point: `+${point}p`,
    remainPoint: (parseInt(pointDoc.data().remainPoint)+parseInt(point)).toString()+"p"
  }


  const batch = db.batch()

  if(!historyDoc.exists){
    batch.set(db.collection("team_admin").doc(teamId).collection("points").doc(YYYYMM),{
      history: [HISTORY]
    })
  }else {
    batch.update(db.collection("team_admin").doc(teamId).collection("points").doc(YYYYMM),{
      history: [
        HISTORY,
        ...historyDoc.data().history
      ]
    })
  }

  batch.update(db.collection("coupon").doc(couponId),{
    isUsed: true,
    usedAt: new Date(),
    usedTeam: teamId
  })

  batch.set(db.collection("team_admin").doc(teamId).collection("points").doc("data"), {
    remainPoint: parseInt(pointDoc.data().remainPoint)+parseInt(point)
  })

  await batch.commit()


}

//super_admin 의 포인트 관리용
export const EditPoint_ForSuperAdmin = async (teamId, title, author, chargePointAmount, reason) =>{
  const batch = db.batch()

  const pointDoc = await db.collection("team_admin").doc(teamId).collection("points").doc("data").get()
  if(!pointDoc.exists){
    alert("없는 팀이거나 포인트 db에 오류가 생겼습니다.")
    return
  } else {
    batch.update(db.collection("team_admin").doc(teamId).collection("points").doc("data"),{
      remainPoint: parseInt(pointDoc.data().remainPoint) + parseInt(chargePointAmount)
    })

    const YYYYMM = getYYYYMM()
    const pointHistoryDoc = await db.collection("team_admin").doc(teamId).collection("points").doc(YYYYMM).get()
    const NEW_HISTORY = {
      title: title,
      author: author,
      date: new Date(),
      point: chargePointAmount.includes("-")?`${chargePointAmount}p`:`+${chargePointAmount}p`,
      remainPoint: (parseInt(pointDoc.data().remainPoint)+parseInt(chargePointAmount)).toString()+"p"
    }

    if(!pointHistoryDoc.exists){
      batch.set(db.collection("team_admin").doc(teamId).collection("points").doc(YYYYMM),{
        history: [
          NEW_HISTORY
        ]
      })
    }else {
      batch.update(db.collection("team_admin").doc(teamId).collection("points").doc(YYYYMM),{
        history: [
          NEW_HISTORY,
          ...pointHistoryDoc.data().history
        ]
      })
    }

    batch.set(db.collection("super_admin").doc("document").collection("pointHistory").doc(),{
      createdAt: new Date(),
      ...{title, author, chargePointAmount, reason}
    })

    await batch.commit()

  }

}