import { Button, TextField } from "@mui/material"
import useUserData from "context/userData"
import { firestore as db } from "firebase/firebase"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useState } from "react"


const HandleSubmit = ({postValues, setPostValues, calendar, setCalendar, formValues, setFormValues}) => {

  const {userData} = useUserData()

  const router = useRouter()
  const {id,type,  postId} = router.query

  const [rejectText, setRejectText]= useState("")
  
  useEffect(()=> {
    console.log(postValues)
  },[postValues])

  const onSubmit = async () => {

    // for(const key in postValues){
      if(postValues.selectedSections.length === 0 ){
        alert("섹션을 한개이상 선택해주세요.")
        return
      }
    if(postValues.title===""||postValues.title===null){alert("제목을 입력해주세요");return;}
    if(postValues.thumbnailURL===""||postValues.thumbnailURL===null){alert("썸네일을 등록해주세요.");return;}
    if(postValues.thumbnailURL===""||postValues.thumbnailURL===null){alert("썸네일을 등록해주세요.");return;}
    if(postValues.hasLimit && postValues.limit==="0"){
      alert("인원수 제한은 0명 보다 많아야 합니다.")
      return false
    }
    const batch = db.batch()

    batch.set(db.collection("team").doc(id).collection(type).doc(postId),{
      ...postValues,
      history: [{type:"create", date: new Date(), text:`"${userData.name}" 님에 의해 저장됨.`},...postValues.history],
      savedAt: new Date(),
      lastSaved: userData.name,
      calendar: calendar.data
    })

    batch.set(db.collection("team").doc(id).collection(`${type}_thumbnail`).doc(postId), {
      isMain: postValues.isMain,
      type: postValues.type,
      selectedSections: postValues.selectedSections,
      title: postValues.title,
      subtitle: postValues.subtitle,
      dateText: postValues.dateText,
      thumbnailURL: postValues.thumbnailURL,
      hasReserve: postValues.hasReserve,
      startAt: postValues.startAt,
      hasDeadline: postValues.hasDeadline,
      endAt: postValues.endAt,
      condition: postValues.condition,
      savedAt: new Date()
    })

    await batch.commit()
    alert("성공적으로 저장되었습니다!")
    return true

  }

  const onApplyClick = async () => {
    const res = await onSubmit()
    if(res){
      const batch = db.batch()

      batch.update(db.collection("team").doc(id).collection(type).doc(postId), {
        history: [{type:"apply", date: new Date(), text: `"${userData.name}" 님에 의해 승인신청.`}, ...postValues.history],
        condition: "waitingForConfirm",
        savedAt: new Date()
      })

      batch.update(db.collection("team").doc(id).collection(`${type}_thumbnail`).doc(postId), {
        condition: "waitingForConfirm",
        savedAt: new Date()
      })

      await batch.commit()
      alert("승인 신청되었습니다.")
      router.reload()
    } 
  }


  const onRejectClick = async () => {
    if(rejectText==="" || rejectText===" ")
      alert("거절 사유를 입력해주세요.")
    else{
      const batch = db.batch()

      batch.update(db.collection("team").doc(id).collection(type).doc(postId), {
        history: [{type:"reject", date: new Date(), text: `"${userData.name}" 님에 의해 승인거절됨.`, rejectText: rejectText}, ...postValues.history],
        condition: "decline",
        savedAt: new Date()
      })
      
      batch.update(db.collection("team").doc(id).collection(`${type}_thumbnail`).doc(postId), {
        condition: "decline",
        savedAt: new Date()
      })

      await batch.commit()
      alert("승인 거절되었습니다.")
    }
  }

  const onConfirmClick = async () => {
    const batch = db.batch()

    batch.update(db.collection("team").doc(id).collection(type).doc(postId), {
      condition: "confirm",
      history: [{type: "confirm", date: new Date(), text:`"${userData.name}" 님에 의해 승인후 게재되었습니다.`}, ...postValues.history],
      savedAt: new Date()
    })

    batch.set(db.collection("team").doc(id).collection(`${type}_thumbnail`).doc(postId), {
      isMain: postValues.isMain,
      type: postValues.type,
      selectedSections: postValues.selectedSections,
      title: postValues.title,
      subtitle: postValues.subtitle,
      dateText: postValues.dateText,
      thumbnailURL: postValues.thumbnailURL,
      hasReserve: postValues.hasReserve,
      startAt: postValues.startAt,
      hasDeadline: postValues.hasDeadline,
      endAt: postValues.endAt,
      condition: "confirm",
      savedAt: new Date()
    })

    await batch.commit()
    alert("승인 완료 후 게재되었습니다.")
    router.reload()
  }

  const onCancelClick = async () => {
    if(confirm("게재취소하시겠습니까?\n일방적인 게재 취소는 사용자들에게 혼란을 줄 수 있습니다.")){
      const batch = db.batch()
      batch.update(db.collection("team").doc(id).collection(type).doc(postId),{
        condition: "unconfirm",
        history: [{type:"cancelDeploy", date: new Date(), text:`"${userData.name}" 님에 의해 게재 취소되었습니다.`}, ...postValues.history],
        savedAt: new Date(),
        lastSaved: userData.name
      })

      batch.update(db.collection("team").doc(id).collection(`${type}_thumbnail`).doc(postId),{
        condition:"unconfirm",
        savedAt: new Date()
      })

      await batch.commit()
      alert("게재취소되었습니다.")
      router.reload()
    }
  }

  return(
    <div style={{marginTop:"80px", marginLeft:"15px"}}>
      <Button
        variant="contained"
        size="small"
        onClick={onSubmit}
      >
        저장
      </Button>

      <div style={{width:'100%', display:"flex", alignItems:"center", marginTop:"10px"}}>
      <Button variant="contained" size="small" style={{fontSize:"13px"}} sx={{padding: "3px 5px !important", backgroundColor:"rgb(239, 123, 60)"}}
        onClick={onApplyClick} disabled={postValues.condition==="waitingForConfirm" || postValues.condition==="confirm"}
      >
        {postValues.condition==="waitingForConfirm" ? "승인대기중" : "저장 후 승인신청"}
      </Button>
      <p style={{marginLeft:'10px', fontSize:"14px"}}>
        {postValues.condition==="waitingForConfirm" ? "승인대기중입니다. 승인이 완료되면 자동으로 게재됩니다." :
        postValues.condition==="confirm" ? "승인완료되었습니다." : "승인신청이 완료될때까지 어플에 업로드되지 않습니다."}</p>
      </div>


      {(userData.roles.includes("super_admin") || userData.roles.includes(`${id}_super_admin`)||userData.roles.includes(`${id}_high_admin`)) && postValues.condition==="waitingForConfirm" &&
        <>
          <div style={{marginTop:"15px"}}>
            <Button variant="contained" size="small" sx={{backgroundColor:"rgb(176, 36, 36)"}} onClick={onRejectClick}>
              승인 거절
            </Button>
            <TextField sx={{marginLeft:"15px", width:"500px"}} label="거절사유" size="small" multiline value={rejectText} onChange={(e)=>setRejectText(e.target.value)}/>
          </div>

          <div style={{marginTop:"15px"}}>
            <Button variant="contained" size="small" sx={{backgroundColor:"rgb(45, 45, 179)"}} onClick={onConfirmClick}>
              승인 및 게재
            </Button>
          </div>
        </>
      }

      {(userData.roles.includes("super_admin") || userData.roles.includes(`${id}_super_admin`)||userData.roles.includes(`${id}_high_admin`)) && postValues.condition==="confirm" &&
        <>
          <div style={{marginTop:"15px"}}>
            <Button variant="contained" size="small" sx={{backgroundColor:"rgb(176, 36, 36)"}} onClick={onCancelClick}>
              게재 취소
            </Button>
          </div>
        </>
      }
    </div>
  )
}

export default HandleSubmit