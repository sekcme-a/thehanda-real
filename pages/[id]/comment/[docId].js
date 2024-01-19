
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useState } from "react"

import CustomForm from "src/post/edit/form/CustomForm"
import Stepper from "src/post/edit/Stepper"


import { firestore as db } from "firebase/firebase"
import SwitchDateTimePicker from "src/post/edit/PublishSetting/components/SwitchDateTimePicker"

import { Button, CircularProgress, Switch, TextField } from "@mui/material"
import { fetch_uid_list } from "src/comment/CommentFunction"
import { sendMultipleNotification } from "src/public/hooks/notification"

const STEPPER_STEP = [
  "후기 폼 작성",
  "저장 및 게재",
]

const Comment = () => {
  const router = useRouter()
  const {id, docId} = router.query

  const [title, setTitle]= useState("")
  const [step, setStep] = useState(0)
  const [postValues, setPostValues] = useState({
    formData: [],
    endAt: new Date(),
    hasEndDate: false,
    isSendAlarm: false,
    alarmInput: {
      title:"",
      subtitle:"",
      text:""
    },
    isRequired: false,
  })
  const handleFormData = (data) => {
    setPostValues(prevPostValues => ({
      ...postValues,
      formData: data,
    }))
  }

  const [appliedAt, setAppliedAt] = useState()

  const [isLoading, setIsLoading] = useState(true)

  const [isSending, setIsSending] = useState(false)


  useEffect(()=> {
    const fetchData = async () => {
      const doc = await db.collection("team").doc(id).collection("programs").doc(docId).get()
      if(doc.exists){
        setTitle(doc.data().title)
        const commentDoc = await db.collection("team").doc(id).collection("comments").doc(docId).get()
        if(commentDoc.exists){
          setPostValues({
            ...commentDoc.data(),
            endAt: commentDoc.data().endAt?.toDate()
          })
          setAppliedAt(commentDoc.data().appliedAt)
        }
        setIsLoading(false)
      }else {
        alert("프로그램이 존재하지 않습니다.")
        router.back()
      }
    }
    fetchData()
  },[])

  const onSubmitClick = async () => {
    await db.collection("team").doc(id).collection("comments").doc(docId).set({
      ...postValues,
      createdAt: new Date(),
    })
    alert("저장되었습니다.")
  }

  const onApplyClick = async () => {
    setIsSending(true)
    if(postValues.formData.length===0) alert("한개이상의 후기 폼을 작성해주세요.")
    else if(postValues.isSendAlarm && (postValues.alarmInput.title===""||postValues.alarmInput.subtitle===""||postValues.alarmInput.text===""))
      alert("알림을 보낼 떄 제목/부제목와 내용은 빈칸일 수 없습니다.")
    else if(!postValues.isRequired && !postValues.isSendAlarm)
      alert(`'알림 보내기' 나 '후기 필수' 중 1개 이상을 선택해야 유저가 후기를 작성할 수 있습니다.`)
    else if(confirm("후기를 게재하시겠습니까?")){
      if(appliedAt)
        if(!confirm(`${appliedAt.toDate().toLocaleString('ko-kr')}에 후기가 게재된적이 있습니다. 다시 게재하시겠습니까?`)){
          setIsSending(false)
          return
        }
      await onSubmitClick()
      const uidList = await fetch_uid_list(id, docId)
      if(uidList.length===0){
        alert("아직 프로그램에 참여한 유저가 없습니다.\n참여한 유저를 설정한 후 다시 시도해주세요.")
        setIsSending(false)
        return;
      }
      
      const batch = db.batch()
      if(postValues.isRequired){
        //send required comment
        Promise.all(uidList.map((uid) =>{
          batch.set(db.collection("user").doc(uid).collection("comment").doc(docId), {
            createdAt: new Date(),
            formData: postValues.formData,
            teamId: id,
          })
        }))
      }
      if(postValues.isSendAlarm){
        //send alarm
        Promise.all(uidList.map((uid) => {
          batch.set(db.collection("user").doc(uid).collection("alarm").doc(), {
            createdAt: new Date(),
            mode: 'programComment',
            read: false,
            text: postValues.alarmInput.text,
            title: postValues.alarmInput.title,
            docId: docId,
            teamId: id,
          })
        }))
      }
      await batch.commit()
      if(postValues.isSendAlarm)
        await sendMultipleNotification(uidList, postValues.alarmInput.title, postValues.alarmInput.subtitle, 'alarm_program')
      await db.collection("team").doc(id).collection("comments").doc(docId).update({
        appliedAt: new Date(),
      })
      alert("성공적으로 게재했습니다.")
      router.reload()
      setIsSending(false)
    }
    
    setIsSending(false)
  }



  if(isLoading) {
    return(
      <CircularProgress />
    )}
  return(
    <>
      <Stepper step={step} handleStep={(num) => setStep(num)} data={STEPPER_STEP}/>

      {/* <h1 style={{fontSize:"20px", fontWeight:"bold", marginBottom:"10px"}}>프로그램 후기 작성</h1>
      <p style={{fontSize:"15px", marginBottom:"40px"}}>{`"${title}"프로그램의 후기 폼을 작성해주세요.`}</p> */}
      <div style={{marginTop:"20px", padding: "20px 20px", backgroundColor:"white",
        borderRadius:"10px", boxShadow:"rgb(0 0 0 / 20%) 0px 2px 1px -1px, rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 1px 3px 0px"}}
      >
        {step===0 && <CustomForm contentMode formData={postValues.formData} setFormData={handleFormData} teamId={id} type="program" />}
        {step===1 && 
          <div style={{margin:"25px 0 7px 0", width:"100%"}}>
            <SwitchDateTimePicker {...{postValues, setPostValues}} type="hasEndDate" value="endAt" text="후기 설문기간" />

            <Switch size="small" checked={postValues.isSendAlarm}
              onChange={(e)=> setPostValues(prev=>({...prev, isSendAlarm:e.target.checked}))}/>
              알림 보내기
            <div style={{marginTop:"3px"}} />
            {postValues.isSendAlarm &&
              <div style={{paddingLeft:"10px"}}>
                <TextField
                  variant="standard"
                  size="small"
                  label="제목"
                  style={{width:"250px"}}
                  value={postValues.alarmInput.title}
                  onChange={(e) => setPostValues(prev=>({...prev, alarmInput: {...prev.alarmInput, title: e.target.value}}))}
                />
                <div />
                <TextField
                  variant="standard"
                  size="small"
                  label="부제목"
                  style={{width:"250px"}}
                  value={postValues.alarmInput.subtitle}
                  onChange={(e) => setPostValues(prev=>({...prev, alarmInput: {...prev.alarmInput, subtitle: e.target.value}}))}
                />
                <div />
                <TextField
                  variant="standard"
                  size="small"
                  label="내용"
                  multiline
                  maxRows={5}
                  style={{width:"500px"}}
                  value={postValues.alarmInput.text}
                  onChange={(e) => setPostValues(prev=>({...prev, alarmInput: {...prev.alarmInput, text: e.target.value}}))}
                />
              </div>
            }
            <div style={{marginTop:"10px"}} />
            <Switch size="small" checked={postValues.isRequired} 
              onChange={(e) => setPostValues(prev => ({...prev, isRequired: e.target.checked}))}/>
              후기 필수{`(필수 체크 시, 유저가 후기를 작성해야 다른 프로그램을 신청할 수 있습니다.)`}
            

            <div style={{marginTop:'30px'}} />
            <Button variant="contained" color="warning" margin="dense" onClick={onSubmitClick}>저 장</Button>
            <div style={{marginTop:'10px'}} />
            <div style={{display:"flex", flexWrap:"wrap", alignItems:"center"}}>
              <Button variant="contained" color="success" margin="dense" onClick={onApplyClick} disabled={isSending}>
                {isSending ? "게재중" : "저장 및 게재"}
              </Button>
              <p style={{marginLeft:"10px"}}>참여한 유저들에게만 후기가 전송됩니다.</p>
            </div>
            {appliedAt && <p style={{marginTop:"10px"}}>{`${appliedAt.toDate().toLocaleString("ko-kr")}에 게재되었습니다.`}</p>}
          </div>
        }


          <div style={{marginTop:"50px", display:"flex", justifyContent:"space-between", flexWrap:"wrap"}}>
            {step === 0 &&
              <>
                <Button></Button>
                <Button onClick={()=> setStep(1)} variant="contained">{`다음 >`}</Button>
              </>
            }
            {step === 1 &&
              <>
                <Button onClick={()=> setStep(0)} variant="contained">{`< 이전`}</Button>
              </>
            }
          </div>
      </div>
    </>
  )
}


export default Comment  